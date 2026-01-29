const User = require('../models/User');

// Admin Only: Get all users in MY organization
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({ organizationId: req.user.organizationId }).select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Admin Only: Delete a user
exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};