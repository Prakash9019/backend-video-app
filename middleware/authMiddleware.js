const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
  // 1. Get token from Header OR Query Parameter
  let token = req.headers['authorization'] || req.query.token;

  // 2. Fail if no token found
  if (!token) {
    return res.status(403).json({ message: "A token is required for authentication" });
  }

  // 3. Clean up the token (Remove "Bearer " prefix if it exists)
  if (token.startsWith("Bearer ")) {
    token = token.slice(7, token.length).trim();
  }

  try {
    // 4. Verify using the Secret Key from .env
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    // 5. Fail if token is invalid or expired
    console.error("Token verification failed:", err.message);
    return res.status(401).json({ message: "Invalid Token" });
  }
};

exports.checkRole = (roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: "Access Denied: Insufficient Permissions" });
  }
  next();
};