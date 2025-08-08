//MOU  5  ร้อยละการตรวจติดตามยืนยันวินิจฉัยกลุ่มสงสัยป่วยโรคความดันโลหิตสูง
//ministy 5.2 ร้อยละการตรวจติดตามยืนยันวินิจฉัยกลุ่มสงสัยป่วยโรคความดันโลหิตสูง
const express = require('express');
const router = express.Router();
const axios = require('axios');
const pool = require('../../config/db');

router.get('/get_s_ht_screen_follow', async (req, res) => {
    try {
        const response = await axios.post('https://opendata.moph.go.th/api/report_data', {
            tableName: "s_ht_screen_follow",
            year: "2568",
            province: "81",
            type: "json"
        });

        const dataList = response.data;

        await pool.query('TRUNCATE TABLE s_ht_screen_follow');

        for (const data of dataList) {
            await pool.query(`
                INSERT INTO s_ht_screen_follow (
                    id, hospcode, areacode, date_com, b_year, target, result,
                    r1, r2, 
                    t_q1, r_q1, r1_q1, r2_q1,
                    t_q2, r_q2, r1_q2, r2_q2,
                    t_q3, r_q3, r1_q3, r2_q3,
                    t_q4, r_q4, r1_q4, r2_q4,
                    target_13, result_13, r_home_bp_13, r_hosp_bp_13, non_follow90_13 ,over90
                ) VALUES (
                    $1, $2, $3, $4, $5, $6, $7, 
                    $8, $9, 
                    $10, $11, $12, $13, 
                    $14, $15, $16, $17, 
                    $18, $19, $20, $21, 
                    $22, $23, $24, $25, 
                    $26, $27, $28, $29, $30, $31
                )
            `, [
                data.id,
                data.hospcode,
                data.areacode,
                data.date_com || null,
                data.b_year,
                data.target,
                data.result,
                data.r1,
                data.r2,
                data.t_q1,
                data.r_q1,
                data.r1_q1,
                data.r2_q1,
                data.t_q2,
                data.r_q2,
                data.r1_q2,
                data.r2_q2,
                data.t_q3,
                data.r_q3,
                data.r1_q3,
                data.r2_q3,
                data.t_q4,
                data.r_q4,
                data.r1_q4,
                data.r2_q4,
                data.target_13,
                data.result_13,
                data.r_home_bp_13,
                data.r_hosp_bp_13,
                data.non_follow90_13,
                data.over90

            ]);
        }

        await pool.query(`
        DELETE FROM summary_mou
        WHERE kpi = $1
        `, ['s_ht_screen_follow']);

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
            , 's_ht_screen_follow' AS kpi
        FROM
            chospital AS h
        LEFT JOIN s_ht_screen_follow AS s ON
            h.hoscode = s.hospcode
            AND s.b_year = '${process.env.B_YEAR}'
        WHERE
            h.hoscode = '99862'
        GROUP BY h.hoscode, h.hosname
        `);

        await pool.query(`
        DELETE FROM summary_ministry
        WHERE kpi = $1
        `, ['s_ht_screen_follow']);

        await pool.query(`
        INSERT INTO summary_ministry (a_code, a_name, target, result, percent, kpi)
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
            , 's_ht_screen_follow' AS kpi
        FROM
            chospital AS h
        LEFT JOIN s_ht_screen_follow AS s ON
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

router.get('/s_ht_screen_follow/data', async (req, res) => {
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
        left join s_ht_screen_follow as s on
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
            and ( h.tmb_code = 'ALL'
                or 'ALL' = 'ALL' )
            and ( h.dep = 'ALL'
                or 'ALL' = 'ALL' )
            and ( h.mcode in ('ALL')
                or 'ALL' in ('ALL') )
            and ( h.mcode in ('ALL')
                or 'ALL' in ('ALL') )
            and ( h.hoscode in ('ALL')
                or 'ALL' in ('ALL') ) 
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
            , SUM("target") as "target"
            , SUM("result") as "result"
        from
            chospital as h
        left join s_ht_screen_follow as s on
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
            and ( h.tmb_code = 'ALL'
                or 'ALL' = 'ALL' )
            and ( h.dep = 'ALL'
                or 'ALL' = 'ALL' )
            and ( h.mcode in ('ALL')
                or 'ALL' in ('ALL') )
            and ( h.mcode in ('ALL')
                or 'ALL' in ('ALL') )
            and ( h.hoscode in ('ALL')
                or 'ALL' in ('ALL') ) 
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