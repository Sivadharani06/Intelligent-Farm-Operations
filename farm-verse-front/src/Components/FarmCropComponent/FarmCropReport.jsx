import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import BlurAdminLayout from '../Layout/BlurAdminLayout';
import { getExpectedYield } from "../../Services/AIService";
import { getFarmCropById, getCropsByUsername } from "../../Services/CropService";
import '../../DisplayView.css';

const FarmCropReport = () => {
    let navigate = useNavigate();
    let param = useParams();
    const [crops, setCrops] = useState([]);
    const [selectedCropId, setSelectedCropId] = useState(param.cid || '');
    const [loading, setLoading] = useState(false);
    const [aiProcessing, setAiProcessing] = useState(false);
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

    // Load user's registered crops
    useEffect(() => {
        getCropsByUsername().then((res) => {
            const list = res.data || [];
            setCrops(list);
            if (!param.cid && list.length > 0) {
                setSelectedCropId(list[0].cropId);
            }
        }).catch(err => {
            console.error("Error fetching crop list:", err);
        });
    }, [param.cid]);

    // Load report for selected crop
    useEffect(() => {
        const targetId = param.cid || selectedCropId;
        if (!targetId) return;

        setLoading(true);
        getFarmCropById(targetId).then(res => {
            if (res.data && res.data.yield && res.data.yield > 0) {
                setFarmCrop(res.data);
                setLoading(false);
            } else {
                setAiProcessing(true);
                getExpectedYield(targetId).then(response => {
                    setFarmCrop(response.data);
                    setLoading(false);
                    setAiProcessing(false);
                }).catch(err => {
                    console.error("Error in getExpectedYield: ", err);
                    setFarmCrop(res.data || {});
                    setLoading(false);
                    setAiProcessing(false);
                });
            }
        }).catch(err => {
            console.error("Error in getFarmCropById: ", err);
            setLoading(false);
        });
    }, [param.cid, selectedCropId]);

    const handleCropSelect = (cid) => {
        setSelectedCropId(cid);
        navigate(`/yield-predictions/${cid}`);
    };

    const handleReanalyzeAI = () => {
        const targetId = param.cid || selectedCropId;
        if (!targetId) return;
        setAiProcessing(true);
        getExpectedYield(targetId).then(response => {
            setFarmCrop(response.data);
            setAiProcessing(false);
        }).catch(err => {
            console.error("Error recalculating yield: ", err);
            setAiProcessing(false);
        });
    };

    const returnBack = () => {
        navigate('/crop-list');  
    };

    return (
        <BlurAdminLayout title="YIELD AI ANALYSIS" breadcrumb="Home / Crops / Yield Prediction">
            <div style={{ maxWidth: '680px', margin: '20px auto' }}>
                
                {/* Crop Selector Header when multiple crops exist */}
                {crops.length > 0 && (
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '12px',
                        marginBottom: '20px',
                        background: '#0d222a',
                        padding: '14px 20px',
                        borderRadius: '12px',
                        border: '1.5px solid rgba(255, 255, 255, 0.18)',
                        flexWrap: 'wrap'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '1.2rem' }}>🌾</span>
                            <span style={{ color: '#00e5ff', fontWeight: '800', fontSize: '0.92rem' }}>SELECT CROP:</span>
                            <select
                                value={param.cid || selectedCropId}
                                onChange={(e) => handleCropSelect(e.target.value)}
                                style={{
                                    background: '#07171e',
                                    color: '#ffffff',
                                    border: '1.5px solid #00d2aa',
                                    borderRadius: '8px',
                                    padding: '7px 14px',
                                    fontWeight: '800',
                                    fontSize: '0.92rem',
                                    cursor: 'pointer',
                                    outline: 'none'
                                }}
                            >
                                {crops.map((c) => (
                                    <option key={c.cropId} value={c.cropId} style={{ background: '#0d222a', color: '#ffffff' }}>
                                        Crop #{c.cropId} - {c.cropName} (Plot #{c.farmId}, {c.cropArea} Ac, {c.soil})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <button 
                            type="button"
                            onClick={handleReanalyzeAI} 
                            disabled={aiProcessing}
                            className="btn btn-outline-info"
                            style={{ 
                                padding: '7px 16px', 
                                fontWeight: '800', 
                                fontSize: '0.84rem',
                                borderRadius: '8px',
                                border: '1.5px solid #00e5ff',
                                color: '#00e5ff',
                                background: 'rgba(0, 229, 255, 0.08)'
                            }}
                        >
                            {aiProcessing ? '⏳ AI Calculating...' : '⚡ Re-Predict AI'}
                        </button>
                    </div>
                )}

                {crops.length === 0 && !loading ? (
                    <div style={{ textAlign: 'center', padding: '40px 20px', background: '#0d222a', borderRadius: '12px', border: '1.5px solid rgba(255,255,255,0.18)' }}>
                        <h3 style={{ color: '#ffffff', fontWeight: '900', marginBottom: '10px' }}>No Crops Registered Yet</h3>
                        <p style={{ color: '#94a3b8', fontSize: '0.95rem', marginBottom: '20px' }}>Please register a crop first to calculate AI yield predictions.</p>
                        <button className="btn btn-primary" onClick={() => navigate('/crop-add')} style={{ padding: '10px 24px', fontWeight: '800' }}>
                            + Add New Crop
                        </button>
                    </div>
                ) : (
                    <div className="blur-card" style={{ padding: '36px', background: '#0d222a', border: '1.5px solid rgba(255,255,255,0.18)' }}>
                        <div className="menu-header" style={{ marginBottom: '28px', textAlign: 'center' }}>
                            <span className="blur-badge blur-badge-cyan" style={{ padding: '5px 14px', fontSize: '0.8rem', fontWeight: '800', marginBottom: '12px', display: 'inline-block' }}>
                                Predictive AI Model
                            </span>
                            <h2 style={{ fontSize: '1.9rem', fontWeight: '900', color: '#ffffff', letterSpacing: '-0.02em', margin: 0 }}>
                                AI Crop Yield Assessment
                            </h2>
                            <p style={{ color: '#00e5ff', fontSize: '1.05rem', fontWeight: '700', marginTop: '8px' }}>
                                Algorithmic yield forecast based on soil and acreage for Crop <span style={{ color: '#ffffff', textDecoration: 'underline' }}>#{farmCrop.cropId || (param.cid || selectedCropId)}</span>
                            </p>
                        </div>

                        {loading ? (
                            <div style={{ textAlign: 'center', padding: '40px 0', color: '#00e5ff', fontWeight: '800' }}>
                                🔄 Fetching AI Yield Prediction...
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', background: '#07171e', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
                                    <span style={{ color: '#00e5ff', fontWeight: '800', fontSize: '0.9rem' }}>CROP VARIETY</span>
                                    <span style={{ fontWeight: '900', color: '#ffffff', fontSize: '1.05rem' }}>{farmCrop.cropName || 'N/A'}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', background: '#07171e', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
                                    <span style={{ color: '#00e5ff', fontWeight: '800', fontSize: '0.9rem' }}>FARM PLOT NAME</span>
                                    <span style={{ fontWeight: '900', color: '#ffffff', fontSize: '1.05rem' }}>{farmCrop.farmName || `Plot #${farmCrop.farmId}`}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', background: '#07171e', borderRadius: '8px', border: '1px solid rgba(0, 210, 170, 0.3)' }}>
                                    <span style={{ color: '#00e5ff', fontWeight: '800', fontSize: '0.9rem' }}>SOIL CLASSIFICATION</span>
                                    <span style={{ fontWeight: '900', color: '#00d2aa', fontSize: '1.05rem' }}>{farmCrop.soil || 'N/A'}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', background: '#07171e', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
                                    <span style={{ color: '#00e5ff', fontWeight: '800', fontSize: '0.9rem' }}>CULTIVATED AREA</span>
                                    <span style={{ fontWeight: '900', color: '#ffffff', fontSize: '1.05rem' }}>{farmCrop.cropArea} Acres</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', background: '#07171e', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
                                    <span style={{ color: '#00e5ff', fontWeight: '800', fontSize: '0.9rem' }}>SOWN TIMELINE</span>
                                    <span style={{ fontWeight: '800', color: '#ffffff', fontSize: '1rem' }}>{farmCrop.sownMonthYear || 'N/A'}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', background: '#07171e', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
                                    <span style={{ color: '#00e5ff', fontWeight: '800', fontSize: '0.9rem' }}>HARVEST TIMELINE</span>
                                    <span style={{ fontWeight: '800', color: '#ffffff', fontSize: '1rem' }}>{farmCrop.harvestMonthYear || 'N/A'}</span>
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
                                        {farmCrop.yield || 0} <span style={{ fontSize: '1rem', color: '#00d2aa', fontWeight: '800' }}>Tons/Acre</span>
                                    </div>
                                    <div style={{ color: '#00e5ff', fontSize: '1rem', fontWeight: '800', marginBottom: '8px' }}>
                                        Estimated Total Harvest: {((farmCrop.yield || 0) * (farmCrop.cropArea || 0)).toFixed(2)} Tons
                                    </div>
                                    <p style={{ color: '#e2e8f0', fontSize: '0.85rem', margin: 0, fontWeight: '600' }}>
                                        AI estimate trained on soil nutrients, rainfall forecasts and historical yield cycles.
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
                                    <span style={{ color: '#e2e8f0', fontWeight: '600', lineHeight: '1.5' }}>
                                        {farmCrop.comments || 'Optimal growth conditions observed. Maintain recommended soil moisture and nutrient schedule.'}
                                    </span>
                                </div>
                            </div>
                        )}

                        <div style={{ marginTop: '30px', textAlign: 'center' }}>
                            <button onClick={returnBack} className="btn btn-secondary" style={{ padding: '12px 32px', fontSize: '1rem', fontWeight: '800' }}>
                                ← Back to Crop List
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </BlurAdminLayout>
    );
};

export default FarmCropReport;
