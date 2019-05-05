import * as mysql from 'mysql'

const pool = mysql.createPool({
  connectionLimit: 10,
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'boom_bot'
})

export const query = (sql: string, values: any[] = []): Promise<any> => {
  return new Promise((resolve, reject) => {
    pool.getConnection(function(err, connection) {
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
