import { useEffect, useState } from 'react';
import { Button, Container, Form, Modal, Row, Spinner, Table, Card, Col } from 'react-bootstrap'
import { IoReload } from 'react-icons/io5';
import { BsThreeDotsVertical } from "react-icons/bs";
import { Link } from 'react-router-dom';
import axios from 'axios'

import { FaList, FaTimesCircle, FaCheckCircle, FaPercentage } from 'react-icons/fa';

function MinistryIndicatorsPage() {
  const [loading, setLoading] = useState(false);
  const [kpiData, setKpiData] = useState([]);
  const [selectedKpiData, setSelectedKpiData] = useState(null);

  const [formData, setFormData] = useState({
    target: '',
    result: '',

  })

  const [showModal, setShowModal] = useState(false);

  const handleShow = () => {
    setShowModal(true)
  };
  const handleClose = () => {
    setShowModal(false)
  };

  // Confirm popup
  const [showConfirmPopup, setConFirmPopup] = useState(false);
  const handleOpenConFirmPopup = (e) => {
    e.preventDefault();
    setShowModal(false);
    setConFirmPopup(true);
  };

  const handleCloseConFirmPopup = () => {
    setShowModal(true);
    setConFirmPopup(false);
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const KpiData = [
    {
      page: 'ministry', index: '1', kpi: 'อัตราส่วนการตายมารดาไทยต่อการเกิดมีชีพแสนคน', criterion: 0,
      apipath: '',
      // link: '',
      sync_api: '',
      database: '',
      target: 0, result: 0, percents: 0.00
    },
    {
      page: 'ministry', index: '2', kpi: 'ร้อยละของเด็กอายุ 0 - 5 ปีมีพัฒนาการสมวัย', criterion: 0,
      apipath: '',
      // link: '',
      sync_api: '',
      database: '',
      target: 0, result: 0, percents: 0.00
    },
    {
      page: 'ministry', index: '3', kpi: 'อัตราความรอบรู้ด้านสุขภาพของประชาชนไทย อายุ 15 ปี ขึ้นไป', criterion: 0,
      apipath: '',
      // link: '',
      sync_api: '',
      database: '',
      target: 0, result: 0, percents: 0.00
    },
    {
      page: 'ministry', index: '4', kpi: 'ระดับความรอบรู้สุขภาพของประชาชนเรื่องโรคอุบัติใหม่และอุบัติซ้ำเพิ่มขึ้นไม่น้อยกว่าร้อยละ 5', criterion: 0,
      apipath: '',
      // link: '',
      sync_api: '',
      database: '',
      target: 0, result: 0, percents: 0.00
    },
    {
      page: 'ministry', index: '5', kpi: 'ร้อยละการตรวจติดตามยืนยันวินิจฉัยกลุ่มสงสัยป่วยโรคเบาหวาน และ/หรือโรคความดันโลหิตสูง 5', notDisplay: true
    },
    {
      page: 'ministry', index: '', kpi: '5.1 ร้อยละการตรวจติดตามยืนยันวินิจฉัยกลุ่มสงสัยป่วยโรคเบาหวาน', criterion: 0,
      apipath: '',
      // link: '',
      sync_api: '',
      database: '',
      target: 0, result: 0, percents: 0.00
    },
    {
      page: 'ministry', index: '', kpi: '5.2 ร้อยละการตรวจติดตามยืนยันวินิจฉัยกลุ่มสงสัยป่วยโรคความดันโลหิตสูง', criterion: 0,
      apipath: '',
      // link: '',
      sync_api: '',
      database: '',
      target: 0, result: 0, percents: 0.00
    },
    {
      page: 'ministry', index: '6', kpi: 'อัตราการเสียชีวิตและบาดเจ็บจากอุบัติเหตุทางถนนในกลุ่มเด็กและเยาวชนลดลง (ช่วงวัย 1-18 ปี)', criterion: 0,
      apipath: '',
      // link: '',
      sync_api: '',
      database: '',
      target: 0, result: 0, percents: 0.00
    },
    {
      page: 'ministry', index: '7', kpi: 'ร้อยละของโรงพยาบาลที่พัฒนาอนามัยสิ่งแวดล้อมได้ตามเกณฑ์ GREEN & CLEAN Hospital Challenge (ระดับมาตรฐานขึ้นไป และระดับท้าทาย)', notDisplay: true
    },
    {
      page: 'ministry', index: '', kpi: '7.1 ร้อยละของโรงพยาบาลที่พัฒนาอนามัยสิ่งแวดล้อมได้ตามเกณฑ์ GREEN & CLEAN Hospital Challenge (ระดับมาตรฐานขึ้นไป)', criterion: 0,
      apipath: '',
      // link: '',
      sync_api: '',
      database: '',
      target: 0, result: 0, percents: 0.00
    },
    {
      page: 'ministry', index: '', kpi: '7.2 ร้อยละของโรงพยาบาลที่พัฒนาอนามัยสิ่งแวดล้อมได้ตามเกณฑ์ GREEN & CLEAN Hospital Challenge (ระดับระดับท้าทาย)', criterion: 0,
      apipath: '',
      // link: '',
      sync_api: '',
      database: '',
      target: 0, result: 0, percents: 0.00
    },
    {
      page: 'ministry', index: '8', kpi: 'จำนวนการจัดตั้งหน่วยบริการปฐมภูมิและเครือข่ายหน่วยบริการปฐมภูมิ ตามพระราชบัญญัติระบบสุขภาพปฐมภูมิ พ.ศ. 2562', criterion: 0,
      apipath: '',
      // link: '',
      sync_api: '',
      database: '',
      target: 0, result: 0, percents: 0.00
    },
    {
      page: 'ministry', index: '9', kpi: 'ร้อยละของชุมชนมีการดำเนินการจัดการสุขภาพที่เหมาะสมให้กับประชาชน', criterion: 0,
      apipath: '',
      // link: '',
      sync_api: '',
      database: '',
      target: 0, result: 0, percents: 0.00
    },
    {
      page: 'ministry', index: '10', kpi: 'อัตราตายของผู้ป่วยโรคหลอดเลือดสมอง (Stroke: I60-I69)', criterion: 0,
      apipath: '',
      // link: '',
      sync_api: '',
      database: '',
      target: 0, result: 0, percents: 0.00
    },
    {
      page: 'ministry', index: '11', kpi: 'อัตราความสำเร็จการรักษาผู้ป่วยวัณโรคปอดรายใหม่', notDisplay: true
    },
    {
      page: 'ministry', index: '', kpi: '11.1 อัตราความสำเร็จการรักษาผู้ป่วยวัณโรคปอดรายใหม่', criterion: 0,
      apipath: '',
      // link: '',
      sync_api: '',
      database: '',
      target: 0, result: 0, percents: 0.00
    },
    {
      page: 'ministry', index: '', kpi: '11.2 อัตราความครอบคลุมการขึ้นทะเบียนรักษาของผู้ป่วยวัณโรครายใหม่และกลับเป็นซ้ำ', criterion: 0,
      apipath: '',
      // link: '',
      sync_api: '',
      database: '',
      target: 0, result: 0, percents: 0.00
    },
    {
      page: 'ministry', index: '12', kpi: 'อัตราตายทารกแรกเกิดอายุน้อยกว่าหรือเท่ากับ 28 วัน', criterion: 0,
      apipath: '',
      // link: '',
      sync_api: '',
      database: '',
      target: 0, result: 0, percents: 0.00
    },
    {
      page: 'ministry', index: '13', kpi: 'ร้อยละของประชาชนที่มารับบริการในระดับปฐมภูมิได้รับการรักษาด้วยการแพทย์แผนไทยและการแพทย์ทางเลือก', criterion: 0,
      apipath: '',
      // link: '',
      sync_api: '',
      database: '',
      target: 0, result: 0, percents: 0.00
    },
    {
      page: 'ministry', index: '14', kpi: 'ร้อยละของผู้ป่วยที่ได้รับการวินิจฉัยโรค Common Diseases and Symptoms มีการสั่งจ่ายยาสมุนไพรเพิ่มขึ้น', criterion: 0,
      apipath: '',
      // link: '',
      sync_api: '',
      database: '',
      target: 0, result: 0, percents: 0.00
    },
    {
      page: 'ministry', index: '15', kpi: 'อัตราการฆ่าตัวตายสำเร็จ', criterion: 0,
      apipath: '',
      // link: '',
      sync_api: '',
      database: '',
      target: 0, result: 0, percents: 0.00
    },
    {
      page: 'ministry', index: '16', kpi: 'ร้อยละของผู้ป่วยโรคจิตเวชและสารเสพติดที่มีความเสี่ยงสูงต่อการก่อความรุนแรง (SMI-V) ที่เข้าสู่กระบวนการบำบัดรักษาในเขตสุขภาพได้รับการดูแลต่อเนื่องจนไม่ก่อความรุนแรงซ้ำ', criterion: 0,
      apipath: '',
      // link: '',
      sync_api: '',
      database: '',
      target: 0, result: 0, percents: 0.00
    },
    {
      page: 'ministry', index: '17', kpi: 'อัตราตายผู้ป่วยติดเชื้อในกระแสเลือดแบบรุนแรงชนิด community-acquired', criterion: 0,
      apipath: '',
      // link: '',
      sync_api: '',
      database: '',
      target: 0, result: 0, percents: 0.00
    },
    {
      page: 'ministry', index: '18', kpi: 'อัตราตายของผู้ป่วยโรคกล้ามเนื้อหัวใจตายเฉียบพลันชนิด STEMI', criterion: 0,
      apipath: '',
      // link: '',
      sync_api: '',
      database: '',
      target: 0, result: 0, percents: 0.00
    },
    {
      page: 'ministry', index: '19', kpi: 'ร้อยละผู้ป่วยไตเรื้อรัง stage 5 รายใหม่ ที่ลดลงจากปีงบประมาณก่อนหน้า', criterion: 0,
      apipath: '',
      // link: '',
      sync_api: '',
      database: '',
      target: 0, result: 0, percents: 0.00
    },
    {
      page: 'ministry', index: '20', kpi: 'อัตราส่วนของจำนวนผู้บริจาคอวัยวะสมองตายที่ได้รับการผ่าตัดนำอวัยวะออก ต่อจำนวนผู้ป่วยเสียชีวิตในโรงพยาบาล', criterion: 0,
      apipath: '',
      // link: '',
      sync_api: '',
      database: '',
      target: 0, result: 0, percents: 0.00
    },
    {
      page: 'ministry', index: '21', kpi: 'การคัดกรองมะเร็ง', notDisplay: true
    },
    {
      page: 'ministry', index: '', kpi: '21.1 ร้อยละของผู้ที่ได้รับการคัดกรองมะเร็งปากมดลูก', criterion: 0,
      apipath: '',
      // link: '',
      sync_api: '',
      database: '',
      target: 0, result: 0, percents: 0.00
    },
    {
      page: 'ministry', index: '', kpi: '21.2 ร้อยละของผู้ที่มีผลผิดปกติ (มะเร็งปากมดลูก) ได้รับการส่องกล้อง Colposcopy', criterion: 0,
      apipath: '',
      // link: '',
      sync_api: '',
      database: '',
      target: 0, result: 0, percents: 0.00
    },
    {
      page: 'ministry', index: '', kpi: '21.3 ร้อยละของผู้ที่ได้รับการคัดกรองมะเร็งลำไส้ใหญ่และไส้ตรง', criterion: 0,
      apipath: '',
      // link: '',
      sync_api: '',
      database: '',
      target: 0, result: 0, percents: 0.00
    },
    {
      page: 'ministry', index: '', kpi: '21.4 ร้อยละของผู้ที่มีผลผิดปกติ (มะเร็งลำไส้ใหญ่และไส้ตรงผิดปกติ) ได้รับส่องกล้อง Colonoscopy', criterion: 0,
      apipath: '',
      // link: '',
      sync_api: '',
      database: '',
      target: 0, result: 0, percents: 0.00
    },
    {
      page: 'ministry', index: '22', kpi: 'ร้อยละของผู้ป่วยยาเสพติดเข้าสู่กระบวนการบำบัดรักษา ได้รับการดูแลอย่างมีคุณภาพต่อเนื่องจนถึงการติดตาม (เฉพาะระบบสมัครใจ) (Retention Rate)', criterion: 0,
      apipath: '',
      // link: '',
      sync_api: '',
      database: '',
      target: 0, result: 0, percents: 0.00
    },
    {
      page: 'ministry', index: '23', kpi: 'ร้อยละของผู้ป่วยวิกฤต เข้าถึงบริการการแพทย์ฉุกเฉิน', criterion: 0,
      apipath: '',
      // link: '',
      sync_api: '',
      database: '',
      target: 0, result: 0, percents: 0.00
    },
    {
      page: 'ministry', index: '24', kpi: 'ร้อยละของผู้ป่วยในพระบรมราชานุเคราะห์ และพระราชานุเคราะห์ ได้รับการดูแลอย่างมีคุณภาพ', criterion: 0,
      apipath: '',
      // link: '',
      sync_api: '',
      database: '',
      target: 0, result: 0, percents: 0.00
    },
    {
      page: 'ministry', index: '25', kpi: 'ร้อยละของเขตสุขภาพที่มีการบริหารจัดการกำลังคนที่มีประสิทธิภาพ', notDisplay: true
    },
    {
      page: 'ministry', index: '', kpi: '25.1 การบริหารจัดการตำแหน่งว่าง', criterion: 0,
      apipath: '',
      // link: '',
      sync_api: '',
      database: '',
      target: 0, result: 0, percents: 0.00
    },
    {
      page: 'ministry', index: '', kpi: '25.2 ร้อยละการปรับปรุงตำแหน่งให้สอดรับกับการยกระดับบริการสุขภาพ', criterion: 0,
      apipath: '',
      // link: '',
      sync_api: '',
      database: '',
      target: 0, result: 0, percents: 0.00
    },
    {
      page: 'ministry', index: '26', kpi: 'ร้อยละของหน่วยงานที่ผ่านเกณฑ์มาตรฐานความมั่นคงปลอดภัยไซเบอร์ระดับสูง', criterion: 0,
      apipath: '',
      // link: '',
      sync_api: '',
      database: '',
      target: 0, result: 0, percents: 0.00
    },
    {
      page: 'ministry', index: '27', kpi: 'ร้อยละของหน่วยงานในสังกัดกระทรวงสาธารณสุขผ่านเกณฑ์การประเมิน ITA', criterion: 0,
      apipath: '',
      // link: '',
      sync_api: '',
      database: '',
      target: 0, result: 0, percents: 0.00
    },
    {
      page: 'ministry', index: '28', kpi: 'ร้อยละของโรงพยาบาลสังกัดกระทรวงสาธารณสุขมีคุณภาพมาตรฐานผ่านการรับรอง HA ขั้นมาตรฐาน', notDisplay: true
    },
    {
      page: 'ministry', index: '', kpi: '28.1 ร้อยละของโรงพยาบาลศูนย์ โรงพยาบาลทั่วไปสังกัดสำนักงานปลัดกระทรวงสาธารณสุข มีคุณภาพมาตรฐานผ่านการรับรอง HA ขั้นมาตรฐาน', criterion: 0,
      apipath: '',
      // link: '',
      sync_api: '',
      database: '',
      target: 0, result: 0, percents: 0.00
    },
    {
      page: 'ministry', index: '', kpi: '28.2 ร้อยละของโรงพยาบาลสังกัดกรมการแพทย์ กรมควบคุมโรค และกรมสุขภาพจิต มีคุณภาพมาตรฐานผ่านการรับรอง HA ขั้นมาตรฐาน', criterion: 0,
      apipath: '',
      // link: '',
      sync_api: '',
      database: '',
      target: 0, result: 0, percents: 0.00
    },
    {
      page: 'ministry', index: '', kpi: '28.3 ร้อยละของโรงพยาบาลชุมชนมีคุณภาพมาตรฐานผ่านการรับรอง HA ขั้นมาตรฐาน', criterion: 0,
      apipath: '',
      // link: '',
      sync_api: '',
      database: '',
      target: 0, result: 0, percents: 0.00
    },
    {
      page: 'ministry', index: '29', kpi: 'ร้อยละของโรงพยาบาลในเขตสุขภาพผ่านเกณฑ์พัฒนา โรงพยาบาลที่มีการตรวจทางห้องปฏิบัติการทางการแพทย์อย่างสมเหตุผล (RLU hospital) ตามที่กำหนด', notDisplay: true
    },
    {
      page: 'ministry', index: '', kpi: '29.1 ร้อยละของผู้ป่วยโรคเบาหวาน ได้รับการตรวจ HbA1c ซ้ำภายใน 90 วัน', criterion: 0,
      apipath: '',
      // link: '',
      sync_api: '',
      database: '',
      target: 0, result: 0, percents: 0.00
    },
    {
      page: 'ministry', index: '', kpi: '29.2 ร้อยละของผู้ป่วยโรคเบาหวาน ได้รับการตรวจ HbA1c อย่างน้อยปีละ 1 ครั้ง', criterion: 0,
      apipath: '',
      // link: '',
      sync_api: '',
      database: '',
      target: 0, result: 0, percents: 0.00
    },
    {
      page: 'ministry', index: '', kpi: '29.3 ร้อยละของโรงพยาบาลในเขตสุขภาพผ่านเกณฑ์พัฒนาโรงพยาบาลที่มีการตรวจทาง ห้องปฏิบัติการทางการแพทย์อย่างสมเหตุผล (RLU hospital) ตามเกณฑ์ที่กำหนด', criterion: 0,
      apipath: '',
      // link: '',
      sync_api: '',
      database: '',
      target: 0, result: 0, percents: 0.00
    },
    {
      page: 'ministry', index: '30', kpi: 'ความแตกต่างการใช้สิทธิ เมื่อไปใช้บริการผู้ป่วยในของผู้มีสิทธิในระบบหลักประกันสุขภาพถ้วนหน้า (compliance rate)', criterion: 0,
      apipath: '',
      // link: '',
      sync_api: '',
      database: '',
      target: 0, result: 0, percents: 0.00
    },
    {
      page: 'ministry', index: '31', kpi: 'ประชาชนสามารถเข้าถึงสิทธิในระบบหลักประกันสุขภาพถ้วนหน้า (UHC)', criterion: 0,
      apipath: '',
      // link: '',
      sync_api: '',
      database: '',
      target: 0, result: 0, percents: 0.00
    },
    {
      page: 'ministry', index: '32', kpi: 'ร้อยละของหน่วยบริการที่ประสบภาวะวิกฤตทางการเงิน', notDisplay: true
    },
    {
      page: 'ministry', index: '', kpi: '32.1 ร้อยละของหน่วยบริการที่ประสบภาวะวิกฤตทางการเงิน (ระดับ 7)', criterion: 0,
      apipath: '',
      // link: '',
      sync_api: '',
      database: '',
      target: 0, result: 0, percents: 0.00
    },
    {
      page: 'ministry', index: '', kpi: '32.2 ร้อยละของหน่วยบริการที่ประสบภาวะวิกฤตทางการเงิน (ระดับ 6)', criterion: 0,
      apipath: '',
      // link: '',
      sync_api: '',
      database: '',
      target: 0, result: 0, percents: 0.00
    },
    {
      page: 'ministry', index: '33', kpi: 'อัตราการเพิ่มขึ้นของจำนวนสถานประกอบการด้านการท่องเที่ยวเชิงสุขภาพที่ได้รับมาตรฐานตามที่กำหนด', criterion: 0,
      apipath: '',
      // link: '',
      sync_api: '',
      database: '',
      target: 0, result: 0, percents: 0.00
    },
    {
      page: 'ministry', index: '34', kpi: 'อัตราการขยายตัวของกลุ่มอุตสาหกรรมการแพทย์และการท่องเที่ยวเชิงสุขภาพ', criterion: 0,
      apipath: '',
      // link: '',
      sync_api: '',
      database: '',
      target: 0, result: 0, percents: 0.00
    },
    {
      page: 'ministry', index: '35', kpi: 'ร้อยละผลิตภัณฑ์สุขภาพที่ได้รับการส่งเสริมและได้รับการอนุญาต', criterion: 0,
      apipath: '',
      // link: '',
      sync_api: '',
      database: '',
      target: 0, result: 0, percents: 0.00
    }
  ];


  const handleSync = async (path) => {
    setLoading(true);
    console.log(`${process.env.REACT_APP_BACKEND_URL}${path}`);

    // 1. Save scroll position ก่อน reload
    const currentScrollY = window.scrollY;
    localStorage.setItem("scrollPosition", currentScrollY);

    try {
      await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api${path}`);
    } catch (error) {
      console.error('Sync ล้มเหลว:', error);
      alert('Sync ล้มเหลว!');
    } finally {
      window.location.reload();

      // (จะไม่ทำงานหลัง reload แล้ว) แต่ยังดีที่มีไว้กรณีไม่ reload
      setTimeout(() => {
        setLoading(false);
      }, 500);
    }
  };


  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/get_summary_mou`);
        const raw = res.data; // array ที่มี kpi, target, result, percent

        // รวมข้อมูล
        const merged = KpiData.map((item) => {
          const found = raw.find((r) => r.kpi === item.database);
          return {
            ...item,
            target: found?.target ?? item.target,
            result: found?.result ?? item.result,
            percents: parseFloat(found?.percent ?? item.percents),
          };
        });

        setKpiData(merged);
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
    const savedScroll = localStorage.getItem("scrollPosition");
    if (savedScroll !== null) {
      setTimeout(() => {
        window.scrollTo(0, parseInt(savedScroll, 10));
        localStorage.removeItem("scrollPosition");
      }, 100); // รอ DOM พร้อม
    }
  }, []);

  const handleManualInsert = async () => {
    setLoading(true)
    try {
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/insert_summary`, {
        a_code: selectedKpiData.a_code,
        a_name: selectedKpiData.a_name,
        target: formData.target,
        result: formData.result,
        kpi: selectedKpiData.database
      });
    } catch (error) {
      console.error("error:", error);
    } finally {
      window.location.reload();
      setTimeout(() => {
        setLoading(false);
      }, 500);
    }
  };
  return (
    <Container fluid className='mb-5'>
      {loading && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0,0,0,0.3)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999,
          }}
        >
          <Spinner animation="border" role="status" size="lg" variant="light">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      )}

      <Row>
        <h2 className="text-start my-3" style={{ fontWeight: '700', color: '#2c3e50' }}>
          ตัวชี้วัดกระทรวง
        </h2>
      </Row>

      {/* ... โค้ด Card, Table ตามที่เขียนไว้ ... */}
      <Row className="g-4">
        <Col md={3}>
          <Card className="border-0 shadow-sm rounded-4 p-3" style={{ backgroundColor: '#f8f9fa' }}>
            <Card.Body className="text-center">
              <FaList size={28} color="#3498db" />
              <h5 className="mt-3 mb-1" style={{ fontWeight: '600' }}>ทั้งหมด</h5>
              <p className="text-muted mb-3">รวมทั้งหมด 129 ตัวชี้วัด</p>
            </Card.Body>
          </Card>
        </Col>

        {/* การ์ด: ยังไม่ผ่าน */}
        <Col md={3}>
          <Card className="border-0 shadow-sm rounded-4 p-3" style={{ backgroundColor: '#f8f9fa' }}>
            <Card.Body className="text-center">
              <FaTimesCircle size={28} color="#e74c3c" />
              <h5 className="mt-3 mb-1" style={{ fontWeight: '600' }}>ยังไม่ผ่าน</h5>
              <p className="text-muted mb-3">47 ตัวชี้วัดยังไม่ผ่านเกณฑ์</p>
            </Card.Body>
          </Card>
        </Col>

        {/* การ์ด: ผ่านแล้ว */}
        <Col md={3}>
          <Card className="border-0 shadow-sm rounded-4 p-3" style={{ backgroundColor: '#f8f9fa' }}>
            <Card.Body className="text-center">
              <FaCheckCircle size={28} color="#2ecc71" />
              <h5 className="mt-3 mb-1" style={{ fontWeight: '600' }}>ผ่านแล้ว</h5>
              <p className="text-muted mb-3">82 ตัวชี้วัดผ่านแล้ว</p>
            </Card.Body>
          </Card>
        </Col>

        {/* การ์ด: ร้อยละ */}
        <Col md={3}>
          <Card className="border-0 shadow-sm rounded-4 p-3" style={{ backgroundColor: '#f8f9fa' }}>
            <Card.Body className="text-center">
              <FaPercentage size={28} color="#f1c40f" />
              <h5 className="mt-3 mb-1" style={{ fontWeight: '600' }}>ร้อยละ</h5>
              <p className="text-muted mb-3">ร้อยละความสำเร็จ 63.6%</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className='mt-5'>
        <Table striped bordered hover>
          <thead className="table-primary text-center">
            <tr>
              <th>ลำดับ</th>
              <th>ตัวชี้วัด</th>
              <th>เกณฑ์</th>
              <th>เป้าหมาย</th>
              <th>ผลงาน</th>
              <th>ร้อยละ</th>
              <th>อ้างอิง</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {kpiData.map((data, index) =>
              <tr key={index}>
                <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>{data.index}</td>
                {data.notDisplay ? (
                  <>
                    <td style={{ textAlign: "start", verticalAlign: 'middle' }}>
                      {data.kpi}
                    </td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </>
                ) : (
                  <>
                    <td style={{ textAlign: "start", verticalAlign: 'middle' }}>
                      <Link
                        to={`/kpi/${data.page}/detail/${encodeURIComponent(data.kpi)}`}
                        state={{ apipath: data.apipath, criterion: data.criterion, notDisplay: data.notDisplay }}
                      >
                        {data.kpi}
                      </Link>
                    </td>
                    <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>≥{data.criterion}%</td>
                    <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>{data.target}</td>
                    <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>{data.result}</td>
                    <td style={{ fontWeight: "700", backgroundColor: data.percents > data.criterion ? "#d4edda" : "#f8d7da", textAlign: 'center', verticalAlign: 'middle' }}>
                      {data.percents}%
                    </td>
                    <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                      <a href={data.link} target="_blank" rel="noopener noreferrer">ที่มา</a>
                    </td>
                    {/* <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                                            <Button onClick={() => handleSync(data.sync_api)}>
                                                <IoReload />
                                            </Button>
                                        </td> */}
                    <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                      <button
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          padding: '4px'
                        }}
                        onClick={() => {
                          setSelectedKpiData(data);
                          setFormData({
                            target: '',
                            result: '',

                          });
                          handleShow();
                        }}
                      >
                        <BsThreeDotsVertical size={18} />
                      </button>
                    </td>


                  </>
                )}
              </tr>
            )}
          </tbody>
        </Table>
      </Row>

      <Modal
        show={showModal}
        onHide={handleClose}
        size="xl"
        centered
        style={{ maxHeight: "80vh", marginTop: "4.75rem" }}
      >
        <Modal.Header closeButton>
          <Modal.Title>{selectedKpiData?.kpi}</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: "80vh" }}>
          {selectedKpiData && (
            <div className="d-flex flex-column gap-3">
              {/* แถวสำหรับปุ่มซิงค์ */}
              <div

              >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <p className="mb-0 fw-bold">ซิงค์ข้อมูล:</p>
                  <Button
                    variant="primary"
                    style={{ marginLeft: "1rem" }}
                    onClick={() => handleSync(selectedKpiData.sync_api)}
                  >
                    ซิงค์ข้อมูล <IoReload className="ms-2" />
                  </Button>
                </div>

                <div className="row g-3" style={{ marginTop: "0.5rem" }}>
                  <div className="col-md-4">
                    <label className="form-label fw-bold">เป้าหมาย</label>
                    <Form.Control type="text" placeholder="กรอกเป้าหมาย..."
                      name='target' onChange={handleChange} value={formData.target} />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label fw-bold">ผลงาน</label>
                    <Form.Control type="text" placeholder="กรอกผลงาน..."
                      name='result' onChange={handleChange} value={formData.result} />
                  </div>
                </div>
              </div>

            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={handleOpenConFirmPopup}>
            บันทึก
          </Button>

          <Button variant="secondary" onClick={handleClose}>
            ปิด
          </Button>
        </Modal.Footer>
      </Modal>


      {/* confirm popup */}
      <Modal show={showConfirmPopup} onHide={handleCloseConFirmPopup} centered>
        <Modal.Header closeButton>
          <Modal.Title>ยืนยัน</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>บันทึกข้อมูลใช่หรือไม่</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseConFirmPopup}
            style={{ border: 'none', borderRadius: '10px' }}>
            ยกเลิก
          </Button>
          <Button variant="success" color="success" onClick={handleManualInsert}
            style={{ border: 'none', borderRadius: '10px' }}>
            ยืนยัน
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  )
}

export default MinistryIndicatorsPage