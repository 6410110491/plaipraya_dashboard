import {
    CDBNavbar,
    CDBNavbarNav,
    CDBNavItem,
} from 'cdbreact';
import { NavLink } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Dropdown } from 'react-bootstrap';
import { FaSignOutAlt, FaUser, FaUserCog } from 'react-icons/fa';

function TopBar() {
    const [username, setUsername] = useState(null);
    const [role, setRole] = useState(null);
    const [hoverLogin, setHoverLogin] = useState(false);

    const bgBlack = { backgroundColor: '#f0f1f3', color: '#2A2F5B' };

    const changepage = (path) => {
        window.location.href = "/" + path
    }

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/checkAuth`, {
                    withCredentials: true
                });
                if (res.data.loggedIn && res.data.username) {
                    setUsername(res.data.username);
                    setRole(res.data.role)
                }
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    return
                }
                // console.error("Auth check failed:", error);
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
        } finally {
            changepage('')
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
                                    <Dropdown.Toggle
                                        variant="outline-light"
                                        id="dropdown-user"
                                        style={{
                                            backgroundColor: hoverLogin ? "#0d7c73ff" : "#0d9488",
                                            color: "#ffffff",
                                            border: "none",
                                            borderRadius: "8px",
                                            padding: "6px 12px"
                                        }}
                                    >
                                        {username}
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu
                                        style={{
                                            backgroundColor: "#ffffff",
                                            borderRadius: "8px",
                                            border: 'none'
                                        }}
                                    >
                                        <Dropdown.Item
                                            onClick={() => changepage('profile-edit')}
                                            style={{
                                                color: "#2C3B50",
                                                fontWeight: "500",
                                                display: 'flex',
                                                alignItems: 'center'
                                            }}

                                        >
                                            <FaUser size={16} style={{ marginRight: '0.5rem' }} /> ข้อมูลส่วนตัว
                                        </Dropdown.Item>
                                        {role === "admin" && (
                                            <Dropdown.Item
                                                onClick={() => changepage('pp-fee-management')}
                                                style={{
                                                    color: "#2C3B50",
                                                    fontWeight: "500",
                                                    display: 'flex',
                                                    alignItems: 'center'
                                                }}
                                            >
                                                <FaUserCog size={16} style={{ marginRight: '0.5rem' }} /> แอดมิน
                                            </Dropdown.Item>
                                        )}

                                        <Dropdown.Item
                                            onClick={handleLogout}
                                            style={{
                                                color: "#2C3B50",
                                                fontWeight: "500",
                                                display: 'flex',
                                                alignItems: 'center'
                                            }}
                                        >
                                            <FaSignOutAlt size={16} style={{ marginRight: '0.5rem' }} /> ออกจากระบบ
                                        </Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>

                            ) : (
                                <NavLink
                                    to="/login"
                                    className="btn"
                                    style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: 8,
                                        backgroundColor: hoverLogin ? "#0d7c73ff" : "#0d9488",
                                        color: "#ffffff",
                                        border: "none",
                                        borderRadius: "8px",
                                        padding: "6px 14px",
                                        fontWeight: "500"
                                    }}
                                    onMouseEnter={() => setHoverLogin(true)}
                                    onMouseLeave={() => setHoverLogin(false)}
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
