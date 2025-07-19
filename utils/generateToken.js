const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.generateToken = (userId, role) => {
  return jwt.sign({ userId, role }, process.env.JWT_SECRET, {
    expiresIn: '1d',
  });
};
