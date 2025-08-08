//MOU 8  จำนวนครั้งบริการสุขภาพช่องปากต่อผู้ให้บริการทันตกรรม เป้าหมาย *9 บุคลากร
const express = require('express');
const router = express.Router();
const axios = require('axios');
const pool = require('../../config/db');

router.get('/get_s_dental_70', async (req, res) => {
    try {
        const response = await axios.post('https://opendata.moph.go.th/api/report_data', {
            tableName: "s_dental_70",
            year: "2568",
            province: "81",
            type: "json"
        });

        const dataList = response.data;

        await pool.query('TRUNCATE TABLE s_dental_70');

        for (const data of dataList) {
            await pool.query(`
                INSERT INTO s_dental_70 (
                    id, hospcode, areacode, date_com, b_year, target, result, 
                    result10, result11, result12, result01,
                    result02, result03, result04, result05,
                    result06, result07, result08, result09
                ) VALUES (
                    $1, $2, $3, $4, $5, $6, 
                    $7, $8, $9, $10, 
                    $11, $12, $13, $14, 
                    $15, $16, $17, $18, $19 
                )
            `, [
                data.id,
                data.hospcode,
                data.areacode,
                data.date_com || null,
                data.b_year,
                data.target || 0,
                data.result,
                data.result10,
                data.result11,
                data.result12,
                data.result01,
                data.result02,
                data.result03,
                data.result04,
                data.result05,
                data.result06,
                data.result07,
                data.result08,
                data.result09
            ]);
        }

        res.status(200).json({ message: 'Import success', count: dataList.length });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

router.get('/s_dental_70/data', async (req, res) => {
    try {
        const response = await pool.query(`
       select
            h.hoscode as a_code
            , CONCAT(h.hosname) as a_name
            , coalesce(SUM("target"), 0) as "target"
            , coalesce(SUM("result"), 0) as "result"
            , coalesce(ROUND(
                        SUM("result") * 100.0 /
                        nullif(SUM("target"), 0),
                        2
                    ), 0) as percent
        from
                    chospital as h
        left join s_dental_70 as s on
            h.hoscode = s.hospcode
            and s.b_year = '${process.env.B_YEAR}'
            and 1 = 1
        where
            h.hdc_regist = 1
            and (h.zone_code = '${process.env.ZONE_CODE}'
                or 'ALL' = '${process.env.ZONE_CODE}')
            and (h.chw_code = '${process.env.CHW_CODE}'
                or 'ALL' = '${process.env.CHW_CODE}')
            and (h.amp_code = '${process.env.AMP_CODE}'
                or 'ALL' = '${process.env.AMP_CODE}')
            and (h.tmb_code = 'ALL'
                or 'ALL' = 'ALL')
            and (h.dep = 'ALL'
                or 'ALL' = 'ALL')
            and (h.mcode in ('ALL')
                or 'ALL' in ('ALL'))
            and (h.mcode in ('ALL')
                or 'ALL' in ('ALL'))
            and (h.hoscode in ('ALL')
                or 'ALL' in ('ALL'))
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
            , concat(h.hosname) as a_name
            , coalesce(SUM("target"), 0) as "target"
            , sum("result") as "result"
        from
            chospital as h
        left join s_dental_70 as s on
            h.hoscode = s.hospcode
            and s.b_year = '${process.env.B_YEAR}'
            and 1 = 1
        where
            h.hdc_regist = 1
            and (h.zone_code = '${process.env.ZONE_CODE}'
                or 'ALL' = '${process.env.ZONE_CODE}')
            and (h.chw_code = '${process.env.CHW_CODE}'
                or 'ALL' = '${process.env.CHW_CODE}')
            and (h.amp_code = '${process.env.AMP_CODE}'
                or 'ALL' = '${process.env.AMP_CODE}')
            and (h.tmb_code = 'ALL'
                or 'ALL' = 'ALL')
            and (h.dep = 'ALL'
                or 'ALL' = 'ALL')
            and (h.mcode in ('ALL')
                or 'ALL' in ('ALL'))
            and (h.mcode in ('ALL')
                or 'ALL' in ('ALL'))
            and (h.hoscode in ('ALL')
                or 'ALL' in ('ALL'))
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


router.post('/s_dental_70/insert_data', async (req, res) => {
    const dataArray = req.body;

    if (!Array.isArray(dataArray) || dataArray.length === 0) {
        return res.status(400).json({ error: 'Expected an array of objects with hospcode, target, and result.' });
    }

    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        for (const item of dataArray) {
            const { hospcode, target, result } = item;

            if (!hospcode) {
                throw new Error('hospcode is required');
            }

            const existingResult = await client.query(
                `SELECT * FROM s_dental_70 WHERE hospcode = $1`,
                [hospcode]
            );

            if (existingResult.rowCount === 0) {
                console.warn(`ไม่พบข้อมูลในฐานข้อมูลสำหรับ hospcode: ${hospcode}`);
                continue; // ข้ามรายการที่ไม่มีข้อมูลเดิม
            }

            const oldData = existingResult.rows[0];

            // เตรียมข้อมูลใหม่
            const updatedData = {
                ...oldData,
                target: target ?? oldData.target,
                result: result ?? oldData.result
            };

            // ทำการอัปเดต
            await client.query(
                `UPDATE s_dental_70 SET
                    id = $1,
                    areacode = $2,
                    date_com = $3,
                    b_year = $4,
                    target = $5,
                    result = $6,
                    result10 = $7,
                    result11 = $8,
                    result12 = $9,
                    result01 = $10,
                    result02 = $11,
                    result03 = $12,
                    result04 = $13,
                    result05 = $14,
                    result06 = $15,
                    result07 = $16,
                    result08 = $17,
                    result09 = $18
                 WHERE hospcode = $19`,
                [
                    updatedData.id,
                    updatedData.areacode,
                    updatedData.date_com,
                    updatedData.b_year,
                    updatedData.target,
                    updatedData.result,
                    updatedData.result10,
                    updatedData.result11,
                    updatedData.result12,
                    updatedData.result01,
                    updatedData.result02,
                    updatedData.result03,
                    updatedData.result04,
                    updatedData.result05,
                    updatedData.result06,
                    updatedData.result07,
                    updatedData.result08,
                    updatedData.result09,
                    hospcode
                ]
            );
        }

        await client.query('COMMIT');

        await pool.query(`
        DELETE FROM summary_mou
        WHERE kpi = $1
        `, ['s_dental_70']);

        await pool.query(`
        INSERT INTO summary_mou (a_code, a_name, target, result, percent, kpi)
        select 
                '99999' as a_code
                ,'รวมทั้งสิ้น' as a_name
                ,SUM(q1.target) as target
                , SUM(q1.result) as result
                , coalesce(ROUND(
                SUM(q1.result) * 100.0 / nullif(SUM(q1.target), 0),2
                ), 0) as percent
                , 's_dental_70' AS kpi
        from(
            select
            h.hoscode as a_code
            , concat(h.hosname) as a_name
            , coalesce(SUM("target"), 0) as "target"
            , sum("result") as "result"
        from
            chospital as h
        left join s_dental_70 as s on
            h.hoscode = s.hospcode
            and s.b_year = '${process.env.B_YEAR}'
            and 1 = 1
        where
            h.hdc_regist = 1
            and (h.zone_code = '${process.env.ZONE_CODE}'
                or 'ALL' = '${process.env.ZONE_CODE}')
            and (h.chw_code = '${process.env.CHW_CODE}'
                or 'ALL' = '${process.env.CHW_CODE}')
            and (h.amp_code = '${process.env.AMP_CODE}'
                or 'ALL' = '${process.env.AMP_CODE}')
            and (h.tmb_code = 'ALL'
                or 'ALL' = 'ALL')
            and (h.dep = 'ALL'
                or 'ALL' = 'ALL')
            and (h.mcode in ('ALL')
                or 'ALL' in ('ALL'))
            and (h.mcode in ('ALL')
                or 'ALL' in ('ALL'))
            and (h.hoscode in ('ALL')
                or 'ALL' in ('ALL'))
        group by
            h.hoscode
            , h.hosname
        ) as q1
        order by
            a_code
        `);

        return res.status(200).json({ message: 'อัปเดตข้อมูลสำเร็จสำหรับรายการที่มีข้อมูลเดิม' });

    } catch (err) {
        await client.query('ROLLBACK');
        console.error(err);
        return res.status(500).json({ error: 'Server error', detail: err.message });
    } finally {
        client.release();
    }
});




module.exports = router;