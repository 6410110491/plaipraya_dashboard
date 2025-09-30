import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import HomePage from './page/HomePage';
import Sidebar from './components/SideBar';
import MouIndicatorsPage from './page/MouIndicatorsPage';
import MinistryIndicatorsPage from './page/MinistryIndicatorsPage';
import InspectorIndicatorsPage from './page/InspectorIndicatorsPage';
import KpiDetail from './components/KpiDetail';
import Footer from './components/Footer';
import TopBar from './components/TopBar';
import Login from './page/Login';
import Signup from './page/Signup';
import ProfileEdit from './page/ProfileEdit';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <div style={{ display: 'flex' }}>
          <Sidebar />
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
            width: '100%'
          }}>
            <TopBar />
            <div style={{ width: '100%', flex: 1 }}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/kpi/mou" element={<MouIndicatorsPage />} />
                <Route path="/kpi/ministry" element={<MinistryIndicatorsPage />} />
                <Route path="/kpi/inspector" element={<InspectorIndicatorsPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/profile-edit" element={<ProfileEdit />} />

                <Route path="/kpi/:page/detail/:kpiname" element={<KpiDetail />} />
              </Routes>
            </div>
            <Footer />
          </div>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
