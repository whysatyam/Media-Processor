const ffmpeg = require('fluent-ffmpeg');
const path = require('path');

function makeBlackAndWhite(inputPath) {
  return new Promise((resolve, reject) => {
    const uploadsDir = path.join(__dirname, '../uploads');
    const outputPath = path.join(uploadsDir, `bw_${Date.now()}.mp4`);

    ffmpeg(inputPath)
      .videoFilters('hue=s=0')
      .output(outputPath)
      .on('end', () => {
        resolve(outputPath);
      })
      .on('error', (err) => {
        console.error('FFmpeg error:', err);
        reject(err);
      })
      .run();
  });
}

module.exports = {
  makeBlackAndWhite
};
