import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getCropExpenseCalculation } from '../../Services/CropInputService';
import { getCropById } from '../../Services/CropService';

const CropExpenseView = () => {
    let navigate = useNavigate();
    let param = useParams();
    
    const [expenseCostPerAcre, setExpenseCostPerAcre] = useState(0.0);
    const [crop, setCrop] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch expense per acre
                const expenseRes = await getCropExpenseCalculation(param.cid);
                setExpenseCostPerAcre(expenseRes.data || 0.0);

                // Fetch crop details
                const cropRes = await getCropById(param.cid);
                setCrop(cropRes.data);
                
                setLoading(false);
            } catch (error) {
                console.error("Error fetching crop expense data", error);
                setLoading(false);
            }
        };
        fetchData();
    }, [param.cid]);

    const returnBack = () => {
        navigate('/crop-list');
    }

    const totalCost = crop ? expenseCostPerAcre * crop.cropArea : 0;

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
                        Expense Estimator
                    </span>
                    <h2 style={{ fontSize: '2.2rem', color: '#0f172a', fontWeight: '800', margin: '0' }}>
                        Crop {param.cid} Estimated Expenses
                    </h2>
                    <p style={{ color: '#64748b', marginTop: '8px', fontSize: '1.05rem' }}>
                        Review the estimated cost breakdown for this crop.
                    </p>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '40px' }}>Loading...</div>
                ) : (
                    <div className="table-responsive" style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
                        <table className="table table-hover mb-0" style={{ width: '100%', margin: '0' }}>
                            <tbody>
                                <tr>
                                    <th style={{ width: '45%', padding: '16px 24px', color: '#334155', fontWeight: '600', borderBottom: '1px solid #f1f5f9', background: '#f8fafc' }}>🌾 Crop Name</th>
                                    <td style={{ padding: '16px 24px', color: '#0f172a', fontWeight: '700', borderBottom: '1px solid #f1f5f9', textAlign: 'right', background: '#f8fafc' }}>{crop?.cropName || 'N/A'}</td>
                                </tr>
                                <tr>
                                    <th style={{ padding: '16px 24px', color: '#14532d', fontWeight: '600', borderBottom: '1px solid #f1f5f9', background: '#f0fdf4' }}>🗺️ Crop Area</th>
                                    <td style={{ padding: '16px 24px', color: '#166534', fontWeight: '700', borderBottom: '1px solid #f1f5f9', textAlign: 'right', background: '#f0fdf4' }}>{crop?.cropArea || 0} Acres</td>
                                </tr>
                                <tr>
                                    <th style={{ padding: '16px 24px', color: '#d97706', fontWeight: '600', borderBottom: '1px solid #f1f5f9', background: '#fffbeb' }}>💰 Cost Per Acre</th>
                                    <td style={{ padding: '16px 24px', color: '#b45309', fontWeight: '600', borderBottom: '1px solid #f1f5f9', textAlign: 'right', background: '#fffbeb' }}>${expenseCostPerAcre.toFixed(2)}</td>
                                </tr>
                                <tr>
                                    <th style={{ padding: '16px 24px', color: '#dc2626', fontWeight: '700', borderBottom: 'none', background: '#fef2f2', fontSize: '1.1rem' }}>💵 Total Estimated Cost</th>
                                    <td style={{ padding: '16px 24px', color: '#b91c1c', fontWeight: '800', borderBottom: 'none', textAlign: 'right', background: '#fef2f2', fontSize: '1.2rem' }}>${totalCost.toFixed(2)}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                )}

                <div style={{ display: 'flex', gap: '15px', marginTop: '30px', justifyContent: 'center' }}>
                    <button 
                        onClick={returnBack}
                        style={{ flex: 1, maxWidth: '250px', padding: '14px', fontSize: '1.05rem', borderRadius: '12px', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: 'white', border: 'none', fontWeight: '700', boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)', transition: 'all 0.2s', cursor: 'pointer' }}
                        onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(16, 185, 129, 0.4)'; }}
                        onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 15px rgba(16, 185, 129, 0.3)'; }}
                    >
                        Back to Dashboard
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CropExpenseView;
