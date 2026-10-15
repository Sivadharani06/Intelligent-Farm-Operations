import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import BlurAdminLayout from '../Layout/BlurAdminLayout';
import { getExpectedExpenses } from '../../Services/AIService';
import { addCropInput } from '../../Services/CropInputService';
import '../../DisplayView.css';

const CropInputView = () => {
    let navigate = useNavigate();
    let param = useParams();
    const [showSuccess, setShowSuccess] = useState(false);
    const [loading, setLoading] = useState(true);
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
        setLoading(true);
        getExpectedExpenses(param.cid).then(response => {
            if (response.data) {
                setCropInput(response.data);
            }
        }).catch(error => {
            console.error("Error fetching crop input data", error);
        }).finally(() => {
            setLoading(false);
        });
    }

    useEffect(() => {
        loadCropInputData();
    }, [param.cid]);

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
        <BlurAdminLayout title="CROP RESOURCE INPUTS" breadcrumb="Home / Crops / Resource Estimator">
            <div style={{ maxWidth: '750px', margin: '20px auto' }}>
                <div className="blur-card" style={{ padding: '36px', background: '#0d222a', border: '1.5px solid rgba(255,255,255,0.18)' }}>
                    <div className="menu-header" style={{ marginBottom: '28px', textAlign: 'center' }}>
                        <span className="blur-badge blur-badge-mint" style={{ padding: '5px 14px', fontSize: '0.8rem', fontWeight: '800', marginBottom: '12px', display: 'inline-block' }}>
                            Resource Estimator
                        </span>
                        <h2 style={{ fontSize: '1.9rem', fontWeight: '900', color: '#ffffff', letterSpacing: '-0.02em', margin: 0 }}>
                            Crop #{param.cid} Resource Demands
                        </h2>
                        <p style={{ color: '#00e5ff', fontSize: '1.05rem', fontWeight: '700', marginTop: '8px' }}>
                            Review predicted agricultural resources and input parameters for optimal yield
                        </p>
                    </div>

                    <div className="table-responsive" style={{ margin: '0 0 28px 0', border: '1.5px solid rgba(255,255,255,0.18)' }}>
                        <table className="table">
                            <tbody>
                                <tr>
                                    <th style={{ width: '45%', color: '#00e5ff', fontSize: '0.92rem', fontWeight: '800' }}>🌾 Crop Variety</th>
                                    <td style={{ textAlign: 'right', fontWeight: '800', color: '#ffffff', fontSize: '1.05rem' }}>{cropInput.cropName || 'N/A'}</td>
                                </tr>
                                <tr>
                                    <th style={{ color: '#00e5ff', fontSize: '0.92rem', fontWeight: '800' }}>🪨 Soil Classification</th>
                                    <td style={{ textAlign: 'right', fontWeight: '800', color: '#00d2aa', fontSize: '1.05rem' }}>{cropInput.soil}</td>
                                </tr>
                                <tr>
                                    <th style={{ color: '#00e5ff', fontSize: '0.92rem', fontWeight: '800' }}>🗺️ Cultivated Land Area</th>
                                    <td style={{ textAlign: 'right', fontWeight: '800', color: '#ffffff', fontSize: '1.05rem' }}>{cropInput.cropArea} Acres</td>
                                </tr>
                                <tr>
                                    <th style={{ color: '#00e5ff', fontSize: '0.92rem', fontWeight: '800' }}>📅 Season Window</th>
                                    <td style={{ textAlign: 'right', color: '#ffffff', fontWeight: '700', fontSize: '1rem' }}>{cropInput.sownMonthYear} to {cropInput.harvestMonthYear}</td>
                                </tr>
                                <tr>
                                    <th style={{ color: '#00e5ff', fontSize: '0.92rem', fontWeight: '800' }}>📈 Forecasted Harvest Yield</th>
                                    <td style={{ textAlign: 'right', fontWeight: '900', color: '#00d2aa', fontSize: '1.15rem' }}>{cropInput.yield} / Acre</td>
                                </tr>
                                <tr>
                                    <th style={{ color: '#00e5ff', fontSize: '0.92rem', fontWeight: '800' }}>💧 Water Requirement</th>
                                    <td style={{ textAlign: 'right', color: '#38bdf8', fontWeight: '800', fontSize: '1.05rem' }}>
                                        {loading ? <span style={{ color: '#00e5ff', fontStyle: 'italic', fontSize: '0.88rem' }}>AI Estimating...</span> : `${cropInput.waterGallon} Gal / Acre`}
                                    </td>
                                </tr>
                                <tr>
                                    <th style={{ color: '#00e5ff', fontSize: '0.92rem', fontWeight: '800' }}>🌱 Fertilizer Required</th>
                                    <td style={{ textAlign: 'right', color: '#facc15', fontWeight: '800', fontSize: '1.05rem' }}>
                                        {loading ? <span style={{ color: '#facc15', fontStyle: 'italic', fontSize: '0.88rem' }}>AI Estimating...</span> : `${cropInput.fertilizer} kg / Acre`}
                                    </td>
                                </tr>
                                <tr>
                                    <th style={{ color: '#00e5ff', fontSize: '0.92rem', fontWeight: '800' }}>🛡️ Pesticide Protection</th>
                                    <td style={{ textAlign: 'right', color: '#fb7185', fontWeight: '800', fontSize: '1.05rem' }}>
                                        {loading ? <span style={{ color: '#fb7185', fontStyle: 'italic', fontSize: '0.88rem' }}>AI Estimating...</span> : `${cropInput.pesticides} kg / Acre`}
                                    </td>
                                </tr>
                                <tr>
                                    <th style={{ color: '#00e5ff', fontSize: '0.92rem', fontWeight: '800' }}>🚜 Mechanized Tractor Usage</th>
                                    <td style={{ textAlign: 'right', color: '#c084fc', fontWeight: '800', fontSize: '1.05rem' }}>
                                        {loading ? <span style={{ color: '#c084fc', fontStyle: 'italic', fontSize: '0.88rem' }}>AI Estimating...</span> : `${cropInput.tractorHour} hours / Acre`}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {showSuccess && (
                        <div style={{
                            background: '#07171e',
                            color: '#00d2aa',
                            padding: '14px 20px',
                            borderRadius: '8px',
                            marginBottom: '20px',
                            textAlign: 'center',
                            fontWeight: '800',
                            border: '2px solid #00d2aa'
                        }}>
                            ✓ Crop Resource Inputs saved successfully!
                        </div>
                    )}

                    <div style={{ display: 'flex', gap: '16px', marginTop: '20px' }}>
                        <button 
                            onClick={returnBack}
                            className="btn btn-secondary flex-grow-1"
                            style={{ padding: '12px', fontSize: '1rem', fontWeight: '800' }}
                        >
                            ← Back
                        </button>
                        <button 
                            onClick={handleSave}
                            disabled={loading || !cropInput.waterGallon || cropInput.waterGallon <= 0}
                            className="btn btn-success flex-grow-1"
                            style={{ 
                                padding: '12px', 
                                fontSize: '1rem', 
                                fontWeight: '900',
                                opacity: (loading || !cropInput.waterGallon || cropInput.waterGallon <= 0) ? 0.6 : 1,
                                cursor: (loading || !cropInput.waterGallon || cropInput.waterGallon <= 0) ? 'not-allowed' : 'pointer'
                            }}
                        >
                            {loading ? "Computing Demands..." : "Save Details ✓"}
                        </button>
                    </div>
                </div>
            </div>
        </BlurAdminLayout>
    );
};

export default CropInputView;
