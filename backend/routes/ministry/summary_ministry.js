const express = require('express');
const router = express.Router();
const axios = require('axios');
const pool = require('../../config/db');

router.get('/get_summary_ministry', async (req, res) => {
    try {
        const response = await pool.query('SELECT * FROM SUMMARY_MINISTRY');
        res.status(200).json(response.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});


router.post('/insert_summary', async (req, res) => {
    let { a_code, a_name, target, result, kpi } = req.body;

    try {
        const existing = await pool.query(
            `SELECT target, result FROM summary_ministry WHERE kpi = $1 AND a_code = $2`,
            [kpi, a_code]
        );

        if (existing.rows.length > 0) {
            const row = existing.rows[0];
            if (!target) target = row.target;
            if (!result) result = row.result;
        }

        let percent = 0;
        if (target && result && Number(target) !== 0) {
            percent = ((result / target) * 100).toFixed(2);
        }

        await pool.query(
            `DELETE FROM summary_ministry WHERE kpi = $1 AND a_code = $2`,
            [kpi, a_code]
        );

        await pool.query(
            `INSERT INTO summary_ministry (a_code, a_name, target, result, percent, kpi) 
             VALUES ($1, $2, $3, $4, $5, $6)`,
            [a_code, a_name, target, result, percent, kpi]
        );

        res.status(200).json({ message: 'บันทึกข้อมูลสำเร็จ', percent });
    } catch (error) {
        console.error('Error inserting summary:', error);
        res.status(500).json({ error: 'เกิดข้อผิดพลาดในการบันทึกข้อมูล' });
    }
});



module.exports = router;