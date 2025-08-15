import React, { useState } from 'react';
import { Form, Button, Card, Container, Row, Col } from 'react-bootstrap';
import axios from 'axios'

function Login() {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    })

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(
                `${process.env.REACT_APP_BACKEND_URL}/api/login`,
                {
                    username: formData.username,
                    password: formData.password,
                },
                { withCredentials: true }
            );

            if (res.data.loggedIn) {
                console.log("Login successful");
                changepage("")
            } else {
                console.log("Login failed:", res.data.status);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const changepage = (path) => {
        window.location.href = "/" + path
    }

    return (
        <Container fluid className="d-flex justify-content-center align-items-center" style={{ height: "100%" }}>
            <Row>
                <Col>
                    <Card style={{ width: '450px', padding: '20px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
                        <Card.Body>
                            <h3 style={{ textAlign: "center" }}>KPI Dashboard</h3>
                            <Card.Title className="text-center mb-4">เข้าสู่ระบบ</Card.Title>
                            <Form onSubmit={handleLogin}>
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

                                <Button variant="primary" type="submit" className="w-100">
                                    เข้าสู่ระบบ
                                </Button>

                            </Form>
                            <Button variant="outline-primary" className="w-100 mt-4" onClick={() => changepage('signup')}>
                                สร้างบัญชีผู้ใช้งาน
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default Login;
