import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import BlurAdminLayout from '../Layout/BlurAdminLayout';
import { getCropsByUsername, deleteCropById } from "../../Services/CropService";
import '../../DisplayView.css';

const CropList = () => {
    const [crops, setCrops] = useState([]);
    let navigate = useNavigate();

    const setCropData = () => {
        getCropsByUsername().then((response) => {
            let sortedCrops = (response.data || []).sort((a, b) => a.cropId - b.cropId);
            setCrops(sortedCrops);
        }).catch(error => {
            console.error("Error loading crops: ", error);
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
            console.error("Error deleting crop: ", error);
        });
    }

    const returnBack = () => {
        navigate('/farmer-menu');
    }

    const formatMonthYear = (dateStr) => {
        if (!dateStr) return "N/A";
        const [year, month] = dateStr.split('-');
        if (!year || !month) return dateStr;
        const date = new Date(year, month - 1);
        return date.toLocaleString('default', { month: 'short', year: 'numeric' });
    };

    return (
        <BlurAdminLayout title="CROP OPERATIONS" breadcrumb="Home / Crops / Crops List">
            <div className="farmer-menu-container" style={{ background: '#0d222a', border: '1.5px solid rgba(255,255,255,0.18)' }}>
                <div className="menu-header" style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <h1 className="menu-title" style={{ fontSize: '2.1rem', fontWeight: '900', color: '#ffffff' }}>Crop Operations Center</h1>
                    <p className="menu-subtitle" style={{ color: '#00e5ff', fontSize: '1.05rem', fontWeight: '700' }}>Planting timelines, harvesting schedules, resource inputs & yield calculations</p>
                </div>

                {crops.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '50px 20px', background: '#07171e', borderRadius: '12px', border: '1.5px solid rgba(255,255,255,0.15)' }}>
                        <h4 style={{ color: '#ffffff', fontWeight: '800' }}>No crops registered yet.</h4>
                        <p style={{ color: '#cbd5e1', fontSize: '0.95rem', marginBottom: '20px' }}>Add your first crop to track inputs, yield metrics and cost operations.</p>
                        <button className="btn btn-primary" onClick={() => navigate('/crop-add')}>+ Add a Crop</button>
                    </div>
                ) : (
                    <div className="blur-cards-grid">
                        {crops.map((crop) => (
                            <div key={crop.cropId} className="blur-feature-card" style={{ background: '#07171e', border: '1.5px solid rgba(255,255,255,0.18)' }}>
                                <div className="blur-card-icon-banner">
                                    <div className="blur-card-icon-wrap" style={{ background: 'rgba(0, 194, 255, 0.2)', color: '#00c2ff' }}>
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
                                        </svg>
                                    </div>
                                    <span className="blur-badge blur-badge-cyan" style={{ padding: '4px 10px', fontSize: '0.78rem', fontWeight: '800' }}>Crop #{crop.cropId}</span>
                                </div>
                                
                                <h3 className="blur-card-title" style={{ fontSize: '1.35rem', fontWeight: '900', color: '#ffffff', margin: '8px 0' }}>{crop.cropName}</h3>
                                
                                <div style={{ margin: '12px 0 18px 0', borderTop: '1px solid rgba(255,255,255,0.12)', paddingTop: '12px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: '0.9rem' }}>
                                        <span style={{ color: '#00e5ff', fontWeight: '800' }}>FARM PLOT ID</span>
                                        <span style={{ fontWeight: '800', color: '#ffffff' }}>Plot #{crop.farmId}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: '0.9rem' }}>
                                        <span style={{ color: '#00e5ff', fontWeight: '800' }}>CULTIVATED AREA</span>
                                        <span style={{ fontWeight: '800', color: '#ffffff' }}>{crop.cropArea} Acres</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: '0.9rem' }}>
                                        <span style={{ color: '#00e5ff', fontWeight: '800' }}>SOWN PERIOD</span>
                                        <span style={{ fontWeight: '700', color: '#ffffff' }}>{formatMonthYear(crop.sownMonthYear)}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: '0.9rem' }}>
                                        <span style={{ color: '#00e5ff', fontWeight: '800' }}>HARVEST PERIOD</span>
                                        <span style={{ fontWeight: '700', color: '#ffffff' }}>{formatMonthYear(crop.harvestMonthYear)}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: '0.9rem' }}>
                                        <span style={{ color: '#00e5ff', fontWeight: '800' }}>RECORDED YIELD</span>
                                        <span style={{ fontWeight: '900', color: '#00d2aa', fontSize: '1rem' }}>{crop.yield || 0} Tons</span>
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: 'auto' }}>
                                    <Link to={`/farm-crop/${crop.cropId}`} style={{ textDecoration: 'none' }}>
                                        <button className="blur-btn blur-btn-secondary w-100" style={{ padding: '8px 6px', fontSize: '0.82rem', fontWeight: '800' }}>
                                            Yield AI
                                        </button>
                                    </Link>
                                    <Link to={`/crop-input/${crop.cropId}`} style={{ textDecoration: 'none' }}>
                                        <button className="blur-btn blur-btn-secondary w-100" style={{ padding: '8px 6px', fontSize: '0.82rem', fontWeight: '800' }}>
                                            Inputs
                                        </button>
                                    </Link>
                                    <Link to={`/final-crop-report/${crop.cropId}`} style={{ textDecoration: 'none' }}>
                                        <button className="blur-btn blur-btn-secondary w-100" style={{ padding: '8px 6px', fontSize: '0.82rem', fontWeight: '800' }}>
                                            Final Report
                                        </button>
                                    </Link>
                                    <Link to={`/crop-profit-report/${crop.cropId}`} style={{ textDecoration: 'none' }}>
                                        <button className="blur-btn blur-btn-primary w-100" style={{ padding: '8px 6px', fontSize: '0.82rem', fontWeight: '900', background: '#00d2aa', borderColor: '#00d2aa', color: '#07161c' }}>
                                            💰 Profit AI
                                        </button>
                                    </Link>
                                </div>
                                <div style={{ marginTop: '8px' }}>
                                    <button className="btn btn-outline-danger w-100" style={{ padding: '7px 10px', fontSize: '0.82rem', fontWeight: '800' }} onClick={() => removeCrop(crop.cropId)}>
                                        Delete Crop
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

export default CropList;