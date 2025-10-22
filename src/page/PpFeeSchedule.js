import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Spinner } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

function PpFeeSchedule() {
  const { years } = useParams();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    const loading = async () => {
      setLoading(true)
      setTimeout(() => {
        setLoading(false);
      }, 500);

    };

    loading();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const yearRes = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/ppfee/${years}`);
        if (yearRes.data.data && yearRes.data.data.length > 0) {
          const id = yearRes.data.data[0].id;

          const dataRes = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/ppfee/data/${id}`);
          setData(dataRes.data);
        } else {
          console.log("ไม่พบปีที่เลือก");
          setData([]);
        }
      } catch (error) {
        console.error("Error fetching PPFee data:", error);
        setData([]);
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 500);
      }
    };

    fetchData();
  }, [years]); // <--- เพิ่ม years เป็น dependency


  const groupedData = data.reduce((acc, curr) => {
    const key = curr.main_activity;
    if (!acc[key]) {
      acc[key] = {
        main_activity: curr.main_activity,
        service_unit_code: curr.service_unit_code,
        service_unit_name: curr.service_unit_name,
        sub_activities: [],
      };
    }
    acc[key].sub_activities.push({
      id: curr.id,
      service_unit_code: curr.service_unit_code,
      service_unit_name: curr.service_unit_name,
      main_activity: curr.main_activity,
      sub_activity: curr.sub_activity,
      person_count: curr.person_count,
      service_count: curr.service_count,
      amount: curr.amount,
    });
    return acc;
  }, {});

  const rows = Object.values(groupedData);

  return (
    loading ? (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
        <Spinner animation="border" role="status" size='lg'>
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    ) : (
      <div className="container mt-4">
        <h2 className="mb-4">ตารางข้อมูล PpFeeSchedule ปีงบ {years}</h2>
        <div className="table-responsive">
          <table className="table table-bordered align-middle">
            <thead className="table-light">
              <tr>
                <th className="text-center" style={{ backgroundColor: '#0d9488', color: '#fff', textAlign: 'center' }}>หน่วยที่ให้บริการ</th>
                <th className="text-center" style={{ backgroundColor: '#0d9488', color: '#fff', textAlign: 'center' }}>ชื่อของหน่วยให้บริการ</th>
                <th className="text-center" style={{ backgroundColor: '#0d9488', color: '#fff', textAlign: 'center' }}>กิจกรรมหลัก</th>
                <th className="text-center" style={{ backgroundColor: '#0d9488', color: '#fff', textAlign: 'center' }}>กิจกรรมย่อย</th>
                <th className="text-center" style={{ backgroundColor: '#0d9488', color: '#fff', textAlign: 'center' }}>รับบริการ (คน)</th>
                <th className="text-center" style={{ backgroundColor: '#0d9488', color: '#fff', textAlign: 'center' }}>จำนวนครั้ง</th>
                <th className="text-center" style={{ backgroundColor: '#0d9488', color: '#fff', textAlign: 'center' }}>การเบิกจ่าย</th>
              </tr>
            </thead>
            <tbody>
              {rows.length > 0 ? (
                rows.map((group, idx) =>
                  group.sub_activities.map((sub, i) => (
                    <tr key={`${idx}-${i}`}>
                      {i === 0 && (
                        <>
                          <td rowSpan={group.sub_activities.length} className="text-center align-middle">
                            {group.service_unit_code}
                          </td>
                          <td rowSpan={group.sub_activities.length} className="text-center align-middle">
                            {group.service_unit_name}
                          </td>
                          <td rowSpan={group.sub_activities.length} className="text-center align-middle">
                            {group.main_activity}
                          </td>
                        </>
                      )}
                      <td>{sub.sub_activity}</td>
                      <td className="text-center">{sub.person_count}</td>
                      <td className="text-center">{sub.service_count}</td>
                      <td className="text-center">
                        {Number(sub.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))
                )
              ) : (
                <tr>
                  <td colSpan="7" className="text-center">
                    ไม่มีข้อมูล
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    )
  )
}

export default PpFeeSchedule