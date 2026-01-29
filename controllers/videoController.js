const Video = require('../models/Video');
const fs = require('fs');
const path = require('path');
const { processVideo } = require('../services/processingService');

// 1. Get Videos with FILTERING & PAGINATION
exports.getVideos = async (req, res) => {
  try {
    const { status, sensitivity, search } = req.query;
    
    // Multi-Tenant Isolation: Always force organizationId
    let query = { organizationId: req.user.organizationId };

    // Apply Filters if they exist
    if (status) query.status = status; // e.g., 'completed'
    if (sensitivity) query.sensitivity = sensitivity; // e.g., 'safe'
    if (search) query.title = { $regex: search, $options: 'i' }; // Search by title

    const videos = await Video.find(query).sort({ uploadDate: -1 });
    
    // Performance: Add Cache-Control header (Client-side caching)
    res.set('Cache-Control', 'public, max-age=300'); // Cache for 5 minutes
    res.json(videos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 2. Upload Video (unchanged, but ensure it triggers processing)
exports.uploadVideo = async (req, res) => {
  try {
    const newVideo = new Video({
      title: req.body.title,
      filename: req.file.filename,
      uploader: req.user.user_id,
      organizationId: req.user.organizationId, // Data Segregation
      size: req.file.size,
      mimetype: req.file.mimetype
    });
    
    await newVideo.save();

    // Trigger Pipeline: Analysis -> Compression
    const io = req.app.get('socketio');
    processVideo(newVideo, io);

    res.status(201).json({ message: "Upload successful", videoId: newVideo._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 3. Stream Video (unchanged, keeps Range Requests)
exports.streamVideo = async (req, res) => {
  const video = await Video.findById(req.params.id);
  if (!video) return res.status(404).send("Video not found");
  
  // Security: Check Organization Access
  if(video.organizationId !== req.user.organizationId) return res.status(403).send("Unauthorized");

  const videoPath = path.join(__dirname, '../uploads', video.filename);
  
  // Performance: Browser Caching for Stream
  res.set('Cache-Control', 'private, max-age=3600'); 

  const videoSize = fs.statSync(videoPath).size;
  const range = req.headers.range;

  if (range) {
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : videoSize - 1;
    const chunksize = (end - start) + 1;
    const file = fs.createReadStream(videoPath, { start, end });
    const head = {
      'Content-Range': `bytes ${start}-${end}/${videoSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': 'video/mp4',
    };
    res.writeHead(206, head);
    file.pipe(res);
  } else {
    // ... standard stream ...
    const head = { 'Content-Length': videoSize, 'Content-Type': 'video/mp4' };
    res.writeHead(200, head);
    fs.createReadStream(videoPath).pipe(res);
  }
};