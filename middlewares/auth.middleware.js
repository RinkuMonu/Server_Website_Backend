const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
require('dotenv').config();


const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.id || decoded.userId).select('-password');
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized: User not found' });
        }

        req.user = user;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Unauthorized: Invalid token', error: err.message });
    }
};

const isAdmin = (req, res, next) => {
    if (req.user?.role !== 'admin') {
        return res.status(403).json({ message: 'Forbidden: Admins only' });
    }
    next();
};

const isCustomer = (req, res, next) => {
    if (req.user?.role !== 'customer') {
        return res.status(403).json({ message: 'Forbidden: Customers only' });
    }
    next();
};

module.exports = {
    authMiddleware,
    isAdmin,
    isCustomer
};
