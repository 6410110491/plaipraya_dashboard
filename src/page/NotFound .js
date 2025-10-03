import React from 'react';
import { Container, Button } from 'react-bootstrap';
import svg from "../images/404.svg";

function NotFound() {
    const changepage = (path) => {
        window.location.href = '/' + path;
    };

    return (
        <Container fluid className="d-flex align-items-center justify-content-center p-0" style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
            <div className="text-center">
                <img src={svg} alt="svg" />
                <h1 className="display-4">Oops! Page Not Found</h1>
                <p className="text-muted mb-4">The page you are looking for might have been removed or is temporarily unavailable.</p>
                <Button variant="primary" onClick={() => changepage('')}
                    style={{ backgroundColor: "#2A2F5B", border: 'none', borderRadius: '10px' }}>
                    กลับสู่หน้าหลัก
                </Button>
            </div>
        </Container>
    );
}

export default NotFound;