//MOU 6.2  MMR
const express = require('express');
const router = express.Router();
const axios = require('axios');
const pool = require('../../config/db');

router.get('/get_s_epi1_3', async (req, res) => {
    try {
        const response = await axios.post('https://opendata.moph.go.th/api/report_data', {
            tableName: "s_epi1",
            year: "2568",
            province: "81",
            type: "json"
        });

        const dataList = response.data;

        await pool.query('TRUNCATE TABLE s_epi1');

        for (const data of dataList) {
            await pool.query(`
                INSERT INTO s_epi1 (
                    id, hospcode, areacode, date_com, b_year,
                    target10, target11, target12, target01, target02, target03, target04, target05,
                    target06, target07, target08, target09,

                    bcg_10, dtp_hb3_10, opv3_10, mmr_10,
                    bcg_11, dtp_hb3_11, opv3_11, mmr_11,
                    bcg_12, dtp_hb3_12, opv3_12, mmr_12,
                    bcg_01, dtp_hb3_01, opv3_01, mmr_01,
                    bcg_02, dtp_hb3_02, opv3_02, mmr_02,
                    bcg_03, dtp_hb3_03, opv3_03, mmr_03,
                    bcg_04, dtp_hb3_04, opv3_04, mmr_04,
                    bcg_05, dtp_hb3_05, opv3_05, mmr_05,
                    bcg_06, dtp_hb3_06, opv3_06, mmr_06,
                    bcg_07, dtp_hb3_07, opv3_07, mmr_07,
                    bcg_08, dtp_hb3_08, opv3_08, mmr_08,
                    bcg_09, dtp_hb3_09, opv3_09, mmr_09,

                    hbv_10, hbv_11, hbv_12, hbv_01, hbv_02, hbv_03, hbv_04, hbv_05, hbv_06, hbv_07, hbv_08, hbv_09,
                    ipv_10, ipv_11, ipv_12, ipv_01, ipv_02, ipv_03, ipv_04, ipv_05, ipv_06, ipv_07, ipv_08, ipv_09,

                    dtp1_10, dtp1_11, dtp1_12, dtp1_01, dtp1_02, dtp1_03, dtp1_04, dtp1_05, dtp1_06, dtp1_07, dtp1_08, dtp1_09,

                    rota_10, rota_11, rota_12, rota_01, rota_02, rota_03, rota_04, rota_05, rota_06, rota_07, rota_08, rota_09,

                    hbv3_10, hbv3_11, hbv3_12, hbv3_01, hbv3_02, hbv3_03, hbv3_04, hbv3_05, hbv3_06, hbv3_07, hbv3_08, hbv3_09,

                    hib3_10, hib3_11, hib3_12, hib3_01, hib3_02, hib3_03, hib3_04, hib3_05, hib3_06, hib3_07, hib3_08, hib3_09
                ) VALUES (
                    $1, $2, $3, $4, $5,
                    $6, $7, $8, $9, $10, $11, $12, $13,
                    $14, $15, $16, $17,

                    $18, $19, $20, $21,
                    $22, $23, $24, $25,
                    $26, $27, $28, $29,
                    $30, $31, $32, $33,
                    $34, $35, $36, $37,
                    $38, $39, $40, $41,
                    $42, $43, $44, $45,
                    $46, $47, $48, $49,
                    $50, $51, $52, $53,
                    $54, $55, $56, $57,
                    $58, $59, $60, $61,
                    $62, $63, $64, $65, 
                    
                    $66, $67, $68, $69, $70, $71, $72, $73, $74, $75, $76, $77,
                    $78, $79, $80, $81, $82, $83, $84, $85, $86, $87, $88, $89, 
                    
                    $90, $91, $92, $93, $94, $95, $96, $97, $98, $99, $100, $101, 
                    
                    $102, $103, $104, $105, $106, $107, $108, $109, $110, $111, $112, $113, 
                    
                    $114, $115, $116, $117, $118, $119, $120, $121, $122, $123, $124, $125, 
                    
                    $126, $127, $128, $129, $130, $131, $132, $133, $134, $135, $136, $137
                )
                `, [
                data.id,
                data.hospcode,
                data.areacode,
                data.date_com || null,
                data.b_year,
                data.target10, data.target11, data.target12, data.target01,
                data.target02, data.target03, data.target04, data.target05,
                data.target06, data.target07, data.target08, data.target09,

                data.bcg_10, data.dtp_hb3_10, data.opv3_10, data.mmr_10,
                data.bcg_11, data.dtp_hb3_11, data.opv3_11, data.mmr_11,
                data.bcg_12, data.dtp_hb3_12, data.opv3_12, data.mmr_12,
                data.bcg_01, data.dtp_hb3_01, data.opv3_01, data.mmr_01,
                data.bcg_02, data.dtp_hb3_02, data.opv3_02, data.mmr_02,
                data.bcg_03, data.dtp_hb3_03, data.opv3_03, data.mmr_03,
                data.bcg_04, data.dtp_hb3_04, data.opv3_04, data.mmr_04,
                data.bcg_05, data.dtp_hb3_05, data.opv3_05, data.mmr_05,
                data.bcg_06, data.dtp_hb3_06, data.opv3_06, data.mmr_06,
                data.bcg_07, data.dtp_hb3_07, data.opv3_07, data.mmr_07,
                data.bcg_08, data.dtp_hb3_08, data.opv3_08, data.mmr_08,
                data.bcg_09, data.dtp_hb3_09, data.opv3_09, data.mmr_09,

                data.hbv_10, data.hbv_11, data.hbv_12, data.hbv_01, data.hbv_02, data.hbv_03,
                data.hbv_04, data.hbv_05, data.hbv_06, data.hbv_07, data.hbv_08, data.hbv_09,
                data.ipv_10, data.ipv_11, data.ipv_12, data.ipv_01, data.ipv_02, data.ipv_03,
                data.ipv_04, data.ipv_05, data.ipv_06, data.ipv_07, data.ipv_08, data.ipv_09,

                data.dtp1_10, data.dtp1_11, data.dtp1_12, data.dtp1_01, data.dtp1_02, data.dtp1_03,
                data.dtp1_04, data.dtp1_05, data.dtp1_06, data.dtp1_07, data.dtp1_08, data.dtp1_09,

                data.rota_10, data.rota_11, data.rota_12, data.rota_01, data.rota_02, data.rota_03,
                data.rota_04, data.rota_05, data.rota_06, data.rota_07, data.rota_08, data.rota_09,

                data.hbv3_10, data.hbv3_11, data.hbv3_12, data.hbv3_01, data.hbv3_02, data.hbv3_03,
                data.hbv3_04, data.hbv3_05, data.hbv3_06, data.hbv3_07, data.hbv3_08, data.hbv3_09,

                data.hib3_10, data.hib3_11, data.hib3_12, data.hib3_01, data.hib3_02, data.hib3_03,
                data.hib3_04, data.hib3_05, data.hib3_06, data.hib3_07, data.hib3_08, data.hib3_09
            ]);

        }


        const response_s_epi3 = await axios.post('https://opendata.moph.go.th/api/report_data', {
            tableName: "s_epi3",
            year: "2568",
            province: "81",
            type: "json"
        });

        const dataList_s_epi3 = response_s_epi3.data;

        await pool.query('TRUNCATE TABLE s_epi3');

        for (const data of dataList_s_epi3) {
            await pool.query(`
                    INSERT INTO s_epi3 (
                        id, hospcode, areacode, date_com, b_year,
                        target10, target11, target12, target01, target02, target03, target04, target05,
                        target06, target07, target08, target09,

                        je3_10, je3_11, je3_12, je3_01, je3_02, je3_03, je3_04, je3_05,
                        je3_06, je3_07, je3_08, je3_09,

                        mmr2_10, mmr2_11, mmr2_12, mmr2_01, mmr2_02, mmr2_03, mmr2_04, mmr2_05,
                        mmr2_06, mmr2_07, mmr2_08, mmr2_09
                    ) VALUES (
                        $1, $2, $3, $4, $5,
                        $6, $7, $8, $9, $10, $11, $12, $13,
                        $14, $15, $16, $17,

                        $18, $19, $20, $21, $22, $23, $24, $25,
                        $26, $27, $28, $29,

                        $30, $31, $32, $33, $34, $35, $36, $37,
                        $38, $39, $40, $41
                    )
                `, [
                data.id,
                data.hospcode,
                data.areacode,
                data.date_com || null,
                data.b_year,

                data.target10, data.target11, data.target12, data.target01,
                data.target02, data.target03, data.target04, data.target05,
                data.target06, data.target07, data.target08, data.target09,

                data.je3_10, data.je3_11, data.je3_12, data.je3_01, data.je3_02, data.je3_03,
                data.je3_04, data.je3_05, data.je3_06, data.je3_07, data.je3_08, data.je3_09,

                data.mmr2_10, data.mmr2_11, data.mmr2_12, data.mmr2_01, data.mmr2_02, data.mmr2_03,
                data.mmr2_04, data.mmr2_05, data.mmr2_06, data.mmr2_07, data.mmr2_08, data.mmr2_09
            ]);


        }

        await pool.query(`
        DELETE FROM summary_mou
        WHERE kpi = $1
        `, ['s_epi1_3']);

        await pool.query(`
        INSERT INTO summary_mou (a_code, a_name, target, result, percent, kpi)
        select
            a_code,
            a_name,
            coalesce(sum(target), 0) as target,
            coalesce(sum(result), 0) as result,
            coalesce(ROUND(
                SUM("result") * 100.0 /
                nullif(SUM("target"), 0),
                2
            ), 0) as percent,
            's_epi1_3' AS kpi
        from (
            select
                h.hoscode as a_code,
                concat(h.hoscode, ':', h.hosname) as a_name,
                sum(
                    target10 + target11 + target12 + target01 + target02 + target03 + 
                    target04 + target05 + target06 + target07 + target08 + target09
                ) as target,
                sum(
                    dtp1_10 + dtp1_11 + dtp1_12 + dtp1_01 + dtp1_02 + dtp1_03 + 
                    dtp1_04 + dtp1_05 + dtp1_06 + dtp1_07 + dtp1_08 + dtp1_09
                ) as result
            from chospital as h
            left join s_epi1 as s on
                h.hoscode = s.hospcode
                and s.b_year = '2568'
            where
                h.hoscode = '99862'
            group by h.hoscode, h.hosname
            UNION ALL
            select
                h.hoscode as a_code,
                concat(h.hoscode, ':', h.hosname) as a_name,
                sum(
                    target10 + target11 + target12 + target01 + target02 + target03 + 
                    target04 + target05 + target06 + target07 + target08 + target09
                ) as target,
                sum(
                    mmr2_10 + mmr2_11 + mmr2_12 + mmr2_01 + mmr2_02 + mmr2_03 + 
                    mmr2_04 + mmr2_05 + mmr2_06 + mmr2_07 + mmr2_08 + mmr2_09
                ) as result
            from chospital as h
            left join s_epi3 as s on
                h.hoscode = s.hospcode
                and s.b_year = '2568'
            where
                h.hoscode = '99862'
            group by h.hoscode, h.hosname
        ) as combined
        group by a_code, a_name
        order by a_code;
        `);

        res.status(200).json({ message: 'Import success', count_epi1: dataList.length, count_epi3: dataList_s_epi3.length });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

router.get('/s_epi1_3/data', async (req, res) => {
    try {
        const response = await pool.query(`
       WITH q1 AS (
            SELECT
                h.hoscode AS a_code,
                concat(h.hosname) AS a_name,
                SUM(
                    target10 + target11 + target12 + target01 + target02 + target03 + 
                    target04 + target05 + target06 + target07 + target08 + target09
                ) AS target,
                SUM(
                    dtp1_10 + dtp1_11 + dtp1_12 + dtp1_01 + dtp1_02 + dtp1_03 + 
                    dtp1_04 + dtp1_05 + dtp1_06 + dtp1_07 + dtp1_08 + dtp1_09
                ) AS result
            FROM chospital AS h
            LEFT JOIN s_epi1 AS s ON h.hoscode = s.hospcode AND s.b_year = '2568'
            WHERE h.hdc_regist = 1
                AND (h.zone_code = '11' OR 'ALL' = '11')
                AND (h.chw_code = '81' OR 'ALL' = '81')
                AND (h.amp_code = '8106' OR 'ALL' = '8106')
                AND (h.tmb_code = 'ALL' OR 'ALL' = 'ALL')
                AND (h.dep = 'ALL' OR 'ALL' = 'ALL')
                AND (h.mcode IN ('ALL') OR 'ALL' IN ('ALL'))
                AND (h.hoscode IN ('ALL') OR 'ALL' IN ('ALL'))
            GROUP BY h.hoscode, h.hosname
            UNION ALL
            SELECT
                h.hoscode AS a_code,
                concat(h.hosname) AS a_name,
                SUM(
                    target10 + target11 + target12 + target01 + target02 + target03 + 
                    target04 + target05 + target06 + target07 + target08 + target09
                ) AS target,
                SUM(
                    mmr2_10 + mmr2_11 + mmr2_12 + mmr2_01 + mmr2_02 + mmr2_03 + 
                    mmr2_04 + mmr2_05 + mmr2_06 + mmr2_07 + mmr2_08 + mmr2_09
                ) AS result
            FROM chospital AS h
            LEFT JOIN s_epi3 AS s ON h.hoscode = s.hospcode AND s.b_year = '2568'
            WHERE h.hdc_regist = 1
                AND (h.zone_code = '11' OR 'ALL' = '11')
                AND (h.chw_code = '81' OR 'ALL' = '81')
                AND (h.amp_code = '8106' OR 'ALL' = '8106')
                AND (h.tmb_code = 'ALL' OR 'ALL' = 'ALL')
                AND (h.dep = 'ALL' OR 'ALL' = 'ALL')
                AND (h.mcode IN ('ALL') OR 'ALL' IN ('ALL'))
                AND (h.hoscode IN ('ALL') OR 'ALL' IN ('ALL'))
            GROUP BY h.hoscode, h.hosname
        ) SELECT
            a_code,
            a_name,
            COALESCE(SUM(target), 0) AS target,
            COALESCE(SUM(result), 0) AS result,
            COALESCE(ROUND(SUM(result) * 100.0 / NULLIF(SUM(target), 0), 2), 0) AS percent
        FROM q1
        GROUP BY a_code, a_name
        UNION ALL
        SELECT
            '99999' AS a_code,
            'รวมทั้งสิ้น' AS a_name,
            SUM(target),
            SUM(result),
            ROUND(SUM(result) * 100.0 / NULLIF(SUM(target), 0), 2) AS percent
        FROM q1
        ORDER BY a_code;
    `)

        res.json(response.rows)
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});


module.exports = router;