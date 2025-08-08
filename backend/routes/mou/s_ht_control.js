//MOU 15  ร้อยละของผู้ป่วยโรคความดันที่ควบคุมระดับความดันโลหิตได้
const express = require('express');
const router = express.Router();
const axios = require('axios');
const pool = require('../../config/db');

router.get('/get_s_ht_control', async (req, res) => {
    try {
        const response = await axios.post('https://opendata.moph.go.th/api/report_data', {
            tableName: "s_ht_control",
            year: "2568",
            province: "81",
            type: "json"
        });

        const dataList = response.data;

        await pool.query('TRUNCATE TABLE s_ht_control');

        for (const data of dataList) {
            await pool.query(`
                INSERT INTO s_ht_control (
                    id, hospcode, areacode, date_com, b_year, target, result, 
                    bp, target1, result1, bp1, target2, no_bp_d, no_bp_f,
                    bp1_d, bp1_f, result_bp1_d, result_bp1_f, yymm, date_fz

                ) VALUES (
                    $1, $2, $3, $4, $5, $6, $7, 
                    $8, $9, $10, $11, $12, $13, $14,
                    $15, $16, $17, $18, $19, $20
                )
            `, [
                data.id,
                data.hospcode,
                data.areacode,
                data.date_com || null,
                data.b_year,
                data.target,
                data.result,
                data.bp, 
                data.target1, 
                data.result1, 
                data.bp1, 
                data.target2, 
                data.no_bp_d, 
                data.no_bp_f,
                data.bp1_d, 
                data.bp1_f, 
                data.result_bp1_d, 
                data.result_bp1_f, 
                data.yymm, 
                data.date_fz

            ]);
        }

        await pool.query(`
        DELETE FROM summary_mou
        WHERE kpi = $1
        `, ['s_ht_control']);

        await pool.query(`
        INSERT INTO summary_mou (a_code, a_name, target, result, percent, kpi)
        SELECT
            h.hoscode AS a_code
            , concat(h.hoscode, ':', h.hosname) AS a_name
            , coalesce(SUM("target"), 0) as "target"
            , coalesce(SUM("result"), 0) as "result"
            , coalesce(ROUND(
                SUM("result") * 100.0 /
                nullif(SUM("target"), 0),
                2
            ), 0) as percent
            , 's_ht_control' AS kpi
        FROM
            chospital AS h
        LEFT JOIN s_ht_control AS s ON
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

router.get('/s_ht_control/data', async (req, res) => {
    try {
        const response = await pool.query(`
        select
            h.hoscode as a_code
            , CONCAT(h.hosname) AS a_name
            , coalesce(SUM("target"), 0) as "target"
            , coalesce(SUM("result"), 0) as "result"
            , coalesce(ROUND(
                SUM("result") * 100.0 /
                nullif(SUM("target"), 0),
                2
            ), 0) as percent
        from
            chospital as h
        left join s_ht_control as s on
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
        from (
        select
            h.hoscode as a_code
            , concat(h.hoscode, ':', h.hosname) as a_name
            , sum("target") as "target"
            , sum("result") as "result_bp2"
            , sum("bp") as "bp2"
            , sum("bp1_d") as "bp1"
            , sum("no_bp_d") as "no_bp"
            , sum("result_bp1_d") as "result"
            , sum("target1") as "target_f"
            , sum("target2") as "visit2"
            , sum("result1") as "result_bp2_f"
            , sum("bp1") as "bp2_f"
            , sum("bp1_f") as "bp1_f"
            , sum("no_bp_f") as "no_bp_f"
            , sum("result_bp1_f") as "result_f"
        from
            chospital as h
        left join s_ht_control as s on
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