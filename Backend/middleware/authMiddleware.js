// middleware/auth.js
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    // 1️⃣ Get token from header (Authorization: Bearer <token>)
    let token = req.headers.authorization?.split(' ')[1];

    // Optional: allow token from query string for testing
    if (!token && req.query.token) token = req.query.token;

    // 2️⃣ If no token, return 401
    if (!token) {
      return res.status(401).json({ success: false, message: 'No token provided, authorization denied' });
    }

    // 3️⃣ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4️⃣ Attach userId to request object
    req.user = { id: decoded.id }; // decoded.id should match how you signed the token

    next(); // proceed to controller
  } catch (err) {
    console.error('JWT Middleware Error:', err.message);
    res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};