const express = require('express');
const upload = require('../middlewares/multer');
const { handleUpload } = require('../controllers/uploadController');
const authenticateUser = require('../middlewares/auth');

const router = express.Router();

router.post('/', authenticateUser, upload.single('file'), handleUpload);

module.exports = router;
