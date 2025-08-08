//Ministy  12	อัตราตายทารกแรกเกิดอายุน้อยกว่าหรือเท่ากับ 28 วัน
const express = require('express');
const router = express.Router();
const axios = require('axios');
const pool = require('../../config/db');

router.get('/get_s_death28pa', async (req, res) => {
    try {
        const response = await axios.post('https://opendata.moph.go.th/api/report_data', {
            tableName: "s_death28pa",
            year: "2568",
            province: "81",
            type: "json"
        });

        const dataList = response.data;

        await pool.query('TRUNCATE TABLE s_death28pa');

        for (const data of dataList) {
            await pool.query(`
                INSERT INTO s_death28pa (
                    id, hospcode, areacode, date_com, b_year, 
                    target, result
                ) VALUES (
                    $1, $2, $3, $4, $5, 
                    $6, $7
                )
            `, [
                data.id,
                data.hospcode,
                data.areacode,
                data.date_com,
                data.b_year,
                data.target,
                data.result,
            ]);
        }

        await pool.query(`
        DELETE FROM summary_ministry
        WHERE kpi = $1
        `, ['s_death28pa']);

        await pool.query(`
        INSERT INTO summary_ministry (a_code, a_name, target, result, percent, kpi)
        select
            h.hoscode as a_code
            , concat(h.hoscode, ':', h.hosname) as a_name
            , SUM("target") as "target"
            , SUM("result") as "result"
            , coalesce(ROUND(SUM("result") * 1000.0 /
                nullif(SUM("target"), 0),2
            ), 0) as percent
            , 's_death28pa' AS kpi
        from
            chospital as h
        left join s_death28pa as s on
            h.hoscode = s.hospcode
            and s.b_year = '${process.env.B_YEAR}'
            and 1 = 1
        WHERE
            h.hoscode = '11344'
        group by
            h.hoscode
            , h.hosname
        order by
            h.hoscode
        `);

        res.status(200).json({ message: 'Import success', count: dataList.length });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

router.get('/s_death28pa/data', async (req, res) => {
    try {
        const response = await pool.query(`
        select
            h.hoscode as a_code
            , CONCAT(h.hosname) as a_name
            , coalesce(SUM("target"), 0) as "target"
            , coalesce(SUM("result"), 0) as "result"
            , coalesce(ROUND(SUM("result") * 1000.0 /
            nullif(SUM("target"), 0),2
            ), 0) as percent
        from
                    chospital as h
        left join s_death28pa as s on
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
            , SUM("target") as "target"
            , SUM("result") as "result"
        from
            chospital as h
        left join s_death28pa as s on
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