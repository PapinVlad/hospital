const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Добавляем `userId` в `req`
        console.log("Decoded Token:", decoded); // Проверяем, что в `decoded`
        next();
    } catch (err) {
        console.error('Authentication Error:', err);
        res.status(401).json({ error: 'Invalid token' });
    }
};

module.exports = authenticate;
 