const mongoose = require('mongoose');

const VideoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  filename: { type: String, required: true },
  uploader: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  organizationId: { type: String, required: true }, // Data segregation
  size: Number,
  mimetype: String,
  // Processing status [cite: 23]
  status: { type: String, enum: ['pending', 'processing', 'completed', 'failed'], default: 'pending' },
  sensitivity: { type: String, enum: ['unchecked', 'safe', 'flagged'], default: 'unchecked' },
  uploadDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Video', VideoSchema);