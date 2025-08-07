import {
    CDBSidebar,
    CDBSidebarContent,
    CDBSidebarFooter,
    CDBSidebarHeader,
    CDBSidebarMenu,
    CDBSidebarMenuItem,
} from 'cdbreact';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
    return (
        <div style={{ display: 'flex', minHeight: '100vh', overflow: 'scroll initial' }}>
            <CDBSidebar textColor="#fff" backgroundColor="#333">
                <CDBSidebarHeader prefix={<i className="fa fa-bars fa-large"></i>}>
                    <a href="/" className="text-decoration-none" style={{ color: 'inherit', marginRight: '15px' }}>
                        KPI Dashboard
                    </a>
                </CDBSidebarHeader>

                <CDBSidebarContent className="sidebar-content">
                    <CDBSidebarMenu>
                        <NavLink to="/">
                            <CDBSidebarMenuItem icon="columns">หน้าหลัก</CDBSidebarMenuItem>
                        </NavLink>
                        <NavLink to="/kpi/mou">
                            <CDBSidebarMenuItem icon="table">ตัวชี้วัด MOU</CDBSidebarMenuItem>
                        </NavLink>
                        <NavLink to="/kpi/ministry">
                            <CDBSidebarMenuItem icon="user">ตัวชี้วัดกระทรวง</CDBSidebarMenuItem>
                        </NavLink>
                        <NavLink to="/kpi/inspector">
                            <CDBSidebarMenuItem icon="chart-line">ตัวชี้วัดตรวจราชการ</CDBSidebarMenuItem>
                        </NavLink>

                    </CDBSidebarMenu>
                </CDBSidebarContent>

                {/* <CDBSidebarFooter style={{ textAlign: 'center' }}>
                    <div
                        style={{
                            padding: '20px 5px',
                        }}
                    >
                        Sidebar Footer
                    </div>
                </CDBSidebarFooter> */}
            </CDBSidebar>
        </div>
    );
};

export default Sidebar;