import { pushApi } from '../line/push'
import * as lineTemplates from '../line/templates'
import * as line from '@line/bot-sdk'
import axios from 'axios'
import * as cheerio from 'cheerio'
import { chunk } from 'lodash'
import { query } from '../../../db/mysql'

const filterShareData = async (arr): Promise<string> => {
  let shareData = ''
  return new Promise(async (resolve, reject) => {
    arr.each((index: number, item) => {
      if (item.children && item.children.length > 0) {
        const str = item.children[0].data
        if (str.includes('window._sharedData = ')) {
          shareData = str
        }
      }
    })
    resolve()
  }).then(() => {
    return shareData
  }).catch((err) => {
    console.log('filterShareData Error', err)
    return shareData
  })
}

const getMessagesByPost = (url: string): Promise<line.Message[]> => {
  return axios
    .get(url)
    .then(async (res) => {
      const $ = cheerio.load(res.data)
      const dataStr = await filterShareData($('script'))
      const media = JSON.parse(
        dataStr.substring(dataStr.indexOf('{'), dataStr.length - 1)
      ).entry_data.PostPage[0].graphql.shortcode_media
      const returnMessages: line.Message[] = []
      if (media.edge_sidecar_to_children) {
        media.edge_sidecar_to_children.edges.forEach((item) => {
          const node = item.node
          if (node.is_video) {
            returnMessages.push(
              lineTemplates.videoMessageTemplate(
                node.display_url,
                node.video_url
              )
            )
          } else {
            returnMessages.push(
              lineTemplates.imageMessageTemplate(node.display_url)
            )
          }
        })
      } else {
        if (media.is_video) {
          returnMessages.push(
            lineTemplates.videoMessageTemplate(
              media.display_url,
              media.video_url
            )
          )
        } else {
          returnMessages.push(
            lineTemplates.imageMessageTemplate(media.display_url)
          )
        }
      }
      return returnMessages
    })
    .catch((err) => {
      console.log('getMessagesByPost Error', err)
      return []
    })
}

const crawler = (
  timestamp: number,
  username: string
): Promise<string[]> => {
  const url = `https://www.instagram.com/${username}/`
  return axios
    .get(url)
    .then(async (res) => {
      const $ = cheerio.load(res.data)
      const dataStr = await filterShareData($('script'))
      const posts = JSON.parse(
        dataStr.substring(dataStr.indexOf('{'), dataStr.length - 1)
      ).entry_data.ProfilePage[0].graphql.user.edge_owner_to_timeline_media
        .edges
      const newPosts: string[] = []
      posts.forEach((item) => {
        if (timestamp - 600 < item.node.taken_at_timestamp) {
          newPosts.push(`${url}p/${item.node.shortcode}`)
        }
      })
      return newPosts
    })
    .catch((err) => {
      console.log(`crawler ${username} Index Error`, err)
      return []
    })
}

const createMessageList = (newPosts: string[]): Promise<line.Message[]> => {
  const promises: Promise<line.Message[]>[] = []
  newPosts.forEach((url) => {
    promises.push(getMessagesByPost(url))
  })
  return Promise.all(promises)
    .then((result) => {
      const messageList = result.reduce((accumulator, currentValue) => {
        return accumulator.concat(currentValue)
      }, [])
      return messageList
    })
    .catch((err) => {
      console.log('createMessageList Promise.all Error', err)
      return []
    })
}

const sendNewPostsToUsers = async (newPosts: string[], users: string[]): Promise<void> => {
  const messageList = await createMessageList(newPosts)
  const messageListLength = messageList.length
  if (messageListLength > 0) {
    if (messageListLength > 5) {
      chunk(messageList, 5).forEach((item) => {
        users.forEach((user) => {
          pushApi(user, item)
        })
      })
    } else {
      users.forEach((user) => {
        pushApi(user, messageList)
      })
    }
  }
}

export const runInstagram = async (): Promise<void> => {
  const currentTime = Math.floor(new Date().getTime() / 1000)
  const instagramList = await query('SELECT R.instagram_username, GROUP_CONCAT(R.user_id) AS subscribers FROM instagram_relations AS R INNER JOIN instagram_usernames ON instagram_username = name GROUP BY R.instagram_username;')
  instagramList.forEach(async (item) => {
    const newPosts = await crawler(currentTime, item.instagram_username)
    sendNewPostsToUsers(newPosts, item.subscribers.split(','))
  })
}
