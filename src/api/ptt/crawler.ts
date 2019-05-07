import * as puppeteer from 'puppeteer'
import * as cheerio from 'cheerio'

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

export const crawler = async (): Promise<void> => {
  const currentTime = Math.floor(new Date().getTime() / 1000)
  const browser = await puppeteer.launch({ headless: false })
  const page = await browser.newPage()
  await page.goto('https://www.ptt.cc/bbs/LoL/index.html')
  const html = await page.content()
  let newPosts = filterNewPosts(html, currentTime)
  console.log(newPosts)
  // await page.evaluate(() => {
  //   let element = document.querySelectorAll('a.btn.wide')[1] as HTMLElement
  //   element.click()
  // })
  // console.log(selector)
}
