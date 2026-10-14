import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import BlurAdminLayout from '../Layout/BlurAdminLayout';
import { getExpectedYield } from "../../Services/AIService";
import { getFarmCropById } from "../../Services/CropService";
import '../../DisplayView.css';

const FarmCropReport = () => {
    let navigate = useNavigate();
    let param = useParams();
    const [farmCrop, setFarmCrop] = useState({
        farmId: 0,
        farmName: "",
        soil: "",
        cropId: "",
        cropName: "",
        cropArea: 0.0,
        sownMonthYear: "",
        harvestMonthYear: "",
        yield: 0.0,
        comments: ""
    });

    const setFarmCropData = () => {
        getFarmCropById(param.cid).then(res => {
            if (res.data && res.data.yield && res.data.yield > 0) {
                setFarmCrop(res.data);
            } else {
                getExpectedYield(param.cid).then(response => {
                    setFarmCrop(response.data);
                }).catch(err => {
                    console.error("Error in getExpectedYield: ", err);
                });
            }
        }).catch(err => {
            console.error("Error in getFarmCropById: ", err);
        });
    }

    useEffect(() => {
        setFarmCropData();
    }, [param.cid]);

    const returnBack = () => {
        navigate('/crop-list');  
    }

    return (
        <BlurAdminLayout title="YIELD AI ANALYSIS" breadcrumb="Home / Crops / Yield Prediction">
            <div style={{ maxWidth: '640px', margin: '20px auto' }}>
                <div className="blur-card" style={{ padding: '36px', background: '#0d222a', border: '1.5px solid rgba(255,255,255,0.18)' }}>
                    <div className="menu-header" style={{ marginBottom: '28px', textAlign: 'center' }}>
                        <h2 style={{ fontSize: '1.9rem', fontWeight: '900', color: '#ffffff', letterSpacing: '-0.02em', margin: 0 }}>
                            AI Crop Yield Assessment
                        </h2>
                        <p style={{ color: '#00e5ff', fontSize: '1.05rem', fontWeight: '700', marginTop: '8px' }}>
                            Algorithmic yield forecast based on soil and acreage for Crop <span style={{ color: '#ffffff', textDecoration: 'underline' }}>#{farmCrop.cropId}</span>
                        </p>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', background: '#07171e', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
                            <span style={{ color: '#00e5ff', fontWeight: '800', fontSize: '0.9rem' }}>CROP VARIETY</span>
                            <span style={{ fontWeight: '900', color: '#ffffff', fontSize: '1.05rem' }}>{farmCrop.cropName}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', background: '#07171e', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
                            <span style={{ color: '#00e5ff', fontWeight: '800', fontSize: '0.9rem' }}>FARM PLOT NAME</span>
                            <span style={{ fontWeight: '900', color: '#ffffff', fontSize: '1.05rem' }}>{farmCrop.farmName}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', background: '#07171e', borderRadius: '8px', border: '1px solid rgba(0, 210, 170, 0.3)' }}>
                            <span style={{ color: '#00e5ff', fontWeight: '800', fontSize: '0.9rem' }}>SOIL CLASSIFICATION</span>
                            <span style={{ fontWeight: '900', color: '#00d2aa', fontSize: '1.05rem' }}>{farmCrop.soil}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', background: '#07171e', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
                            <span style={{ color: '#00e5ff', fontWeight: '800', fontSize: '0.9rem' }}>CULTIVATED AREA</span>
                            <span style={{ fontWeight: '900', color: '#ffffff', fontSize: '1.05rem' }}>{farmCrop.cropArea} Acres</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', background: '#07171e', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
                            <span style={{ color: '#00e5ff', fontWeight: '800', fontSize: '0.9rem' }}>SOWN TIMELINE</span>
                            <span style={{ fontWeight: '800', color: '#ffffff', fontSize: '1rem' }}>{farmCrop.sownMonthYear}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', background: '#07171e', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
                            <span style={{ color: '#00e5ff', fontWeight: '800', fontSize: '0.9rem' }}>HARVEST TIMELINE</span>
                            <span style={{ fontWeight: '800', color: '#ffffff', fontSize: '1rem' }}>{farmCrop.harvestMonthYear}</span>
                        </div>

                        {/* Yield Metric Box */}
                        <div style={{ 
                            background: '#07171e', 
                            border: '2px solid #00d2aa', 
                            borderRadius: '10px', 
                            padding: '20px', 
                            marginTop: '10px',
                            textAlign: 'center'
                        }}>
                            <span style={{ color: '#00d2aa', fontSize: '0.85rem', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                                PREDICTED YIELD OUTPUT
                            </span>
                            <div style={{ color: '#ffffff', fontSize: '2.2rem', fontWeight: '900', margin: '8px 0' }}>
                                {farmCrop.yield} <span style={{ fontSize: '1rem', color: '#00d2aa', fontWeight: '800' }}>Tons/Acre</span>
                            </div>
                            <p style={{ color: '#e2e8f0', fontSize: '0.85rem', margin: 0, fontWeight: '600' }}>
                                Machine learning estimate trained on soil nutrients and regional climate seasonality.
                            </p>
                        </div>

                        {/* Comment Section */}
                        <div style={{ 
                            background: '#07171e', 
                            border: '1.5px solid rgba(255, 255, 255, 0.15)', 
                            borderRadius: '8px', 
                            padding: '14px', 
                            fontSize: '0.9rem',
                            color: '#ffffff'
                        }}>
                            <strong style={{ color: '#00e5ff', display: 'block', marginBottom: '6px', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                Agronomist Remarks:
                            </strong>
                            <span style={{ color: '#e2e8f0', fontWeight: '600' }}>
                                {farmCrop.comments || 'Optimal growth conditions observed. Monitor irrigation frequency during heading stage.'}
                            </span>
                        </div>
                    </div>

                    <div style={{ marginTop: '30px', textAlign: 'center' }}>
                        <button onClick={returnBack} className="btn btn-secondary" style={{ padding: '12px 32px', fontSize: '1rem', fontWeight: '800' }}>
                            ← Back to Crop List
                        </button>
                    </div>
                </div>
            </div>
        </BlurAdminLayout>
    );
};

export default FarmCropReport;
