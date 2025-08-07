import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import HomePage from './page/HomePage';
import Sidebar from './components/SideBar';
import MouIndicatorsPage from './page/MouIndicatorsPage';
import MinistryIndicatorsPage from './page/MinistryIndicatorsPage';
import InspectorIndicatorsPage from './page/InspectorIndicatorsPage';
import KpiDetail from './components/KpiDetail';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <div style={{ display: 'flex' }}>
          <Sidebar />
          <div style={{ padding: '20px', width: '100%' }}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/kpi/mou" element={<MouIndicatorsPage />} />
              <Route path="/kpi/ministry" element={<MinistryIndicatorsPage />} />
              <Route path="/kpi/inspector" element={<InspectorIndicatorsPage />} />

              <Route path="/kpi/:page/detail/:kpiname" element={<KpiDetail />} />
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
