import React,{useState,useEffect} from 'react';
import {useNavigate,useParams,} from 'react-router-dom';
import {getExpectedYield} from  "../../Services/AIService";
import '../../DisplayView.css';

const FarmCropReport=()=>{
    let navigate=useNavigate();
    let param=useParams();
    const [farmCrop,setFarmCrop]=useState({
        farmId:0,
        farmName:"",
         soil:"",
        cropId:"",
        cropName:"",
        cropArea:0.0,
        sownMonthYear:"",
        harvestMonthYear:"",
        yield:0.0,
        comments:""
    });

    const setFarmCropData=()=>{
        getExpectedYield(param.cid).then(response=>{
          setFarmCrop(response.data);
      });
      }
     
      useEffect(() => {
         setFarmCropData();
       }, []);
     
       const returnBack=()=>{
        navigate('/crop-list');  
     }
    
      return (
    <div 
      style={{
        backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.4), rgba(15, 23, 42, 0.6)), url('https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=2832&q=80')`,
        height: '100vh',
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
            maxWidth: '450px', 
            width: '100%',
            textAlign: 'left',
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(15px)',
            WebkitBackdropFilter: 'blur(15px)',
            borderRadius: '20px',
            boxShadow: '0 15px 35px rgba(0,0,0,0.15)',
            padding: '28px'
          }}>
            <h2 className="text-center" style={{ display: 'block', marginBottom: '8px', color: '#0f172a', fontWeight: '800', fontSize: '1.4rem' }}>
              Crop Yield Report
            </h2>
            <p className="text-center" style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '20px' }}>
              Detailed records for Crop ID: <strong style={{ color: '#047857' }}>{farmCrop.cropId}</strong>
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '10px' }}>
                <span style={{ color: '#64748b', fontWeight: '500', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                  🌱 <span>Crop Name</span>
                </span>
                <span style={{ color: '#1e293b', fontWeight: '600' }}>{farmCrop.cropName}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '10px' }}>
                <span style={{ color: '#64748b', fontWeight: '500', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                  🏡 <span>Farm Name</span>
                </span>
                <span style={{ color: '#1e293b', fontWeight: '600' }}>{farmCrop.farmName}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '10px' }}>
                <span style={{ color: '#64748b', fontWeight: '500', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                  🟫 <span>Soil Type</span>
                </span>
                <span style={{ color: '#1e293b', fontWeight: '600' }}>{farmCrop.soil}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '10px' }}>
                <span style={{ color: '#64748b', fontWeight: '500', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                  📐 <span>Crop Area</span>
                </span>
                <span style={{ color: '#1e293b', fontWeight: '600' }}>{farmCrop.cropArea} Acres</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '10px' }}>
                <span style={{ color: '#64748b', fontWeight: '500', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                  📅 <span>Sowing Period</span>
                </span>
                <span style={{ color: '#1e293b', fontWeight: '600' }}>{farmCrop.sownMonthYear}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '10px' }}>
                <span style={{ color: '#64748b', fontWeight: '500', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                  🌾 <span>Harvesting Period</span>
                </span>
                <span style={{ color: '#1e293b', fontWeight: '600' }}>{farmCrop.harvestMonthYear}</span>
              </div>

              {/* Special Yield Metric Highlight Card */}
              <div style={{ 
                background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)', 
                border: '1px solid #a7f3d0', 
                borderRadius: '12px', 
                padding: '16px', 
                marginTop: '10px',
                textAlign: 'center'
              }}>
                <span style={{ color: '#065f46', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  🌾 Expected Yield per Acre
                </span>
                <div style={{ color: '#047857', fontSize: '1.75rem', fontWeight: '800', margin: '4px 0' }}>
                  {farmCrop.yield} <span style={{ fontSize: '0.85rem', fontWeight: '600', color: '#065f46' }}>Tons/Acre</span>
                </div>
                <p style={{ color: '#065f46', fontSize: '0.75rem', margin: 0 }}>
                  Calculated dynamically based on crop, area, and soil condition.
                </p>
              </div>

              {/* Comment Section */}
              <div style={{ 
                background: '#f8fafc', 
                border: '1px solid #e2e8f0', 
                borderRadius: '10px', 
                padding: '10px 12px', 
                fontSize: '0.8rem',
                color: '#475569'
              }}>
                <strong style={{ color: '#334155', display: 'block', marginBottom: '4px' }}>💬 Comments / Remarks:</strong>
                {farmCrop.comments || 'No remarks provided for this crop entry.'}
              </div>

            </div>

            <div style={{ marginTop: '30px', textAlign: 'center' }}>
              <button onClick={() => returnBack()} className="btn btn-secondary" style={{ width: '120px' }}>
                Return
              </button>
            </div>
          </div>
        </div>
      );
    };
     
    export default FarmCropReport;
