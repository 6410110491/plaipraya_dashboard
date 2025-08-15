const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const bcrypt = require("bcrypt");

function generateTimestampId() {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return BigInt(timestamp) * 1000n + BigInt(random);
}

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ loggedIn: false, status: "Username and password required" });
        }

        const potentialLogin = await pool.query(
            'SELECT id, username, password FROM users WHERE username=$1',
            [username]
        );

        if (potentialLogin.rowCount === 0) {
            return res.json({ loggedIn: false, status: "Invalid username or password" });
        }

        const isSamePass = await bcrypt.compare(password, potentialLogin.rows[0].password);
        if (!isSamePass) {
            return res.json({ loggedIn: false, status: "Invalid username or password" });
        }

        req.session.user = {
            username: username,
            id: potentialLogin.rows[0].id,
        };

        res.json({ loggedIn: true, username });

    } catch (err) {
        console.error(err);
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

        const newUserQuery = await pool.query(
            `INSERT INTO users
            (id, username, password, email, first_name, last_name, department)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING id, username`,
            [gen_id, username, hashedPass, email, first_name, last_name, department]
        );

        req.session.user = {
            username: username,
            id: newUserQuery.rows[0].id,
        };

        res.json({ loggedIn: true, username });

    } catch (err) {
        console.error(err);
        res.status(500).json({ loggedIn: false, status: "Server error" });
    }
});

router.get("/logout", (req, res) => {
    try {
        if (req.session) {
            req.session.destroy(err => {
                if (err) {
                    console.error('Session destroy error:', err);
                    return res.status(500).json({ error: 'Failed to logout' });
                }
                res.clearCookie('sid', { path: '/' });
                return res.status(200).json({ message: 'Logged out successfully' });
            });
        } else {
            res.status(401).json({ error: 'No active session' });
        }
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});



router.get("/checkAuth", (req, res) => {
    if (req.session.user && req.session.user.username) {
        res.json({ loggedIn: true, username: req.session.user.username });
    } else {
        res.json({ loggedIn: false });
    }
});


module.exports = router;
