//MOU 4. ร้อยละการตรวจติดตามยืนยันวินิจฉัยกลุ่มสงสัยป่วยโรคเบาหวาน

//ministy 5.1 ร้อยละการตรวจติดตามยืนยันวินิจฉัยกลุ่มสงสัยป่วยโรคเบาหวาน
const express = require('express');
const router = express.Router();
const axios = require('axios');
const pool = require('../../config/db');

router.get('/get_s_ncd_screen_repleate1', async (req, res) => {
    try {
        const response = await axios.post('https://opendata.moph.go.th/api/report_data', {
            tableName: "s_ncd_screen_repleate1",
            year: "2568",
            province: "81",
            type: "json"
        });

        const dataList = response.data;

        await pool.query('TRUNCATE TABLE s_ncd_screen_repleate1');

        for (const data of dataList) {
            await pool.query(`
                INSERT INTO s_ncd_screen_repleate1 (
                    id, hospcode, areacode, date_com, b_year,
                    targetq1, targetq2, targetq3, targetq4,
                    resultq1, resultq2, resultq3, resultq4,
                    target, result, yymm, date_fz, target_13,
                    result_13, non_follow180_13, over180
                ) VALUES (
                    $1, $2, $3, $4, $5, $6,
                    $7, $8, $9, $10,
                    $11, $12, $13, $14,
                    $15, $16, $17, $18,
                    $19, $20, $21
                )
            `, [
                data.id,
                data.hospcode,
                data.areacode,
                data.date_com || null,
                data.b_year,
                data.targetq1 || 0,
                data.targetq2 || 0,
                data.targetq3 || 0,
                data.targetq4 || 0,
                data.resultq1 || 0,
                data.resultq2 || 0,
                data.resultq3 || 0,
                data.resultq4 || 0,
                data.target || 0,
                data.result || 0,
                data.yymm,
                data.date_fz,
                data.target_13 || 0,
                data.result_13 || 0,
                data.non_follow180_13 || 0,
                data.over180 || 0
            ]);
        }

        await pool.query(`
        DELETE FROM summary_mou
        WHERE kpi = $1
        `, ['s_ncd_screen_repleate1']);

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
            , 's_ncd_screen_repleate1' AS kpi
        FROM
            chospital AS h
        LEFT JOIN s_ncd_screen_repleate1 AS s ON
            h.hoscode = s.hospcode
            AND s.b_year = '${process.env.B_YEAR}'
        WHERE
            h.hoscode = '99862'
        GROUP BY h.hoscode, h.hosname
        `);

        await pool.query(`
        DELETE FROM summary_ministry
        WHERE kpi = $1
        `, ['s_ncd_screen_repleate1']);

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
            , 's_ncd_screen_repleate1' AS kpi
        FROM
            chospital AS h
        LEFT JOIN s_ncd_screen_repleate1 AS s ON
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


router.get('/s_ncd_screen_repleate1/data', async (req, res) => {
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
        left join s_ncd_screen_repleate1 as s on
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
            ,'รวมทั้งสิ้น' as a_name
            ,SUM(q1.target) as target
            ,SUM(q1.result) as result
            ,ROUND(SUM(q1.result) * 100.0 / nullif(SUM(q1.target), 0),2) as percent
        from (
            select
            h.hoscode as a_code
            , concat(h.hoscode, ':', h.hosname) as a_name
            , SUM(target) as target
            , SUM(result) as result
        from
            chospital as h
        left join s_ncd_screen_repleate1 as s on
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