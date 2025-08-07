//MOU 12  ร้อยละประชากรกลุ่มเป้าหมาย อายุ 50 - 70 ปี ที่ได้รับการคัดกรองมะเร็งลำไส้ใหญ่และไส้ตรง
const express = require('express');
const router = express.Router();
const axios = require('axios');
const pool = require('../../config/db');

router.get('/get_s_colon_screen', async (req, res) => {
    try {
        const response = await axios.post('https://opendata.moph.go.th/api/report_data', {
            tableName: "s_colon_screen",
            year: "2568",
            province: "81",
            type: "json"
        });

        const dataList = response.data;

        await pool.query('TRUNCATE TABLE s_colon_screen');

        for (const data of dataList) {
            await pool.query(`
                INSERT INTO s_colon_screen (
                    id, hospcode, areacode, date_com, b_year, target, 
                    fitposq1, fitposq2 ,fitposq3  ,fitposq4,
                    fitnegq1, fitnegq2 ,fitnegq3, fitnegq4,
                    colonoq1, colonoq2, colonoq3,  colonoq4,
                    colonoposq1, colonoposq2, colonoposq3, colonoposq4,
                    colonocaq1, colonocaq2, colonocaq3, colonocaq4,
                    colono1_o_q1, colono1_o_q2, colono1_o_q3, colono1_o_q4,
                    colono2_o_q1, colono2_o_q2, colono2_o_q3, colono2_o_q4,
                    colono3_o_q1, colono3_o_q2, colono3_o_q3, colono3_o_q4,
                    colono1_i_q1, colono1_i_q2, colono1_i_q3, colono1_i_q4, 
                    colono2_i_q1, colono2_i_q2, colono2_i_q3, colono2_i_q4, 
                    colono3_i_q1, colono3_i_q2, colono3_i_q3, colono3_i_q4
                ) VALUES (
                    $1, $2, $3, $4, $5, $6, 
                    $7, $8, $9, $10, 
                    $11, $12, $13, $14, 
                    $15, $16, $17, $18, 
                    $19, $20, $21, $22, 
                    $23, $24, $25, $26, 
                    $27, $28, $29, $30, 
                    $31, $32, $33, $34, 
                    $35, $36, $37, $38, 
                    $39, $40, $41, $42, 
                    $43, $44, $45, $46, 
                    $47, $48, $49, $50
                )
            `, [
                data.id,
                data.hospcode,
                data.areacode,
                data.date_com || null,
                data.b_year,
                data.target,

                data.fitposq1,
                data.fitposq2,
                data.fitposq3,
                data.fitposq4,

                data.fitnegq1,
                data.fitnegq2,
                data.fitnegq3,
                data.fitnegq4,

                data.colonoq1,
                data.colonoq2,
                data.colonoq3,
                data.colonoq4,

                data.colonoposq1,
                data.colonoposq2,
                data.colonoposq3,
                data.colonoposq4,

                data.colonocaq1,
                data.colonocaq2,
                data.colonocaq3,
                data.colonocaq4,

                data.colono1_o_q1,
                data.colono1_o_q2,
                data.colono1_o_q3,
                data.colono1_o_q4,

                data.colono2_o_q1,
                data.colono2_o_q2,
                data.colono2_o_q3,
                data.colono2_o_q4,

                data.colono3_o_q1,
                data.colono3_o_q2,
                data.colono3_o_q3,
                data.colono3_o_q4,

                data.colono1_i_q1,
                data.colono1_i_q2,
                data.colono1_i_q3,
                data.colono1_i_q4,

                data.colono2_i_q1,
                data.colono2_i_q2,
                data.colono2_i_q3,
                data.colono2_i_q4,

                data.colono3_i_q1,
                data.colono3_i_q2,
                data.colono3_i_q3,
                data.colono3_i_q4
            ]);
        }

        await pool.query(`
        DELETE FROM summary_mou
        WHERE kpi = $1
        `, ['s_colon_screen']);

        await pool.query(`
        INSERT INTO summary_mou (a_code, a_name, target, result, percent, kpi)
        SELECT
            h.hoscode AS a_code
            , concat(h.hoscode, ':', h.hosname) AS a_name
            , coalesce(SUM("target"), 0) as "target"
            , coalesce(SUM("fitposq1" + "fitposq2" + "fitposq3" + "fitposq4" + "fitnegq1" + "fitnegq2" + "fitnegq3" + "fitnegq4"), 0) as "result"
            , coalesce(ROUND(
                SUM("fitposq1" + "fitposq2" + "fitposq3" + "fitposq4" + "fitnegq1" + "fitnegq2" + "fitnegq3" + "fitnegq4") * 100.0 /
                nullif(SUM("target"), 0),
                2
            ), 0) as percent
            , 's_colon_screen' AS kpi
        FROM
            chospital AS h
        LEFT JOIN s_colon_screen AS s ON
            h.hoscode = s.hospcode
            AND s.b_year = '2568'
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

router.get('/s_colon_screen/data', async (req, res) => {
    try {
        const response = await pool.query(`
       select
            h.hoscode as a_code
            , CONCAT(h.hosname) AS a_name
            , coalesce(SUM("target"), 0) as "target"
            , coalesce(SUM("fitposq1" + "fitposq2" + "fitposq3" + "fitposq4" + "fitnegq1" + "fitnegq2" + "fitnegq3" + "fitnegq4"), 0) as "result"
            , coalesce(ROUND(
                SUM("fitposq1" + "fitposq2" + "fitposq3" + "fitposq4" + "fitnegq1" + "fitnegq2" + "fitnegq3" + "fitnegq4") * 100.0 /
                nullif(SUM("target"), 0),
                2
            ), 0) as percent
        from
            chospital as h
        left join s_colon_screen as s on
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
            , SUM("target") "target"
            , SUM("fitposq1" + "fitposq2" + "fitposq3" + "fitposq4" + "fitnegq1" + "fitnegq2" + "fitnegq3" + "fitnegq4") result
        from
            chospital as h
        left join s_colon_screen as s on
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