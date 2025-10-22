const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const logger = require('../logger');
const isLoggedIn = require('../middleware/isLogin');

function generateTimestampId() {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return BigInt(timestamp) * 1000n + BigInt(random);
}

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            logger.warn(`${username} ->Bad Request`, {
                username: username,
                context: 'logged in',
                timestamp: new Date().toISOString(),
            });
            return res.status(400).json({ loggedIn: false, status: "Username and password required" });
        }

        const potentialLogin = await pool.query(
            'SELECT id, username, password, first_name, last_name, role FROM users WHERE username=$1',
            [username]
        );

        if (potentialLogin.rowCount === 0) {
            logger.warn(`${username} ->Invalid username or password`, {
                username: username,
                context: 'logged in',
                timestamp: new Date().toISOString(),
            });
            return res.status(401).json({ loggedIn: false, status: "Invalid username or password" });
        }

        const isSamePass = await bcrypt.compare(password, potentialLogin.rows[0].password);
        if (!isSamePass) {
            logger.warn(`${username} ->Invalid username or password`, {
                username: username,
                context: 'logged in',
                timestamp: new Date().toISOString(),
            });
            return res.status(401).json({ loggedIn: false, status: "Invalid username or password" });
        }

        const payload = {
            // id: potentialLogin.rows[0].id,       // แก้จาก potentialLogin.id
            loggedIn: true,
            username: potentialLogin.rows[0].username,
            first_name: potentialLogin.rows[0].first_name,
            last_name: potentialLogin.rows[0].last_name,
            role: potentialLogin.rows[0].role
        };

        jwt.sign(payload, process.env.COOKIE_SECRET, { expiresIn: '1d' }, (err, token) => {
            if (err) {
                return res.status(500).json({ message: "Server Error" });
            }

            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'Strict',
                maxAge: 24 * 60 * 60 * 1000 // 1 วัน
            });

            // ส่ง response หลังตั้ง cookie
            res.json({ loggedIn: true, username: potentialLogin.rows[0].username });
            logger.info(`User logged in: ${potentialLogin.rows[0].username}`, { username: potentialLogin.rows[0].username });
        });

    } catch (err) {
        console.error(err);
        logger.error('Error in API', {
            username: username,
            context: 'logged in',
            stack: err.stack,
            error: err.message,
            timestamp: new Date().toISOString(),
        });
        res.status(500).json({ loggedIn: false, status: "Server error" });
    }
});

router.post('/signup', async (req, res) => {
    try {
        const { username, password, email, first_name, last_name, department } = req.body;

        if (!username || !password || !email) {
            return res.status(400).json({ loggedIn: false, status: "Required fields missing" });
        }

        const existingUser = await pool.query(
            'SELECT username FROM users WHERE username=$1',
            [username]
        );

        const existingEmail = await pool.query(
            'SELECT email FROM users WHERE email=$1',
            [email]
        );

        if (existingUser.rowCount > 0) return res.json({ loggedIn: false, status: "Username taken" });
        if (existingEmail.rowCount > 0) return res.json({ loggedIn: false, status: "Email taken" });

        const hashedPass = await bcrypt.hash(password, 10);
        const gen_id = generateTimestampId();
        const default_role = 'user'

        const newUserQuery = await pool.query(
            `INSERT INTO users
            (id, username, password, email, first_name, last_name, department, role)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING id, username`,
            [gen_id, username, hashedPass, email, first_name, last_name, department, default_role]
        );

        res.json({ loggedIn: true, username });

    } catch (err) {
        console.error(err);
        res.status(500).json({ loggedIn: false, status: "Server error" });
    }
});

router.get("/logout", async (req, res) => {
    try {
        const token = req.cookies.token;
        const decoded = jwt.verify(token, process.env.COOKIE_SECRET);
        if (token) {
            res.clearCookie('token');
            res.clearCookie('connect.sid');
            logger.info(`User logged out: ${decoded.username}`, { username: decoded.username });
            return res.status(200).json({ message: 'Logged out successfully' });
        } else {
            res.status(401).json({ error: 'No active session' });
        }
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});



router.get("/checkAuth", isLoggedIn, (req, res) => {
    const token = req.cookies.token;
    if (!token) {
        return res.json({ loggedIn: false });
    }

    try {
        const decoded = jwt.verify(token, process.env.COOKIE_SECRET);
        res.json({
            username: decoded.username,
            loggedIn: true,
            role: decoded.role,
            id: decoded.id
        });
    } catch (err) {
        res.json({ loggedIn: false });
    }
});




module.exports = router;
