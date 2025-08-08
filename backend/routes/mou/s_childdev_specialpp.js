//MOU 1. ร้อยละของเด็กอายุ 0-5 ปี มีพัฒนาการสมวัย (DSPM)
const express = require('express');
const router = express.Router();
const pool = require('../../config/db');
const axios = require('axios');


router.get('/get_s_childdev', async (req, res) => {
    try {
        const response = await axios.post('https://opendata.moph.go.th/api/report_data', {
            "tableName": "s_childdev_specialpp",
            "year": "2568",
            "province": "81",
            "type": "json"
        })
        const dataList = response.data

        await pool.query('TRUNCATE TABLE s_childdev_specialpp')
        for (const data of dataList) {
            await pool.query(`
        INSERT INTO s_childdev_specialpp (
            id, hospcode, areacode, date_com, b_year, monthly,

            target_9, result_9, 
            "1b260_1_9", "1b261_9", "1b262_9",
            follow_9, "1b260_2_9", improper_9,
            "1b202_9", "1b212_9", "1b222_9", "1b232_9", "1b242_9",
            wait30_9, loss_9,

            target_18, result_18, 
            "1b260_1_18", "1b261_18", "1b262_18",
            follow_18, "1b260_2_18", improper_18,
            "1b202_18", "1b212_18", "1b222_18", "1b232_18", "1b242_18",
            wait30_18, loss_18,

            target_30, result_30, 
            "1b260_1_30", "1b261_30", "1b262_30",
            follow_30, "1b260_2_30", improper_30,
            "1b202_30", "1b212_30", "1b222_30", "1b232_30", "1b242_30",
            wait30_30, loss_30,

            target_42, result_42, 
            "1b260_1_42", "1b261_42", "1b262_42",
            follow_42, "1b260_2_42", improper_42,
            "1b202_42", "1b212_42", "1b222_42", "1b232_42", "1b242_42",
            wait30_42, loss_42,

            target_60, result_60, 
            "1b260_1_60", "1b261_60", "1b262_60",
            follow_60, "1b260_2_60", improper_60,
            "1b202_60", "1b212_60", "1b222_60", "1b232_60", "1b242_60",
            wait30_60, loss_60
        ) VALUES (
            $1, $2, $3, $4, $5, $6,
            $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21,
            $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34, $35, $36,
            $37, $38, $39, $40, $41, $42, $43, $44, $45, $46, $47, $48, $49, $50, $51,
            $52, $53, $54, $55, $56, $57, $58, $59, $60, $61, $62, $63, $64, $65, $66,
            $67, $68, $69, $70, $71, $72, $73, $74, $75, $76, $77, $78, $79, $80, $81
        )
    `, [
                data.id, data.hospcode, data.areacode, data.date_com, data.b_year, data.monthly,
                data.target_9, data.result_9,
                data["1b260_1_9"], data["1b261_9"], data["1b262_9"],
                data.follow_9, data["1b260_2_9"], data.improper_9,
                data["1b202_9"], data["1b212_9"], data["1b222_9"], data["1b232_9"], data["1b242_9"],
                data.wait30_9, data.loss_9,
                data.target_18, data.result_18,
                data["1b260_1_18"], data["1b261_18"], data["1b262_18"],
                data.follow_18, data["1b260_2_18"], data.improper_18,
                data["1b202_18"], data["1b212_18"], data["1b222_18"], data["1b232_18"], data["1b242_18"],
                data.wait30_18, data.loss_18,
                data.target_30, data.result_30,
                data["1b260_1_30"], data["1b261_30"], data["1b262_30"],
                data.follow_30, data["1b260_2_30"], data.improper_30,
                data["1b202_30"], data["1b212_30"], data["1b222_30"], data["1b232_30"], data["1b242_30"],
                data.wait30_30, data.loss_30,
                data.target_42, data.result_42,
                data["1b260_1_42"], data["1b261_42"], data["1b262_42"],
                data.follow_42, data["1b260_2_42"], data.improper_42,
                data["1b202_42"], data["1b212_42"], data["1b222_42"], data["1b232_42"], data["1b242_42"],
                data.wait30_42, data.loss_42,
                data.target_60, data.result_60,
                data["1b260_1_60"], data["1b261_60"], data["1b262_60"],
                data.follow_60, data["1b260_2_60"], data.improper_60,
                data["1b202_60"], data["1b212_60"], data["1b222_60"], data["1b232_60"], data["1b242_60"],
                data.wait30_60, data.loss_60
            ]);
        }

        await pool.query(`
        DELETE FROM summary_mou
        WHERE kpi = $1
        `, ['s_childdev_specialpp']);

        await pool.query(`
        INSERT INTO summary_mou (a_code, a_name, target, result, percent, kpi)
        SELECT
            h.hoscode AS a_code,
            concat(h.hoscode, ':', h.hosname) AS a_name,
            SUM("target_9" + "target_18" + "target_30" + "target_42" + "target_60") AS target,
            SUM("result_9" + "result_18" + "result_30" + "result_42" + "result_60") AS result,
            coalesce(ROUND(
                SUM("result_9" + "result_18" + "result_30" + "result_42" + "result_60") * 100.0 /
                nullif(SUM("target_9" + "target_18" + "target_30" + "target_42" + "target_60"), 0),
                2
            ), 0) AS percent,
            's_childdev_specialpp' AS kpi
        FROM
            chospital AS h
        LEFT JOIN s_childdev_specialpp AS s ON
            h.hoscode = s.hospcode
            AND s.b_year = '${process.env.B_YEAR}'
        WHERE
            h.hoscode = '99862'
        GROUP BY h.hoscode, h.hosname
        `);



        res.status(200).json({ message: 'Import success', count: dataList.length });

    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error', err);
    }
});

router.get('/s_childdev/data', async (req, res) => {
    try {
        const response = await pool.query(`
        select
            h.hoscode as a_code
            , CONCAT(h.hosname) AS a_name
            , coalesce(SUM("target_9" + "target_18" + "target_30" + "target_42" + "target_60" ), 0) as "target"
            , coalesce(SUM( "result_9" + "result_18" + "result_30" + "result_42" + "result_60"), 0) as "result"
            , coalesce(ROUND(
                SUM( "result_9" + "result_18" + "result_30" + "result_42" + "result_60") * 100.0 /
                nullif(SUM("target_9" + "target_18" + "target_30" + "target_42" + "target_60"), 0),
                2
            ), 0) as percent
        from
            chospital as h
        left join s_childdev_specialpp as s on
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
            , SUM( "target_9" + "target_18" + "target_30" + "target_42" + "target_60" ) as "target"
            , SUM( "result_9" + "result_18" + "result_30" + "result_42" + "result_60" ) as "result"
        from
            chospital as h
        left join s_childdev_specialpp as s on
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
            a_code
    `)

        res.json(response.rows)
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// router.get('/s_childdev/data', async (req, res) => {

// });





module.exports = router;