const Jimp = require('jimp');

async function makeBlackAndWhite(filePath) {
  const image = await Jimp.read(filePath);
  image.greyscale();
  return await image.getBufferAsync(Jimp.MIME_PNG);
}

module.exports = { makeBlackAndWhite };