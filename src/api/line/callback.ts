import { replyApi } from './reply'
import * as line from '@line/bot-sdk'
import { ensureUserExist } from './user'
import { subscribePtt, unsubscribePtt } from './ptt'

const handleText = async (
  message: line.TextMessage,
  replyToken: string,
  source: line.EventSource
): Promise<void> => {
  let replyMessage: line.TextMessage
  const sourceId = await ensureUserExist(source)
  if (/^subscribe ptt \S+$/.test(message.text)) {
    const board = message.text.split(' ')[2]
    replyMessage = await subscribePtt(board.toLowerCase(), sourceId)
  } else if (/^unsubscribe ptt \S+$/.test(message.text)) {
    const board = message.text.split(' ')[2]
    replyMessage = await unsubscribePtt(board.toLowerCase(), sourceId)
  }

  // if (/^subscribe ig \S+$/.test(message.text)) {
  //   const account = message.text.split(' ')[2]
  //   const pageExist = await checkPageExist(
  //     `https://www.instagram.com/${encodeURI(account)}/`
  //   )
  //   if (pageExist) {
  //     replyMessage = await subscribeInstagram(account.toLowerCase(), sourceId)
  //   } else {
  //     replyMessage = textMessageTemplate('Subscribe fail, Account not exist!')
  //   }
  // }
  // } else if (/^subscribe ptt \S+$/.test(message.text)) {
  //   const board = message.text.split(' ')[2]
  //   const pageExist = await checkPageExist(
  //     `https://www.ptt.cc/bbs/${board}/index.html`
  //   )
  //   if (pageExist) {
  //     replyMessage = await subscribePtt(board.toLowerCase(), sourceId)
  //   } else {
  //     replyMessage = textMessageTemplate('Subscribe fail, Board not exist!')
  //   }
  // } else if (/^unsubscribe ptt \S+$/.test(message.text)) {
  //   const board = message.text.split(' ')[2]
  //   const pageExist = await checkPageExist(
  //     `https://www.ptt.cc/bbs/${board}/index.html`
  //   )
  //   if (pageExist) {
  //     replyMessage = await unsubscribePtt(board.toLowerCase(), sourceId)
  //   } else {
  //     replyMessage = textMessageTemplate('Unsubscribe fail, Board not exist!')
  //   }
  // }

  replyApi(replyToken, replyMessage)
}

export const handleEvent = (event: line.WebhookEvent): void => {
  switch (event.type) {
    case 'message':
      const message = event.message
      console.log(event.source)
      switch (message.type) {
        case 'text':
          handleText(message, event.replyToken, event.source)
          break
        case 'image':
          break
        // return handleImage(message, event.replyToken);
        case 'video':
          break
        // return handleVideo(message, event.replyToken);
        case 'audio':
          break
        // return handleAudio(message, event.replyToken);
        case 'location':
          break
        // return handleLocation(message, event.replyToken);
        case 'sticker':
          break
        // return handleSticker(message, event.replyToken);
        default:
          throw new Error(`Unknown message: ${JSON.stringify(message)}`)
      }
      break
    case 'follow':
      break
    // return replyText(event.replyToken, 'Got followed event');
    case 'unfollow':
      break
    // return console.log(`Unfollowed this bot: ${JSON.stringify(event)}`);
    case 'join':
      break
    // return replyText(event.replyToken, `Joined ${event.source.type}`);
    case 'leave':
      break
    // return console.log(`Left: ${JSON.stringify(event)}`);
    case 'postback':
      break
    // let data = event.postback.data;
    // if (data === 'DATE' || data === 'TIME' || data === 'DATETIME') {
    //   data += `(${JSON.stringify(event.postback.params)})`;
    // }
    // return replyText(event.replyToken, `Got postback: ${data}`);
    case 'beacon':
      break
    // return replyText(event.replyToken, `Got beacon: ${event.beacon.hwid}`);
    default:
      throw new Error(`Unknown event: ${JSON.stringify(event)}`)
  }
}

// const subscribeInstagram = (
//   account: string,
//   userId: string
// ): Promise<line.TextMessage> => {
//   let replyText = ''
//   return instagramFirestore
//     .getSubItemsByAccount(account)
//     .then(async (querySnapshot: admin.firestore.QuerySnapshot) => {
//       if (querySnapshot.size === 0) {
//         await instagramFirestore
//           .createSubItem(account, userId)
//           .then(res => {
//             replyText = `Subscribe ${account} success!`
//           })
//           .catch(err => {
//             console.log('instagramFirestore -> createSubItem Error', err)
//           })
//       }
//       await querySnapshot.forEach(async item => {
//         const userList = item.data().users
//         if (userList.includes(userId)) {
//           replyText = `${account} already subscribed!`
//         } else {
//           userList.push(userId)
//           instagramFirestore.updateUserListFromSubItem(item.id, userList)
//           replyText = `Subscribe ${account} success!`
//         }
//       })
//       return textMessageTemplate(replyText)
//     })
//     .catch(error => {
//       console.log(error)
//       return textMessageTemplate('Please try later!')
//     })
// }

// const unsubscribePtt = (
//   board: string,
//   userId: string
// ): Promise<line.TextMessage> => {
//   let replyText = ''
//   return pttFirestore
//     .getSubItemsByBoard(board)
//     .then(async (querySnapshot: admin.firestore.QuerySnapshot) => {
//       if (querySnapshot.size === 0) {
//         replyText = `You are not subscribe ${board}!`
//       } else {
//         await querySnapshot.forEach(async item => {
//           const userList = item.data().users
//           if (userList.includes(userId)) {
//             const userIndex = userList.indexOf(userId)
//             userList.splice(userIndex, 1)
//             pttFirestore.updateUserListFromSubItem(item.id, userList)
//             replyText = `Unsubscribe ${board} success!`
//           } else {
//             replyText = `You are not subscribe ${board}!`
//           }
//         })
//       }
//       return textMessageTemplate(replyText)
//     })
//     .catch(error => {
//       console.log(error)
//       return textMessageTemplate('Please try later!')
//     })
// }
