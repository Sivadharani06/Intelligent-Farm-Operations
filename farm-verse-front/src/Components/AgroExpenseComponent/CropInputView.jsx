import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getExpectedExpenses } from '../../Services/AIService';
import { addCropInput } from '../../Services/CropInputService';

const CropInputView = () => {
    let navigate = useNavigate();
    let param = useParams();
    const [showSuccess, setShowSuccess] = useState(false);
    const [cropInput, setCropInput] = useState({
        cropId: "",
        cropName: "",
        cropArea: 0.0,
        soil: "",
        sownMonthYear: "",
        harvestMonthYear: "",
        yield: 0.0,
        waterGallon: 0.0,
        fertilizer: 0.0,
        pesticides: 0.0,
        tractorHour: 0
    });

    const loadCropInputData = () => {
        getExpectedExpenses(param.cid).then(response => {
            if (response.data) {
                setCropInput(response.data);
            }
        }).catch(error => {
            console.error("Error fetching crop input data", error);
        });
    }

    useEffect(() => {
        loadCropInputData();
    }, []);

    const returnBack = () => {
        navigate('/crop-list');
    }

    const handleSave = () => {
        addCropInput(cropInput).then(response => {
            setShowSuccess(true);
            setTimeout(() => {
                navigate('/crop-list');
            }, 1500);
        }).catch(error => {
            console.error("Error saving crop input data", error);
        });
    }

    return (
        <div 
            style={{
                backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.6), rgba(15, 23, 42, 0.8)), url('https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=2832&q=80')`,
                minHeight: '100vh',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundAttachment: 'fixed',
                padding: '40px 20px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}
        >
            <div style={{
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                borderRadius: '24px',
                padding: '40px',
                boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
                width: '100%',
                maxWidth: '750px'
            }}>
                <div className="text-center mb-4">
                    <span style={{ 
                        background: 'rgba(16, 185, 129, 0.1)', 
                        color: '#059669', 
                        padding: '8px 16px', 
                        borderRadius: '20px', 
                        fontSize: '0.85rem', 
                        fontWeight: '700',
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                        display: 'inline-block',
                        marginBottom: '15px'
                    }}>
                        Resource Estimator
                    </span>
                    <h2 style={{ fontSize: '2.2rem', color: '#0f172a', fontWeight: '800', margin: '0' }}>
                        Crop {param.cid} Inputs
                    </h2>
                    <p style={{ color: '#64748b', marginTop: '8px', fontSize: '1.05rem' }}>
                        Review and confirm the predicted resources for optimal yield.
                    </p>
                </div>

                <div className="table-responsive" style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
                    <table className="table table-hover mb-0" style={{ width: '100%', margin: '0' }}>
                        <tbody>
                            <tr>
                                <th style={{ width: '45%', padding: '16px 24px', color: '#334155', fontWeight: '600', borderBottom: '1px solid #f1f5f9', background: '#f8fafc' }}>🌾 Crop Name</th>
                                <td style={{ padding: '16px 24px', color: '#0f172a', fontWeight: '700', borderBottom: '1px solid #f1f5f9', textAlign: 'right', background: '#f8fafc' }}>{cropInput.cropName || 'N/A'}</td>
                            </tr>
                            <tr>
                                <th style={{ padding: '16px 24px', color: '#57534e', fontWeight: '600', borderBottom: '1px solid #f1f5f9', background: '#f5f5f4' }}>🪨 Soil Type</th>
                                <td style={{ padding: '16px 24px', color: '#44403c', fontWeight: '700', borderBottom: '1px solid #f1f5f9', textAlign: 'right', background: '#f5f5f4' }}>{cropInput.soil}</td>
                            </tr>
                            <tr>
                                <th style={{ padding: '16px 24px', color: '#14532d', fontWeight: '600', borderBottom: '1px solid #f1f5f9', background: '#f0fdf4' }}>🗺️ Crop Area</th>
                                <td style={{ padding: '16px 24px', color: '#166534', fontWeight: '700', borderBottom: '1px solid #f1f5f9', textAlign: 'right', background: '#f0fdf4' }}>{cropInput.cropArea} Acres</td>
                            </tr>
                            <tr>
                                <th style={{ padding: '16px 24px', color: '#7e22ce', fontWeight: '600', borderBottom: '1px solid #f1f5f9', background: '#faf5ff' }}>📅 Timeline</th>
                                <td style={{ padding: '16px 24px', color: '#6b21a8', fontWeight: '700', borderBottom: '1px solid #f1f5f9', textAlign: 'right', background: '#faf5ff' }}>{cropInput.sownMonthYear} to {cropInput.harvestMonthYear}</td>
                            </tr>
                            <tr>
                                <th style={{ padding: '16px 24px', color: '#15803d', fontWeight: '600', borderBottom: '1px solid #f1f5f9', background: '#dcfce7' }}>📈 Expected Yield</th>
                                <td style={{ padding: '16px 24px', color: '#16a34a', fontWeight: '800', borderBottom: '1px solid #f1f5f9', fontSize: '1.05rem', textAlign: 'right', background: '#dcfce7' }}>{cropInput.yield} / Acre</td>
                            </tr>
                            <tr>
                                <th style={{ padding: '16px 24px', color: '#0284c7', fontWeight: '600', borderBottom: '1px solid #f1f5f9', background: '#f0f9ff' }}>💧 Water Requirement</th>
                                <td style={{ padding: '16px 24px', color: '#0369a1', fontWeight: '600', borderBottom: '1px solid #f1f5f9', textAlign: 'right', background: '#f0f9ff' }}>{cropInput.waterGallon} Gal/Acre</td>
                            </tr>
                            <tr>
                                <th style={{ padding: '16px 24px', color: '#d97706', fontWeight: '600', borderBottom: '1px solid #f1f5f9', background: '#fffbeb' }}>🌱 Fertilizer Required</th>
                                <td style={{ padding: '16px 24px', color: '#b45309', fontWeight: '600', borderBottom: '1px solid #f1f5f9', textAlign: 'right', background: '#fffbeb' }}>{cropInput.fertilizer} kg/Acre</td>
                            </tr>
                            <tr>
                                <th style={{ padding: '16px 24px', color: '#dc2626', fontWeight: '600', borderBottom: '1px solid #f1f5f9', background: '#fef2f2' }}>🛡️ Pesticide Usage</th>
                                <td style={{ padding: '16px 24px', color: '#b91c1c', fontWeight: '600', borderBottom: '1px solid #f1f5f9', textAlign: 'right', background: '#fef2f2' }}>{cropInput.pesticides} kg/Acre</td>
                            </tr>
                            <tr>
                                <th style={{ padding: '16px 24px', color: '#4f46e5', fontWeight: '600', borderBottom: 'none', background: '#eef2ff' }}>🚜 Tractor Usage</th>
                                <td style={{ padding: '16px 24px', color: '#4338ca', fontWeight: '600', borderBottom: 'none', textAlign: 'right', background: '#eef2ff' }}>{cropInput.tractorHour} hours/Acre</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {showSuccess && (
                    <div style={{
                        background: '#dcfce7',
                        color: '#166534',
                        padding: '12px 20px',
                        borderRadius: '8px',
                        marginTop: '20px',
                        textAlign: 'center',
                        fontWeight: '600',
                        border: '1px solid #bbf7d0',
                        boxShadow: '0 2px 10px rgba(22, 163, 74, 0.1)'
                    }}>
                        ✓ Crop Inputs saved successfully!
                    </div>
                )}

                <div style={{ display: 'flex', gap: '15px', marginTop: '30px' }}>
                    <button 
                        onClick={returnBack}
                        style={{ flex: 1, padding: '14px', fontSize: '1.05rem', borderRadius: '12px', background: '#f1f5f9', color: '#475569', border: '1px solid #e2e8f0', fontWeight: '600', transition: 'all 0.2s', cursor: 'pointer' }}
                        onMouseOver={(e) => { e.currentTarget.style.background = '#e2e8f0'; e.currentTarget.style.color = '#1e293b'; }}
                        onMouseOut={(e) => { e.currentTarget.style.background = '#f1f5f9'; e.currentTarget.style.color = '#475569'; }}
                    >
                        Return
                    </button>
                    <button 
                        onClick={handleSave}
                        style={{ flex: 2, padding: '14px', fontSize: '1.05rem', borderRadius: '12px', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: 'white', border: 'none', fontWeight: '700', boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)', transition: 'all 0.2s', cursor: 'pointer' }}
                        onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(16, 185, 129, 0.4)'; }}
                        onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 15px rgba(16, 185, 129, 0.3)'; }}
                    >
                        Save Details ✓
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CropInputView;
