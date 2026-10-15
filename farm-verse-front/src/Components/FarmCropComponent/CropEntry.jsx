import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BlurAdminLayout from '../Layout/BlurAdminLayout';
import { addCrop, generateCropId, getCropsByUsername } from "../../Services/CropService";
import { getFarmsByUsername } from "../../Services/FarmService";
import '../../DisplayView.css';

const CropEntry = () => {
    let navigate = useNavigate();
    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState("");
    const [crop, setCrop] = useState({
        cropId: "",
        farmId: "",
        username: "abcd",
        cropName: "",
        cropArea: "",
        sownMonthYear: "",
        harvestMonthYear: "",
        yield: 0.0,
        comments: "",
    });
    
    const [farms, setFarms] = useState([]);
    const [existingCrops, setExistingCrops] = useState([]);
    const [flag, setFlag] = useState(false);
    const [newId, setNewId] = useState("");

    // Helper: Standard crop growth durations in months
    const getCropDurationMonths = (cropName) => {
        if (!cropName) return 4;
        const name = cropName.toLowerCase().trim();
        if (name.includes('sugar') || name.includes('cane')) return 12; // Sugarcane: 10-12 months
        if (name.includes('turmeric') || name.includes('ginger')) return 9;
        if (name.includes('cotton')) return 6;
        if (name.includes('chilli') || name.includes('pepper')) return 5;
        if (name.includes('rice') || name.includes('paddy') || name.includes('basmati')) return 4;
        if (name.includes('wheat') || name.includes('corn') || name.includes('maize') || name.includes('soybean') || name.includes('potato') || name.includes('onion') || name.includes('groundnut')) return 4;
        if (name.includes('tomato') || name.includes('carrot') || name.includes('bean') || name.includes('cabbage')) return 3;
        return 4; // Default seasonal duration
    };

    // Helper: Calculate harvest month (YYYY-MM) from sown month and crop duration
    const calculateHarvestMonth = (sownStr, cropName) => {
        if (!sownStr || !sownStr.includes('-')) return '';
        const [yearStr, monthStr] = sownStr.split('-');
        let year = parseInt(yearStr, 10);
        let month = parseInt(monthStr, 10);
        if (isNaN(year) || isNaN(month)) return '';

        const duration = getCropDurationMonths(cropName);
        let totalMonths = month + duration;
        while (totalMonths > 12) {
            year += 1;
            totalMonths -= 12;
        }
        return `${year}-${String(totalMonths).padStart(2, '0')}`;
    };
    
    const setCropId = () => {
        generateCropId().then(response => {
            setNewId(response.data);
        }).catch(err => {
            console.error("Error generating Crop ID:", err);
        });
    };

    const loadFarmAndCropData = () => {
        Promise.all([getFarmsByUsername(), getCropsByUsername()]).then(([farmsRes, cropsRes]) => {
            const fetchedFarms = farmsRes.data || [];
            const fetchedCrops = cropsRes.data || [];
            setFarms(fetchedFarms);
            setExistingCrops(fetchedCrops);

            if (fetchedFarms.length > 0) {
                // Default to first or most recent farm
                const defaultFarm = fetchedFarms[fetchedFarms.length - 1];
                setCrop(prev => ({ ...prev, farmId: String(defaultFarm.farmId) }));
            }
        }).catch(err => {
            console.error("Error fetching farms or crops data:", err);
        });
    };

    useEffect(() => {
        setCropId();
        loadFarmAndCropData();
        setFlag(false);
    }, []);

    // Active Farm details and remaining capacity calculation
    const currentFarm = farms.find(f => String(f.farmId) === String(crop.farmId));
    const totalFarmArea = currentFarm ? Number(currentFarm.area || 0) : 0;
    const usedFarmArea = existingCrops
        .filter(c => String(c.farmId) === String(crop.farmId))
        .reduce((sum, c) => sum + Number(c.cropArea || 0), 0);
    const remainingArea = Math.max(0, Math.round((totalFarmArea - usedFarmArea) * 100) / 100);

    const onChangeHandler = (event) => {
        event.persist();
        setFlag(false);
        setServerError("");
        const name = event.target.name;
        const value = event.target.value;

        if (name === "cropName") {
            // Auto-calculate harvest date if sownMonthYear is already chosen
            const autoHarvest = crop.sownMonthYear ? calculateHarvestMonth(crop.sownMonthYear, value) : crop.harvestMonthYear;
            setCrop(values => ({ ...values, cropName: value, harvestMonthYear: autoHarvest || values.harvestMonthYear }));
        } else if (name === "sownMonthYear") {
            // Auto-calculate harvest date when sown month is selected
            const autoHarvest = calculateHarvestMonth(value, crop.cropName);
            setCrop(values => ({ ...values, sownMonthYear: value, harvestMonthYear: autoHarvest || values.harvestMonthYear }));
        } else {
            setCrop(values => ({ ...values, [name]: value }));
        }

        // Live acreage validation check
        if (name === "cropArea" && currentFarm) {
            const entered = Number(value);
            if (entered > remainingArea) {
                setErrors(prev => ({
                    ...prev,
                    cropArea: `Exceeds plot capacity! Only ${remainingArea.toFixed(1)} Acres remaining out of ${totalFarmArea} Acres on Farm #${crop.farmId}.`
                }));
            } else {
                setErrors(prev => {
                    const copy = { ...prev };
                    delete copy.cropArea;
                    return copy;
                });
            }
        }
    };

    const saveCrop = (event) => {
        event.preventDefault();
        setServerError("");
        const cropToSave = {
            ...crop,
            cropId: newId,
            cropArea: Number(crop.cropArea),
            yield: Number(crop.yield),
            farmId: Number(crop.farmId)
        };
        addCrop(cropToSave).then(response => {
            setFlag(true);
            setServerError("");
            // Refresh crop list to update remaining plot capacity
            getCropsByUsername().then(res => setExistingCrops(res.data || []));
        }).catch(err => {
            console.error("Error saving crop:", err);
            const msg = err.response?.data?.message || err.response?.data || "Error saving crop. Please verify entered acreage against farm capacity.";
            setServerError(typeof msg === 'string' ? msg : JSON.stringify(msg));
        });
    };

    const clearAll = (event) => {
        if (event) event.preventDefault();
        setCrop({
            cropId: "",
            farmId: farms.length > 0 ? String(farms[0].farmId) : "",
            username: "abcd",
            cropName: "",
            cropArea: "",
            sownMonthYear: "",
            harvestMonthYear: "",
            yield: 0.0,
            comments: "",
        });
        setErrors({});
        setServerError("");
        setFlag(false);
    };

    const handleValidation = (event) => {
        event.preventDefault();
        let tempErrors = {};
        let isValid = true;

        if (!crop.farmId || String(crop.farmId).trim() === "") {
            tempErrors.farmId = "Farm ID is required";
            isValid = false;
        }

        if (!crop.cropName || !crop.cropName.trim()) {
            tempErrors.cropName = "Crop name is required";
            isValid = false;
        }

        const enteredArea = Number(crop.cropArea);
        if (crop.cropArea === undefined || crop.cropArea === null || String(crop.cropArea).trim() === "" || enteredArea <= 0) {
            tempErrors.cropArea = "Crop area must be greater than 0";
            isValid = false;
        } else if (currentFarm && enteredArea > remainingArea) {
            tempErrors.cropArea = `Exceeds plot capacity! Only ${remainingArea.toFixed(1)} Acres remaining out of ${totalFarmArea} Acres on Farm #${crop.farmId}.`;
            isValid = false;
        }

        if (!crop.sownMonthYear || !crop.sownMonthYear.trim()) {
            tempErrors.sownMonthYear = "Sown month/year is required";
            isValid = false;
        }

        if (!crop.harvestMonthYear || !crop.harvestMonthYear.trim()) {
            tempErrors.harvestMonthYear = "Harvest month/year is required";
            isValid = false;
        }

        if (crop.yield === undefined || crop.yield === null || String(crop.yield).trim() === "" || Number(crop.yield) < 0) {
            tempErrors.yield = "Yield must be a valid number";
            isValid = false;
        }

        setErrors(tempErrors);
        if (isValid) {
            saveCrop(event);
        }
    };

    const returnBack = (event) => {
        if (event) event.preventDefault();
        navigate('/farmer-menu');
    };

    return (
        <BlurAdminLayout title="ADD CROP" breadcrumb="Home / Crops / Add Crop">
            <div style={{ maxWidth: '640px', margin: '20px auto' }}>
                <div className="blur-card" style={{ padding: '36px', background: '#0d222a', border: '1.5px solid rgba(255,255,255,0.18)' }}>
                    <div className="menu-header" style={{ marginBottom: '28px', textAlign: 'center' }}>
                        <h2 style={{ fontSize: '1.9rem', fontWeight: '900', color: '#ffffff', letterSpacing: '-0.02em', margin: 0 }}>Register New Crop</h2>
                        <p style={{ color: '#00e5ff', fontSize: '1.05rem', fontWeight: '700', marginTop: '8px' }}>Enter plot allocation, timelines, and anticipated harvest yield</p>
                    </div>

                    {serverError && (
                        <div style={{ marginBottom: '20px', background: 'rgba(244, 63, 94, 0.15)', border: '1.5px solid #f43f5e', padding: '12px 16px', borderRadius: '8px', color: '#fecdd3', fontWeight: '700', fontSize: '0.92rem' }}>
                            ⚠️ {serverError}
                        </div>
                    )}

                    <form>
                        <div className="form-group text-left" style={{ marginBottom: '18px' }}>
                            <label style={{ color: '#00e5ff', fontWeight: '800', fontSize: '0.9rem' }}>CROP ID (AUTO-GENERATED):</label>
                            <input name="cropId" className="form-control" value={newId} readOnly style={{ background: '#07171e', color: '#00d2aa', fontWeight: '800', fontSize: '1.1rem', border: '1.5px solid rgba(255,255,255,0.15)' }} />
                        </div>

                        <div className="form-group text-left" style={{ marginBottom: '18px' }}>
                            <label style={{ color: '#00e5ff', fontWeight: '800', fontSize: '0.9rem' }}>ASSIGNED FARM PLOT ID:</label>
                            <select name="farmId" className="form-control" value={crop.farmId} onChange={onChangeHandler} style={{ background: '#07171e', color: '#ffffff', fontWeight: '700', fontSize: '1rem', border: '1.5px solid rgba(255,255,255,0.2)' }}>
                                <option value="">Select a Farm ID</option>
                                {farms.map(f => (
                                    <option key={f.farmId} value={f.farmId}>
                                        {f.farmName ? `${f.farmName} (Plot #${f.farmId})` : `Farm Plot #${f.farmId}`} - {f.area} Acres
                                    </option>
                                ))}
                            </select>
                            {errors.farmId && <p style={{ color: "#fb7185", fontSize: "0.85rem", marginTop: "4px", fontWeight: '700' }}>{errors.farmId}</p>}

                            {/* Real-time Farm Plot Capacity Widget */}
                            {currentFarm && (
                                <div style={{
                                    background: remainingArea > 0 ? 'rgba(0, 229, 255, 0.08)' : 'rgba(244, 63, 94, 0.12)',
                                    border: `1.5px solid ${remainingArea > 0 ? 'rgba(0, 229, 255, 0.3)' : '#f43f5e'}`,
                                    borderRadius: '8px',
                                    padding: '10px 14px',
                                    marginTop: '8px',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}>
                                    <div>
                                        <div style={{ color: '#ffffff', fontWeight: '800', fontSize: '0.88rem' }}>
                                            Plot #{currentFarm.farmId} Capacity ({currentFarm.soil || 'General'} Soil)
                                        </div>
                                        <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '2px' }}>
                                            Total: <strong style={{ color: '#fff' }}>{totalFarmArea} Acres</strong> | Used: <strong style={{ color: '#00e5ff' }}>{usedFarmArea.toFixed(1)} Acres</strong>
                                        </div>
                                    </div>
                                    <span style={{
                                        background: remainingArea > 0 ? '#00d2aa' : '#f43f5e',
                                        color: remainingArea > 0 ? '#07161c' : '#ffffff',
                                        padding: '4px 10px',
                                        borderRadius: '6px',
                                        fontWeight: '900',
                                        fontSize: '0.82rem'
                                    }}>
                                        {remainingArea > 0 ? `${remainingArea.toFixed(1)} Acres Remaining` : 'Plot Fully Allocated (0 Acres)'}
                                    </span>
                                </div>
                            )}
                        </div>

                        <div className="form-group text-left" style={{ marginBottom: '18px' }}>
                            <label style={{ color: '#00e5ff', fontWeight: '800', fontSize: '0.9rem' }}>CROP NAME / VARIETY:</label>
                            <input placeholder="e.g. Rice, Sugar cane, Wheat, Cotton" name="cropName" className="form-control" value={crop.cropName} onChange={onChangeHandler} style={{ background: '#07171e', color: '#ffffff', fontWeight: '700', fontSize: '1rem', border: '1.5px solid rgba(255,255,255,0.2)' }} />
                            {errors.cropName && <p style={{ color: "#fb7185", fontSize: "0.85rem", marginTop: "4px", fontWeight: '700' }}>{errors.cropName}</p>}
                        </div>

                        <div className="form-group text-left" style={{ marginBottom: '18px' }}>
                            <label style={{ color: '#00e5ff', fontWeight: '800', fontSize: '0.9rem' }}>
                                CULTIVATED AREA (ACRES):
                                {currentFarm && (
                                    <span style={{ float: 'right', color: remainingArea > 0 ? '#00d2aa' : '#fb7185', fontSize: '0.82rem' }}>
                                        Max available: {remainingArea.toFixed(1)} Acres
                                    </span>
                                )}
                            </label>
                            <input placeholder={remainingArea > 0 ? `e.g. Up to ${remainingArea.toFixed(1)}` : 'No capacity left'} name="cropArea" className="form-control" value={crop.cropArea} onChange={onChangeHandler} style={{ background: '#07171e', color: '#ffffff', fontWeight: '700', fontSize: '1rem', border: errors.cropArea ? '1.5px solid #fb7185' : '1.5px solid rgba(255,255,255,0.2)' }} />
                            {errors.cropArea && <p style={{ color: "#fb7185", fontSize: "0.85rem", marginTop: "4px", fontWeight: '700' }}>{errors.cropArea}</p>}
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '18px' }}>
                            <div className="form-group text-left">
                                <label style={{ color: '#00e5ff', fontWeight: '800', fontSize: '0.9rem' }}>SOWN MONTH & YEAR:</label>
                                <input type="month" name="sownMonthYear" className="form-control" value={crop.sownMonthYear} onChange={onChangeHandler} style={{ background: '#07171e', color: '#ffffff', fontWeight: '700', fontSize: '1rem', border: '1.5px solid rgba(255,255,255,0.2)' }} />
                                {errors.sownMonthYear && <p style={{ color: "#fb7185", fontSize: "0.85rem", marginTop: "4px", fontWeight: '700' }}>{errors.sownMonthYear}</p>}
                            </div>

                            <div className="form-group text-left">
                                <label style={{ color: '#00e5ff', fontWeight: '800', fontSize: '0.9rem' }}>
                                    HARVEST MONTH & YEAR:
                                </label>
                                <input type="month" name="harvestMonthYear" className="form-control" value={crop.harvestMonthYear} onChange={onChangeHandler} style={{ background: '#07171e', color: '#00d2aa', fontWeight: '800', fontSize: '1rem', border: '1.5px solid rgba(255,255,255,0.2)' }} />
                                {errors.harvestMonthYear && <p style={{ color: "#fb7185", fontSize: "0.85rem", marginTop: "4px", fontWeight: '700' }}>{errors.harvestMonthYear}</p>}
                                <p style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '4px', marginBottom: 0 }}>
                                    ✨ Auto-calculated (~{getCropDurationMonths(crop.cropName)} mos cycle for {crop.cropName || 'crop'})
                                </p>
                            </div>
                        </div>

                        <div className="form-group text-left" style={{ marginBottom: '24px' }}>
                            <label style={{ color: '#00e5ff', fontWeight: '800', fontSize: '0.9rem' }}>EXPECTED YIELD (TONS):</label>
                            <input placeholder="e.g. 24.5" name="yield" className="form-control" value={crop.yield} onChange={onChangeHandler} style={{ background: '#07171e', color: '#ffffff', fontWeight: '700', fontSize: '1rem', border: '1.5px solid rgba(255,255,255,0.2)' }} />
                            {errors.yield && <p style={{ color: "#fb7185", fontSize: "0.85rem", marginTop: "4px", fontWeight: '700' }}>{errors.yield}</p>}
                        </div>

                        <div style={{ display: 'flex', gap: '14px', marginTop: '28px' }}>
                            <button className="btn btn-success flex-grow-1" style={{ fontWeight: '900', padding: '12px' }} onClick={handleValidation} disabled={currentFarm && remainingArea <= 0}>
                                Save Crop
                            </button>
                            <button className="btn btn-secondary flex-grow-1" style={{ fontWeight: '800', padding: '12px' }} onClick={clearAll}>Reset</button>
                            <button className="btn btn-secondary flex-grow-1" style={{ fontWeight: '800', padding: '12px' }} onClick={returnBack}>Back</button>
                        </div>
                    </form>

                    {flag && (
                        <div style={{ marginTop: '24px', textAlign: 'center', background: '#07171e', border: '2px solid #00d2aa', padding: '14px', borderRadius: '8px', color: '#00d2aa', fontWeight: '800', fontSize: '1rem' }}>
                            ✓ New Crop Successfully Registered!
                        </div>
                    )}
                </div>
            </div>
        </BlurAdminLayout>
    );
};

export default CropEntry;
