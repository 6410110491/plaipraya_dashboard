import {
    CDBNavbar,
    CDBNavbarNav,
    CDBNavItem,
} from 'cdbreact';
import { NavLink } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Dropdown } from 'react-bootstrap';

function TopBar() {
    const [username, setUsername] = useState(null);

    const bgBlack = { backgroundColor: '#333', color: '#f4f4f4' };

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/checkAuth`, {
                    withCredentials: true
                });
                if (res.data.loggedIn && res.data.username) {
                    setUsername(res.data.username);
                }
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    return
                }
                console.error("Auth check failed:", error);
            }
        };
        checkAuth();
    }, []);

    const handleLogout = async () => {
        try {
            await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/logout`, {
                withCredentials: true
            });
            // setUsername(null)
        } catch (error) {
            console.error("Auth check failed:", error);
        }
        window.location.reload();
    };

    return (
        <div style={{ maxHeight: "73.5px", }}>
            <CDBNavbar style={bgBlack} dark expand="md">
                <div style={{ display: 'flex', alignItems: 'center', width: '100%', padding: '10px 32px' }}>
                    <CDBNavbarNav right style={{ marginLeft: 'auto', alignItems: 'center' }}>
                        <CDBNavItem>
                            {username ? (
                                <Dropdown align="end">
                                    <Dropdown.Toggle variant="outline-light" id="dropdown-user">
                                        {username}
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu>
                                        <Dropdown.Item onClick={handleLogout}>
                                            ออกจากระบบ
                                        </Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            ) : (
                                <NavLink
                                    to="/login"
                                    className="btn btn-outline-light"
                                    style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}
                                >
                                    <i className="fa fa-sign-in-alt" aria-hidden="true" />
                                    เข้าสู่ระบบ
                                </NavLink>
                            )}
                        </CDBNavItem>
                    </CDBNavbarNav>
                </div>
            </CDBNavbar>
        </div>
    )
}

export default TopBar;
