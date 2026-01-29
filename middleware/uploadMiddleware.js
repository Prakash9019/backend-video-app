const multer = require('multer');
const path = require('path');

// Storage configuration [cite: 38]
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});

// File validation 
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('video/')) {
    cb(null, true);
  } else {
    cb(new Error('Not a video!'), false);
  }
};

module.exports = multer({ storage, fileFilter });