const jwt = require('jsonwebtoken');
const pool = require('../config/db');

const isLoggedIn = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: "No token, Unauthorized" });
        }

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.COOKIE_SECRET);
        } catch (err) {
            return res.status(401).json({ message: "Invalid or expired token" });
        }

        const result = await pool.query(
            'SELECT id, username, password FROM users WHERE username=$1',
            [decoded.username]
        );

        if (result.rowCount === 0) {
            return res.status(401).json({ message: "User not found" });
        }

        req.user = result.rows[0];
        next();

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = isLoggedIn;
