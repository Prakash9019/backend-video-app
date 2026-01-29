const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  // Roles: 'viewer', 'editor', 'admin' 
  role: { type: String, enum: ['viewer', 'editor', 'admin'], default: 'viewer' },
  organizationId: { type: String, required: true } // Multi-tenant isolation [cite: 30]
});

module.exports = mongoose.model('User', UserSchema);