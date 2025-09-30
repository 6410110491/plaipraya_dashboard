import React, { useEffect, useState } from 'react';
import { Button, Form, Card, Spinner, Container } from 'react-bootstrap';
import axios from 'axios';
import Swal from 'sweetalert2';

function ProfileEdit() {
    const [loading, setLoading] = useState(true);
    const [submitLoading, setSubmitLoading] = useState(false); // submit form
    const [hoverPrimary, setHoverPrimary] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        department: '',
    });

    const department_list = ["ควบคุมโรคติดต่อ (IDC)", "ควบคุมโรคไม่ติดต่อ (NCD)", "ควบคุมผู้บริโภค (CPC)", "ทรัพยากรบุคคล (HRM)", "ทันตสาธารณสุข (DEN)",
        "นิติการ (LEG)", "บริหารทั่วไป (ADM)", "ปฐมภูมิและเครือข่ายสุขภาพ (PRI)", "ประกันสุขภาพ (HIN)", "พัฒนาคุณภาพบริหาร (QIS)", "ยุทธศาสตร์สาธารณสุข (PHS)",
        "สุขภาพดิจิทัล (DGH)", "ส่งเสริมสุขภาพ (HPR)", "อนามัยสิ่งแวดล้อม (ENV)", "แพทย์แผนไทย (TMD)", "อื่นๆ (OTH)"
    ]

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/profile`, { withCredentials: true });
                const data = response.data;
                setFormData({
                    firstName: data.first_name || '',
                    lastName: data.last_name || '',
                    email: data.email || '',
                    department: data.department || '',
                });
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setSubmitLoading(true);
            const res = await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/profile`, {
                first_name: formData.firstName,
                last_name: formData.lastName,
                email: formData.email,
                department: formData.department,
                password: formData.password
            }, { withCredentials: true });

            await Swal.fire({
                icon: 'success',
                title: 'บันทึกข้อมูลสำเร็จ',
                text: 'บันทึกข้อมูลเรียบร้อยแล้ว',
                confirmButtonText: 'ตกลง',
            })
            console.log(res.data);
        } catch (err) {
            console.error(err);
            await Swal.fire({
                icon: 'error',
                title: 'บันทึกข้อมูลไม่สำเร็จ',
                text: 'ไม่สามารถบันทึกข้อมูลได้ กรุณาลองใหม่',
                confirmButtonText: 'ตกลง',
            });
        } finally {
            setSubmitLoading(false);
        }
    }

    return (
        <Container fluid
            style={{
                backgroundColor: '#f8f9fa', padding: '25px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                height: '100%'
            }}>
            {loading ? (
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
                    <Spinner animation="border" role="status" size="lg">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                </div>
            ) : (
                <Card className="p-4" style={{ maxWidth: 600, margin: '20px auto', width: '100%' }}>
                    <h3 className="mb-4">แก้ไขข้อมูลส่วนตัว</h3>

                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>ชื่อ</Form.Label>
                            <Form.Control
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>นามสกุล</Form.Label>
                            <Form.Control
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>อีเมล</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                disabled
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formDepartment">
                            <Form.Label>กลุ่มงาน</Form.Label>
                            <Form.Select
                                name="department"
                                value={formData.department}
                                onChange={handleChange}
                                required
                            >
                                <option value="">กลุ่มงาน</option>
                                {department_list.map((data, index) => (
                                    <option key={index} value={data}>
                                        {data}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>

                        <div className="d-flex justify-content-end gap-2">
                            <Button variant="secondary" disabled={submitLoading}>ยกเลิก</Button>
                            <Button type="submit" variant="primary" disabled={submitLoading}
                                style={{
                                    backgroundColor: hoverPrimary ? "#1f2347" : "#2A2F5B",
                                    color: "#ffffff",
                                    border: 'none'
                                }}
                                onMouseEnter={() => setHoverPrimary(true)}
                                onMouseLeave={() => setHoverPrimary(false)}>
                                {submitLoading ? 'กำลังบันทึก...' : 'บันทึก'}
                            </Button>
                        </div>
                    </Form>
                </Card>
            )}
        </Container>
    );
}

export default ProfileEdit;
