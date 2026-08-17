import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFarmsByUsername, deleteFarmById } from "../../Services/FarmService";
import '../../DisplayView.css';

const FarmList = () => {
  const [farms, setFarms] = useState([]);
  let navigate = useNavigate();

  const setFarmData = () => {
    getFarmsByUsername().then((response) => {
      setFarms(response.data);
    }).catch(error => {
      alert("Error Occurred while loading data:" + error);
    });
  }

  useEffect(() => {
    setFarmData();
  }, []);

  const removeFarm = (id) => {
    deleteFarmById(id).then(res => {
      let remainFarms = farms.filter((farm) => (farm.farmId !== id));
      setFarms(remainFarms);
    });
  }

  const returnBack = () => {
    navigate('/farmer-menu');
  }

  return (
    <div 
      style={{
        backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.2), rgba(15, 23, 42, 0.4)), url('https://images.unsplash.com/photo-1495107334309-fcf20504a5ab?auto=format&fit=crop&w=2832&q=80')`,
        height: '100vh',
        overflowY: 'auto',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '40px 20px',
        boxSizing: 'border-box'
      }}
    >
      <div className="farmer-menu-container" style={{
        background: 'rgba(255, 255, 255, 0.7)',
        backdropFilter: 'blur(15px)',
        WebkitBackdropFilter: 'blur(15px)',
        borderRadius: '28px',
        padding: '40px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
        margin: '0 auto',
        maxWidth: '1000px'
      }}>
        
        <div className="menu-header" style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 className="menu-title" style={{ fontSize: '2.5rem', color: '#0f172a', fontWeight: '800' }}>My Registered Farms</h1>
          <p className="menu-subtitle" style={{ color: '#475569', fontSize: '1.1rem', marginTop: '10px' }}>Overview of all your managed plots and land areas</p>
        </div>

        {farms.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', background: 'rgba(255,255,255,0.5)', borderRadius: '16px' }}>
            <h3 style={{ color: '#334155' }}>No farms registered yet.</h3>
            <button className="btn btn-success" style={{ marginTop: '20px' }} onClick={() => navigate('/farm-add')}>Register a Farm</button>
          </div>
        ) : (
          <div className="dashboard-grid">
            {farms.map((farm) => (
              <div key={farm.farmId} className="dashboard-card" style={{ background: 'rgba(255,255,255,0.95)', border: '1px solid rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column' }}>
                <div className="card-content" style={{ flexGrow: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                    <h3 className="card-title" style={{ margin: 0, fontSize: '1.5rem', color: '#10b981' }}>{farm.farmName}</h3>
                    <span style={{ background: '#e2e8f0', color: '#475569', padding: '4px 10px', borderRadius: '12px', fontSize: '0.85rem', fontWeight: '600' }}>ID: {farm.farmId}</span>
                  </div>
                  
                  <div className="card-description" style={{ marginBottom: '20px', color: '#334155' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                      <span style={{ fontWeight: '600' }}>Area</span>
                      <span>{farm.area}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                      <span style={{ fontWeight: '600' }}>Soil Type</span>
                      <span>{farm.soil}</span>
                    </div>
                  </div>
                  
                  <div className="card-actions" style={{ marginTop: 'auto' }}>
                    <button className="btn btn-danger" style={{ width: '100%', padding: '10px', borderRadius: '8px', fontWeight: '600', transition: 'all 0.3s' }} onClick={() => removeFarm(farm.farmId)}>
                      Delete Farm
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="dashboard-footer" style={{ marginTop: '40px', textAlign: 'center', borderTop: '1px solid rgba(0,0,0,0.1)', paddingTop: '30px' }}>
          <button className="btn btn-secondary" onClick={returnBack} style={{ padding: '12px 30px', fontSize: '1.1rem', borderRadius: '12px', fontWeight: '600', background: '#64748b', border: 'none', color: 'white', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
            ← Back to Dashboard
          </button>
        </div>
        
      </div>
    </div>
  );
}

export default FarmList;