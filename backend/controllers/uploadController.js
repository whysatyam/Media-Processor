const path = require('path');
const fs = require('fs');
const { unlink } = require('fs/promises');
const { makeBlackAndWhite } = require('../utils/imageProcessor');
const videoProcessor = require('../utils/videoProcessor');

async function handleUpload(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const filePath = req.file.path;
    const ext = path.extname(filePath).toLowerCase();

    if (ext === '.jpg' || ext === '.jpeg' || ext === '.png') {
      const processedBuffer = await makeBlackAndWhite(filePath);
      await unlink(filePath);

      res.set('Content-Type', 'image/png');
      return res.send(processedBuffer);
    }

    if (ext === '.mp4') {
      const outputPath = await videoProcessor.makeBlackAndWhite(filePath);

      res.setHeader('Content-Type', 'video/mp4');

      const stream = fs.createReadStream(outputPath);
      stream.pipe(res);

      stream.on('close', async () => {
        try {
          await unlink(filePath);
          await unlink(outputPath);
        } catch (err) {
          console.error('Error deleting files:', err);
        }
      });
      
      return;
    }

    res.status(400).json({ error: 'Unsupported file type' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to process file' });
  }
}

module.exports = {
  handleUpload
};