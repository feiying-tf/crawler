let fs = require('fs');
let util = require('util');
let path = require('path');
const readdir = util.promisify(fs.readdir);

module.exports = async (imgdir) => {
  let imgPaths = await readdir(imgdir);
  let imgs = imgPaths.filter(item => {
    return /(jpg|png|gif)$/.test(item);
  })
  if (imgs.length > 0) {
    console.log('开始删除图片');
    imgs.forEach(item => {
      let url = path.resolve(__dirname, `../imgs/${item}`)
      fs.unlinkSync(url);
    });
    console.log('删除图片完成');
  }
}