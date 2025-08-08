//Ministry  18	อัตราตายของผู้ป่วยโรคกล้ามเนื้อหัวใจตายเฉียบพลันชนิด STEMI
const express = require('express');
const router = express.Router();
const axios = require('axios');
const pool = require('../../config/db');

router.get('/get_s_stemi_death', async (req, res) => {
    try {
        const response = await axios.post('https://opendata.moph.go.th/api/report_data', {
            tableName: "s_stemi_death",
            year: "2568",
            province: "81",
            type: "json"
        });

        const dataList = response.data;

        await pool.query('TRUNCATE TABLE s_stemi_death');

        for (const data of dataList) {
            await pool.query(`
                INSERT INTO s_stemi_death (
                    id, hospcode, areacode, date_com, b_year, 
                    targetq1, targetq2, targetq3, targetq4,
                    resultq1, resultq2, resultq3, resultq4
                ) VALUES (
                    $1, $2, $3, $4, $5, 
                    $6, $7, $8, $9, 
                    $10, $11, $12, $13
                )
            `, [
                data.id,
                data.hospcode,
                data.areacode,
                data.date_com || null,
                data.b_year,
                data.targetq1, 
                data.targetq2, 
                data.targetq3, 
                data.targetq4,
                data.resultq1, 
                data.resultq2, 
                data.resultq3, 
                data.resultq4

            ]);
        }

        await pool.query(`
        DELETE FROM summary_ministry
        WHERE kpi = $1
        `, ['s_stemi_death']);

        await pool.query(`
        INSERT INTO summary_ministry (a_code, a_name, target, result, percent, kpi)
        select
            h.hoscode as a_code
            , concat(h.hoscode, ':', h.hosname) as a_name
            , SUM("targetq1" + "targetq2" + "targetq3" + "targetq4") as "target"
            , SUM("resultq1" + "resultq2" + "resultq3" + "resultq4") as "result"
            , coalesce(ROUND(
                        SUM("resultq1" + "resultq2" + "resultq3" + "resultq4") * 100.0 /
                        nullif(SUM("targetq1" + "targetq2" + "targetq3" + "targetq4"), 0),
                        2
                    ), 0) as percent
            , 's_stemi_death' AS kpi
        from
            chospital as h
        left join s_stemi_death as s on
            h.hoscode = s.hospcode
            and s.b_year = '${process.env.B_YEAR}'
            and 1 = 1
        WHERE
            h.hoscode = '11344'
        group by
            h.hoscode
            , h.hosname
        `);

        res.status(200).json({ message: 'Import success', count: dataList.length });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

router.get('/s_stemi_death/data', async (req, res) => {
    try {
        const response = await pool.query(`
        select
            h.hoscode as a_code
            , CONCAT(h.hosname) as a_name
            , coalesce(SUM("targetq1" + "targetq2" + "targetq3" + "targetq4"), 0) as "target"
            , coalesce(SUM("resultq1" + "resultq2" + "resultq3" + "resultq4"), 0) as "result"
            , coalesce(ROUND(SUM("resultq1" + "resultq2" + "resultq3" + "resultq4") * 100.0 /
            nullif(SUM("targetq1" + "targetq2" + "targetq3" + "targetq4"), 0),
            2), 0) as percent
        from
            chospital as h
        left join s_stemi_death as s on
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
            , concat(h.hoscode, ':', h.hosname) as a_name
            , SUM("targetq1" + "targetq2" + "targetq3" + "targetq4") as "target"
            , SUM("resultq1" + "resultq2" + "resultq3" + "resultq4") as "result"
        from
            chospital as h
        left join s_stemi_death as s on
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


module.exports = router;