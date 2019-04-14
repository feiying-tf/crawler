let http = require('http');
let https = require('https');
let fs = require('fs');
let path = require('path');
let util = require('util');
let chalk = require('chalk');

// const createWriteStream = util.promisify(fs.createWriteStream);
const writeFile = util.promisify(fs.writeFile);

// src: 图片的路径
// dir: 将图片保存的地方
module.exports = async (src, dir) => {
  // 如果可以匹配上后缀名，那么说明是url，否则说明是base64
  if (/(.jpg|.png|.gif)$/.test(src)) {
    const mod = /^https:/.test(src) ? https : http;
    mod.get(src, (res) => {
      // 获取扩展名
      let ext = path.extname(src);
      // 保存图片的路径名
      let file = path.join(dir, `${Date.now()}${ext}`)
      let ws = fs.createWriteStream(file);
      res.pipe(ws);
    })
  } else {
    const matches = base64Str.match(/^data:(.+?);base64,(.+)$/);
    try {
      const ext = matches[1].split('/')[1]
        .replace('jpeg', 'jpg');
      const file = path.join(dir, `${Date.now()}.${ext}`);
      await writeFile(file, matches[2], 'base64');
    } catch (ex) {
      console.log(chalk.blue('非法 base64 字符串'));
    }
  }
}