//Ministy  10. อัตราตายของผู้ป่วยโรคหลอดเลือดสมอง (Stroke: I60-I69)
const express = require('express');
const router = express.Router();
const axios = require('axios');
const pool = require('../../config/db');

router.get('/get_s_stroke_admit_death', async (req, res) => {
    try {
        const response = await axios.post('https://opendata.moph.go.th/api/report_data', {
            tableName: "s_stroke_admit_death",
            year: "2568",
            province: "81",
            type: "json"
        });

        const dataList = response.data;

        await pool.query('TRUNCATE TABLE s_stroke_admit_death');

        for (const data of dataList) {
            await pool.query(`
                INSERT INTO s_stroke_admit_death (
                    id, hospcode, areacode, date_com, b_year, 
                    targetq1, targetq2, targetq3, targetq4,
                    resultq1, resultq2, resultq3, resultq4,

                    target1_q1, target2_q1, target3_q1,

                    target1_q2, target2_q2, target3_q2,

                    target1_q3, target2_q3, target3_q3,

                    target1_q4, target2_q4, target3_q4,

                    result1_q1, result2_q1, result3_q1,

                    result1_q2, result2_q2, result3_q2,

                    result1_q3, result2_q3, result3_q3,

                    result1_q4, result2_q4, result3_q4
                ) VALUES (
                    $1, $2, $3, $4, $5, 
                    $6, $7, $8, $9, 
                    $10, $11, $12, $13, 

                    $14, $15, $16, 
                    $17, $18, $19, 
                    $20, $21, $22, 
                    $23, $24, $25, 
                    $26, $27, $28, 
                    $29, $30, $31,
                    $32, $33, $34,
                    $35, $36, $37
                )
            `, [
                data.id,
                data.hospcode,
                data.areacode,
                data.date_com,
                data.b_year,
                data.targetq1,
                data.targetq2,
                data.targetq3,
                data.targetq4,
                data.resultq1,
                data.resultq2,
                data.resultq3,
                data.resultq4,
                data.target1_q1,
                data.target2_q1,
                data.target3_q1,
                data.target1_q2,
                data.target2_q2,
                data.target3_q2,
                data.target1_q3,
                data.target2_q3,
                data.target3_q3,
                data.target1_q4,
                data.target2_q4,
                data.target3_q4,
                data.result1_q1,
                data.result2_q1,
                data.result3_q1,
                data.result1_q2,
                data.result2_q2,
                data.result3_q2,
                data.result1_q3,
                data.result2_q3,
                data.result3_q3,
                data.result1_q4,
                data.result2_q4,
                data.result3_q4
            ]);
        }

        await pool.query(`
        DELETE FROM summary_ministry
        WHERE kpi = $1
        `, ['s_stroke_admit_death']);

        await pool.query(`
        INSERT INTO summary_ministry (a_code, a_name, target, result, percent, kpi)
        SELECT
            h.hoscode AS a_code
            , concat(h.hoscode, ':', h.hosname) AS a_name
            , COALESCE(SUM("targetq1" + "targetq2" + "targetq3" + "targetq4"), 0) AS target
            , COALESCE(SUM("resultq1" + "resultq2" + "resultq3" + "resultq4"), 0) AS result
            ,COALESCE(ROUND(SUM("resultq1" + "resultq2" + "resultq3" + "resultq4") * 100.0 /NULLIF(SUM("targetq1" + "targetq2" + "targetq3" + "targetq4"), 0),2), 0) AS percent
            , 's_stroke_admit_death' AS kpi
        FROM
            chospital AS h
        LEFT JOIN s_stroke_admit_death AS s ON
            h.hoscode = s.hospcode
            AND s.b_year = '${process.env.B_YEAR}'
        WHERE
            h.hoscode = '11344'
        GROUP BY h.hoscode, h.hosname
        `);

        res.status(200).json({ message: 'Import success', count: dataList.length });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

router.get('/s_stroke_admit_death/data', async (req, res) => {
    try {
        const response = await pool.query(`
        select
            h.hoscode as a_code
            , CONCAT(h.hosname) as a_name
            , coalesce(SUM("targetq1" + "targetq2" + "targetq3" + "targetq4"), 0) as "target"
            , coalesce(SUM("resultq1" + "resultq2" + "resultq3" + "resultq4"), 0) as "result"
            , coalesce(ROUND(
                        SUM("resultq1" + "resultq2" + "resultq3" + "resultq4") * 100.0 /
                        nullif(SUM("targetq1" + "targetq2" + "targetq3" + "targetq4"), 0),
                        2
                    ), 0) as percent
        from
                    chospital as h
        left join s_stroke_admit_death as s on
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
            , SUM("targetq1" + "targetq2" + "targetq3" + "targetq4") as "target"
            , SUM("resultq1" + "resultq2" + "resultq3" + "resultq4") as "result"
        from
            chospital as h
        left join s_stroke_admit_death as s on
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