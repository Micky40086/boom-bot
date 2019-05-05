import axios from 'axios'

export const checkPageExist = (url: string): Promise<boolean> => {
  return axios
    .get(url)
    .then(res => {
      return res.status === 200
    })
    .catch(err => {
      console.log('checkPageExist Error', err)
      return false
    })
}
