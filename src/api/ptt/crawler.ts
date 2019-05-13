import axios from 'axios'
import * as cheerio from 'cheerio'
import * as line from '@line/bot-sdk'
import * as lineTemplates from '../line/templates'
import { pushApi } from '../line/push'
import { chunk } from 'lodash'
import { query } from '../../../db/mysql'

interface PttPostObject {
  title: string;
  href: string;
}

const filterNewPosts = (html, time): PttPostObject[] => {
  const $ = cheerio.load(html)
  const newPosts = []
  $('.r-ent .title a').each((i, item) => {
    const href = item.attribs.href
    if (time - 1800 < parseInt(href.split('.')[1], 10)) {
      newPosts.push({ title: $(item).text(), href: item.attribs.href })
    }
  })
  return newPosts
}

const createMessageList = (newPosts): line.Message[] => {
  const messageList: line.Message[] = []
  newPosts.forEach((item) => {
    messageList.push(
      lineTemplates.textMessageTemplate(
        `${item.title} \n https://www.ptt.cc${item.href}`
      )
    )
  })
  return messageList
}

const sendNewPostsToUsers = (newPosts, users: string[]): void => {
  const messageList = createMessageList(newPosts)
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

const crawler = (board): Promise<PttPostObject[]> => {
  const currentTime = Math.floor(new Date().getTime() / 1000)
  return axios.get(`https://www.ptt.cc/bbs/${board}/index.html`, {
    headers: {
      Cookie: 'over18=1;'
    }
  }).then((res) => {
    return filterNewPosts(res.data, currentTime)
  }).catch((err) => {
    console.log(`${board} crawler error`, err)
    return []
  })
}

export const runPtt = async (): Promise<void> => {
  const pttList = await query('SELECT R.ptt_board, GROUP_CONCAT(R.user_id) AS subscribers FROM ptt_relations AS R INNER JOIN ptt_boards ON ptt_board = name GROUP BY R.ptt_board;')
  pttList.forEach(async (item) => {
    const newPosts = await crawler(item.ptt_board)
    sendNewPostsToUsers(newPosts, item.subscribers.split(','))
  })
}
