import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import BlurAdminLayout from '../Layout/BlurAdminLayout';
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

    const handleDownloadReport = () => {
        const docHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>FarmVerse - Final Crop Report #${report.cropId || param.cid}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #07161c; color: #ffffff; padding: 32px; margin: 0; }
    .container { max-width: 800px; margin: 0 auto; background: #0d222a; border: 1.5px solid rgba(255,255,255,0.2); border-radius: 12px; padding: 32px; }
    h2 { font-size: 24px; font-weight: 900; color: #ffffff; margin-bottom: 6px; }
    .sub { color: #00e5ff; font-size: 14px; font-weight: 700; margin-bottom: 24px; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 24px; }
    .box { background: #07171e; border: 1px solid rgba(255,255,255,0.15); border-radius: 8px; padding: 14px; }
    .k { color: #00e5ff; font-size: 11px; font-weight: 800; text-transform: uppercase; }
    .v { color: #ffffff; font-size: 18px; font-weight: 900; margin-top: 4px; }
    table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 13px; }
    th { background: #061318; color: #00e5ff; padding: 10px 14px; text-align: left; font-weight: 800; border-bottom: 1.5px solid rgba(255,255,255,0.15); }
    td { padding: 10px 14px; border-bottom: 1px solid rgba(255,255,255,0.08); color: #ffffff; }
    .total-banner { display: flex; justify-content: space-between; padding: 14px 18px; background: #07171e; border: 2px solid #00d2aa; border-radius: 8px; margin: 20px 0; font-weight: 900; }
    .footer { text-align: center; font-size: 12px; color: #94a3b8; margin-top: 24px; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <h2>Final Crop Yield & Expense Audit</h2>
    <div class="sub">Crop ID: #${report.cropId || param.cid} • Generated on ${new Date().toLocaleDateString('en-IN')}</div>
    <div class="grid">
      <div class="box"><div class="k">Crop Name</div><div class="v">${report.cropName || 'N/A'}</div></div>
      <div class="box"><div class="k">Farm Plot</div><div class="v">${report.farmName || 'Plot A'}</div></div>
      <div class="box"><div class="k">Soil Type</div><div class="v" style="color:#00d2aa">${report.soil || 'Alluvial'}</div></div>
      <div class="box"><div class="k">Cultivated Area</div><div class="v">${report.cropArea} Acres</div></div>
      <div class="box"><div class="k">Sown Timeline</div><div class="v">${report.sownMonthYear || 'N/A'}</div></div>
      <div class="box"><div class="k">Harvest Timeline</div><div class="v">${report.harvestMonthYear || 'N/A'}</div></div>
    </div>
    <table>
      <thead>
        <tr><th>Resource Item</th><th>Quantity</th><th style="text-align: right">Cost (₹)</th></tr>
      </thead>
      <tbody>
        <tr><td>💧 Water Irrigation</td><td>${report.water} Gal</td><td style="text-align: right; color:#00d2aa; font-weight:bold">₹${report.waterExp}</td></tr>
        <tr><td>🌱 Fertilizer Application</td><td>${report.fertilizer} Kg</td><td style="text-align: right; color:#00d2aa; font-weight:bold">₹${report.fertilizerExp}</td></tr>
        <tr><td>🧪 Pesticide Treatments</td><td>${report.pesticides} L</td><td style="text-align: right; color:#00d2aa; font-weight:bold">₹${report.pesticidesExp}</td></tr>
        <tr><td>🚜 Tractor Mechanical Hours</td><td>${report.tractorHour} Hrs</td><td style="text-align: right; color:#00d2aa; font-weight:bold">₹${report.tractorExp}</td></tr>
        <tr><td>🛠️ Farm Implements & Tools</td><td>${report.agroTools} Unit</td><td style="text-align: right; color:#00d2aa; font-weight:bold">₹${report.agroToolsExp}</td></tr>
      </tbody>
    </table>
    <div class="total-banner">
      <span>TOTAL EXPENDITURE / ACRE</span>
      <span style="color:#00d2aa; font-size: 20px">₹ ${report.total?.toFixed(2)}</span>
    </div>
    <div class="footer">FarmVerse • Intelligent Farm Operations Platform</div>
  </div>
</body>
</html>`;
        const blob = new Blob([docHtml], { type: 'text/html;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `FarmVerse_FinalCropReport_#${report.cropId || param.cid}.html`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    return (
        <BlurAdminLayout title="FINAL CROP REPORT" breadcrumb="Home / Crops / Final Crop Report">
            <div style={{ maxWidth: '780px', margin: '20px auto' }}>
                <div className="blur-card" style={{ padding: '36px', background: '#0d222a', border: '1.5px solid rgba(255,255,255,0.18)', borderRadius: '14px' }}>
                    
                    {/* Header */}
                    <div className="menu-header" style={{ marginBottom: '28px', textAlign: 'center' }}>
                        <h2 style={{ fontSize: '2rem', fontWeight: '900', color: '#ffffff', letterSpacing: '-0.02em', margin: 0 }}>
                            Final Crop Yield & Expense Audit
                        </h2>
                        <p style={{ color: '#00e5ff', fontSize: '1.05rem', fontWeight: '700', marginTop: '8px' }}>
                            Comprehensive analytical audit for Crop ID: <span style={{ color: '#ffffff', textDecoration: 'underline' }}>#{report.cropId}</span>
                        </p>
                    </div>

                    {/* 6 Key Crop Metrics Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '32px' }}>
                        <div style={{ padding: '14px 18px', background: '#07171e', borderRadius: '10px', border: '1.5px solid rgba(0, 229, 255, 0.25)' }}>
                            <span style={{ color: '#00e5ff', fontSize: '0.8rem', fontWeight: '800', letterSpacing: '0.06em', textTransform: 'uppercase' }}>CROP NAME</span>
                            <div style={{ color: '#ffffff', fontWeight: '900', fontSize: '1.25rem', marginTop: '4px' }}>{report.cropName || 'N/A'}</div>
                        </div>

                        <div style={{ padding: '14px 18px', background: '#07171e', borderRadius: '10px', border: '1.5px solid rgba(0, 229, 255, 0.25)' }}>
                            <span style={{ color: '#00e5ff', fontSize: '0.8rem', fontWeight: '800', letterSpacing: '0.06em', textTransform: 'uppercase' }}>FARM PLOT</span>
                            <div style={{ color: '#ffffff', fontWeight: '900', fontSize: '1.25rem', marginTop: '4px' }}>{report.farmName || 'Plot A'}</div>
                        </div>

                        <div style={{ padding: '14px 18px', background: '#07171e', borderRadius: '10px', border: '1.5px solid rgba(0, 210, 170, 0.35)' }}>
                            <span style={{ color: '#00e5ff', fontSize: '0.8rem', fontWeight: '800', letterSpacing: '0.06em', textTransform: 'uppercase' }}>SOIL TYPE</span>
                            <div style={{ color: '#00d2aa', fontWeight: '900', fontSize: '1.25rem', marginTop: '4px' }}>{report.soil || 'Alluvial'}</div>
                        </div>

                        <div style={{ padding: '14px 18px', background: '#07171e', borderRadius: '10px', border: '1.5px solid rgba(0, 229, 255, 0.25)' }}>
                            <span style={{ color: '#00e5ff', fontSize: '0.8rem', fontWeight: '800', letterSpacing: '0.06em', textTransform: 'uppercase' }}>CROP AREA</span>
                            <div style={{ color: '#ffffff', fontWeight: '900', fontSize: '1.25rem', marginTop: '4px' }}>{report.cropArea} Acres</div>
                        </div>

                        <div style={{ padding: '14px 18px', background: '#07171e', borderRadius: '10px', border: '1.5px solid rgba(255, 255, 255, 0.15)' }}>
                            <span style={{ color: '#00e5ff', fontSize: '0.8rem', fontWeight: '800', letterSpacing: '0.06em', textTransform: 'uppercase' }}>SOWN TIMELINE</span>
                            <div style={{ color: '#ffffff', fontWeight: '800', fontSize: '1.15rem', marginTop: '4px' }}>{report.sownMonthYear || 'N/A'}</div>
                        </div>

                        <div style={{ padding: '14px 18px', background: '#07171e', borderRadius: '10px', border: '1.5px solid rgba(255, 255, 255, 0.15)' }}>
                            <span style={{ color: '#00e5ff', fontSize: '0.8rem', fontWeight: '800', letterSpacing: '0.06em', textTransform: 'uppercase' }}>HARVEST TIMELINE</span>
                            <div style={{ color: '#ffffff', fontWeight: '800', fontSize: '1.15rem', marginTop: '4px' }}>{report.harvestMonthYear || 'N/A'}</div>
                        </div>
                    </div>

                    {/* Resource Table */}
                    <h4 style={{ fontSize: '1rem', fontWeight: '900', color: '#00d2aa', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '14px' }}>
                        INPUT RESOURCE EXPENDITURE
                    </h4>
                    
                    <div className="table-responsive" style={{ margin: '0 0 24px 0', border: '1.5px solid rgba(255,255,255,0.18)' }}>
                        <table className="table" style={{ margin: 0 }}>
                            <thead>
                                <tr style={{ background: '#061318' }}>
                                    <th style={{ color: '#00e5ff', fontSize: '0.88rem', fontWeight: '800', padding: '14px 18px' }}>Resource Item</th>
                                    <th style={{ color: '#00e5ff', fontSize: '0.88rem', fontWeight: '800', padding: '14px 18px' }}>Quantity</th>
                                    <th style={{ color: '#00e5ff', fontSize: '0.88rem', fontWeight: '800', textAlign: 'right', padding: '14px 18px' }}>Cost (₹)</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td style={{ color: '#ffffff', fontWeight: '700', fontSize: '0.95rem' }}>💧 Water Irrigation</td>
                                    <td style={{ color: '#e2e8f0', fontWeight: '600' }}>{report.water} Gal</td>
                                    <td style={{ textAlign: 'right', fontWeight: '900', color: '#00d2aa', fontSize: '1.05rem' }}>₹{report.waterExp}</td>
                                </tr>
                                <tr>
                                    <td style={{ color: '#ffffff', fontWeight: '700', fontSize: '0.95rem' }}>🌱 Fertilizer Application</td>
                                    <td style={{ color: '#e2e8f0', fontWeight: '600' }}>{report.fertilizer} Kg</td>
                                    <td style={{ textAlign: 'right', fontWeight: '900', color: '#00d2aa', fontSize: '1.05rem' }}>₹{report.fertilizerExp}</td>
                                </tr>
                                <tr>
                                    <td style={{ color: '#ffffff', fontWeight: '700', fontSize: '0.95rem' }}>🧪 Pesticide Treatments</td>
                                    <td style={{ color: '#e2e8f0', fontWeight: '600' }}>{report.pesticides} L</td>
                                    <td style={{ textAlign: 'right', fontWeight: '900', color: '#00d2aa', fontSize: '1.05rem' }}>₹{report.pesticidesExp}</td>
                                </tr>
                                <tr>
                                    <td style={{ color: '#ffffff', fontWeight: '700', fontSize: '0.95rem' }}>🚜 Tractor Mechanical Hours</td>
                                    <td style={{ color: '#e2e8f0', fontWeight: '600' }}>{report.tractorHour} Hrs</td>
                                    <td style={{ textAlign: 'right', fontWeight: '900', color: '#00d2aa', fontSize: '1.05rem' }}>₹{report.tractorExp}</td>
                                </tr>
                                <tr>
                                    <td style={{ color: '#ffffff', fontWeight: '700', fontSize: '0.95rem' }}>🛠️ Farm Implements & Tools</td>
                                    <td style={{ color: '#e2e8f0', fontWeight: '600' }}>{report.agroTools} Unit</td>
                                    <td style={{ textAlign: 'right', fontWeight: '900', color: '#00d2aa', fontSize: '1.05rem' }}>₹{report.agroToolsExp}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Total Cost Banner */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 24px', background: '#07171e', borderRadius: '10px', border: '2px solid #00d2aa', marginBottom: '24px' }}>
                        <span style={{ fontWeight: '900', fontSize: '1.1rem', color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.05em' }}>TOTAL EXPENDITURE / ACRE</span>
                        <span style={{ fontWeight: '900', fontSize: '1.65rem', color: '#00d2aa' }}>₹ {report.total?.toFixed(2)}</span>
                    </div>

                    {/* Efficiency Metrics */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '28px' }}>
                        <div style={{ background: '#07171e', border: '1.5px solid rgba(0, 210, 170, 0.35)', borderRadius: '10px', padding: '18px', textAlign: 'center' }}>
                            <span style={{ color: '#00d2aa', fontSize: '0.82rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                💰 Total Cost / Acre
                            </span>
                            <div style={{ color: '#ffffff', fontSize: '1.5rem', fontWeight: '900', margin: '6px 0' }}>
                                ₹{report.cropArea > 0 ? Math.round(report.total).toLocaleString('en-IN') : 0}
                            </div>
                        </div>

                        <div style={{ background: '#07171e', border: '1.5px solid rgba(0, 229, 255, 0.35)', borderRadius: '10px', padding: '18px', textAlign: 'center' }}>
                            <span style={{ color: '#00e5ff', fontSize: '0.82rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                📈 Efficiency / Ton
                            </span>
                            <div style={{ color: '#ffffff', fontSize: '1.5rem', fontWeight: '900', margin: '6px 0' }}>
                                ₹{report.yield > 0 ? Math.round(report.total / report.yield).toLocaleString('en-IN') : 0}
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons: Links to Return & Calculate Profit */}
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
                        <button onClick={returnBack} className="btn btn-secondary" style={{ padding: '12px 24px', fontSize: '1rem', fontWeight: '800' }}>
                            ← Back to Crop List
                        </button>
                        <button 
                            onClick={handleDownloadReport} 
                            className="btn btn-outline-info" 
                            style={{ padding: '12px 24px', fontSize: '1rem', fontWeight: '800', borderColor: '#00e5ff', color: '#00e5ff', display: 'flex', alignItems: 'center', gap: '6px' }}
                        >
                            <span>📥</span> Download Report
                        </button>
                        <button 
                            onClick={() => navigate(`/crop-profit-report/${param.cid}`)} 
                            className="btn btn-primary" 
                            style={{ padding: '12px 28px', fontSize: '1rem', fontWeight: '900', background: '#00d2aa', borderColor: '#00d2aa', color: '#07161c' }}
                        >
                            💰 Calculate Profit & AI Review →
                        </button>
                    </div>

                </div>
            </div>
        </BlurAdminLayout>
    );
};

export default FinalCropReport;
