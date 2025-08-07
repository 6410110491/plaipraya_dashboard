import { useEffect, useState } from 'react';
import { Button, Card, Col, Container, Form, Modal, Row, Spinner, Table } from 'react-bootstrap'
import { IoReload } from 'react-icons/io5';
import { BsThreeDotsVertical } from "react-icons/bs";
import { Link } from 'react-router-dom';
import axios from 'axios'

import { FaList, FaTimesCircle, FaCheckCircle, FaPercentage } from 'react-icons/fa';

function MouIndicatorsPage() {
    const [loading, setLoading] = useState(false);
    const [kpiData, setKpiData] = useState([]);
    const [selectedKpiData, setSelectedKpiData] = useState(null);

    const [formData, setFormData] = useState({
        target1: '', result1: '',
        target2: '', result2: '',
        target3: '', result3: '',
        target4: '', result4: '',
        target5: '', result5: '',
        target6: '', result6: '',
        target7: '', result7: '',
        target8: '', result8: '',
        target9: '', result9: '',
        target10: '', result10: '',
        target11: '', result11: '',

    })

    const hospitals = [
        { name: "โรงพยาบาลส่งเสริมสุขภาพตำบลบ้านบางเหียน", hospcode: "09034", key: "1" },
        { name: "โรงพยาบาลส่งเสริมสุขภาพตำบลบ้านทะเลหอย", hospcode: "09035", key: "2" },
        { name: "โรงพยาบาลส่งเสริมสุขภาพตำบลบ้านช่องแบก", hospcode: "09036", key: "3" },
        { name: "โรงพยาบาลส่งเสริมสุขภาพตำบลบ้านตัวอย่าง", hospcode: "09037", key: "4" },
        { name: "โรงพยาบาลส่งเสริมสุขภาพตำบลบ้านเขาต่อ", hospcode: "09038", key: "5" },
        { name: "โรงพยาบาลส่งเสริมสุขภาพตำบลบ้านนา", hospcode: "09039", key: "6" },
        { name: "โรงพยาบาลส่งเสริมสุขภาพตำบลบ้านบางเหลียว", hospcode: "09040", key: "7" },
        { name: "โรงพยาบาลส่งเสริมสุขภาพตำบลบ้านโคกแซะ", hospcode: "09041", key: "8" },
        { name: "โรงพยาบาลปลายพระยา", hospcode: "11344", key: "9" },
        { name: "โรงพยาบาลส่งเสริมสุขภาพตำบลบ้านคลองปัญญา", hospcode: "14218", key: "10" },
        { name: "ศูนย์สุขภาพชุมชนโรงพยาบาลปลายพระยา", hospcode: "99862", key: "11" },
    ];


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
            page: 'mou', index: '1', kpi: 'ร้อยละของเด็กอายุ 0-5 ปี พัฒนาการสมวัย', criterion: 87,
            apipath: '/s_childdev/data',
            link: 'https://hdc.moph.go.th/kbi/public/standard-report-detail/2238b7879f442749bd1804032119e824',
            sync_api: '/get_s_childdev',
            database: 's_childdev_specialpp',
            target: 0, result: 0, percents: 0.00, manual: false
        },
        {
            page: 'mou', index: '2', kpi: 'ร้อยละของหญิงตั้งครรภ์ได้รับบริการฝากครรภ์คุณภาพ', criterion: 50,
            apipath: '/s_anc_quality/data',
            link: 'https://hdc.moph.go.th/kbi/public/standard-report-detail/5087190fa0a3c28974fdde7fd1443d5e',
            sync_api: '/get_s_anc_quality',
            database: 's_anc_quality',
            target: 0, result: 0, percents: 0.00, manual: false
        },
        {
            page: 'mou', index: '3', kpi: 'ร้อยละของผู้มีภาวะพึ่งพิงได้รับการดูแลตาม Care Plan', criterion: 99,
            // link: 'https://ltc.anamai.moph.go.th/',
            // database: 's_anc_quality',
            target: 0, result: 0, percents: 0.00, manual: false
        },
        {
            page: 'mou', index: '4', kpi: 'ร้อยละการตรวจติดตามยืนยันวินิจฉัยกลุ่มสงสัยป่วยโรคเบาหวาน', criterion: 65,
            apipath: '/s_ncd_screen_repleate1/data',
            link: 'https://hdc.moph.go.th/center/public/standard-report-detail/e9e461e793e8258f47d46d6956f12832',
            sync_api: '/get_s_ncd_screen_repleate1',
            database: 's_ncd_screen_repleate1',
            target: 0, result: 0, percents: 0.00, manual: false
        },
        {
            page: 'mou', index: '5', kpi: 'ร้อยละการตรวจติดตามยืนยันวินิจฉัยกลุ่มสงสัยป่วยโรคความดันโลหิตสูง', criterion: 85,
            apipath: '/s_ht_screen_follow/data',
            link: 'https://hdc.moph.go.th/center/public/standard-report-detail/b57439ff27302ade8c38d1dd189644a4',
            sync_api: '/get_s_ht_screen_follow',
            database: 's_ht_screen_follow',
            target: 0, result: 0, percents: 0.00, manual: false
        },
        { page: 'mou', index: '6', kpi: 'ร้อยละความครอบคลุมของการได้รับวัคซีนในเด็กอายุ 0-5 ปี', notDisplay: true },
        {
            page: 'mou', index: '', kpi: '6.1 ทุกตัว', criterion: 90,
            apipath: '/s_epi_complete/data',
            link: 'https://hdc.moph.go.th/kbi/public/standard-report-detail/f033ab37c30201f73f142449d037028d',
            sync_api: '/get_s_epi_complete',
            database: 's_epi_complete',
            target: 0, result: 0, percents: 0.00, manual: false
        },
        {
            page: 'mou', index: '', kpi: '6.2 MMR', criterion: 95,
            apipath: '/s_epi1_3/data',
            link: 'https://hdc.moph.go.th/kbi/public/search?q=MMR',
            sync_api: '/get_s_epi1_3',
            database: 's_epi1_3',
            target: 0, result: 0, percents: 0.00, manual: false

        },
        {
            page: 'mou', index: '7', kpi: 'จำนวนการจัดตั้งหน่วยบริการปฐมภูมิและเครือข่ายหน่วยบริการปฐมภูมิตามพระราชบัญญัติระบบสุขภาพปฐมภูมิ พ.ศ.2562', criterion: 80,
            // database: 's_childdev',
            target: 0, result: 0, percents: 0.00, manual: false
        },
        {
            page: 'mou', index: '8', kpi: 'จำนวนครั้งบริการสุขภาพช่องปากต่อผู้ให้บริการทันตกรรม เป้าหมาย *9 บุคลากร', criterion: 0,
            apipath: '/s_dental_70/data',
            link: 'https://hdc.moph.go.th/kbi/public/standard-report-detail/43b53d1950da4739e9a7f8ee4b0d25d2',
            sync_api: '/get_s_dental_70',
            database: 's_dental_70',
            // a_code: "99999",
            // a_name: "รวมทั้งสิ้น",
            target: 0, result: 0, percents: 0.00, manual: true
        },
        { page: 'mou', index: '9', kpi: 'อัตราความสำเร็จการรักษาผู้ป่วยวัณโรคปอดรายใหม่', notDisplay: true },
        {
            page: 'mou', index: '', kpi: '9.1 อัตราความครอบคลุมการขึ้นทะเบียนของผู้ป่วยวัณโรครายใหม่และกลับเป็นซ้ำ', criterion: 85,
            // database: 's_childdev',
            target: 0, result: 0, percents: 0.00, manual: false
        },
        {
            page: 'mou', index: '', kpi: '9.2 อัตราความสำเร็จการรักษาผู้ป่วยวัณโรคปอดรายใหม่', criterion: 85,
            // database: 's_childdev',
            target: 0, result: 0, percents: 0.00, manual: false
        },
        {
            page: 'mou', index: '10', kpi: 'ร้อยละประชากรกลุ่มเป้าหมายอายุ 30 - 70 ปี ที่ได้รับคัดกรองมะเร็งเต้านม', criterion: 60,
            apipath: '/s_breast_screen/data',
            link: 'https://hdc.moph.go.th/kbi/public/standard-report-detail/308526013808e90ce8f30d66e3b5ad82',
            sync_api: '/get_s_breast_screen',
            database: 's_breast_screen',
            target: 0, result: 0, percents: 0.00, manual: false
        },
        {
            page: 'mou', index: '11', kpi: 'ร้อยละประชากรสตรีกลุ่มเป้า อายุ 30 - 60 ปี ที่ได้รับการคัดกรองมะเร็งปากมดลูก', criterion: 70,
            // database: 's_childdev',
            target: 0, result: 0, percents: 0.00, manual: false
        },
        {
            page: 'mou', index: '12', kpi: 'ร้อยละประชากรกลุ่มเป้าหมาย อายุ 50 - 70 ปี ที่ได้รับการคัดกรองมะเร็งลำไส้ใหญ่และไส้ตรง', criterion: 60,
            apipath: '/s_colon_screen/data',
            link: 'https://hdc.moph.go.th/kbi/public/standard-report-detail/6c88a8d6cbd2779301d3198b82a45cdf',
            sync_api: '/get_s_colon_screen',
            database: 's_colon_screen',
            target: 0, result: 0, percents: 0.00, manual: false
        },
        {
            page: 'mou', index: '13', kpi: 'ร้อยละของผู้ป่วยยาเสพติดที่เข้าสู่กระบวนการบำบัดรักษาได้รับการดูแลอย่างมีคุณภาพอย่างต่อเนื่องจนถึงการติดตาม (Retention Rate )', criterion: 80,
            // kpi: 's_childdev',
            target: 0, result: 0, percents: 0.00, manual: false
        },
        {
            page: 'mou', index: '14', kpi: 'ร้อยละของผู้ป่วยโรคเบาหวานที่ควบคุมระดับน้ำตาลได้', criterion: 41,
            apipath: '/s_dm_control/data',
            link: 'https://hdc.moph.go.th/center/public/standard-report-detail/137a726340e4dfde7bbbc5d8aeee3ac3',
            sync_api: '/get_s_dm_control',
            database: 's_dm_control',
            target: 0, result: 0, percents: 0.00, manual: false
        },
        {
            page: 'mou', index: '15', kpi: 'ร้อยละของผู้ป่วยโรคความดันที่ควบคุมระดับความดันโลหิตได้', criterion: 62,
            apipath: '/s_ht_control/data',
            link: 'https://hdc.moph.go.th/center/public/standard-report-detail/2e3813337b6b5377c2f68affe247d5f9',
            sync_api: '/get_s_ht_control',
            database: 's_ht_control',
            target: 0, result: 0, percents: 0.00, manual: false
        },
        {
            page: 'mou', index: '16', kpi: 'ร้อยละผู้สูงอายุ ผู้ป่วยโรคเรื้อรัง และหญิงตั้งครรภ์ ได้รับการคัดกรองสุขภาพจิตตามมาตรฐานที่กำหนด', criterion: 90,
            apipath: '/s_2q_adl_anc_chronic/data',
            link: 'https://hdc.moph.go.th/kbi/public/search?q=2Q',
            sync_api: '/get_s_2q_adl_anc_chronic',
            database: 's_2q_adl_anc_chronic',
            target: 0, result: 0, percents: 0.00, manual: false
        },
        {
            page: 'mou', index: '17', kpi: 'ร้อยละของผู้ป่วยที่ได้รับการวินิจฉัยโรค Common Diseases and Symptoms มีการสั่งจ่ายยาสมุนไพรเพิ่มขึ้น', criterion: 60,
            // database: 's_childdev',
            target: 0, result: 0, percents: 0.00, manual: false
        },
        {
            page: 'mou', index: '18', kpi: 'ร้อยละของประชาชนที่มารับบริการในระดับปฐมภูมิได้รับการรักษาด้วยการแพทย์แผนไทย และการแพทย์ทางเลือก', criterion: 49,
            apipath: '/s_ttm35/data',
            link: 'https://hdc.moph.go.th/center/public/standard-report-detail/8f3d7d8e9dd50372641546bf12895c04',
            sync_api: '/get_s_ttm35',
            database: 's_ttm35',
            target: 0, result: 0, percents: 0.00, manual: false
        },
        {
            page: 'mou', index: '19', kpi: 'ร้อยละของอำเภอที่ประชาชนไทย มี Health ID เพื่อการเข้าถึงระบบบริการสุขภาพแบบไร้รอยต่อ', criterion: 50,
            apipath: '/s_thai_id/data',
            link: 'https://kbo.moph.go.th/health_id/',
            sync_api: '',
            database: 's_thai_id',
            target: 0, result: 0, percents: 0.00, manual: true
        },
        {
            page: 'mou', index: '20', kpi: 'การประเมินเกณฑ์ประสิทธิภาพทางการเงิน (TPS) ผ่านเกณฑ์ ร้อยละ 81 – 100 ระดับดีมาก (5)', criterion: 81,
            // database: 's_childdev',
            target: 0, result: 0, percents: 0.00, manual: false
        },
        {
            page: 'mou', index: '21', kpi: 'ระดับความสำเร็จในการดำเนินงานการใช้ยาอย่างสมเหตุผลในชุมชน (RDU community)', criterion: 80,
            // database: 's_childdev',
            target: 0, result: 0, percents: 0.00, manual: false
        },
        {
            page: 'mou', index: '22', kpi: 'ระดับความสำเร็จของการส่งเสริมผลิตภัณฑ์สุขภาพให้ได้รับอนุญาต', criterion: 80,
            // database: 's_childdev',
            target: 0, result: 0, percents: 0.00, manual: false
        }
    ];

    const totalIndicators = KpiData.length;

    const passedIndicators = kpiData.filter(item => item.percents >= item.criterion).length;

    const notPassedIndicators = totalIndicators - passedIndicators;

    const successPercent = ((passedIndicators / totalIndicators) * 100).toFixed(1);

    console.log(KpiData.filter(item => item.percents >= item.criterion))

    const handleSync = async (path) => {
        setLoading(true);

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
        setLoading(true);
        try {
            const insertPayloads = [];
            hospitals.forEach(hosp => {
                if (!hosp.hospcode) {
                    console.warn(`Skipping hospital with missing hospcode:`, hosp);
                    return;
                }
                const target = formData[`target${hosp.key}`];
                const result = formData[`result${hosp.key}`];
                if (!target && !result) return;

                const payload = {
                    hospcode: hosp.hospcode,
                    ...(target && { target }),
                    ...(result && { result }),
                };

                insertPayloads.push(payload);
            });
            if (insertPayloads.length > 0) {
                const apiEndpoint = selectedKpiData?.manual === true && `${process.env.REACT_APP_BACKEND_URL}/api/${selectedKpiData.database}/insert_data`
                await axios.post(apiEndpoint, insertPayloads);
            }

            window.location.reload();

        } catch (error) {
            console.error("Insert error:", error);
            alert(error.response.data.error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            if (!selectedKpiData || !selectedKpiData.database) return;

            try {
                const response = await axios.get(
                    `${process.env.REACT_APP_BACKEND_URL}/api/${selectedKpiData.database}/data`
                );
                const data = response.data;

                const updatedFormData = {};
                data.forEach((item, index) => {
                    updatedFormData[`target${index + 1}`] = item.target || '';
                    updatedFormData[`result${index + 1}`] = item.result || '';
                });

                setFormData(prev => ({
                    ...prev,
                    ...updatedFormData
                }));
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [selectedKpiData]);


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
                    ตัวชี้วัด MOU
                </h2>
            </Row>

            {/* ... โค้ด Card, Table ตามที่เขียนไว้ ... */}
            <Row className="g-4">
                <Col md={3}>
                    <Card className="border-0 shadow-sm rounded-4 p-3" style={{ backgroundColor: '#f8f9fa' }}>
                        <Card.Body className="text-center">
                            <FaList size={28} color="#3498db" />
                            <h6 className="mt-3 mb-1">รวมทั้งหมด</h6>
                            <h5 className="text-muted mb-3 mt-2" style={{ fontWeight: "700" }}>{totalIndicators} ตัวชี้วัด</h5>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={3}>
                    <Card className="border-0 shadow-sm rounded-4 p-3" style={{ backgroundColor: '#f8f9fa' }}>
                        <Card.Body className="text-center">
                            <FaTimesCircle size={28} color="#e74c3c" />
                            <h6 className="mt-3 mb-1">ยังไม่ผ่าน</h6>
                            <h5 className="text-muted mb-3 mt-2" style={{ fontWeight: "700" }}>{notPassedIndicators} ตัวชี้วัด</h5>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={3}>
                    <Card className="border-0 shadow-sm rounded-4 p-3" style={{ backgroundColor: '#f8f9fa' }}>
                        <Card.Body className="text-center">
                            <FaCheckCircle size={28} color="#2ecc71" />
                            <h6 className="mt-3 mb-1">ผ่านแล้ว</h6>
                            <h5 className="text-muted mb-3 mt-2" style={{ fontWeight: "700" }}>{passedIndicators} ตัวชี้วัด</h5>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={3}>
                    <Card className="border-0 shadow-sm rounded-4 p-3" style={{ backgroundColor: '#f8f9fa' }}>
                        <Card.Body className="text-center">
                            <FaPercentage size={28} color="#f1c40f" />
                            <h6 className="mt-3 mb-1">ร้อยละ</h6>
                            <h5 className="text-muted mb-3 mt-2" style={{ fontWeight: "700" }}>{successPercent}%</h5>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>



            <Row className='mt-5'>
                <Table striped bordered hover>
                    <thead className="table-primary text-center">
                        <tr>
                            <th >ลำดับ</th>
                            <th >ตัวชี้วัด</th>
                            <th >เกณฑ์</th>
                            <th >เป้าหมาย</th>
                            <th >ผลงาน</th>
                            <th >ร้อยละ</th>
                            <th >อ้างอิง</th>
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
                                            {/* <Link
                                                to={`/kpi/${data.page}/detail/${encodeURIComponent(data.kpi)}`}
                                                state={{ apipath: data.apipath, criterion: data.criterion, notDisplay: data.notDisplay }}
                                            >
                                                {data.kpi}
                                            </Link> */}
                                            <Link
                                                to={`/kpi/${data.page}/detail/${encodeURIComponent(data.kpi)}
                                                ?apipath=${encodeURIComponent(data.apipath)}
                                                &criterion=${encodeURIComponent(data.criterion)}
                                                &notDisplay=${data.notDisplay}`}
                                            >{data.kpi}</Link>

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
                <Modal.Header closeButton style={{
                    position: "sticky",
                    top: 0,
                    zIndex: 999,
                    backgroundColor: '#fff'
                }}>
                    <Modal.Title>{selectedKpiData?.kpi}</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ maxHeight: "80vh" }}>
                    {selectedKpiData && (
                        <div className="d-flex flex-column gap-3">
                            {/* แถวสำหรับปุ่มซิงค์ */}
                            <div>
                                {selectedKpiData?.sync_api && (
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <p className="mb-0 fw-bold">ซิงค์ข้อมูล:</p>
                                        <Button
                                            variant="outline-primary"
                                            style={{ marginLeft: "1rem" }}
                                            onClick={() => handleSync(selectedKpiData.sync_api)}
                                        >
                                            ซิงค์ข้อมูล <IoReload className="ms-2" />
                                        </Button>
                                    </div>
                                )}

                                {selectedKpiData?.manual === true &&
                                    (
                                        <Row style={{ marginTop: '1rem' }}>
                                            <Row style={{ marginTop: '0.75rem' }}>
                                                <Col sm={12} md={3}><p>รพสต.บ้านบางเหียน</p></Col>
                                                <Col sm={6} md={4}>
                                                    <Form.Control type="text" placeholder="กรอกเป้าหมาย..."
                                                        name='target1' onChange={handleChange} value={formData.target1 ?? ''} />
                                                </Col>
                                                <Col sm={6} md={4}>
                                                    <Form.Control type="text" placeholder="กรอกผลงาน..."
                                                        name='result1' onChange={handleChange} value={formData.result1 ?? ''} />
                                                </Col>
                                            </Row>

                                            <Row style={{ marginTop: '0.75rem' }}>
                                                <Col sm={12} md={3}><p>รพสต.บ้านทะเลหอย</p></Col>
                                                <Col sm={6} md={4}>
                                                    <Form.Control type="text" placeholder="กรอกเป้าหมาย..."
                                                        name='target2' onChange={handleChange} value={formData.target2 ?? ''} />
                                                </Col>
                                                <Col sm={6} md={4}>
                                                    <Form.Control type="text" placeholder="กรอกผลงาน..."
                                                        name='result2' onChange={handleChange} value={formData.result2 ?? ''} />
                                                </Col>
                                            </Row>

                                            <Row style={{ marginTop: '0.75rem' }}>
                                                <Col sm={12} md={3}><p>รพสต.บ้านช่องแบก</p></Col>
                                                <Col sm={6} md={4}>
                                                    <Form.Control type="text" placeholder="กรอกเป้าหมาย..."
                                                        name='target3' onChange={handleChange} value={formData.target3 ?? ''} />
                                                </Col>
                                                <Col sm={6} md={4}>
                                                    <Form.Control type="text" placeholder="กรอกผลงาน..."
                                                        name='result3' onChange={handleChange} value={formData.result3 ?? ''} />
                                                </Col>
                                            </Row>
                                            <Row style={{ marginTop: '0.75rem' }}>
                                                <Col sm={12} md={3}><p>รพสต.บ้านตัวอย่าง</p></Col>
                                                <Col sm={6} md={4}>
                                                    <Form.Control type="text" placeholder="กรอกเป้าหมาย..."
                                                        name='target4' onChange={handleChange} value={formData.target4 ?? ''} />
                                                </Col>
                                                <Col sm={6} md={4}>
                                                    <Form.Control type="text" placeholder="กรอกผลงาน..."
                                                        name='result4' onChange={handleChange} value={formData.result4 ?? ''} />
                                                </Col>
                                            </Row>
                                            <Row style={{ marginTop: '0.75rem' }}>
                                                <Col sm={12} md={3}><p>รพสต.บ้านเขาต่อ</p></Col>
                                                <Col sm={6} md={4}>
                                                    <Form.Control type="text" placeholder="กรอกเป้าหมาย..."
                                                        name='target5' onChange={handleChange} value={formData.target5 ?? ''} />
                                                </Col>
                                                <Col sm={6} md={4}>
                                                    <Form.Control type="text" placeholder="กรอกผลงาน..."
                                                        name='result5' onChange={handleChange} value={formData.result5 ?? ''} />
                                                </Col>
                                            </Row>
                                            <Row style={{ marginTop: '0.75rem' }}>
                                                <Col sm={12} md={3}><p>รพสต.บ้านนา</p></Col>
                                                <Col sm={6} md={4}>
                                                    <Form.Control type="text" placeholder="กรอกเป้าหมาย..."
                                                        name='target6' onChange={handleChange} value={formData.target6 ?? ''} />
                                                </Col>
                                                <Col sm={6} md={4}>
                                                    <Form.Control type="text" placeholder="กรอกผลงาน..."
                                                        name='result6' onChange={handleChange} value={formData.result6 ?? ''} />
                                                </Col>
                                            </Row>
                                            <Row style={{ marginTop: '0.75rem' }}>
                                                <Col sm={12} md={3}><p>รพสต.บ้านบางเหลียว</p></Col>
                                                <Col sm={6} md={4}>
                                                    <Form.Control type="text" placeholder="กรอกเป้าหมาย..."
                                                        name='target7' onChange={handleChange} value={formData.target7 ?? ''} />
                                                </Col>
                                                <Col sm={6} md={4}>
                                                    <Form.Control type="text" placeholder="กรอกผลงาน..."
                                                        name='result7' onChange={handleChange} value={formData.result7 ?? ''} />
                                                </Col>
                                            </Row>
                                            <Row style={{ marginTop: '0.75rem' }}>
                                                <Col sm={12} md={3}><p>รพสต.บ้านโคกแซะ</p></Col>
                                                <Col sm={6} md={4}>
                                                    <Form.Control type="text" placeholder="กรอกเป้าหมาย..."
                                                        name='target8' onChange={handleChange} value={formData.target8 ?? ''} />
                                                </Col>
                                                <Col sm={6} md={4}>
                                                    <Form.Control type="text" placeholder="กรอกผลงาน..."
                                                        name='result8' onChange={handleChange} value={formData.result8 ?? ''} />
                                                </Col>
                                            </Row>
                                            <Row style={{ marginTop: '0.75rem' }}>
                                                <Col sm={12} md={3}><p>รพ.ปลายพระยา</p></Col>
                                                <Col sm={6} md={4}>
                                                    <Form.Control type="text" placeholder="กรอกเป้าหมาย..."
                                                        name='target9' onChange={handleChange} value={formData.target9 ?? ''} />
                                                </Col>
                                                <Col sm={6} md={4}>
                                                    <Form.Control type="text" placeholder="กรอกผลงาน..."
                                                        name='result9' onChange={handleChange} value={formData.result9 ?? ''} />
                                                </Col>
                                            </Row>
                                            <Row style={{ marginTop: '0.75rem' }}>
                                                <Col sm={12} md={3}><p>รพสต.บ้านคลองปัญญา</p></Col>
                                                <Col sm={6} md={4}>
                                                    <Form.Control type="text" placeholder="กรอกเป้าหมาย..."
                                                        name='target10' onChange={handleChange} value={formData.target10 ?? ''} />
                                                </Col>
                                                <Col sm={6} md={4}>
                                                    <Form.Control type="text" placeholder="กรอกผลงาน..."
                                                        name='result10' onChange={handleChange} value={formData.result10 ?? ''} />
                                                </Col>
                                            </Row>
                                            <Row style={{ marginTop: '0.75rem' }}>
                                                <Col sm={12} md={3}><p>ศสช.รพ.ปลายพระยา</p></Col>
                                                <Col sm={6} md={4}>
                                                    <Form.Control type="text" placeholder="กรอกเป้าหมาย..."
                                                        name='target11' onChange={handleChange} value={formData.target11 ?? ''} />
                                                </Col>
                                                <Col sm={6} md={4}>
                                                    <Form.Control type="text" placeholder="กรอกผลงาน..."
                                                        name='result11' onChange={handleChange} value={formData.result11 ?? ''} />
                                                </Col>
                                            </Row>

                                        </Row>
                                    )
                                }
                            </div>

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
            </Modal >


            {/* confirm popup */}
            < Modal show={showConfirmPopup} onHide={handleCloseConFirmPopup} centered >
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
            </Modal >
        </Container >
    );
}

export default MouIndicatorsPage