import React, { useEffect, useState } from 'react';
import { Col, Container, Row, Table, Spinner } from 'react-bootstrap';
import { useLocation, useParams } from 'react-router-dom';
import { PieChart } from '@mui/x-charts';
import axios from 'axios';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LabelList, ReferenceLine
} from 'recharts';
import Typography from '@mui/material/Typography';
import { Card } from '@mui/material';

function KpiDetail() {
    const location = useLocation();
    const { apipath, criterion } = location.state || {};
    const { kpiname } = useParams();

    const [data, setData] = useState();
    const [loading, setLoading] = useState(true);

    const nameMap = {
        'โรงพยาบาลส่งเสริมสุขภาพตำบลบ้านบางเหียน': 'รพสต.บ้านบางเหียน',
        'โรงพยาบาลส่งเสริมสุขภาพตำบลบ้านทะเลหอย': 'รพสต.บ้านทะเลหอย',
        'โรงพยาบาลส่งเสริมสุขภาพตำบลบ้านช่องแบก': 'รพสต.บ้านช่องแบก',
        'โรงพยาบาลส่งเสริมสุขภาพตำบลบ้านตัวอย่าง': 'รพสต.บ้านตัวอย่าง',
        'โรงพยาบาลส่งเสริมสุขภาพตำบลบ้านเขาต่อ': 'รพสต.บ้านเขาต่อ',
        'โรงพยาบาลส่งเสริมสุขภาพตำบลบ้านนา': 'รพสต.บ้านนา',
        'โรงพยาบาลส่งเสริมสุขภาพตำบลบ้านบางเหลียว': 'รพสต.บ้านบางเหลียว',
        'โรงพยาบาลส่งเสริมสุขภาพตำบลบ้านโคกแซะ': 'รพสต.บ้านโคกแซะ',
        'โรงพยาบาลปลายพระยา': 'รพ.ปลายพระยา',
        'โรงพยาบาลส่งเสริมสุขภาพตำบลบ้านคลองปัญญา': 'รพสต.บ้านคลองปัญญา',
        'ศูนย์สุขภาพชุมชนโรงพยาบาลปลายพระยา': 'ศสช.รพ.ปลายพระยา',
    };

    const valueFormatter = (item) => `${item.value}%`;

    const desktopOS = data?.filter(item => item.a_code === "99862").map(item => {
        const percent = Number(item.percent);
        return [
            { label: 'ผ่าน', value: percent, color: '#4CAF50' },
            { label: 'ไม่ผ่าน', value: percent >= 100 ? 0 : (100 - percent).toFixed(2), color: '#F44336' },
        ];
    })[0] || [];

    const barData = data?.filter(item => item.a_code !== "99999").map(item => {
        const percent = parseFloat(item.percent);
        const customName = nameMap[item.a_name] || item.a_name;
        return {
            name: customName,
            pass: percent,
        };
    }) || [];

    useEffect(() => {
        const fetchDataDetail = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api${apipath}`);
                setData(response.data);
            } catch (error) {
                console.error('Error fetching KPI detail:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchDataDetail();
    }, [apipath]);

    return loading ? (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
            <Spinner animation="border" role="status" size="lg">
                <span className="visually-hidden">Loading...</span>
            </Spinner>
        </div>
    ) : (
        <Container fluid className="py-4">
            <Row className="mb-4">
                <Col>
                    <h3 className="text-primary fw-bold">รายละเอียดตัวชี้วัด</h3>
                    <p><strong>ตัวชี้วัด:</strong> {decodeURIComponent(kpiname)}</p>
                </Col>
            </Row>

            <Row className="g-4">
                <Col md={4}>
                    <Card elevation={3} className="p-4 text-center" style={{ minHeight: 450 }}>
                        <PieChart
                            series={[
                                {
                                    data: desktopOS,
                                    highlightScope: { fade: 'global', highlight: 'item' },
                                    faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                                    valueFormatter,
                                    label: { visible: true },
                                },
                            ]}
                            height={250}
                            width={250}
                        />
                        <Typography variant="subtitle1" className="mt-3">
                            ศูนย์สุขภาพชุมชนโรงพยาบาลปลายพระยา
                        </Typography>
                    </Card>
                </Col>

                <Col md={8}>
                    <Card elevation={3} className="p-4" style={{ minHeight: 450 }}>
                        <div style={{ overflowX: 'auto' }}>
                            <BarChart width={900} height={400} data={barData} margin={{ bottom: 80, top: 20, left: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" angle={-25} textAnchor="end" height={60} />
                                <YAxis domain={[0, 100]} />
                                <Tooltip formatter={(val) => `${val.toFixed(2)}%`} />
                                <Bar dataKey="pass" fill="#4CAF50">
                                    <LabelList
                                        dataKey="pass"
                                        position="top"
                                        formatter={(val) => val === 0 ? '' : `${val.toFixed(2)}%`}
                                    />
                                </Bar>
                                <ReferenceLine
                                    y={criterion}
                                    stroke="red"
                                    strokeDasharray="4 4"
                                    label={{
                                        value: `เกณฑ์ผ่าน ${criterion}%`,
                                        position: 'top',
                                        fill: 'red',
                                        fontSize: 12,
                                        dy: -10,
                                    }}
                                    style={{ zIndex: 999 }}
                                />
                            </BarChart>
                        </div>
                    </Card>
                </Col>
            </Row>

            <Row className="mt-5">
                <Card elevation={3} className="p-3">
                    <Table striped bordered hover responsive>
                        <thead className="table-primary text-center">
                            <tr>
                                <th>รหัสหน่วยบริการ</th>
                                <th style={{ textAlign: "left" }}>ชื่อหน่วยบริการ</th>
                                <th>เป้าหมาย</th>
                                <th>ผลงาน</th>
                                <th>ร้อยละ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data?.map((item, index) => (
                                <tr key={index}>
                                    <td className="text-center">{item.a_code === '99999' ? '' : item.a_code}</td>
                                    <td>{item.a_name}</td>
                                    <td className="text-center">{item.target}</td>
                                    <td className="text-center">{item.result}</td>
                                    <td className="text-center fw-bold">{item.percent}%</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Card>
            </Row>
        </Container>
    );
}

export default KpiDetail;
