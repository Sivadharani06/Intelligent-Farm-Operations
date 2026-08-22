import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getCropExpenseCalculation } from '../../Services/CropInputService';
import '../../DisplayView.css';

const FinalCropReport = () => {
    let navigate = useNavigate();
    let param = useParams();
    const [report, setReport] = useState({
        farmId: 0,
        farmName: "",
        soil: "",
        cropId: "",
        cropName: "",
        cropArea: 0.0,
        sownMonthYear: "",
        harvestMonthYear: "",
        yield: 0.0,
        water: 0.0,
        fertilizer: 0.0,
        pesticides: 0.0,
        tractorHour: 0.0,
        agroTools: 0.0,
        waterExp: 0.0,
        fertilizerExp: 0.0,
        pesticidesExp: 0.0,
        tractorExp: 0.0,
        agroToolsExp: 0.0,
        total: 0.0
    });

    const setFinalReportData = () => {
        getCropExpenseCalculation(param.cid).then(response => {
            setReport(response.data);
        }).catch(error => {
            console.error("Error fetching crop report: ", error);
        });
    }

    useEffect(() => {
        setFinalReportData();
    }, [param.cid]);

    const returnBack = () => {
        navigate('/crop-list');
    }

    return (
        <div 
          style={{
            backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.4), rgba(15, 23, 42, 0.6)), url('https://images.unsplash.com/photo-1593113564998-fdf441c2f9d8?auto=format&fit=crop&w=2832&q=80')`,
            minHeight: '100vh',
            overflowY: 'auto',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start',
            padding: '40px 20px',
            boxSizing: 'border-box'
          }}
        >
          <div className="login-box" style={{ 
            maxWidth: '600px', 
            width: '100%',
            textAlign: 'left',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(15px)',
            WebkitBackdropFilter: 'blur(15px)',
            borderRadius: '20px',
            boxShadow: '0 15px 35px rgba(0,0,0,0.15)',
            padding: '28px'
          }}>
            <h2 className="text-center" style={{ display: 'block', marginBottom: '8px', color: '#0f172a', fontWeight: '800', fontSize: '1.5rem' }}>
              Final Crop Report
            </h2>
            <p className="text-center" style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '20px' }}>
              Comprehensive details & expenses for Crop ID: <strong style={{ color: '#047857' }}>{report.cropId}</strong>
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', fontSize: '0.9rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', padding: '10px', background: '#f8fafc', borderRadius: '8px' }}>
                <span style={{ color: '#64748b', fontSize: '0.8rem', fontWeight: '600' }}>CROP NAME</span>
                <span style={{ color: '#1e293b', fontWeight: '700', fontSize: '1rem' }}>{report.cropName}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', padding: '10px', background: '#f8fafc', borderRadius: '8px' }}>
                <span style={{ color: '#64748b', fontSize: '0.8rem', fontWeight: '600' }}>FARM NAME</span>
                <span style={{ color: '#1e293b', fontWeight: '700', fontSize: '1rem' }}>{report.farmName}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', padding: '10px', background: '#f8fafc', borderRadius: '8px' }}>
                <span style={{ color: '#64748b', fontSize: '0.8rem', fontWeight: '600' }}>SOIL TYPE</span>
                <span style={{ color: '#1e293b', fontWeight: '700', fontSize: '1rem' }}>{report.soil}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', padding: '10px', background: '#f8fafc', borderRadius: '8px' }}>
                <span style={{ color: '#64748b', fontSize: '0.8rem', fontWeight: '600' }}>CROP AREA</span>
                <span style={{ color: '#1e293b', fontWeight: '700', fontSize: '1rem' }}>{report.cropArea} Acres</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', padding: '10px', background: '#f8fafc', borderRadius: '8px' }}>
                <span style={{ color: '#64748b', fontSize: '0.8rem', fontWeight: '600' }}>SOWN MONTH</span>
                <span style={{ color: '#1e293b', fontWeight: '700', fontSize: '1rem' }}>{report.sownMonthYear}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', padding: '10px', background: '#f8fafc', borderRadius: '8px' }}>
                <span style={{ color: '#64748b', fontSize: '0.8rem', fontWeight: '600' }}>HARVEST MONTH</span>
                <span style={{ color: '#1e293b', fontWeight: '700', fontSize: '1rem' }}>{report.harvestMonthYear}</span>
              </div>
            </div>

            <h4 style={{ marginTop: '25px', marginBottom: '15px', color: '#334155', borderBottom: '2px solid #e2e8f0', paddingBottom: '5px' }}>Expense Breakdown</h4>
            
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ background: '#f1f5f9', color: '#475569', textAlign: 'left' }}>
                  <th style={{ padding: '8px', borderBottom: '1px solid #cbd5e1' }}>Item</th>
                  <th style={{ padding: '8px', borderBottom: '1px solid #cbd5e1' }}>Quantity</th>
                  <th style={{ padding: '8px', borderBottom: '1px solid #cbd5e1', textAlign: 'right' }}>Cost (₹)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ padding: '8px', borderBottom: '1px solid #e2e8f0' }}>💧 Water</td>
                  <td style={{ padding: '8px', borderBottom: '1px solid #e2e8f0' }}>{report.water} Gal</td>
                  <td style={{ padding: '8px', borderBottom: '1px solid #e2e8f0', textAlign: 'right', fontWeight: '500' }}>{report.waterExp}</td>
                </tr>
                <tr>
                  <td style={{ padding: '8px', borderBottom: '1px solid #e2e8f0' }}>🌱 Fertilizer</td>
                  <td style={{ padding: '8px', borderBottom: '1px solid #e2e8f0' }}>{report.fertilizer} Kg</td>
                  <td style={{ padding: '8px', borderBottom: '1px solid #e2e8f0', textAlign: 'right', fontWeight: '500' }}>{report.fertilizerExp}</td>
                </tr>
                <tr>
                  <td style={{ padding: '8px', borderBottom: '1px solid #e2e8f0' }}>🧪 Pesticides</td>
                  <td style={{ padding: '8px', borderBottom: '1px solid #e2e8f0' }}>{report.pesticides} L</td>
                  <td style={{ padding: '8px', borderBottom: '1px solid #e2e8f0', textAlign: 'right', fontWeight: '500' }}>{report.pesticidesExp}</td>
                </tr>
                <tr>
                  <td style={{ padding: '8px', borderBottom: '1px solid #e2e8f0' }}>🚜 Tractor Hours</td>
                  <td style={{ padding: '8px', borderBottom: '1px solid #e2e8f0' }}>{report.tractorHour} Hrs</td>
                  <td style={{ padding: '8px', borderBottom: '1px solid #e2e8f0', textAlign: 'right', fontWeight: '500' }}>{report.tractorExp}</td>
                </tr>
                <tr>
                  <td style={{ padding: '8px', borderBottom: '1px solid #e2e8f0' }}>🛠️ Agro Tools</td>
                  <td style={{ padding: '8px', borderBottom: '1px solid #e2e8f0' }}>{report.agroTools} Unit</td>
                  <td style={{ padding: '8px', borderBottom: '1px solid #e2e8f0', textAlign: 'right', fontWeight: '500' }}>{report.agroToolsExp}</td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="2" style={{ padding: '12px 8px', fontWeight: '700', fontSize: '1.1rem', color: '#0f172a' }}>TOTAL EXPENSE</td>
                  <td style={{ padding: '12px 8px', textAlign: 'right', fontWeight: '800', fontSize: '1.2rem', color: '#b91c1c' }}>₹ {report.total}</td>
                </tr>
              </tfoot>
            </table>

            <div style={{ 
              background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)', 
              border: '1px solid #a7f3d0', 
              borderRadius: '12px', 
              padding: '16px', 
              marginTop: '20px',
              textAlign: 'center'
            }}>
              <span style={{ color: '#065f46', fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                💰 Total Expense / Acre
              </span>
              <div style={{ color: '#047857', fontSize: '1.8rem', fontWeight: '800', margin: '4px 0' }}>
                ₹{report.cropArea > 0 ? Math.round(report.total / report.cropArea).toLocaleString('en-IN') : 0} <span style={{ fontSize: '0.9rem', fontWeight: '600', color: '#065f46' }}>/ Acre</span>
              </div>
            </div>

            <div style={{ marginTop: '25px', textAlign: 'center' }}>
              <button onClick={() => returnBack()} className="btn btn-secondary" style={{ width: '140px', padding: '10px', fontSize: '1rem' }}>
                Return to List
              </button>
            </div>
          </div>
        </div>
    );
};

export default FinalCropReport;
