import { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Accordion, Badge, ProgressBar, Spinner } from 'react-bootstrap';
import axios from 'axios'

import { FaHandshake, FaUniversity, FaSearch } from 'react-icons/fa';

function HomePage() {
    const [loading, setLoading] = useState(false);
    const [kpi, setKpi] = useState([]);
    const [kpiMinistry, setKpiMinistry] = useState([]);
    const [kpiInspector, setKpiInspector] = useState([]);

    const changepage = (path) => {
        window.location.href = "/" + path
    }

    const kpis = [
        {
            title: 'ตัวชี้วัด MOU',
            page: 'mou',
            summary: '10%',
            details: [
                { label: '1.) ร้อยละของเด็กอายุ 0-5 ปี พัฒนาการสมวัย', database: 's_childdev_specialpp', criterion: 87, value: 0 },
                { label: '2.) ร้อยละของหญิงตั้งครรภ์ได้รับบริการฝากครรภ์คุณภาพ', database: 's_anc_quality', criterion: 50, value: 0 },
                { label: '3.) ร้อยละของผู้มีภาวะพึ่งพิงได้รับการดูแลตาม Care Plan', value: 0 },
                { label: '4.) ร้อยละการตรวจติดตามยืนยันวินิจฉัยกลุ่มสงสัยป่วยโรคเบาหวาน', database: 's_ncd_screen_repleate1', criterion: 65, value: 0 },
                { label: '5.) ร้อยละการตรวจติดตามยืนยันวินิจฉัยกลุ่มสงสัยป่วยโรคความดันโลหิตสูง', database: 's_ht_screen_follow', criterion: 85, value: 0 },
                { label: '6.) ร้อยละความครอบคลุมของการได้รับวัคซีนในเด็กอายุ 0-5 ปี', value: 0 },
                { label: '6.1) ทุกตัว', database: 's_epi_complete', criterion: 90, value: 0 },
                { label: '6.2) MMR', criterion: 95, database: 's_epi1_3', value: 0 },
                { label: '7.) จำนวนการจัดตั้งหน่วยบริการปฐมภูมิและเครือข่ายหน่วยบริการปฐมภูมิตามพระราชบัญญัติระบบสุขภาพปฐมภูมิ พ.ศ.2562', value: 0 },
                { label: '8.) จำนวนครั้งบริการสุขภาพช่องปากต่อผู้ให้บริการทันตกรรม เป้าหมาย *9 บุคลากร', database: 's_dental_70', criterion: 0, value: 0 },
                { label: '9.) อัตราความสำเร็จการรักษาผู้ป่วยวัณโรคปอดรายใหม่', value: 0 },
                { label: '9.1) อัตราความครอบคลุมการขึ้นทะเบียนของผู้ป่วยวัณโรครายใหม่และกลับเป็นซ้ำ', value: 0 },
                { label: '9.1) อัตราความสำเร็จการรักษาผู้ป่วยวัณโรคปอดรายใหม่', value: 0 },
                { label: '10.) ร้อยละประชากรกลุ่มเป้าหมายอายุ 30 - 70 ปี ที่ได้รับคัดกรองมะเร็งเต้านม', database: 's_breast_screen', criterion: 60, value: 0 },
                { label: '11.) ร้อยละประชากรสตรีกลุ่มเป้า อายุ 30 - 60 ปี ที่ได้รับการคัดกรองมะเร็งปากมดลูก', value: 0 },
                { label: '12.) ร้อยละประชากรกลุ่มเป้าหมาย อายุ 50 - 70 ปี ที่ได้รับการคัดกรองมะเร็งลำไส้ใหญ่และไส้ตรง', database: 's_colon_screen', criterion: 60, value: 0 },
                { label: '13.) ร้อยละของผู้ป่วยยาเสพติดที่เข้าสู่กระบวนการบำบัดรักษาได้รับการดูแลอย่างมีคุณภาพอย่างต่อเนื่องจนถึงการติดตาม (Retention Rate )', value: 0 },
                { label: '14.) ร้อยละของผู้ป่วยโรคเบาหวานที่ควบคุมระดับน้ำตาลได้', database: 's_dm_control', criterion: 41, value: 0 },
                { label: '15.) ร้อยละของผู้ป่วยโรคความดันที่ควบคุมระดับความดันโลหิตได้', database: 's_ht_control', criterion: 62, value: 0 },
                { label: '16.) ร้อยละผู้สูงอายุ ผู้ป่วยโรคเรื้อรัง และหญิงตั้งครรภ์ ได้รับการคัดกรองสุขภาพจิตตามมาตรฐานที่กำหนด ', database: 's_2q_adl_anc_chronic', criterion: 90, value: 0 },
                { label: '17.) ร้อยละของผู้ป่วยที่ได้รับการวินิจฉัยโรค Common Diseases and Symptoms มีการสั่งจ่ายยาสมุนไพรเพิ่มขึ้น ', value: 0 },
                { label: '18.) ร้อยละของประชาชนที่มารับบริการในระดับปฐมภูมิได้รับการรักษาด้วยการแพทย์แผนไทย และการแพทย์ทางเลือก ', database: 's_ttm35', criterion: 49, value: 0 },
                { label: '19.) ร้อยละของอำเภอที่ประชาชนไทย มี Health ID เพื่อการเข้าถึงระบบบริการสุขภาพแบบไร้รอยต่อ ', database: 's_thai_id', criterion: 50, value: 0 },
                { label: '20.) การประเมินเกณฑ์ประสิทธิภาพทางการเงิน (TPS) ผ่านเกณฑ์ ร้อยละ 81 – 100 ระดับดีมาก (5) ', value: 0 },
                { label: '21.) ระดับความสำเร็จในการดำเนินงานการใช้ยาอย่างสมเหตุผลในชุมชน (RDU community)', value: 0 },
                { label: '22.) ระดับความสำเร็จของการส่งเสริมผลิตภัณฑ์สุขภาพให้ได้รับอนุญาต', value: 0 },
            ],
        }
    ];

    const kpisMinistry = [
        {
            title: 'ตัวชี้วัดกระทรวง',
            page: 'ministry',
            summary: '85%',
            details: [
                { label: '1.) อัตราส่วนการตายมารดาไทยต่อการเกิดมีชีพแสนคน', value: 0 },
                { label: '2.) ร้อยละของเด็กอายุ 0 - 5 ปีมีพัฒนาการสมวัย', value: 0 },
                { label: '3.) อัตราความรอบรู้ด้านสุขภาพของประชาชนไทย อายุ 15 ปี ขึ้นไป', value: 0 },
                { label: '4.) ระดับความรอบรู้สุขภาพของประชาชนเรื่องโรคอุบัติใหม่และอุบัติซ้ำเพิ่มขึ้นไม่น้อยกว่าร้อยละ 5', value: 0 },
                { label: '5.) ร้อยละการตรวจติดตามยืนยันวินิจฉัยกลุ่มสงสัยป่วยโรคเบาหวาน และ/หรือโรคความดันโลหิตสูง 5', value: 0 },
                { label: '5.1) ร้อยละการตรวจติดตามยืนยันวินิจฉัยกลุ่มสงสัยป่วยโรคเบาหวาน', database: 's_ncd_screen_repleate1', criterion: 70, value: 0 },
                { label: '5.2) ร้อยละการตรวจติดตามยืนยันวินิจฉัยกลุ่มสงสัยป่วยโรคความดันโลหิตสูง', database: 's_ht_screen_follow', criterion: 85, value: 0 },
                { label: '6) อัตราการเสียชีวิตและบาดเจ็บจากอุบัติเหตุทางถนนในกลุ่มเด็กและเยาวชนลดลง (ช่วงวัย 1-18 ปี)', value: 0 },
                { label: '7) ร้อยละของโรงพยาบาลที่พัฒนาอนามัยสิ่งแวดล้อมได้ตามเกณฑ์ GREEN & CLEAN Hospital Challenge (ระดับมาตรฐานขึ้นไป และระดับท้าทาย)', value: 0 },
                { label: '7.1) ร้อยละของโรงพยาบาลที่พัฒนาอนามัยสิ่งแวดล้อมได้ตามเกณฑ์ GREEN & CLEAN Hospital Challenge (ระดับมาตรฐานขึ้นไป)', value: 0 },
                { label: '7.2) ร้อยละของโรงพยาบาลที่พัฒนาอนามัยสิ่งแวดล้อมได้ตามเกณฑ์ GREEN & CLEAN Hospital Challenge (ระดับระดับท้าทาย)', value: 0 },
                { label: '8.) จำนวนการจัดตั้งหน่วยบริการปฐมภูมิและเครือข่ายหน่วยบริการปฐมภูมิ ตามพระราชบัญญัติระบบสุขภาพปฐมภูมิ พ.ศ. 2562', value: 0 },
                { label: '9.) ร้อยละของชุมชนมีการดำเนินการจัดการสุขภาพที่เหมาะสมให้กับประชาชน', value: 0 },
                { label: '10.) อัตราตายของผู้ป่วยโรคหลอดเลือดสมอง (Stroke: I60-I69)', database: 's_stroke_admit_death', criterion: 7, value: 0 },
                { label: '11.) อัตราความสำเร็จการรักษาผู้ป่วยวัณโรคปอดรายใหม่', value: 0 },
                { label: '11.1) อัตราความสำเร็จการรักษาผู้ป่วยวัณโรคปอดรายใหม่', value: 0 },
                { label: '11.2) อัตราความครอบคลุมการขึ้นทะเบียนรักษาของผู้ป่วยวัณโรครายใหม่และกลับเป็นซ้ำ', value: 0 },
                { label: '12.) อัตราตายทารกแรกเกิดอายุน้อยกว่าหรือเท่ากับ 28 วัน', database: 's_death28pa', criterion: 3.6, value: 0 },
                { label: '13.) ร้อยละของประชาชนที่มารับบริการในระดับปฐมภูมิได้รับการรักษาด้วยการแพทย์แผนไทยและการแพทย์ทางเลือก', database: 's_ttm35', criterion: 45, value: 0 },
                { label: '14.) ร้อยละของผู้ป่วยที่ได้รับการวินิจฉัยโรค Common Diseases and Symptoms มีการสั่งจ่ายยาสมุนไพรเพิ่มขึ้น', value: 0 },
                { label: '15.) อัตราการฆ่าตัวตายสำเร็จ', value: 0 },
                { label: '16.) ร้อยละของผู้ป่วยโรคจิตเวชและสารเสพติดที่มีความเสี่ยงสูงต่อการก่อความรุนแรง (SMI-V) ที่เข้าสู่กระบวนการบำบัดรักษาในเขตสุขภาพได้รับการดูแลต่อเนื่องจนไม่ก่อความรุนแรงซ้ำ', value: 0 },
                { label: '17.) อัตราตายผู้ป่วยติดเชื้อในกระแสเลือดแบบรุนแรงชนิด community-acquired', database: 's_kpi_sepsis_septic', criterion: 26, value: 0 },
                { label: '18.) อัตราตายของผู้ป่วยโรคกล้ามเนื้อหัวใจตายเฉียบพลันชนิด STEMI', database: 's_stemi_death', criterion: 9, value: 0 },
                { label: '19.) ร้อยละผู้ป่วยไตเรื้อรัง stage 5 รายใหม่ ที่ลดลงจากปีงบประมาณก่อนหน้า', value: 0 },
                { label: '20.) อัตราส่วนของจำนวนผู้บริจาคอวัยวะสมองตายที่ได้รับการผ่าตัดนำอวัยวะออก ต่อจำนวนผู้ป่วยเสียชีวิตในโรงพยาบาล', value: 0 },
                { label: '21.) การคัดกรองมะเร็ง', value: 0 },
                { label: '21.1) ร้อยละของผู้ที่ได้รับการคัดกรองมะเร็งปากมดลูก', value: 0 },
                { label: '21.2) ร้อยละของผู้ที่มีผลผิดปกติ (มะเร็งปากมดลูก) ได้รับการส่องกล้อง Colposcopy', value: 0 },
                { label: '21.3) ร้อยละของผู้ที่ได้รับการคัดกรองมะเร็งลำไส้ใหญ่และไส้ตรง', value: 0 },
                { label: '21.4) ร้อยละของผู้ที่มีผลผิดปกติ (มะเร็งลำไส้ใหญ่และไส้ตรงผิดปกติ) ได้รับส่องกล้อง Colonoscopy', value: 0 },
                { label: '22.) ร้อยละของผู้ป่วยยาเสพติดเข้าสู่กระบวนการบำบัดรักษา ได้รับการดูแลอย่างมีคุณภาพต่อเนื่องจนถึงการติดตาม (เฉพาะระบบสมัครใจ) (Retention Rate)', value: 0 },
                { label: '23.) ร้อยละของผู้ป่วยวิกฤต เข้าถึงบริการการแพทย์ฉุกเฉิน', value: 0 },
                { label: '24.) ร้อยละของผู้ป่วยในพระบรมราชานุเคราะห์ และพระราชานุเคราะห์ ได้รับการดูแลอย่างมีคุณภาพ', value: 0 },
                { label: '25.) ร้อยละของเขตสุขภาพที่มีการบริหารจัดการกำลังคนที่มีประสิทธิภาพ', value: 0 },
                { label: '25.1) การบริหารจัดการตำแหน่งว่าง', value: 0 },
                { label: '25.2) ร้อยละการปรับปรุงตำแหน่งให้สอดรับกับการยกระดับบริการสุขภาพ', value: 0 },
                { label: '26.) ร้อยละของหน่วยงานที่ผ่านเกณฑ์มาตรฐานความมั่นคงปลอดภัยไซเบอร์ระดับสูง', value: 0 },
                { label: '27.) ร้อยละของหน่วยงานในสังกัดกระทรวงสาธารณสุขผ่านเกณฑ์การประเมิน ITA', value: 0 },
                { label: '28.) ร้อยละของโรงพยาบาลสังกัดกระทรวงสาธารณสุขมีคุณภาพมาตรฐานผ่านการรับรอง HA ขั้นมาตรฐาน', value: 0 },
                { label: '28.1) ร้อยละของโรงพยาบาลศูนย์ โรงพยาบาลทั่วไปสังกัดสำนักงานปลัดกระทรวงสาธารณสุข มีคุณภาพมาตรฐานผ่านการรับรอง HA ขั้นมาตรฐาน', value: 0 },
                { label: '28.2) ร้อยละของโรงพยาบาลสังกัดกรมการแพทย์ กรมควบคุมโรค และกรมสุขภาพจิต มีคุณภาพมาตรฐานผ่านการรับรอง HA ขั้นมาตรฐาน', value: 0 },
                { label: '28.3) ร้อยละของโรงพยาบาลชุมชนมีคุณภาพมาตรฐานผ่านการรับรอง HA ขั้นมาตรฐาน', value: 0 },
                { label: '29.) ร้อยละของโรงพยาบาลในเขตสุขภาพผ่านเกณฑ์พัฒนา โรงพยาบาลที่มีการตรวจทางห้องปฏิบัติการทางการแพทย์อย่างสมเหตุผล (RLU hospital) ตามที่กำหนด', value: 0 },
                { label: '29.1) ร้อยละของผู้ป่วยโรคเบาหวาน ได้รับการตรวจ HbA1c ซ้ำภายใน 90 วัน', value: 0 },
                { label: '29.2) ร้อยละของผู้ป่วยโรคเบาหวาน ได้รับการตรวจ HbA1c อย่างน้อยปีละ 1 ครั้ง', value: 0 },
                { label: '29.3) ร้อยละของโรงพยาบาลในเขตสุขภาพผ่านเกณฑ์พัฒนาโรงพยาบาลที่มีการตรวจทาง ห้องปฏิบัติการทางการแพทย์อย่างสมเหตุผล (RLU hospital) ตามเกณฑ์ที่กำหนด', value: 0 },
                { label: '30.) ความแตกต่างการใช้สิทธิ เมื่อไปใช้บริการผู้ป่วยในของผู้มีสิทธิในระบบหลักประกันสุขภาพถ้วนหน้า (compliance rate)', value: 0 },
                { label: '31.) ประชาชนสามารถเข้าถึงสิทธิในระบบหลักประกันสุขภาพถ้วนหน้า (UHC)', value: 0 },
                { label: '32.) ร้อยละของหน่วยบริการที่ประสบภาวะวิกฤตทางการเงิน', value: 0 },
                { label: '32.1) ร้อยละของหน่วยบริการที่ประสบภาวะวิกฤตทางการเงิน (ระดับ 7)', value: 0 },
                { label: '32.2) ร้อยละของหน่วยบริการที่ประสบภาวะวิกฤตทางการเงิน (ระดับ 6)', value: 0 },
                { label: '33.) อัตราการเพิ่มขึ้นของจำนวนสถานประกอบการด้านการท่องเที่ยวเชิงสุขภาพที่ได้รับมาตรฐานตามที่กำหนด', value: 0 },
                { label: '34.) อัตราการขยายตัวของกลุ่มอุตสาหกรรมการแพทย์และการท่องเที่ยวเชิงสุขภาพ', value: 0 },
                { label: '35.) ร้อยละผลิตภัณฑ์สุขภาพที่ได้รับการส่งเสริมและได้รับการอนุญาต', value: 0 },
            ],
        }
    ]

    const kpisInspector = [
        {
            title: 'ตัวชี้วัดตรวจราชการ',
            page: 'inspector',
            summary: '85%',
            details: [
                { label: '1.) ร้อยละของจังหวัดในเขตสุขภาพที่มีเครือข่ายราชทัณฑ์ปันสุข ทําความ ดี เพื่อชาติ ศาสน์ กษัตริย์(สะสม)', value: 0 },
                { label: '2.) ผู้ต้องขังได้รับการคัดกรอง CXR', value: 0 },
                { label: '2.1) ผู้ต้องขังแรกรับได้รับการคัดกรองวัณโรคด้วยการถ่ายภาพรังสีทรวงอก (CXR)', value: 0 },
                { label: '2.2) ผู้ต้องขังเก่าได้รับการคัดกรองวัณโรคด้วยการถ่ายภาพรังสีทรวงอก (CXR)', value: 0 },
                { label: '3.) จำนวนการจัดตั้งหน่วยบริการปฐมภูมิและเครือข่ายหน่วยบริการปฐมภูมิ ตามพระราชบัญญัติระบบสุขภาพปฐมภูมิ พ.ศ. 2562', value: 0 },
                { label: '4.) ร้อยละของหน่วยงานที่ผ่านเกณฑ์มาตรฐานความมั่นคงปลอดภัยไซเบอร์ระดับสูง', value: 0 },
                { label: '5.) อัตราการฆ่าตัวตายสำเร็จ', value: 0 },
                { label: '5.1) อัตราการฆ่าตัวตายสำเร็จ', value: 0 },
                { label: '5.2) ร้อยละของผู้พยายามฆ่าตัวตายเข้าถึงบริการที่มีประสิทธิภาพ', value: 0 },
                { label: '6.) ร้อยละของผู้ป่วยยาเสพติดเข้าสู่กระบวนการบำบัดรักษา ได้รับการดูแลอย่างมีคุณภาพต่อเนื่องจนถึงการติดตาม', value: 0 },
                { label: '7.) อัตราส่วนการตายมารดาไทยต่อการเกิดมีชีพแสนคน', value: 0 },
                { label: '8.) เด็กปฐมวัยมีพัฒนาการสมวัย', value: 0 },
                { label: '8.1) ร้อยละของเด็กอายุ 0 - 5 ปีมีพัฒนาการสมวัย', value: 0 },
                { label: '8.2) ร้อยละของเด็กปฐมวัยที่มีพัฒนาการล่าช้าเข้าถึงบริการพัฒนาการและสุขภาพจิตที่ได้มาตรฐาน', value: 0 },
                { label: '9) อัตราความรอบรู้ด้านสุขภาพ', value: 0 },
                { label: '9.1) อัตราความรอบรู้ด้านสุขภาพของประชาชนไทย อายุ 15 ปี ขึ้นไป', value: 0 },
                { label: '9.2) จํานวนประชาชนในชุมชนได้รับการส่งเสริมความรอบรู้ด้านสุขภาพป้องกันโรค', value: 0 },
                { label: '10.) ระดับความรอบรู้สุขภาพของประชาชนเรื่องโรคอุบัติใหม่และอุบัติซ้ำเพิ่มขึ้นไม่น้อยกว่าร้อยละ 5', value: 0 },
                { label: '11.1) จำนวนการจัดตั้ง/การดำเนินงาน NCDs remission clinic', value: 0 },
                { label: '11.2) ร้อยละของผู้ป่วยเบาหวานชนิดที่ 2 ที่เข้าสู่โรคเบาหวานระยะสงบ (DM remission)', value: 0 },
                { label: '11.3) ร้อยละของผู้ป่วยเบาหวานชนิดที่ 2 ทั้งหมดในพื้นที่', value: 0 },
                { label: '11.4) ร้อยละการตรวจติดตามยืนยันวินิจฉัยกลุ่มสงสัยป่วยโรคเบาหวาน', value: 0 },
                { label: '11.5) ร้อยละการตรวจติดตามยืนยันวินิจฉัยกลุ่มสงสัยป่วยโรคความดันโลหิตสูง', value: 0 },
                { label: '12.) อัตราการเสียชีวิตและบาดเจ็บจากอุบัติเหตุทางถนนในกลุ่มเด็กและเยาวชน', value: 0 },
                { label: '13.) โรคหลอดเลือดสมอง (Stroke)', value: 0 },
                { label: '13.1) อัตราตายของผู้ป่วยโรคหลอดเลือดสมอง', value: 0 },
                { label: '13.2) ร้อยละผู้ป่วยโรคหลอดเลือดสมองที่มีอาการไม่เกิน 72 ชั่วโมง ได้รับการรักษาใน Stroke Unit', value: 0 },
                { label: '14.) อัตราความสำเร็จการรักษาผู้ป่วยวัณโรคปอดรายใหม่', value: 0 },
                { label: '14.1) อัตราความสำเร็จการรักษาผู้ป่วยวัณโรคปอดรายใหม่', value: 0 },
                { label: '14.2) อัตราความครอบคลุมการขึ้นทะเบียนรักษาของผู้ป่วยวัณโรครายใหม่และกลับเป็นซ้ำ', value: 0 },
                { label: '15.) อัตราตายทารกแรกเกิด', value: 0 },
                { label: '15.1) อัตราตายทารกแรกเกิดอายุน้อยกว่าหรือเท่ากับ 28 วัน', value: 0 },
                { label: '15.2) จํานวนเตียง NICU ในเขตสุขภาพ', value: 0 },
                { label: '16.) อัตราตายผู้ป่วยติดเชื้อในกระแสเลือดแบบรุนแรงชนิด community-acquired', value: 0 },
                { label: '17.) กล้ามเนื้อหัวใจตายเฉียบพลัน (STEMI)', value: 0 },
                { label: '17.1) อัตราตายของผู้ป่วยโรคกล้ามเนื้อหัวใจตายเฉียบพลันชนิด STEMI', value: 0 },
                { label: '17.2) ร้อยละผู้ป่วย STEMI ได้รับยาละลายลิ่มเลือดตามมาตรฐานเวลา', value: 0 },
                { label: '17.3) ร้อยละผู้ป่วย STEMI ได้รับ Primary PCI ตามมาตรฐานเวลา', value: 0 },
                { label: '17.4) อัตราตาย STEMI ภายใน 30 วัน', value: 0 },
                { label: '18.) ร้อยละผู้ป่วยไตเรื้อรัง stage 5 รายใหม่ ที่ลดลง', value: 0 },
                { label: '19.) อัตราส่วนของผู้บริจาคอวัยวะสมองตายที่ได้รับการผ่าตัด', value: 0 },
                { label: '20.) การคัดกรองมะเร็ง', value: 0 },
                { label: '20.1) ร้อยละผู้ที่ได้รับการคัดกรองมะเร็งปากมดลูก', value: 0 },
                { label: '20.2) ร้อยละผู้ที่มีผลผิดปกติ ได้รับการส่องกล้อง Colposcopy', value: 0 },
                { label: '20.3) ร้อยละการคัดกรองมะเร็งลำไส้ใหญ่และไส้ตรง', value: 0 },
                { label: '20.4) ร้อยละได้รับส่องกล้อง Colonoscopy หลังผลผิดปกติ', value: 0 },
                { label: '21.) ไวรัสตับอักเสบ บี และ ซี', value: 0 },
                { label: '21.1) ผู้ติดเชื้อไวรัสตับอักเสบ บี ได้รับการรักษา', value: 0 },
                { label: '21.2) ผู้ติดเชื้อไวรัสตับอักเสบ ซี ได้รับการรักษา', value: 0 },
                { label: '22.) อสม.มีศักยภาพในการคัดกรองโรค NCDs', value: 0 },
                { label: '23.) มีบริการสถานชีวาภิบาลตามแนวทาง/มาตรฐาน', value: 0 },
                { label: '24.) ร้อยละการจัดทำ Advance Care Plan ในผู้ป่วยประคับประคอง', value: 0 },
                { label: '25.) ร้อยละโรงพยาบาลที่มี Home ward for active dying patient', value: 0 },
                { label: '26.) ผู้สูงอายุที่มีความเสี่ยงความจำ และการเคลื่อนไหวได้รับการดูแล', value: 0 },
                { label: '26.1) ร้อยละผู้สูงอายุเสี่ยงความจำ ได้รับการดูแล', value: 0 },
                { label: '26.2) ร้อยละผู้สูงอายุเสี่ยงด้านการเคลื่อนไหว ได้รับการดูแล', value: 0 },
                { label: '27.) Caregiver รายใหม่ผ่านการอบรม', value: 0 },
                { label: '28.) ร้อยละวัคซีน MMR2 ในเด็กอายุต่ำกว่า 3 ปี', value: 0 },
                { label: '29.) อัตราส่วนสถานประกอบการด้านการท่องเที่ยวเชิงสุขภาพ', value: 0 },
                { label: '30.) ร้อยละผลิตภัณฑ์สุขภาพที่ได้รับการส่งเสริมและได้รับการอนุญาต', value: 0 },
                { label: '31.) รายรับจากการให้บริการการแพทย์แผนไทยและทางเลือกต่อจำนวนครั้ง', value: 0 },
                { label: '32.) ร้อยละของโรงพยาบาลที่พัฒนาอนามัยสิ่งแวดล้อมได้ตามเกณฑ์ GREEN & CLEAN Hospital Challenge (ระดับมาตรฐานขึ้นไป และระดับท้าทาย)', value: 0 },
                { label: '32.1) ร้อยละของโรงพยาบาลที่ผ่านเกณฑ์ GREEN & CLEAN (ระดับมาตรฐาน)', value: 0 },
                { label: '32.2) ร้อยละของโรงพยาบาลที่ผ่านเกณฑ์ GREEN & CLEAN (ระดับท้าทาย)', value: 0 },
                { label: '33.) การบริหารจัดการตำแหน่งว่าง', value: 0 },
                { label: '34.) ร้อยละของโรงพยาบาลในเขตสุขภาพผ่านเกณฑ์พัฒนา โรงพยาบาลที่มีการตรวจทางห้องปฏิบัติการทางการแพทย์อย่างสมเหตุผล (RLU hospital) ตามที่กำหนด', value: 0 },
                { label: '34.1) ร้อยละของโรงพยาบาลผ่านเกณฑ์ RLU hospital', value: 0 },
                { label: '34.2) ร้อยละผู้ป่วยเบาหวานตรวจ HbA1c ซ้ำภายใน 90 วัน', value: 0 },
                { label: '34.3) ร้อยละผู้ป่วยเบาหวานตรวจ HbA1c อย่างน้อยปีละ 1 ครั้ง', value: 0 },
                { label: '35. ร้อยละของหน่วยบริการที่ประสบภาวะวิกฤตทางการเงิน', value: 0 },
                { label: '35.1) ร้อยละของหน่วยบริการที่ประสบภาวะวิกฤตทางการเงิน (ระดับ 7)', value: 0 },
                { label: '35.2) ร้อยละของหน่วยบริการที่ประสบภาวะวิกฤตทางการเงิน (ระดับ 6)', value: 0 },
                { label: '36.) หน่วยงานผ่านเกณฑ์ตรวจสอบรายงานการเงิน (หมวดสินทรัพย์ถาวร และลูกหนี้ค่ารักษาพยาบาล)', value: 0 }
            ],
        }
    ]

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            try {
                const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/get_summary_mou`);
                const raw = res.data;

                const percentMap = new Map(raw.map(item => [item.kpi, item.percent]));

                const updatedKpis = kpis.map(kpiGroup => {
                    const updatedDetails = kpiGroup.details.map(detail => {
                        const percent = percentMap.get(detail.database);
                        return {
                            ...detail,
                            value: percent ?? detail.value,
                        };
                    });
                    return {
                        ...kpiGroup,
                        details: updatedDetails,
                    };
                });

                setKpi(updatedKpis);

            } catch (error) {
                console.error('Error fetching KPI result:', error);
            } finally {
                setTimeout(() => {
                    setLoading(false);
                }, 500);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            try {
                const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/get_summary_ministry`);
                const raw = res.data;

                const percentMap = new Map(raw.map(item => [item.kpi, item.percent]));

                const updatedKpis = kpisMinistry.map(kpiGroup => {
                    const updatedDetails = kpiGroup.details.map(detail => {
                        const percent = percentMap.get(detail.database);
                        return {
                            ...detail,
                            value: percent ?? detail.value,
                        };
                    });
                    return {
                        ...kpiGroup,
                        details: updatedDetails,
                    };
                });

                setKpiMinistry(updatedKpis);

            } catch (error) {
                console.error('Error fetching KPI result:', error);
            } finally {
                setTimeout(() => {
                    setLoading(false);
                }, 500);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            try {
                const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/get_summary_inspector`);
                const raw = res.data;

                const percentMap = new Map(raw.map(item => [item.kpi, item.percent]));

                const updatedKpis = kpisInspector.map(kpiGroup => {
                    const updatedDetails = kpiGroup.details.map(detail => {
                        const percent = percentMap.get(detail.database);
                        return {
                            ...detail,
                            value: percent ?? detail.value,
                        };
                    });
                    return {
                        ...kpiGroup,
                        details: updatedDetails,
                    };
                });

                setKpiInspector(updatedKpis);

            } catch (error) {
                console.error('Error fetching KPI result:', error);
            } finally {
                setTimeout(() => {
                    setLoading(false);
                }, 500);
            }
        };

        fetchData();
    }, []);


    return (
        loading ? (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
                <Spinner animation="border" role="status" size='lg'>
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </div>
        ) : (
            <Container fluid>
                <Row>
                    <h2 className="text-start my-3" style={{ fontWeight: '700', color: '#2c3e50', }}>
                        หน้าหลัก
                    </h2>
                </Row>

                <Row className="g-4">
                    {/* MOU */}
                    <Col md={4}>
                        <Card className="border-0 shadow-sm rounded-4 p-3" style={{ backgroundColor: '#f8f9fa' }}>
                            <Card.Body className="text-center">
                                <FaHandshake size={36} color="#3498db" />
                                <h5 className="mt-3 mb-1" style={{ fontWeight: '600' }}>ตัวชี้วัด MOU</h5>
                                <p className="text-muted mb-3">มีตัวชี้วัดทั้งหมด 23 ตัวชี้วัด</p>
                                <div className="d-flex align-items-center justify-content-center" >
                                    <Button
                                        variant="light"
                                        className="d-flex align-items-center justify-content-center gap-2"
                                        onClick={() => changepage('kpi/mou')}
                                    >
                                        <span>แสดงรายละเอียด</span>
                                    </Button>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>

                    {/* กระทรวง */}
                    <Col md={4}>
                        <Card className="border-0 shadow-sm rounded-4 p-3" style={{ backgroundColor: '#f8f9fa' }}>
                            <Card.Body className="text-center">
                                <FaUniversity size={36} color="#2ecc71" />
                                <h5 className="mt-3 mb-1" style={{ fontWeight: '600' }}>ตัวชี้วัดกระทรวง</h5>
                                <p className="text-muted mb-3">มีตัวชี้วัดทั้งหมด 47 ตัวชี้วัด</p>
                                <div className="d-flex align-items-center justify-content-center" >
                                    <Button
                                        variant="light"
                                        className="d-flex align-items-center justify-content-center gap-2"
                                        onClick={() => changepage('kpi/ministry')}
                                    >
                                        <span>แสดงรายละเอียด</span>
                                    </Button>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>

                    {/* ตรวจราชการ */}
                    <Col md={4}>
                        <Card className="border-0 shadow-sm rounded-4 p-3" style={{ backgroundColor: '#f8f9fa' }}>
                            <Card.Body className="text-center">
                                <FaSearch size={36} color="#e67e22" />
                                <h5 className="mt-3 mb-1" style={{ fontWeight: '600' }}>ตัวชี้วัดตรวจราชการ</h5>
                                <p className="text-muted mb-3">มีตัวชี้วัดทั้งหมด 59 ตัวชี้วัด</p>
                                <div className="d-flex align-items-center justify-content-center" >
                                    <Button
                                        variant="light"
                                        className="d-flex align-items-center justify-content-center gap-2"
                                        onClick={() => changepage('kpi/inspector')}
                                    >
                                        <span>แสดงรายละเอียด</span>
                                    </Button>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                <Row className="mt-4">
                    <Col>
                        <Card>
                            <Card.Header>สรุปตัวชี้วัด (KPI Summary)</Card.Header>
                            <Card.Body>
                                {/* MOU */}
                                <Accordion defaultActiveKey="0">
                                    {kpi.map((kpi, idx) => (
                                        <Accordion.Item eventKey={`${idx}`} key={idx}>
                                            <Accordion.Header>
                                                <div className="d-flex justify-content-between align-items-center w-100">
                                                    <div>
                                                        <strong>{kpi.title}</strong>
                                                        <Badge bg="info" className="ms-3">{kpi.summary}</Badge>
                                                    </div>
                                                    <Button
                                                        style={{ marginRight: "1rem" }}
                                                        variant="outline-primary"
                                                        size="sm"
                                                        onClick={() => changepage(`kpi/${kpi.page}`)}
                                                    >
                                                        รายละเอียด
                                                    </Button>
                                                </div>
                                            </Accordion.Header>
                                            <Accordion.Body className="bg-light">
                                                <ul className="list-group list-group-flush">
                                                    {kpi.details.map((detail, i) => {
                                                        // เช็คว่าหัวข้อย่อยไหม
                                                        const isSubItem = /^\d+\.\d+\)/.test(detail.label);
                                                        return (
                                                            <li
                                                                key={i}
                                                                className="list-group-item d-flex justify-content-between align-items-start"
                                                            >
                                                                <span className={`fw-bold ${isSubItem ? 'ms-4' : ''}`}>
                                                                    {detail.label}
                                                                </span>
                                                                <div className="d-flex align-items-center" style={{ minWidth: '200px' }}>
                                                                    <ProgressBar
                                                                        now={detail.value}
                                                                        style={{ width: '120px', height: '12px' }}
                                                                        variant={detail.value > detail.criterion ? "success" : "danger"}
                                                                    />
                                                                    <span className={`ms-2 ${detail.value > detail.criterion ? "text-success" : "text-danger"}`}>
                                                                        {detail.value}%
                                                                    </span>
                                                                </div>
                                                            </li>
                                                        );
                                                    })}
                                                </ul>
                                            </Accordion.Body>

                                        </Accordion.Item>
                                    ))}
                                </Accordion>

                                {/* กระทรวง */}
                                <Accordion defaultActiveKey="0">
                                    {kpiMinistry.map((kpi, idx) => (
                                        <Accordion.Item eventKey={`${idx}`} key={idx}>
                                            <Accordion.Header>
                                                <div className="d-flex justify-content-between align-items-center w-100">
                                                    <div>
                                                        <strong>{kpi.title}</strong>
                                                        <Badge bg="info" className="ms-3">{kpi.summary}</Badge>
                                                    </div>
                                                    <Button
                                                        style={{ marginRight: "1rem" }}
                                                        variant="outline-primary"
                                                        size="sm"
                                                        onClick={() => changepage(`kpi/${kpi.page}`)}
                                                    >
                                                        รายละเอียด
                                                    </Button>
                                                </div>
                                            </Accordion.Header>
                                            <Accordion.Body className="bg-light">
                                                <ul className="list-group list-group-flush">
                                                    {kpi.details.map((detail, i) => {
                                                        // เช็คว่าหัวข้อย่อยไหม
                                                        const isSubItem = /^\d+\.\d+\)/.test(detail.label);
                                                        return (
                                                            <li
                                                                key={i}
                                                                className="list-group-item d-flex justify-content-between align-items-start"
                                                            >
                                                                <span className={`fw-bold ${isSubItem ? 'ms-4' : ''}`}>
                                                                    {detail.label}
                                                                </span>
                                                                <div className="d-flex align-items-center" style={{ minWidth: '200px' }}>
                                                                    <ProgressBar
                                                                        now={detail.value}
                                                                        style={{ width: '120px', height: '12px' }}
                                                                        variant={detail.value > detail.criterion ? "success" : "danger"}
                                                                    />
                                                                    <span className={`ms-2 ${detail.value > detail.criterion ? "text-success" : "text-danger"}`}>
                                                                        {detail.value}%
                                                                    </span>
                                                                </div>
                                                            </li>
                                                        );
                                                    })}
                                                </ul>
                                            </Accordion.Body>

                                        </Accordion.Item>
                                    ))}
                                </Accordion>

                                {/* ราชการ */}
                                <Accordion defaultActiveKey="0">
                                    {kpiInspector.map((kpi, idx) => (
                                        <Accordion.Item eventKey={`${idx}`} key={idx}>
                                            <Accordion.Header>
                                                <div className="d-flex justify-content-between align-items-center w-100">
                                                    <div>
                                                        <strong>{kpi.title}</strong>
                                                        <Badge bg="info" className="ms-3">{kpi.summary}</Badge>
                                                    </div>
                                                    <Button
                                                        style={{ marginRight: "1rem" }}
                                                        variant="outline-primary"
                                                        size="sm"
                                                        onClick={() => changepage(`kpi/${kpi.page}`)}
                                                    >
                                                        รายละเอียด
                                                    </Button>
                                                </div>
                                            </Accordion.Header>
                                            <Accordion.Body className="bg-light">
                                                <ul className="list-group list-group-flush">
                                                    {kpi.details.map((detail, i) => {
                                                        // เช็คว่าหัวข้อย่อยไหม
                                                        const isSubItem = /^\d+\.\d+\)/.test(detail.label);
                                                        return (
                                                            <li
                                                                key={i}
                                                                className="list-group-item d-flex justify-content-between align-items-start"
                                                            >
                                                                <span className={`fw-bold ${isSubItem ? 'ms-4' : ''}`}>
                                                                    {detail.label}
                                                                </span>
                                                                <div className="d-flex align-items-center" style={{ minWidth: '200px' }}>
                                                                    <ProgressBar
                                                                        now={detail.value}
                                                                        style={{ width: '120px', height: '12px' }}
                                                                        variant={detail.value > detail.criterion ? "success" : "danger"}
                                                                    />
                                                                    <span className={`ms-2 ${detail.value > detail.criterion ? "text-success" : "text-danger"}`}>
                                                                        {detail.value}%
                                                                    </span>
                                                                </div>
                                                            </li>
                                                        );
                                                    })}
                                                </ul>
                                            </Accordion.Body>

                                        </Accordion.Item>
                                    ))}
                                </Accordion>
                            </Card.Body>
                        </Card>


                    </Col>
                </Row>
            </Container >
        )
    )
}

export default HomePage