//MOU 16 ร้อยละผู้สูงอายุ ผู้ป่วยโรคเรื้อรัง และหญิงตั้งครรภ์ ได้รับการคัดกรองสุขภาพจิตตามมาตรฐานที่กำหนด 
const express = require('express');
const router = express.Router();
const axios = require('axios');
const pool = require('../../config/db');

router.get('/get_s_2q_adl_anc_chronic', async (req, res) => {
    try {
        // s_2q_adl
        const response = await axios.post('https://opendata.moph.go.th/api/report_data', {
            tableName: "s_2q_adl",
            year: "2568",
            province: "81",
            type: "json"
        });

        const dataList = response.data;

        await pool.query('TRUNCATE TABLE s_2q_adl');

        for (const data of dataList) {
            await pool.query(`
                INSERT INTO s_2q_adl (
                    id, hospcode, areacode, date_com, b_year, target, result,
                    "1B0280", "1B0281", target_1, "1B0280_1", "1B0281_1",	
                    target_2 , "1B0280_2", "1B0281_2", target_3, "1B0280_3",	
                    "1B0281_3", "1b0212"	
                ) VALUES (
                    $1, $2, $3, $4, $5, $6, $7, 
                    $8, $9, $10, $11, $12,
                    $13, $14, $15, $16, $17,
                    $18, $19
                )
            `, [
                data.id,
                data.hospcode,
                data.areacode,
                data.date_com || null,
                data.b_year,
                data.target,
                data.result,
                data["1B0280"],
                data["1B0281"],
                data.target_1,
                data["1B0280_1"],
                data["1B0281_1"],
                data.target_2,
                data["1B0280_2"],
                data["1B0281_2"],
                data.target_3,
                data["1B0280_3"],
                data["1B0281_3"],
                data["1b0212"]

            ]);
        }

        // s_2q_anc
        const response_anc = await axios.post('https://opendata.moph.go.th/api/report_data', {
            tableName: "s_2q_anc",
            year: "2568",
            province: "81",
            type: "json"
        });

        const dataList_anc = response_anc.data;

        await pool.query('TRUNCATE TABLE s_2q_anc');

        for (const data of dataList_anc) {
            await pool.query(`
                INSERT INTO s_2q_anc (
                    id, hospcode, areacode, date_com, b_year, target, result,
                    b, a, b1b140, b1b141,
                    a1b140, a1b141
                ) VALUES (
                    $1, $2, $3, $4, $5, $6, $7,
                    $8, $9, $10, $11, 
                    $12, $13 
                )
            `, [
                data.id,
                data.hospcode,
                data.areacode,
                data.date_com || null,
                data.b_year,
                data.target,
                data.result,
                data.b,
                data.a,
                data.b1b140,
                data.b1b141,
                data.a1b140,
                data.a1b141

            ]);
        }

        // s_2q_chronic
        const response_chronic = await axios.post('https://opendata.moph.go.th/api/report_data', {
            tableName: "s_2q_chronic",
            year: "2568",
            province: "81",
            type: "json"
        });

        const dataList_chronic = response_chronic.data;

        await pool.query('TRUNCATE TABLE s_2q_chronic');

        for (const data of dataList_chronic) {
            await pool.query(`
                INSERT INTO s_2q_chronic (
                    id, hospcode, areacode, date_com, b_year, target, 
                    "1519_1B130", "1519_1B131", "2059_1B130", "2059_1B131",
                    "60_1B0280", "60_1B0281"
                ) VALUES (
                    $1, $2, $3, $4, $5, $6, 
                    $7, $8, $9, $10, 
                    $11, $12 
                )
            `, [
                data.id,
                data.hospcode,
                data.areacode,
                data.date_com || null,
                data.b_year,
                data.target,
                data["1519_1B130"],
                data["1519_1B131"],
                data["2059_1B130"],
                data["2059_1B131"],
                data["60_1B0280"],
                data["60_1B0281"]

            ]);
        }

        await pool.query(`
            DELETE FROM summary_mou
            WHERE kpi = $1
            `, ['s_2q_adl_anc_chronic']);

        await pool.query(`
            INSERT INTO summary_mou (a_code, a_name, target, result, percent, kpi)
                select
                    h.hoscode as a_code,
                    CONCAT(h.hoscode, ':', h.hosname) as a_name,
                    coalesce(adl.target, 0) + coalesce(chronic.target, 0) + coalesce(anc.target, 0) as target,
                    coalesce(adl.result, 0) + coalesce(chronic.result, 0) + coalesce(anc.result, 0) as result,
                    coalesce(round((coalesce(adl.result, 0) + coalesce(chronic.result, 0) + coalesce(anc.result, 0)) * 100.0 
                    / nullif((coalesce(adl.target, 0) + coalesce(chronic.target, 0) + coalesce(anc.target, 0)), 0), 2), 0) as percent,
                    's_2q_adl_anc_chronic' AS kpi
                from
                    chospital as h
                left join (
                    select hospcode, sum(target) as target, sum(result) as result
                    from s_2q_adl
                    where s.b_year = '${process.env.B_YEAR}'
                    group by hospcode
                ) adl on h.hoscode = adl.hospcode
                left join (
                    select
                        hospcode,
                        sum(target) as target,
                        sum(
                            coalesce("1519_1B130",0) +
                            coalesce("1519_1B131",0) +
                            coalesce("2059_1B130",0) +
                            coalesce("2059_1B131",0) +
                            coalesce("60_1B0280",0) +
                            coalesce("60_1B0281",0)
                        ) as result
                    from s_2q_chronic
                    where s.b_year = '${process.env.B_YEAR}'
                    group by hospcode
                ) chronic on h.hoscode = chronic.hospcode
                left join (
                    select hospcode, sum(target) as target, sum(result) as result
                    from s_2q_anc
                    where s.b_year = '${process.env.B_YEAR}'
                    group by hospcode
                ) anc on h.hoscode = anc.hospcode
                where
                    h.hdc_regist = 1
                    and (h.zone_code = '${process.env.ZONE_CODE}'
                        or 'ALL' = '${process.env.ZONE_CODE}')
                    and (h.chw_code = '${process.env.CHW_CODE}'
                        or 'ALL' = '${process.env.CHW_CODE}')
                    and (h.amp_code = '${process.env.AMP_CODE}'
                        or 'ALL' = '${process.env.AMP_CODE}')
                    and (h.tmb_code = 'ALL' or 'ALL' = 'ALL')
                    and (h.dep = 'ALL' or 'ALL' = 'ALL')
                    and (h.mcode in ('ALL') or 'ALL' in ('ALL'))
                    and (h.hoscode in ('ALL') or 'ALL' in ('ALL'))
                    and h.hoscode = '99862'
            `);


        res.status(200).json({ message: 'Import success', count_adl: dataList.length, count_anc: dataList_anc.length, count_chronic: dataList_chronic.length });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

router.get('/s_2q_adl_anc_chronic/data', async (req, res) => {
    try {
        const response = await pool.query(`
       with data as (
        select
            h.hoscode as a_code,
            h.hosname as a_name,
            coalesce(adl.target, 0) + coalesce(chronic.target, 0) + coalesce(anc.target, 0) as target,
            coalesce(adl.result, 0) + coalesce(chronic.result, 0) + coalesce(anc.result, 0) as result
        from
            chospital as h
        left join (
            select hospcode, sum(target) as target, sum(result) as result
            from s_2q_adl
            where b_year = '${process.env.B_YEAR}'
            group by hospcode
        ) adl on h.hoscode = adl.hospcode
        left join (
            select
                hospcode,
                sum(target) as target,
                sum(
                    coalesce("1519_1B130",0) +
                    coalesce("1519_1B131",0) +
                    coalesce("2059_1B130",0) +
                    coalesce("2059_1B131",0) +
                    coalesce("60_1B0280",0) +
                    coalesce("60_1B0281",0)
                ) as result
            from s_2q_chronic
            where b_year = '${process.env.B_YEAR}'
            group by hospcode
        ) chronic on h.hoscode = chronic.hospcode
        left join (
            select hospcode, sum(target) as target, sum(result) as result
            from s_2q_anc
            where b_year = '${process.env.B_YEAR}'
            group by hospcode
        ) anc on h.hoscode = anc.hospcode
        where
            h.hdc_regist = 1
            and (h.zone_code = '${process.env.ZONE_CODE}'
                or 'ALL' = '${process.env.ZONE_CODE}')
            and (h.chw_code = '${process.env.CHW_CODE}'
                or 'ALL' = '${process.env.CHW_CODE}')
            and (h.amp_code = '${process.env.AMP_CODE}'
                or 'ALL' = '${process.env.AMP_CODE}')
            and (h.tmb_code = 'ALL' or 'ALL' = 'ALL')
            and (h.dep = 'ALL' or 'ALL' = 'ALL')
            and (h.mcode in ('ALL') or 'ALL' in ('ALL'))
            and (h.hoscode in ('ALL') or 'ALL' in ('ALL'))
        )
        select
            a_code,
            a_name,
            target,
            result,
            coalesce(round(result * 100.0 / nullif(target, 0), 2), 0) as percent
        from data
        union all
        select
            '99999' as a_code,
            'รวมทั้งสิ้น' as a_name,
            sum(target),
            sum(result),
            round(sum(result) * 100.0 / nullif(sum(target), 0), 2) as percent
        from data
        order by a_code;
    `)

        res.json(response.rows)
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
