import { query } from '../../../db/mysql'
import * as line from '@line/bot-sdk'
import { textMessageTemplate } from './templates'
import { checkPageExist } from './helper'

const ensurePttBoardExist = async (board): Promise<void> => {
  let pttBoard = await query(
    `SELECT * FROM ptt_boards WHERE name = '${board}' LIMIT 1`
  )
  if (!pttBoard.length) {
    pttBoard = await query('INSERT INTO ptt_boards(name) VALUES ?', [[board]])
  }
}

export const subscribePtt = async (
  board: string,
  sourceId: string
): Promise<line.TextMessage> => {
  let relation = await query(
    `SELECT * FROM ptt_relations WHERE user_id = '${sourceId}' and ptt_board = '${board}' LIMIT 1`
  )
  if (!relation.length) {
    const pageExist = await checkPageExist(
      `https://www.ptt.cc/bbs/${board}/index.html`
    )
    if (pageExist) {
      await ensurePttBoardExist(board)
      relation = await query(
        'INSERT INTO ptt_relations(user_id, ptt_board) VALUES ?',
        [[sourceId, board]]
      )
      return textMessageTemplate(`Subscribe ${board} success!`)
    } else {
      return textMessageTemplate('Subscribe fail, Board not exist!')
    }
  } else {
    return textMessageTemplate(`Already subscribed ${board}!`)
  }
}

export const unsubscribePtt = async (
  board: string,
  sourceId: string
): Promise<line.TextMessage> => {
  let relation = await query(
    `SELECT * FROM ptt_relations WHERE user_id = '${sourceId}' and ptt_board = '${board}' LIMIT 1`
  )
  if (relation.length) {
    relation = await query(
      `DELETE FROM ptt_relations WHERE user_id = '${sourceId}' and ptt_board = '${board}'`
    )
    return textMessageTemplate(`Unsubscribe ${board} success!`)
  } else {
    return textMessageTemplate(`Not subscribed ${board}!`)
  }
}
