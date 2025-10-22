// routes/ppfee.js
const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const isAdmin = require('../middleware/isAdmin');

function generateTimestampId() {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return BigInt(timestamp) * 1000n + BigInt(random);
}

// GET ปีงบทั้งหมด
router.get('/ppfee/years', async (req, res) => {
    try {
        const result = await pool.query(`SELECT * FROM ppfee_years ORDER BY year DESC`);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch years' });
    }
});

// GET 1 ปีงบ
router.get('/ppfee/:year', async (req, res) => {
    const { year } = req.params;
    try {
        const getyear = await pool.query('SELECT * FROM ppfee_years WHERE year = $1', [year]);

        if (getyear.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: 'Not found years select'
            });
        }

        // ส่งผลลัพธ์เฉพาะถ้ามีข้อมูล
        res.json({
            success: true,
            data: getyear.rows
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch years' });
    }
});



// POST เพิ่มปีงบ
router.post('/ppfee/years', isAdmin, async (req, res) => {
    const { year, status } = req.body;
    const gen_id = generateTimestampId();
    try {
        const check = await pool.query('SELECT * FROM ppfee_years WHERE year = $1', [year]);
        if (check.rows.length > 0) {
            return res.status(400).json({ message: 'ปีงบประมาณนี้มีอยู่แล้ว' });
        }
        await pool.query('INSERT INTO ppfee_years (id, year, status) VALUES ($1, $2, $3) ON CONFLICT (year) DO NOTHING',
            [gen_id, year, status]);
        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server Error' });
    }
});

// PUT เปลี่ยนสถานะ
router.put('/ppfee/years/:id', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    await pool.query('UPDATE ppfee_years SET status=$1 WHERE id=$2', [status, id]);
    res.json({ success: true });
});

// GET ข้อมูลตามปีงบเป็นไอดี
router.get('/ppfee/data/:yearId', async (req, res) => {
    const { yearId } = req.params;

    try {
        const result = await pool.query(
            `SELECT *
             FROM ppfee_data
             WHERE year_id = $1
             ORDER BY created_at ASC`,
            [yearId]
        );

        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาด' });
    }
});


// POST ข้อมูลตามปีงบ
router.post('/ppfee/data/:yearId', async (req, res) => {
    const { yearId } = req.params;
    const {
        service_unit_code,
        service_unit_name,
        main_activity,
        sub_activity,
        person_count,
        service_count,
        amount
    } = req.body;
    const gen_id = generateTimestampId();

    try {
        if (!service_unit_code || !service_unit_name || !main_activity || !sub_activity == null) {
            return res.status(400).json({
                success: false,
                message: 'กรุณากรอกข้อมูลให้ครบถ้วน'
            });
        }

        const yearCheck = await pool.query('SELECT * FROM ppfee_years WHERE id = $1', [yearId]);
        if (yearCheck.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: 'Not found years select'
            });
        }

        const insert = await pool.query(
            `INSERT INTO ppfee_data
      (id, year_id, service_unit_code, service_unit_name, main_activity, sub_activity, person_count, service_count, amount)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
      RETURNING *`,
            [gen_id, yearId, service_unit_code, service_unit_name, main_activity, sub_activity, person_count, service_count, amount]
        );

        res.json({
            success: true,
            message: 'เพิ่มข้อมูลกิจกรรมสำเร็จ',
            data: insert.rows[0]
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'เกิดข้อผิดพลาดภายในระบบ'
        });
    }
});

router.delete('/ppfee/data/:id', async (req, res) => {
    const { id } = req.params;

    try {
        if (!id) {
            return res.status(400).json({
                success: false,
                message: 'Missing ID parameter',
            });
        }

        const result = await pool.query(
            'DELETE FROM ppfee_data WHERE id = $1 RETURNING *',
            [id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: 'Data not found',
            });
        }

        res.json({
            success: true,
            message: 'Deleted successfully',
            deleted: result.rows[0],
        });

    } catch (err) {
        console.error('Error deleting ppfee data:', err);
        res.status(500).json({
            success: false,
            message: 'Internal server error while deleting data',
        });
    }
});


// PUT: แก้ไขข้อมูลกิจกรรมย่อย
router.put('/ppfee/data/:id', async (req, res) => {
    const { id } = req.params;
    const {
        service_unit_code,
        service_unit_name,
        main_activity,
        sub_activity,
        person_count,
        service_count,
        amount
    } = req.body;

    try {
        // ตรวจสอบว่าข้อมูลนี้มีอยู่จริงหรือไม่
        const check = await pool.query('SELECT * FROM ppfee_data WHERE id = $1', [id]);
        if (check.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: 'ไม่พบข้อมูลที่ต้องการแก้ไข'
            });
        }

        // อัปเดตข้อมูล
        const update = await pool.query(
            `UPDATE ppfee_data 
             SET service_unit_code= $1,
                service_unit_name= $2,
                main_activity = $3,
                sub_activity = $4,
                person_count = $5,
                service_count = $6,
                amount = $7,
                updated_at = CURRENT_TIMESTAMP
             WHERE id = $8
             RETURNING *`,
            [service_unit_code, service_unit_name, main_activity, sub_activity, person_count, service_count, amount, id]
        );

        res.json({
            success: true,
            message: 'แก้ไขข้อมูลสำเร็จ',
            data: update.rows[0]
        });

    } catch (error) {
        console.error('UPDATE ERROR:', error);
        res.status(500).json({
            success: false,
            message: 'เกิดข้อผิดพลาดภายในระบบ'
        });
    }
});


module.exports = router;
