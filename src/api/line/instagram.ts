import { query } from '../../../db/mysql'
import * as line from '@line/bot-sdk'
import { textMessageTemplate } from './templates'
import { checkPageExist } from './helper'

const ensureInstagramUsernameExist = async (board): Promise<void> => {
  let instagramUsername = await query(
    `SELECT * FROM instagram_usernames WHERE name = '${board}' LIMIT 1`
  )
  if (!instagramUsername.length) {
    instagramUsername = await query('INSERT INTO instagram_usernames(name) VALUES ?', [[board]])
  }
}

export const subscribeInstagram = async (
  username: string,
  sourceId: string
): Promise<line.TextMessage> => {
  let relation = await query(
    `SELECT * FROM instagram_relations WHERE user_id = '${sourceId}' and instagram_username = '${username}' LIMIT 1`
  )
  if (!relation.length) {
    const pageExist = await checkPageExist(
      `https://www.instagram.com/${username}/`
    )
    if (pageExist) {
      await ensureInstagramUsernameExist(username)
      relation = await query(
        'INSERT INTO instagram_relations(user_id, instagram_username) VALUES ?',
        [[sourceId, username]]
      )
      return textMessageTemplate(`Subscribe ${username} success!`)
    } else {
      return textMessageTemplate('Subscribe fail, username not exist!')
    }
  } else {
    return textMessageTemplate(`Already subscribed ${username}!`)
  }
}

export const unsubscribeInstagram = async (
  username: string,
  sourceId: string
): Promise<line.TextMessage> => {
  let relation = await query(
    `SELECT * FROM instagram_relations WHERE user_id = '${sourceId}' and instagram_username = '${username}' LIMIT 1`
  )
  if (relation.length) {
    relation = await query(
      `DELETE FROM instagram_relations WHERE user_id = '${sourceId}' and instagram_username = '${username}'`
    )
    return textMessageTemplate(`Unsubscribe ${username} success!`)
  } else {
    return textMessageTemplate(`Not subscribed ${username}!`)
  }
}
