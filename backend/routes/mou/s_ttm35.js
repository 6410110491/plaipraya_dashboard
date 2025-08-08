//MOU 18  ร้อยละของประชาชนที่มารับบริการในระดับปฐมภูมิได้รับการรักษาด้วยการแพทย์แผนไทย และการแพทย์ทางเลือก
//Ministry  13	ร้อยละของประชาชนที่มารับบริการในระดับปฐมภูมิได้รับการรักษาด้วยการแพทย์แผนไทยและการแพทย์ทางเลือก
const express = require('express');
const router = express.Router();
const axios = require('axios');
const pool = require('../../config/db');

router.get('/get_s_ttm35', async (req, res) => {
    try {
        const response = await axios.post('https://opendata.moph.go.th/api/report_data', {
            tableName: "s_ttm35",
            year: "2568",
            province: "81",
            type: "json"
        });

        const dataList = response.data;

        await pool.query('TRUNCATE TABLE s_ttm35');

        for (const data of dataList) {
            await pool.query(`
                INSERT INTO s_ttm35 (
                    id, hospcode, areacode, date_com, b_year, 
                    op_service_q1, tm_service_q1, op_service_q2, tm_service_q2,
                    op_service_q3, tm_service_q3, op_service_q4, tm_service_q4
                ) VALUES (
                    $1, $2, $3, $4, $5, 
                    $6, $7,$8, $9, 
                    $10, $11, $12, $13
                )
            `, [
                data.id,
                data.hospcode,
                data.areacode,
                data.date_com || null,
                data.b_year,
                data.op_service_q1,
                data.tm_service_q1,
                data.op_service_q2,
                data.tm_service_q2,
                data.op_service_q3,
                data.tm_service_q3,
                data.op_service_q4,
                data.tm_service_q4

            ]);
        }

        await pool.query(`
        DELETE FROM summary_mou
        WHERE kpi = $1
        `, ['s_ttm35']);

        await pool.query(`
        INSERT INTO summary_mou (a_code, a_name, target, result, percent, kpi)
        SELECT
            h.hoscode AS a_code
            , concat(h.hoscode, ':', h.hosname) AS a_name
            , coalesce(SUM("op_service_q1" + "op_service_q2" + "op_service_q3" + "op_service_q4"), 0) as "target"
            , coalesce(SUM("tm_service_q1" + "tm_service_q2" + "tm_service_q3" + "tm_service_q4"), 0) as "result"
            , coalesce(ROUND(
                SUM("tm_service_q1" + "tm_service_q2" + "tm_service_q3" + "tm_service_q4") * 100.0 /
                nullif(SUM("op_service_q1" + "op_service_q2" + "op_service_q3" + "op_service_q4"), 0),
                2
            ), 0) as percent
            , 's_ttm35' AS kpi
        FROM
            chospital AS h
        LEFT JOIN s_ttm35 AS s ON
            h.hoscode = s.hospcode
            AND s.b_year = '${process.env.B_YEAR}'
        WHERE
            h.hoscode = '99862'
        GROUP BY h.hoscode, h.hosname
        `);

        await pool.query(`
        DELETE FROM summary_ministry
        WHERE kpi = $1
        `, ['s_ttm35']);

        await pool.query(`
        INSERT INTO summary_ministry (a_code, a_name, target, result, percent, kpi)
        SELECT
            h.hoscode AS a_code
            , concat(h.hoscode, ':', h.hosname) AS a_name
            , coalesce(SUM("op_service_q1" + "op_service_q2" + "op_service_q3" + "op_service_q4"), 0) as "target"
            , coalesce(SUM("tm_service_q1" + "tm_service_q2" + "tm_service_q3" + "tm_service_q4"), 0) as "result"
            , coalesce(ROUND(
                SUM("tm_service_q1" + "tm_service_q2" + "tm_service_q3" + "tm_service_q4") * 100.0 /
                nullif(SUM("op_service_q1" + "op_service_q2" + "op_service_q3" + "op_service_q4"), 0),
                2
            ), 0) as percent
            , 's_ttm35' AS kpi
        FROM
            chospital AS h
        LEFT JOIN s_ttm35 AS s ON
            h.hoscode = s.hospcode
            AND s.b_year = '${process.env.B_YEAR}'
        WHERE
            h.hoscode = '99862'
        GROUP BY h.hoscode, h.hosname
        `);

        res.status(200).json({ message: 'Import success', count: dataList.length });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

router.get('/s_ttm35/data', async (req, res) => {
    try {
        const response = await pool.query(`
        select
            h.hoscode as a_code
            , CONCAT(h.hosname) AS a_name
            , coalesce(SUM("op_service_q1" + "op_service_q2" + "op_service_q3" + "op_service_q4"), 0) as "target"
            , coalesce(SUM("tm_service_q1" + "tm_service_q2" + "tm_service_q3" + "tm_service_q4"), 0) as "result"
            , coalesce(ROUND(
                SUM("tm_service_q1" + "tm_service_q2" + "tm_service_q3" + "tm_service_q4") * 100.0 /
                nullif(SUM("op_service_q1" + "op_service_q2" + "op_service_q3" + "op_service_q4"), 0),
                2
            ), 0) as percent
        from
            chospital as h
        left join s_ttm35 as s on
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
            ,
            'รวมทั้งสิ้น' as a_name
            ,
            SUM(q1.target) as target
            ,
            SUM(q1.result) as result
            ,
            ROUND(
                SUM(q1.result) * 100.0 / nullif(SUM(q1.target), 0),
                2
            ) as percent
        from 
        (
        select
            h.hoscode as a_code
            , concat(h.hoscode, ':', h.hosname) as a_name
            , SUM("op_service_q1" + "op_service_q2" + "op_service_q3" + "op_service_q4") target
            , SUM("tm_service_q1" + "tm_service_q2" + "tm_service_q3" + "tm_service_q4") result
            , SUM("op_service_q1") "op_service_q1"
            , SUM("tm_service_q1") "tm_service_q1"
            , SUM("op_service_q2") "op_service_q2"
            , SUM("tm_service_q2") "tm_service_q2"
            , SUM("op_service_q3") "op_service_q3"
            , SUM("tm_service_q3") "tm_service_q3"
            , SUM("op_service_q4") "op_service_q4"
            , SUM("tm_service_q4") "tm_service_q4"
        from
            chospital as h
        left join s_ttm35 as s on
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
            a_code;
    `)

        res.json(response.rows)
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});


module.exports = router;