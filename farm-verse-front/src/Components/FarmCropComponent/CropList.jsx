import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getCropsByUsername, deleteCropById } from "../../Services/CropService";
import '../../DisplayView.css';

const CropList = () => {
    const [crops, setCrops] = useState([]);
    let navigate = useNavigate();

    const setCropData = () => {
        getCropsByUsername().then((response) => {
            setCrops(response.data || []);
        }).catch(error => {
            alert("Error occurred while loading data: " + error);
        });
    }

    useEffect(() => {
        setCropData();
    }, []);

    const removeCrop = (id) => {
        deleteCropById(id).then(res => {
            let remainCrops = crops.filter((crop) => (crop.cropId !== id));
            setCrops(remainCrops);
        }).catch(error => {
            alert("Error deleting crop: " + error);
        });
    }

    const returnBack = () => {
        navigate('/farmer-menu');
    }

    return (
        <div 
            style={{
                backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.2), rgba(15, 23, 42, 0.4)), url('https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=2832&q=80')`,
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
                maxWidth: '1200px'
            }}>
                
                <div className="menu-header" style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <h1 className="menu-title" style={{ fontSize: '2.5rem', color: '#0f172a', fontWeight: '800' }}>My Crops Dashboard</h1>
                    <p className="menu-subtitle" style={{ color: '#475569', fontSize: '1.1rem', marginTop: '10px' }}>Monitor planting, harvesting, and yield data</p>
                </div>

                {crops.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px', background: 'rgba(255,255,255,0.5)', borderRadius: '16px' }}>
                        <h3 style={{ color: '#334155' }}>No crops registered yet.</h3>
                        <button className="btn btn-success" style={{ marginTop: '20px' }} onClick={() => navigate('/crop-add')}>Add a Crop</button>
                    </div>
                ) : (
                    <div className="dashboard-grid">
                        {crops.map((crop) => (
                            <div key={crop.cropId} className="dashboard-card" style={{ background: 'rgba(255,255,255,0.95)', border: '1px solid rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column' }}>
                                <div className="card-content" style={{ flexGrow: 1, padding: '24px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                                        <h3 className="card-title" style={{ margin: 0, fontSize: '1.5rem', color: '#10b981' }}>{crop.cropName}</h3>
                                        <span style={{ background: '#e2e8f0', color: '#475569', padding: '4px 10px', borderRadius: '12px', fontSize: '0.85rem', fontWeight: '600' }}>Crop ID: {crop.cropId}</span>
                                    </div>
                                    
                                    <div className="card-description" style={{ marginBottom: '20px', color: '#334155' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                                            <span style={{ fontWeight: '600' }}>Farm ID</span>
                                            <span>{crop.farmId}</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                                            <span style={{ fontWeight: '600' }}>Crop Area</span>
                                            <span>{crop.cropArea} Acres</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                                            <span style={{ fontWeight: '600' }}>Sown Date</span>
                                            <span>{crop.sownMonthYear}</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                                            <span style={{ fontWeight: '600' }}>Harvest Date</span>
                                            <span>{crop.harvestMonthYear}</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                                            <span style={{ fontWeight: '600', color: '#0f172a' }}>Yield</span>
                                            <span style={{ fontWeight: '700', color: '#059669' }}>{crop.yield}</span>
                                        </div>
                                    </div>
                                    
                                    <div className="card-actions" style={{ marginTop: 'auto', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                        <Link to={`/farm-crop/${crop.cropId}`} style={{ flex: 1, minWidth: '45%', textDecoration: 'none' }}>
                                            <button className="btn btn-warning" style={{ width: '100%', padding: '8px', borderRadius: '8px', fontWeight: '600', transition: 'all 0.3s', color: '#000' }}>
                                                Check Yield
                                            </button>
                                        </Link>
                                        <Link to={`/crop-input/${crop.cropId}`} style={{ flex: 1, minWidth: '45%', textDecoration: 'none' }}>
                                            <button className="btn btn-info" style={{ width: '100%', padding: '8px', borderRadius: '8px', fontWeight: '600', transition: 'all 0.3s', color: '#fff', backgroundColor: '#0ea5e9', borderColor: '#0ea5e9' }}>
                                                Crop Input
                                            </button>
                                        </Link>
                                        <Link to={`/final-crop-report/${crop.cropId}`} style={{ flex: 1, minWidth: '45%', textDecoration: 'none' }}>
                                            <button className="btn btn-success" style={{ width: '100%', padding: '8px', borderRadius: '8px', fontWeight: '600', transition: 'all 0.3s', color: '#fff' }}>
                                                Final Report
                                            </button>
                                        </Link>

                                        <button className="btn btn-danger" style={{ flex: 1, minWidth: '45%', padding: '8px', borderRadius: '8px', fontWeight: '600', transition: 'all 0.3s' }} onClick={() => removeCrop(crop.cropId)}>
                                            Delete
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

export default CropList;