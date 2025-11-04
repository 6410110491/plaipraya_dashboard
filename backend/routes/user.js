const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const isLoggedIn = require('../middleware/isLogin');
const isSuperAdmin = require('../middleware/isSuperAdmin');

router.get('/profile', isLoggedIn, async (req, res) => {
    try {
        const userId = req.user.id;
        const result = await pool.query(
            'SELECT id, username, email, first_name, last_name, department, role, created_at, updated_at FROM users WHERE id = $1',
            [userId]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

router.put('/profile', isLoggedIn, async (req, res) => {
    try {
        const userId = req.user.id;
        const { first_name, last_name, email, department, role } = req.body;

        const query = `
            UPDATE users
            SET first_name = COALESCE($1, first_name),
                last_name = COALESCE($2, last_name),
                email = COALESCE($3, email),
                department = COALESCE($4, department),
                role = COALESCE($5, role),
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $6
            RETURNING id, username, email, first_name, last_name, department, created_at, updated_at, role
        `;

        const values = [
            first_name || null,
            last_name || null,
            email || null,
            department || null,
            role || null,
            userId
        ];

        const result = await pool.query(query, values);

        res.json({ message: 'Profile updated', user: result.rows[0] });
    } catch (err) {
        console.error(err);
        if (err.code === '23505') {
            return res.status(400).json({ error: 'Email หรือ Username ซ้ำ' });
        }
        res.status(500).json({ error: 'Server error' });
    }
});

router.get('/users', isSuperAdmin, async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT id, first_name, last_name, department, role FROM users ORDER BY created_at DESC'
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

router.put('/users/:id', isSuperAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { first_name, last_name, email, department, role } = req.body;

        const query = `
            UPDATE users
            SET first_name = COALESCE($1, first_name),
                last_name = COALESCE($2, last_name),
                email = COALESCE($3, email),
                department = COALESCE($4, department),
                role = COALESCE($5, role),
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $6
            RETURNING id, username, email, first_name, last_name, department, created_at, updated_at, role
        `;

        const values = [
            first_name || null,
            last_name || null,
            email || null,
            department || null,
            role || null,
            id
        ];

        const result = await pool.query(query, values);

        res.json({ success: true, user: result.rows[0] });

    } catch (err) {
        console.error(err);
        if (err.code === '23505') {
            return res.status(400).json({ error: 'Email หรือ Username ซ้ำ' });
        }
        res.status(500).json({ error: 'Server error' });
    }
});



module.exports = router;