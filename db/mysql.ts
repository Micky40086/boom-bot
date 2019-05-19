import * as mysql from 'mysql'
import { mysqlConfig } from '../config/mysql'

const pool = mysql.createPool({
  connectionLimit: 10,
  ...mysqlConfig
})

export const query = (sql: string, values: any[] = []): Promise<any> => {
  return new Promise((resolve, reject) => {
    pool.getConnection(function (err, connection) {
      if (err) {
        reject(err)
      } else {
        connection.query(sql, [values], (error, results, _fields) => {
          if (error) {
            reject(error)
          } else {
            resolve(results)
          }
          connection.release()
        })
      }
    })
  })
}
