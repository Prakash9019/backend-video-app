require('dotenv').config();
const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const cors = require('cors');
const socketIo = require('socket.io');

const authRoutes = require('./routes/authRoutes');
const videoRoutes = require('./routes/videoRoutes');

const app = express();
const server = http.createServer(app);

// Socket.io Setup [cite: 22]
const io = socketIo(server, {
  cors: { origin: "*" } // Allow frontend connection
});

// Save io instance to app for use in controllers
app.set('socketio', io);

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection [cite: 94]
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// Socket Connection Logic
io.on('connection', (socket) => {
  console.log('New client connected');
  
  // Join a room based on user ID for private updates 
  socket.on('join-user-room', (userId) => {
    socket.join(userId);
  });
  
  socket.on('disconnect', () => console.log('Client disconnected'));
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/admin', require('./routes/adminRoutes'));
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));