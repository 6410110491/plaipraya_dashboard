import { useEffect, useState } from 'react';
import { Button, Container, Form, Modal, Row, Spinner, Table, Card, Col, OverlayTrigger, Tooltip } from 'react-bootstrap'
import { IoReload } from 'react-icons/io5';
import { BsThreeDotsVertical } from "react-icons/bs";
import { Link } from 'react-router-dom';
import axios from 'axios'

import { FaList, FaTimesCircle, FaCheckCircle, FaPercentage } from 'react-icons/fa';
import Swal from 'sweetalert2';

function InspectorIndicatorsPage() {
  let hoverTimer;
  const [loading, setLoading] = useState(false);
  const [kpiData, setKpiData] = useState([]);
  const [selectedKpiData, setSelectedKpiData] = useState(null);
  const [hoverSignup, setHoverSignup] = useState(false);
  const [logs, setLogs] = useState(null);

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

  const unitList = [
    "รพสต.บ้านบางเหียน",
    "รพสต.บ้านทะเลหอย",
    "รพสต.บ้านช่องแบก",
    "รพสต.บ้านตัวอย่าง",
    "รพสต.บ้านเขาต่อ",
    "รพสต.บ้านนา",
    "รพสต.บ้านบางเหลียว",
    "รพสต.บ้านโคกแซะ",
    "รพ.ปลายพระยา",
    "รพสต.บ้านคลองปัญญา",
    "ศสช.รพ.ปลายพระยา",
  ];


  const KpiData = [
    {
      page: 'inspector', index: '1', kpi: 'ร้อยละของจังหวัดในเขตสุขภาพที่มีเครือข่ายราชทัณฑ์ปันสุข ทําความ ดี เพื่อชาติ ศาสน์ กษัตริย์(สะสม)', criterion: 0,
      apipath: '',
      link: '',
      sync_api: '',
      database: '',
      target: 0, result: 0, percents: 0.00
    },
    {
      page: 'inspector', index: '2', kpi: 'ผู้ต้องขังได้รับการคัดกรอง CXR', criterion: 0, notDisplay: true
    },
    {
      page: 'inspector', index: '', kpi: '2.1 ผู้ต้องขังแรกรับได้รับการคัดกรองวัณโรคด้วยการถ่ายภาพรังสีทรวงอก (CXR)', criterion: 0,
      apipath: '',
      link: '',
      sync_api: '',
      database: '',
      target: 0, result: 0, percents: 0.00
    },
    {
      page: 'inspector', index: '', kpi: '2.2 ผู้ต้องขังเก่าได้รับการคัดกรองวัณโรคด้วยการถ่ายภาพรังสีทรวงอก (CXR)', criterion: 0,
      apipath: '',
      link: '',
      sync_api: '',
      database: '',
      target: 0, result: 0, percents: 0.00
    },
    {
      page: 'inspector', index: '3', kpi: 'จำนวนการจัดตั้งหน่วยบริการปฐมภูมิและเครือข่ายหน่วยบริการปฐมภูมิ ตามพระราชบัญญัติระบบสุขภาพปฐมภูมิ พ.ศ. 2562', criterion: 0,
      apipath: '',
      link: '',
      sync_api: '',
      database: '',
      target: 0, result: 0, percents: 0.00
    },
    {
      page: 'inspector', index: '4', kpi: 'ร้อยละของหน่วยงานที่ผ่านเกณฑ์มาตรฐานความมั่นคงปลอดภัยไซเบอร์ระดับสูง', criterion: 0,
      apipath: '',
      link: '',
      sync_api: '',
      database: '',
      target: 0, result: 0, percents: 0.00
    },
    {
      page: 'inspector', index: '5', kpi: 'อัตราการฆ่าตัวตายสำเร็จ', notDisplay: true
    },
    {
      page: 'inspector', index: '', kpi: '5.1 อัตราการฆ่าตัวตายสำเร็จ', criterion: 0,
      apipath: '',
      link: '',
      sync_api: '',
      database: '',
      target: 0, result: 0, percents: 0.00
    },
    {
      page: 'inspector', index: '', kpi: '5.2 ร้อยละของผู้พยายามฆ่าตัวตายเข้าถึงบริการที่มีประสิทธิภาพ', criterion: 0,
      apipath: '',
      link: '',
      sync_api: '',
      database: '',
      target: 0, result: 0, percents: 0.00
    },
    {
      page: 'inspector', index: '6', kpi: 'ร้อยละของผู้ป่วยยาเสพติดเข้าสู่กระบวนการบำบัดรักษา ได้รับการดูแลอย่างมีคุณภาพต่อเนื่องจนถึงการติดตาม', criterion: 0,
      apipath: '',
      link: '',
      sync_api: '',
      database: '',
      target: 0, result: 0, percents: 0.00
    },
    {
      page: 'inspector', index: '7', kpi: 'อัตราส่วนการตายมารดาไทยต่อการเกิดมีชีพแสนคน', criterion: 0,
      apipath: '',
      link: '',
      sync_api: '',
      database: '',
      target: 0, result: 0, percents: 0.00
    },
    {
      page: 'inspector', index: '8', kpi: 'เด็กปฐมวัยมีพัฒนาการสมวัย', notDisplay: true
    },
    {
      page: 'inspector', index: '', kpi: '8.1 ร้อยละของเด็กอายุ 0 - 5 ปีมีพัฒนาการสมวัย', criterion: 0,
      apipath: '',
      link: '',
      sync_api: '',
      database: '',
      target: 0, result: 0, percents: 0.00
    },
    {
      page: 'inspector', index: '', kpi: '8.2 ร้อยละของเด็กปฐมวัยที่มีพัฒนาการล่าช้าเข้าถึงบริการพัฒนาการและสุขภาพจิตที่ได้มาตรฐาน', criterion: 0,
      apipath: '',
      link: '',
      sync_api: '',
      database: '',
      target: 0, result: 0, percents: 0.00
    },
    {
      page: 'inspector', index: '9', kpi: 'อัตราความรอบรู้ด้านสุขภาพ', notDisplay: true
    },
    {
      page: 'inspector', index: '', kpi: '9.1 อัตราความรอบรู้ด้านสุขภาพของประชาชนไทย อายุ 15 ปี ขึ้นไป', criterion: 0,
      apipath: '',
      link: '',
      sync_api: '',
      database: '',
      target: 0, result: 0, percents: 0.00
    },
    {
      page: 'inspector', index: '', kpi: '9.2 จํานวนประชาชนในชุมชนได้รับการส่งเสริมความรอบรู้ด้านสุขภาพป้องกันโรค', criterion: 0,
      apipath: '',
      link: '',
      sync_api: '',
      database: '',
      target: 0, result: 0, percents: 0.00
    },
    {
      page: 'inspector', index: '10', kpi: 'ระดับความรอบรู้สุขภาพของประชาชนเรื่องโรคอุบัติใหม่และอุบัติซ้ำเพิ่มขึ้นไม่น้อยกว่าร้อยละ 5', notDisplay: true
    },
    {
      page: 'inspector', index: '', kpi: '11.1 จำนวนการจัดตั้ง/การดำเนินงาน NCDs remission clinic', criterion: 0,
      apipath: '',
      link: '',
      sync_api: '',
      database: '',
      target: 0, result: 0, percents: 0.00
    },
    {
      page: 'inspector', index: '', kpi: '11.2 ร้อยละของผู้ป่วยเบาหวานชนิดที่ 2 ที่เข้าสู่โรคเบาหวานระยะสงบ (DM remission)', criterion: 0,
      apipath: '',
      link: '',
      sync_api: '',
      database: '',
      target: 0, result: 0, percents: 0.00
    },
    {
      page: 'inspector', index: '', kpi: '11.3 ร้อยละของผู้ป่วยเบาหวานชนิดที่ 2 ทั้งหมดในพื้นที่', criterion: 0,
      apipath: '',
      link: '',
      sync_api: '',
      database: '',
      target: 0, result: 0, percents: 0.00
    },
    {
      page: 'inspector', index: '', kpi: '11.4 ร้อยละการตรวจติดตามยืนยันวินิจฉัยกลุ่มสงสัยป่วยโรคเบาหวาน', criterion: 0,
      apipath: '',
      link: '',
      sync_api: '',
      database: '',
      target: 0, result: 0, percents: 0.00
    },
    {
      page: 'inspector', index: '', kpi: '11.5 ร้อยละการตรวจติดตามยืนยันวินิจฉัยกลุ่มสงสัยป่วยโรคความดันโลหิตสูง', criterion: 0,
      apipath: '',
      link: '',
      sync_api: '',
      database: '',
      target: 0, result: 0, percents: 0.00
    },
    {
      page: 'inspector', index: '12', kpi: 'อัตราการเสียชีวิตและบาดเจ็บจากอุบัติเหตุทางถนนในกลุ่มเด็กและเยาวชน', criterion: 0,
      apipath: '',
      link: '',
      sync_api: '',
      database: '',
      target: 0, result: 0, percents: 0.00
    },
    {
      page: 'inspector', index: '13', kpi: 'โรคหลอดเลือดสมอง (Stroke)', notDisplay: true
    },
    {
      page: 'inspector', index: '', kpi: '13.1 อัตราตายของผู้ป่วยโรคหลอดเลือดสมอง', criterion: 0,
      apipath: '',
      link: '',
      sync_api: '',
      database: '',
      target: 0, result: 0, percents: 0.00
    },
    {
      page: 'inspector', index: '', kpi: '13.2 ร้อยละผู้ป่วยโรคหลอดเลือดสมองที่มีอาการไม่เกิน 72 ชั่วโมง ได้รับการรักษาใน Stroke Unit', criterion: 0,
      apipath: '',
      link: '',
      sync_api: '',
      database: '',
      target: 0, result: 0, percents: 0.00
    },
    {
      page: 'inspector', index: '14', kpi: 'อัตราความสำเร็จการรักษาผู้ป่วยวัณโรคปอดรายใหม่', notDisplay: true
    },
    {
      page: 'inspector', index: '', kpi: '14.1 อัตราความสำเร็จการรักษาผู้ป่วยวัณโรคปอดรายใหม่', criterion: 0,
      apipath: '',
      link: '',
      sync_api: '',
      database: '',
      target: 0, result: 0, percents: 0.00
    },
    {
      page: 'inspector', index: '', kpi: '14.2 อัตราความครอบคลุมการขึ้นทะเบียนรักษาของผู้ป่วยวัณโรครายใหม่และกลับเป็นซ้ำ', criterion: 0,
      apipath: '',
      link: '',
      sync_api: '',
      database: '',
      target: 0, result: 0, percents: 0.00
    },
    {
      page: 'inspector', index: '15', kpi: 'อัตราตายทารกแรกเกิด', criterion: 0, notDisplay: true
    },
    {
      page: 'inspector', index: '', kpi: '15.1 อัตราตายทารกแรกเกิดอายุน้อยกว่าหรือเท่ากับ 28 วัน', criterion: 0,
      apipath: '',
      link: '',
      sync_api: '',
      database: '',
      target: 0, result: 0, percents: 0.00
    },
    {
      page: 'inspector', index: '', kpi: '15.2 จํานวนเตียง NICU ในเขตสุขภาพ', criterion: 0,
      apipath: '',
      link: '',
      sync_api: '',
      database: '',
      target: 0, result: 0, percents: 0.00
    },
    {
      page: 'inspector', index: '16', kpi: 'อัตราตายผู้ป่วยติดเชื้อในกระแสเลือดแบบรุนแรงชนิด community-acquired', criterion: 0,
      apipath: '',
      link: '',
      sync_api: '',
      database: '',
      target: 0, result: 0, percents: 0.00
    },
    {
      page: 'inspector', index: '17', kpi: 'กล้ามเนื้อหัวใจตายเฉียบพลัน (STEMI)', criterion: 0, notDisplay: true
    },
    {
      page: 'inspector', index: '', kpi: '17.1 อัตราตายของผู้ป่วยโรคกล้ามเนื้อหัวใจตายเฉียบพลันชนิด STEMI', criterion: 0,
      apipath: '',
      link: '',
      sync_api: '',
      database: '',
      target: 0, result: 0, percents: 0.00
    },
    {
      page: 'inspector', index: '', kpi: '17.2 ร้อยละผู้ป่วย STEMI ได้รับยาละลายลิ่มเลือดตามมาตรฐานเวลา', criterion: 0,
      apipath: '',
      link: '',
      sync_api: '',
      database: '',
      target: 0, result: 0, percents: 0.00
    },
    {
      page: 'inspector', index: '', kpi: '17.3 ร้อยละผู้ป่วย STEMI ได้รับ Primary PCI ตามมาตรฐานเวลา', criterion: 0,
      apipath: '',
      link: '',
      sync_api: '',
      database: '',
      target: 0, result: 0, percents: 0.00
    },
    {
      page: 'inspector', index: '', kpi: '17.4 อัตราตาย STEMI ภายใน 30 วัน', criterion: 0,
      apipath: '',
      link: '',
      sync_api: '',
      database: '',
      target: 0, result: 0, percents: 0.00
    },
    {
      page: 'inspector', index: '18', kpi: 'ร้อยละผู้ป่วยไตเรื้อรัง stage 5 รายใหม่ ที่ลดลง', criterion: 0,
      apipath: '',
      link: '',
      sync_api: '',
      database: '',
      target: 0, result: 0, percents: 0.00
    },
    {
      page: 'inspector', index: '19', kpi: 'อัตราส่วนของผู้บริจาคอวัยวะสมองตายที่ได้รับการผ่าตัด', criterion: 0,
      apipath: '',
      link: '',
      sync_api: '',
      database: '',
      target: 0, result: 0, percents: 0.00
    },
    {
      page: 'inspector', index: '20', kpi: 'การคัดกรองมะเร็ง', criterion: 0, notDisplay: true
    },
    {
      page: 'inspector', index: '', kpi: '20.1 ร้อยละผู้ที่ได้รับการคัดกรองมะเร็งปากมดลูก', criterion: 0,
      apipath: '',
      link: '',
      sync_api: '',
      database: '',
      target: 0, result: 0, percents: 0.00
    },
    {
      page: 'inspector', index: '', kpi: '20.2 ร้อยละผู้ที่มีผลผิดปกติ ได้รับการส่องกล้อง Colposcopy', criterion: 0,
      apipath: '',
      link: '',
      sync_api: '',
      database: '',
      target: 0, result: 0, percents: 0.00
    },
    {
      page: 'inspector', index: '', kpi: '20.3 ร้อยละการคัดกรองมะเร็งลำไส้ใหญ่และไส้ตรง', criterion: 0,
      apipath: '',
      link: '',
      sync_api: '',
      database: '',
      target: 0, result: 0, percents: 0.00
    },
    {
      page: 'inspector', index: '', kpi: '20.4 ร้อยละได้รับส่องกล้อง Colonoscopy หลังผลผิดปกติ', criterion: 0,
      apipath: '',
      link: '',
      sync_api: '',
      database: '',
      target: 0, result: 0, percents: 0.00
    },
    {
      page: 'inspector', index: '21', kpi: 'ไวรัสตับอักเสบ บี และ ซี', criterion: 0, notDisplay: true
    },
    {
      page: 'inspector', index: '', kpi: '21.1 ผู้ติดเชื้อไวรัสตับอักเสบ บี ได้รับการรักษา', criterion: 0,
      apipath: '',
      link: '',
      sync_api: '',
      database: '',
      target: 0, result: 0, percents: 0.00
    },
    {
      page: 'inspector', index: '', kpi: '21.2 ผู้ติดเชื้อไวรัสตับอักเสบ ซี ได้รับการรักษา', criterion: 0,
      apipath: '',
      link: '',
      sync_api: '',
      database: '',
      target: 0, result: 0, percents: 0.00
    },
    {
      page: 'inspector', index: '22', kpi: 'อสม.มีศักยภาพในการคัดกรองโรค NCDs', criterion: 0,
      apipath: '',
      link: '',
      sync_api: '',
      database: '',
      target: 0, result: 0, percents: 0.00
    },
    {
      page: 'inspector', index: '23', kpi: 'มีบริการสถานชีวาภิบาลตามแนวทาง/มาตรฐาน', criterion: 0,
      apipath: '',
      link: '',
      sync_api: '',
      database: '',
      target: 0, result: 0, percents: 0.00
    },
    {
      page: 'inspector', index: '24', kpi: 'ร้อยละการจัดทำ Advance Care Plan ในผู้ป่วยประคับประคอง', criterion: 0,
      apipath: '',
      link: '',
      sync_api: '',
      database: '',
      target: 0, result: 0, percents: 0.00
    },
    {
      page: 'inspector', index: '25', kpi: 'ร้อยละโรงพยาบาลที่มี Home ward for active dying patient', criterion: 0,
      apipath: '',
      link: '',
      sync_api: '',
      database: '',
      target: 0, result: 0, percents: 0.00
    },
    {
      page: 'inspector', index: '26', kpi: 'ผู้สูงอายุที่มีความเสี่ยงความจำ และการเคลื่อนไหวได้รับการดูแล', criterion: 0, notDisplay: true
    },
    {
      page: 'inspector', index: '', kpi: '26.1 ร้อยละผู้สูงอายุเสี่ยงความจำ ได้รับการดูแล', criterion: 0,
      apipath: '',
      link: '',
      sync_api: '',
      database: '',
      target: 0, result: 0, percents: 0.00
    },
    {
      page: 'inspector', index: '', kpi: '26.2 ร้อยละผู้สูงอายุเสี่ยงด้านการเคลื่อนไหว ได้รับการดูแล', criterion: 0,
      apipath: '',
      link: '',
      sync_api: '',
      database: '',
      target: 0, result: 0, percents: 0.00
    },
    {
      page: 'inspector', index: '27', kpi: 'Caregiver รายใหม่ผ่านการอบรม', criterion: 0,
      apipath: '',
      link: '',
      sync_api: '',
      database: '',
      target: 0, result: 0, percents: 0.00
    },
    {
      page: 'inspector', index: '28', kpi: 'ร้อยละวัคซีน MMR2 ในเด็กอายุต่ำกว่า 3 ปี', criterion: 0,
      apipath: '',
      link: '',
      sync_api: '',
      database: '',
      target: 0, result: 0, percents: 0.00
    },
    {
      page: 'inspector', index: '29', kpi: 'อัตราส่วนสถานประกอบการด้านการท่องเที่ยวเชิงสุขภาพ', criterion: 0,
      apipath: '',
      link: '',
      sync_api: '',
      database: '',
      target: 0, result: 0, percents: 0.00
    },
    {
      page: 'inspector', index: '30', kpi: 'ร้อยละผลิตภัณฑ์สุขภาพที่ได้รับการส่งเสริมและได้รับการอนุญาต', criterion: 0,
      apipath: '',
      link: '',
      sync_api: '',
      database: '',
      target: 0, result: 0, percents: 0.00
    },
    {
      page: 'inspector', index: '31', kpi: 'รายรับจากการให้บริการการแพทย์แผนไทยและทางเลือกต่อจำนวนครั้ง', criterion: 0,
      apipath: '',
      link: '',
      sync_api: '',
      database: '',
      target: 0, result: 0, percents: 0.00
    },
    {
      page: 'inspector', index: '32', kpi: 'ร้อยละของโรงพยาบาลที่พัฒนาอนามัยสิ่งแวดล้อมได้ตามเกณฑ์ GREEN & CLEAN Hospital Challenge (ระดับมาตรฐานขึ้นไป และระดับท้าทาย)', notDisplay: true
    },
    {
      page: 'inspector', index: '', kpi: '32.1 ร้อยละของโรงพยาบาลที่ผ่านเกณฑ์ GREEN & CLEAN (ระดับมาตรฐาน)', criterion: 0,
      apipath: '',
      link: '',
      sync_api: '',
      database: '',
      target: 0, result: 0, percents: 0.00
    },
    {
      page: 'inspector', index: '', kpi: '32.2 ร้อยละของโรงพยาบาลที่ผ่านเกณฑ์ GREEN & CLEAN (ระดับท้าทาย)', criterion: 0,
      apipath: '',
      link: '',
      sync_api: '',
      database: '',
      target: 0, result: 0, percents: 0.00
    },
    {
      page: 'inspector', index: '33', kpi: 'การบริหารจัดการตำแหน่งว่าง', criterion: 0,
      apipath: '',
      link: '',
      sync_api: '',
      database: '',
      target: 0, result: 0, percents: 0.00
    },
    {
      page: 'inspector', index: '34', kpi: 'ร้อยละของโรงพยาบาลในเขตสุขภาพผ่านเกณฑ์พัฒนา โรงพยาบาลที่มีการตรวจทางห้องปฏิบัติการทางการแพทย์อย่างสมเหตุผล (RLU hospital) ตามที่กำหนด', notDisplay: true
    },
    {
      page: 'inspector', index: '', kpi: '34.1 ร้อยละของโรงพยาบาลผ่านเกณฑ์ RLU hospital', criterion: 0,
      apipath: '',
      link: '',
      sync_api: '',
      database: '',
      target: 0, result: 0, percents: 0.00
    },
    {
      page: 'inspector', index: '', kpi: '34.2 ร้อยละผู้ป่วยเบาหวานตรวจ HbA1c ซ้ำภายใน 90 วัน', criterion: 0,
      apipath: '',
      link: '',
      sync_api: '',
      database: '',
      target: 0, result: 0, percents: 0.00
    },
    {
      page: 'inspector', index: '', kpi: '34.3 ร้อยละผู้ป่วยเบาหวานตรวจ HbA1c อย่างน้อยปีละ 1 ครั้ง', criterion: 0,
      apipath: '',
      link: '',
      sync_api: '',
      database: '',
      target: 0, result: 0, percents: 0.00
    },
    {
      page: 'inspector', index: '35', kpi: 'ร้อยละของหน่วยบริการที่ประสบภาวะวิกฤตทางการเงิน', criterion: 0,
      apipath: '',
      link: '',
      sync_api: '',
      database: '',
      target: 0, result: 0, percents: 0.00
    },
    {
      page: 'inspector', index: '', kpi: '35.1 ร้อยละของหน่วยบริการที่ประสบภาวะวิกฤตทางการเงิน (ระดับ 7)', criterion: 0,
      apipath: '',
      link: '',
      sync_api: '',
      database: '',
      target: 0, result: 0, percents: 0.00
    },
    {
      page: 'inspector', index: '', kpi: '35.2 ร้อยละของหน่วยบริการที่ประสบภาวะวิกฤตทางการเงิน (ระดับ 6)', criterion: 0,
      apipath: '',
      link: '',
      sync_api: '',
      database: '',
      target: 0, result: 0, percents: 0.00
    },
    {
      page: 'inspector', index: '36', kpi: 'หน่วยงานผ่านเกณฑ์ตรวจสอบรายงานการเงิน (หมวดสินทรัพย์ถาวร และลูกหนี้ค่ารักษาพยาบาล)', criterion: 0,
      apipath: '',
      link: '',
      sync_api: '',
      database: '',
      target: 0, result: 0, percents: 0.00
    }
  ];

  const totalIndicators = KpiData.length;

  const passedIndicators = kpiData.filter(
    item => typeof item.percents === 'number' && item.percents !== 0 && item.percents >= item.criterion
  ).length;


  const notPassedIndicators = totalIndicators - passedIndicators;

  const successPercent = ((passedIndicators / totalIndicators) * 100).toFixed(1);

  const handleSync = async (path) => {
    setLoading(true);

    const currentScrollY = window.scrollY;
    localStorage.setItem("scrollPosition", currentScrollY);

    try {
      await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api${path}`);
      setLoading(false);
      await Swal.fire({
        icon: 'success',
        title: 'Sync สำเร็จ',
        text: 'ข้อมูลถูกซิงค์เรียบร้อยแล้ว',
        confirmButtonText: 'ตกลง',
      });
    } catch (error) {
      console.error('Sync ล้มเหลว:', error);
      setLoading(false);
      await Swal.fire({
        icon: 'error',
        title: 'Sync ล้มเหลว',
        text: 'ไม่สามารถซิงค์ข้อมูลได้ กรุณาลองใหม่',
        confirmButtonText: 'ตกลง',
      });
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 500);
      window.location.reload();
    }
  };


  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/get_summary_mou`);
        const raw = res.data;

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
      }, 100);
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

  const handleHover = (sync_api) => {
    clearTimeout(hoverTimer);

    hoverTimer = setTimeout(async () => {
      try {
        const cleanSyncApi = sync_api.replace(/^\//, "").replace(/insertdata$/, "");
        const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/logs`, {
          params: { sync_api: cleanSyncApi }
        });
        setLogs(res.data);
      } catch (err) {
        console.error(err);
      }
    }, 900);
  };

  const handleLeave = () => {
    setLogs(null);
  };

  return (
    <Container fluid className='pb-5' style={{ backgroundColor: '#f8f9fa', padding: '25px' }}>
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
          ตัวชี้วัดตรวจราชการ
        </h2>
      </Row>

      {/* ... โค้ด Card, Table ตามที่เขียนไว้ ... */}
      <Row className="g-4">
        {/* รวมทั้งหมด */}
        <Col lg={3} md={6} sm={6} xs={12}>
          <Card
            style={{
              background: `linear-gradient(135deg, #4286f4, #373b44)`,
              borderRadius: "15px",
              color: "white",
              padding: "20px",
              position: "relative",
              overflow: "hidden",
              minWidth: "220px",
              border: "none",
            }}
          >
            <div
              style={{
                position: "absolute",
                width: "150px",
                height: "150px",
                borderRadius: "50%",
                background: "rgba(255, 255, 255, 0.1)",
                top: "-40px",
                right: "-40px",
              }}
            />
            <div
              style={{
                position: "absolute",
                width: "100px",
                height: "100px",
                borderRadius: "50%",
                background: "rgba(255, 255, 255, 0.05)",
                top: "20px",
                right: "20px",
              }}
            />
            <Card.Body className="text-center" style={{ position: "relative", zIndex: 1 }}>
              <FaList size={28} color="#fff" />
              <h6 className="mt-3 mb-1">รวมทั้งหมด</h6>
              <h5 className="mb-3 mt-2" style={{ fontWeight: "700", color: "#fff" }}>
                {totalIndicators} ตัวชี้วัด
              </h5>
            </Card.Body>
          </Card>
        </Col>

        {/* ผ่านแล้ว */}
        <Col lg={3} md={6} sm={6} xs={12}>
          <Card
            style={{
              background: `linear-gradient(135deg, #2ecc71, #27ae60)`,
              borderRadius: "15px",
              color: "white",
              padding: "20px",
              position: "relative",
              overflow: "hidden",
              minWidth: "220px",
              border: "none",
            }}
          >
            <div
              style={{
                position: "absolute",
                width: "150px",
                height: "150px",
                borderRadius: "50%",
                background: "rgba(255, 255, 255, 0.1)",
                top: "-40px",
                right: "-40px",
              }}
            />
            <div
              style={{
                position: "absolute",
                width: "100px",
                height: "100px",
                borderRadius: "50%",
                background: "rgba(255, 255, 255, 0.05)",
                top: "20px",
                right: "20px",
              }}
            />
            <Card.Body className="text-center" style={{ position: "relative", zIndex: 1 }}>
              <FaCheckCircle size={28} color="#fff" />
              <h6 className="mt-3 mb-1">ผ่านแล้ว</h6>
              <h5 className="mb-3 mt-2" style={{ fontWeight: "700", color: "#fff" }}>
                {passedIndicators} ตัวชี้วัด
              </h5>
            </Card.Body>
          </Card>
        </Col>

        {/* ยังไม่ผ่าน */}
        <Col lg={3} md={6} sm={6} xs={12}>
          <Card
            style={{
              background: `linear-gradient(135deg, #e74c3c, #c0392b)`,
              borderRadius: "15px",
              color: "white",
              padding: "20px",
              position: "relative",
              overflow: "hidden",
              minWidth: "220px",
              border: "none",
            }}
          >
            <div
              style={{
                position: "absolute",
                width: "150px",
                height: "150px",
                borderRadius: "50%",
                background: "rgba(255, 255, 255, 0.1)",
                top: "-40px",
                right: "-40px",
              }}
            />
            <div
              style={{
                position: "absolute",
                width: "100px",
                height: "100px",
                borderRadius: "50%",
                background: "rgba(255, 255, 255, 0.05)",
                top: "20px",
                right: "20px",
              }}
            />
            <Card.Body className="text-center" style={{ position: "relative", zIndex: 1 }}>
              <FaTimesCircle size={28} color="#fff" />
              <h6 className="mt-3 mb-1">ยังไม่ผ่าน</h6>
              <h5 className="mb-3 mt-2" style={{ fontWeight: "700", color: "#fff" }}>
                {notPassedIndicators} ตัวชี้วัด
              </h5>
            </Card.Body>
          </Card>
        </Col>

        {/* ร้อยละ */}
        <Col lg={3} md={6} sm={6} >
          <Card
            style={{
              background: `linear-gradient(135deg, #f1c40f, #f39c12)`,
              borderRadius: "15px",
              color: "white",
              padding: "20px",
              position: "relative",
              overflow: "hidden",
              minWidth: "220px",
              border: "none",
            }}
          >
            <div
              style={{
                position: "absolute",
                width: "150px",
                height: "150px",
                borderRadius: "50%",
                background: "rgba(255, 255, 255, 0.1)",
                top: "-40px",
                right: "-40px",
              }}
            />
            <div
              style={{
                position: "absolute",
                width: "100px",
                height: "100px",
                borderRadius: "50%",
                background: "rgba(255, 255, 255, 0.05)",
                top: "20px",
                right: "20px",
              }}
            />
            <Card.Body className="text-center" style={{ position: "relative", zIndex: 1 }}>
              <FaPercentage size={28} color="#fff" />
              <h6 className="mt-3 mb-1">ร้อยละ</h6>
              <h5 className="mb-3 mt-2" style={{ fontWeight: "700", color: "#fff" }}>
                {successPercent}%
              </h5>
            </Card.Body>
          </Card>
        </Col>
      </Row>


      <Row className='mt-5'>
        <Table striped bordered hover responsive>
          <thead className="table-primary text-center">
            <tr>
              <th style={{ backgroundColor: '#757f8f', color: '#fff', textAlign: 'center' }}>
                ลำดับ
              </th>
              <th style={{ backgroundColor: '#757f8f', color: '#fff', textAlign: 'center' }}>
                ตัวชี้วัด
              </th>
              <th style={{ backgroundColor: '#757f8f', color: '#fff', textAlign: 'center' }}>
                เกณฑ์
              </th>
              <th style={{ backgroundColor: '#757f8f', color: '#fff', textAlign: 'center' }}>
                เป้าหมาย
              </th>
              <th style={{ backgroundColor: '#757f8f', color: '#fff', textAlign: 'center' }}>
                ผลงาน
              </th>
              <th style={{ backgroundColor: '#757f8f', color: '#fff', textAlign: 'center' }}>
                ร้อยละ
              </th>
              <th style={{ backgroundColor: '#757f8f', color: '#fff', textAlign: 'center' }}>
                อ้างอิง
              </th>
              <th style={{ backgroundColor: '#757f8f', color: '#fff', textAlign: 'center' }}></th>
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
                    <OverlayTrigger
                      placement="top"
                      delay={{ show: 1000, hide: 500 }}
                      overlay={
                        <Tooltip id="button-tooltip">
                          {logs
                            ? `วันเวลา: ${new Date(logs.timestamp).toLocaleString("th-TH", { timeZone: "Asia/Bangkok" })} 
                                                             ผู้ซิงค์: ${logs.message.replace(/\bcalled\b/g, "")}`
                            : "ไม่มีข้อมูล"}
                        </Tooltip>
                      }
                    >

                      <td style={{ textAlign: "start", verticalAlign: 'middle', cursor: 'pointer' }}
                        onMouseEnter={() => handleHover(data.sync_api, index)}
                        onMouseLeave={handleLeave}
                      >
                        <Link
                          to={`/kpi/${data.page}/detail/${encodeURIComponent(data.kpi)}?apipath=${encodeURIComponent(data.apipath)}&criterion=${data.criterion}&notDisplay=${data.notDisplay}&a_code=${data.a_code}`}
                          target="_blank"
                        >
                          {data.kpi}
                        </Link>
                      </td>
                    </OverlayTrigger>

                    <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>≥{data.criterion}%</td>
                    <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                      {Number(data.target).toLocaleString()}
                    </td>
                    <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                      {Number(data.result).toLocaleString()}
                    </td>

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
        <Modal.Header
          closeButton
          style={{
            position: "sticky",
            top: 0,
            zIndex: 999,
            backgroundColor: "#fff",
          }}
        >
          <Modal.Title>{selectedKpiData?.kpi}</Modal.Title>
        </Modal.Header>

        <Modal.Body style={{ maxHeight: "70vh", overflowY: "auto" }}>
          {selectedKpiData && (
            <div className="d-flex flex-column gap-3">
              {/* ปุ่มซิงค์ */}
              {selectedKpiData?.sync_api && (
                <div className="d-flex align-items-center flex-wrap gap-2">
                  <p className="mb-0 fw-bold">ซิงค์ข้อมูล:</p>
                  <Button
                    variant="outline-primary"
                    onClick={() => handleSync(selectedKpiData.sync_api)}
                    style={{
                      backgroundColor: hoverSignup ? "#2A2F5B" : "transparent",
                      color: hoverSignup ? "#ffffff" : "#2A2F5B",
                      border: '1px solid #2A2F5B',
                      transition: 'all 0.3s'
                    }}
                    onMouseEnter={() => setHoverSignup(true)}
                    onMouseLeave={() => setHoverSignup(false)}>
                    ซิงค์ข้อมูล <IoReload className="ms-2" />
                  </Button>
                </div>
              )}

              {/* ฟอร์ม Manual */}
              {selectedKpiData?.manual === true && (
                <div className="mt-3">
                  {unitList.map((unit, idx) => (
                    <Row key={idx} className="align-items-center mb-3">
                      {/* ชื่อหน่วยงาน */}
                      <Col xs={12} md={3} className="mb-2 mb-md-0">
                        <p className="mb-0">{unit}</p>
                      </Col>

                      {/* เป้าหมาย */}
                      <Col xs={12} sm={6} md={4} className="mb-2 mb-sm-0">
                        <Form.Control
                          type="text"
                          placeholder="กรอกเป้าหมาย..."
                          name={`target${idx + 1}`}
                          onChange={handleChange}
                          value={formData[`target${idx + 1}`] ?? ""}
                        />
                      </Col>

                      {/* ผลงาน */}
                      <Col xs={12} sm={6} md={4}>
                        <Form.Control
                          type="text"
                          placeholder="กรอกผลงาน..."
                          name={`result${idx + 1}`}
                          onChange={handleChange}
                          value={formData[`result${idx + 1}`] ?? ""}
                        />
                      </Col>
                    </Row>
                  ))}
                </div>
              )}
            </div>
          )}
        </Modal.Body>

        <Modal.Footer>
          {selectedKpiData?.manual === true && (
            <Button variant="success" onClick={handleOpenConFirmPopup}>
              บันทึก
            </Button>
          )}
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

export default InspectorIndicatorsPage