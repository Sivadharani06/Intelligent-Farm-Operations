import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BlurAdminLayout from '../Layout/BlurAdminLayout';
import { getFarmsByUsername, deleteFarmById } from "../../Services/FarmService";
import '../../DisplayView.css';

const FarmList = () => {
  const [farms, setFarms] = useState([]);
  let navigate = useNavigate();

  const setFarmData = () => {
    getFarmsByUsername().then((response) => {
      setFarms(response.data);
    }).catch(error => {
      console.error("Error loading farms:", error);
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
    <BlurAdminLayout title="MY REGISTERED FARMS" breadcrumb="Home / Farms / Farm List">
      <div className="farmer-menu-container" style={{ background: '#0d222a', border: '1.5px solid rgba(255,255,255,0.18)' }}>
        <div className="menu-header" style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 className="menu-title" style={{ fontSize: '2.1rem', fontWeight: '900', color: '#ffffff' }}>Registered Farms Matrix</h1>
          <p className="menu-subtitle" style={{ color: '#00e5ff', fontSize: '1.05rem', fontWeight: '700' }}>Overview of all active agricultural plots and managed land area</p>
        </div>

        {farms.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '50px 20px', background: '#07171e', borderRadius: '12px', border: '1.5px solid rgba(255,255,255,0.15)' }}>
            <h4 style={{ color: '#ffffff', fontWeight: '800' }}>No farms registered yet.</h4>
            <p style={{ color: '#cbd5e1', fontSize: '0.95rem', marginBottom: '20px' }}>Start by mapping your first farm plot to begin managing operations.</p>
            <button className="btn btn-primary" onClick={() => navigate('/farm-add')}>+ Register a Farm</button>
          </div>
        ) : (
          <div className="blur-cards-grid">
            {farms.map((farm) => (
              <div key={farm.farmId} className="blur-feature-card" style={{ background: '#07171e', border: '1.5px solid rgba(255,255,255,0.18)' }}>
                <div className="blur-card-icon-banner">
                  <div className="blur-card-icon-wrap" style={{ background: 'rgba(0, 210, 170, 0.2)', color: '#00d2aa' }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                  </div>
                  <span className="blur-badge blur-badge-mint" style={{ padding: '4px 10px', fontSize: '0.78rem', fontWeight: '800' }}>ID: #{farm.farmId}</span>
                </div>
                
                <h3 className="blur-card-title" style={{ fontSize: '1.35rem', fontWeight: '900', color: '#ffffff', margin: '8px 0' }}>{farm.farmName}</h3>
                
                <div style={{ margin: '14px 0 20px 0', borderTop: '1px solid rgba(255,255,255,0.12)', paddingTop: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontSize: '0.92rem' }}>
                    <span style={{ color: '#00e5ff', fontWeight: '800' }}>AREA</span>
                    <span style={{ fontWeight: '800', color: '#ffffff' }}>{farm.area} Acres</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontSize: '0.92rem' }}>
                    <span style={{ color: '#00e5ff', fontWeight: '800' }}>SOIL TYPE</span>
                    <span style={{ fontWeight: '900', color: '#00d2aa' }}>{farm.soil}</span>
                  </div>
                </div>

                <div className="blur-card-actions" style={{ marginTop: 'auto' }}>
                  <button className="btn btn-danger w-100" style={{ fontWeight: '800', padding: '10px' }} onClick={() => removeFarm(farm.farmId)}>
                    Delete Plot
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={{ marginTop: '36px', textAlign: 'center' }}>
          <button className="btn btn-secondary" style={{ padding: '12px 32px', fontSize: '1rem', fontWeight: '800' }} onClick={returnBack}>
            ← Back to Dashboard
          </button>
        </div>
      </div>
    </BlurAdminLayout>
  );
}

export default FarmList;