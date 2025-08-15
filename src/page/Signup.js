import React, { useState } from 'react';
import { Form, Button, Card, Container, Row, Col } from 'react-bootstrap';
import axios from 'axios'

function Signup() {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        passwordConfirm: '',
        email: '',
        fisrtname: '',
        lastname: '',
        department: '',
    })

    const department_list = ["ควบคุมโรคติดต่อ (IDC)", "ควบคุมโรคไม่ติดต่อ (NCD)", "ควบคุมผู้บริโภค (CPC)", "ทรัพยากรบุคคล (HRM)", "ทันตสาธารณสุข (DEN)",
        "นิติการ (LEG)", "บริหารทั่วไป (ADM)", "ปฐมภูมิและเครือข่ายสุขภาพ (PRI)", "ประกันสุขภาพ (HIN)", "พัฒนาคุณภาพบริหาร (QIS)", "ยุทธศาสตร์สาธารณสุข (PHS)",
        "สุขภาพดิจิทัล (DGH)", "ส่งเสริมสุขภาพ (HPR)", "อนามัยสิ่งแวดล้อม (ENV)", "แพทย์แผนไทย (TMD)", "อื่นๆ (OTH)"
    ]

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSignup = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.passwordConfirm) {
            alert("Password ไม่ตรงกัน");
            return;
        }

        try {
            const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/signup`, {
                username: formData.username,
                password: formData.password,
                email: formData.email,
                first_name: formData.fisrtname,
                last_name: formData.lastname,
                department: formData.department
            }, { withCredentials: true });

            console.log(res.data);
        } catch (err) {
            console.error(err);
        }
    };


    return (
        <Container fluid className="d-flex justify-content-center align-items-center" style={{ height: "100%" }}>
            <Row>
                <Col>
                    <Card style={{ width: '450px', padding: '20px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
                        <Card.Body>
                            <h3 style={{ textAlign: "center" }}>KPI Dashboard</h3>
                            <Card.Title className="text-center mb-4">ลงทะเบียน</Card.Title>
                            <Form onSubmit={handleSignup}>
                                <Row>
                                    <Col sm={12} md={6} lg={6}>
                                        <Form.Group className="mb-4" controlId="formFisrtname">
                                            <Form.Control
                                                type="text"
                                                placeholder="ชื่อ"
                                                name='fisrtname'
                                                value={formData.fisrtname}
                                                onChange={handleChange}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col sm={12} md={6} lg={6}>
                                        <Form.Group className="mb-4" controlId="formLastname">
                                            <Form.Control
                                                type="text"
                                                placeholder="นามสกุล"
                                                name='lastname'
                                                value={formData.lastname}
                                                onChange={handleChange}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Form.Group className="mb-4" controlId="formDepartment">
                                    <Form.Select aria-label="Default select example"
                                        type="text"
                                        name='department'
                                        value={formData.department}
                                        onChange={handleChange}
                                        required>
                                        <option value="">กลุ่มงาน</option>
                                        {department_list.map((data, index) => (
                                            <option key={index} value={data}>{data}</option>
                                        ))}
                                    </Form.Select>

                                </Form.Group>

                                <Form.Group className="mb-4" controlId="formEmail">
                                    <Form.Control
                                        type="email"
                                        placeholder="อีเมล"
                                        name='email'
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>

                                <Form.Group className="mb-4" controlId="formUsername">
                                    <Form.Control
                                        type="text"
                                        placeholder="ชื่อผู้ใช้งาน"
                                        name='username'
                                        value={formData.username}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>

                                <Form.Group className="mb-4" controlId="formPassword">
                                    <Form.Control
                                        type="Password"
                                        placeholder="รหัสผ่าน"
                                        name='password'
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>

                                <Form.Group className="mb-4" controlId="formPasswordConfirm">
                                    <Form.Control
                                        type="Password"
                                        placeholder="รหัสผ่านอีกครั้ง"
                                        name='passwordConfirm'
                                        value={formData.passwordConfirm}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>


                                <Button variant="primary" type="submit" className="w-100">
                                    ลงทะเบียน
                                </Button>

                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    )
}

export default Signup