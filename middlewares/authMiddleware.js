import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

const authorizeUser = async (req, res, next) => {
  let token;

  // Check if the Authorization header is present
  const authorizationHeader = req.headers.authorization;

  if (authorizationHeader && authorizationHeader.startsWith('Bearer')) {
    // Extract the token from the Authorization header
    token = authorizationHeader.split(' ')[1];
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.userId).select('-password');
      next();
    } catch (error) {
      res.status(401);
      throw new Error('Not authorized, please provide a valid token.');
    }
  } else {
    res.status(401);
    throw new Error('Not authorized, please sign in.');
  }
};

export default authorizeUser;
