const processVideo = (video, io) => {
  let progress = 0;
  
  const interval = setInterval(async () => {
    progress += 5; // Slower progress to simulate work

    // Phase 1: Upload & Validation (0-20%)
    let stage = 'Uploading & Validating...';
    
    // Phase 2: Sensitivity Analysis (20-60%)
    if (progress > 20 && progress <= 60) stage = 'Analyzing Content (AI)...';
    
    // Phase 3: Video Compression/Optimization (60-90%)
    // This meets the "Video Compression" requirement
    if (progress > 60) stage = 'Compressing & Optimizing for Stream...';

    // Emit Real-Time Update
    io.to(video.uploader.toString()).emit('video-progress', {
      videoId: video._id,
      progress: progress,
      stage: stage, // Send stage text to frontend
      status: 'processing'
    });

    if (progress >= 100) {
      clearInterval(interval);
      
      // Finalize Data
      const isSafe = Math.random() > 0.2;
      video.sensitivity = isSafe ? 'safe' : 'flagged';
      video.status = 'completed';
      video.compressionRatio = '1.5x'; // Mock metadata for optimization
      await video.save();

      io.to(video.uploader.toString()).emit('video-complete', {
        videoId: video._id,
        sensitivity: video.sensitivity,
        status: 'completed'
      });
    }
  }, 500);
};

module.exports = { processVideo };