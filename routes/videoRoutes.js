const express = require('express');
const router = express.Router();
const videoController = require('../controllers/videoController');
const { verifyToken, checkRole } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// POST /api/videos/upload - Only Editors and Admins can upload
// Uses 'upload.single' to handle the file from the form data named 'video'
router.post(
  '/upload', 
  verifyToken, 
  checkRole(['editor', 'admin']), 
  upload.single('video'), 
  videoController.uploadVideo
);

// Add the GET route with filtering support
router.get('/', verifyToken, videoController.getVideos);

// GET /api/videos/stream/:id - Stream video (Range requests)
router.get('/stream/:id', verifyToken, videoController.streamVideo);

module.exports = router;