import * as line from '@line/bot-sdk'
import { messageSecret } from '../../../config/line'

const client = new line.Client({
  channelAccessToken: messageSecret.accessToken
})

export const replyApi = (
  userId: string,
  message: line.Message | line.Message[]
): void => {
  if (message) {
    client.replyMessage(userId, message).catch(err => {
      console.log('ReplyApi', err)
    })
  }
}
