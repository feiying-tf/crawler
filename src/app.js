const puppeteer = require('puppeteer');
const toImg = require('../util/util');
const path = require('path');
const clearImgs = require('../util/clearImgs');
const config = require('../util/defaultConfig');
// const { screenshot } = require('./path.js')
(async () => {
  // 创建一个浏览器实例
  const browser = await puppeteer.launch();
  // 创建一个新页面
  const page = await browser.newPage();
  // 打开百度图库
  await page.goto('https://image.baidu.com/');
  console.log('open https://image.baidu.com/');

  // 设置视图宽高
  await page.setViewport({
    width: 1920,
    height: 2016
  });

  // 聚焦到输入框
  await page.focus('.s_ipt');  

  // 在输入框中输入小狗
  await page.keyboard.sendCharacter('狗');
  console.log('输入狗');

  // 点击搜索按钮
  await page.click('.s_search');
  console.log('点击搜索按钮');

  await page.on('load', async () => {
    console.log('page load done, start fetch...')
    // 找到所有的图片
    const srcs = await page.evaluate(() => {
      const images = document.querySelectorAll('img.main_img');
      return Array.prototype.map.call(images, img => img.src);
    });
    // 在生成图片前先删除文件夹里面多余的
    clearImgs(config.imgPath);
    console.log('开始生成图片');
    for (var i = 0; i < srcs.length; i++) {
      // 为了防止百度的反爬虫机制，每一个请求前都做一些延时
      await page.waitFor(200);
      await toImg(srcs[i], config.imgPath)
    }
    // 因为srcs可能是链接图片，也可以是base64图片
    console.log('图片生成完毕');
    await browser.close();
  })
})();