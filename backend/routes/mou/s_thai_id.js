//MOU 19. ร้อยละของอำเภอที่ประชาชนไทย มี Health ID เพื่อการเข้าถึงระบบบริการสุขภาพแบบไร้รอยต่อ
const express = require('express');
const router = express.Router();
const axios = require('axios');
const pool = require('../../config/db');


router.post('/s_thai_id/insert_data', async (req, res) => {
    const dataToInsert = req.body;

    if (!Array.isArray(dataToInsert) || dataToInsert.length === 0) {
        return res.status(400).send('Invalid data provided. Expected an array of objects.');
    }

    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        await client.query('TRUNCATE TABLE s_thai_id');

        const insertPromises = dataToInsert.map(item => {
            return client.query(
                `INSERT INTO s_thai_id (hospcode, target, result)
                 VALUES ($1, $2, $3)`,
                [item.hospcode, item.target, item.result]
            );
        });

        await Promise.all(insertPromises);

        await client.query(`
            DELETE FROM summary_mou WHERE kpi = $1
        `, ['s_thai_id']);

        await client.query(`
            INSERT INTO summary_mou (a_code, a_name, target, result, percent, kpi)
            select
                h.hoscode as a_code
                , concat(h.hoscode, ':', h.hosname) as a_name 
                , coalesce(SUM("target"), 0) as "target"
                , coalesce(SUM("result"), 0) as "result"
                , coalesce(ROUND(SUM("result") * 100.0 /
                nullif(SUM("target"), 0),2
                ), 0) as percent
            from
                chospital as h
            inner join s_thai_id as s on
                h.hoscode = s.hospcode
            WHERE
                h.hoscode = '99862'
            group by
                h.hoscode
                , h.hosname
            order by
                a_code
        `);

        await client.query('COMMIT'); // Commit the transaction
        res.status(200).json({ message: 'บันทึกข้อมูลสำเร็จ' });
    } catch (err) {
        await client.query('ROLLBACK'); // Rollback on error
        console.error(err);
        res.status(500).send('Server Error');
    } finally {
        client.release();
    }
});

router.get('/s_thai_id/data', async (req, res) => {
    try {
        const response = await pool.query(`
       select
            h.hoscode as a_code
            , CONCAT(h.hosname) as a_name
            , coalesce(SUM("target"), 0) as "target"
            , coalesce(SUM("result"), 0) as "result"
            , coalesce(ROUND(SUM("result") * 100.0 /
            nullif(SUM("target"), 0),2
            ), 0) as percent
        from
            chospital as h
        inner join s_thai_id as s on
            h.hoscode = s.hospcode
        group by
            h.hoscode
            , h.hosname
        union all
                select 
                '99999' as a_code
                ,'รวมทั้งสิ้น' as a_name
                ,SUM(q1.target) as target
                , SUM(q1.result) as result
                , coalesce(ROUND(
                SUM(q1.result) * 100.0 / nullif(SUM(q1.target), 0),2
                ), 0) as percent
        from(
            select
            h.hoscode as a_code
            , CONCAT(h.hosname) as a_name
            , coalesce(SUM("target"), 0) as "target"
            , coalesce(SUM("result"), 0) as "result"
            , coalesce(ROUND(SUM("result") * 100.0 /
            nullif(SUM("target"), 0),2
            ), 0) as percent
        from
            chospital as h
        inner join s_thai_id as s on
            h.hoscode = s.hospcode
        group by
            h.hoscode
            , h.hosname
        ) as q1
        order by
            a_code
    `)

        res.json(response.rows)
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});



module.exports = router;