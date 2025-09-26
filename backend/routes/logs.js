const express = require('express');
const router = express.Router();
const axios = require('axios');
const pool = require('../config/db');


// ดึง logs ล่าสุด
router.get('/logs', async (req, res) => {
    try {
        const { sync_api } = req.query;

        if (!sync_api) {
            return res.status(400).json({ error: 'sync_api is required' });
        }

        const result = await pool.query(
            `SELECT id, level, context, message, timestamp
             FROM winston_logs
             WHERE context::text LIKE $1
             ORDER BY timestamp DESC
             LIMIT 1`,
            [`%${sync_api}%`]   // ใช้ LIKE หา sync_api ใน context
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'No logs found for this sync_api' });
        }

        const row = result.rows[0];
        const log = {
            id: row.id,
            level: row.level,
            context: row.context,
            message: row.message,
            timestamp: row.timestamp
        };

        res.json(log);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error fetching logs' });
    }
});

module.exports = router;