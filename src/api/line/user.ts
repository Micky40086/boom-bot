import { query } from '../../../db/mysql'

export const ensureUserExist = async (source): Promise<string> => {
  let sourceId = ''
  let userType = ''
  switch (source.type) {
    case 'user':
      userType = '0'
      sourceId = source.userId
      break
    case 'group':
      userType = '1'
      sourceId = source.groupId
      break
    case 'room':
      userType = '2'
      sourceId = source.roomId
      break
  }

  let user = await query(`SELECT * FROM users WHERE id = '${sourceId}' LIMIT 1`)
  if (!user.length) {
    user = await query('INSERT INTO users(id, type) VALUES ?', [
      [sourceId, userType]
    ])
  }
  return sourceId
}
