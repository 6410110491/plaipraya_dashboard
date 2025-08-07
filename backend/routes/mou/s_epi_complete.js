//MOU  6.1  ความครอบคลุมการได้รับวัคซีนแต่ละชนิดครบตามเกณฑ์ในเด็กอายุครบ 5 ปี (fully immunized)
const express = require('express');
const router = express.Router();
const axios = require('axios');
const pool = require('../../config/db');

router.get('/get_s_epi_complete', async (req, res) => {
    try {
        const response = await axios.post('https://opendata.moph.go.th/api/report_data', {
            tableName: "s_epi_complete",
            year: "2568",
            province: "81",
            type: "json"
        });

        const dataList = response.data;

        await pool.query('TRUNCATE TABLE s_epi_complete');

        for (const data of dataList) {
            await pool.query(`
                INSERT INTO s_epi_complete (
                    id, hospcode, areacode, date_com, b_year, target, result
                    , target10, result10, target11, result11, target12, result12, target01, result01, target02, result02
                    , target03, result03, target04, result04, target05, result05, target06, result06, target07, result07
                    , target08, result08, target09, result09
                ) VALUES (
                    $1, $2, $3, $4, $5, $6, $7, 
                    $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, 
                    $18, $19, $20, $21, $22, $23, $24, $25, $26, $27,
                    $28, $29, $30, $31
                )
            `, [
                data.id,
                data.hospcode,
                data.areacode,
                data.date_com || null,
                data.b_year,
                data.target,
                data.result,
                data.target10,
                data.result10,
                data.target11,
                data.result11,
                data.target12,
                data.result12,
                data.target01,
                data.result01,
                data.target02,
                data.result02,
                data.target03,
                data.result03,
                data.target04,
                data.result04,
                data.target05,
                data.result05,
                data.target06,
                data.result06,
                data.target07,
                data.result07,
                data.target08,
                data.result08,
                data.target09,
                data.result09
            ]);
        }

        await pool.query(`
        DELETE FROM summary_mou
        WHERE kpi = $1
        `, ['s_epi_complete']);

        await pool.query(`
        INSERT INTO summary_mou (a_code, a_name, target, result, percent, kpi)
        SELECT
            h.hoscode AS a_code
            , concat(h.hoscode, ':', h.hosname) AS a_name
            , COALESCE(SUM(target), 0) AS target
            , COALESCE(SUM(result), 0) AS result
            ,COALESCE(ROUND(SUM(result) * 100.0 /NULLIF(SUM(target), 0),2), 0) AS percent
            , 's_epi_complete' AS kpi
        FROM
            chospital AS h
        LEFT JOIN s_epi_complete AS s ON
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

router.get('/s_epi_complete/data', async (req, res) => {
    try {
        const response = await pool.query(`
        select
            h.hoscode as a_code
            , concat(h.hosname) as a_name
            , COALESCE(SUM(target), 0) AS target
            , COALESCE(SUM(result), 0) AS result
            ,COALESCE(ROUND(SUM(result) * 100.0 /NULLIF(SUM(target), 0),2), 0) AS percent
        from
            chospital as h
        left join s_epi_complete as s on
            h.hoscode = s.hospcode
            and s.b_year = '${process.env.B_YEAR}'
            and 1 = 1
        where
            s.id = 'f033ab37c30201f73f142449d037028d'
            and h.hdc_regist = 1
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
        UNION ALL
        SELECT 
            '99999' AS a_code,
            'รวมทั้งสิ้น' AS a_name,
            SUM(q1.target) AS target,
            SUM(q1.result) AS result,
            ROUND(
            SUM(q1.result) * 100.0 / NULLIF(SUM(q1.target), 0),
            2) AS percent
        from (
        select
            h.hoscode as a_code
            , concat(h.hoscode, ':', h.hosname) as a_name
            , sum(target) as target
            , sum(result) as result
        from
            chospital as h
        left join s_epi_complete as s on
            h.hoscode = s.hospcode
            and s.b_year = '${process.env.B_YEAR}'
            and 1 = 1
        where
            s.id = 'f033ab37c30201f73f142449d037028d'
            and h.hdc_regist = 1
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
        order by a_code;
    `)

        res.json(response.rows)
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});


module.exports = router;