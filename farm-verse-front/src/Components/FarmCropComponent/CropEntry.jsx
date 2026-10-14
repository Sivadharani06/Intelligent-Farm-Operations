import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BlurAdminLayout from '../Layout/BlurAdminLayout';
import { addCrop, generateCropId } from "../../Services/CropService";
import { getAllFarmIdsByUser } from "../../Services/FarmService";
import '../../DisplayView.css';

const CropEntry = () => {
    let navigate = useNavigate();
    const [errors, setErrors] = useState({});
    const [crop, setCrop] = useState({
        cropId: "",
        farmId: "",
        username: "abcd",
        cropName: "",
        cropArea: 0.0,
        sownMonthYear: "",
        harvestMonthYear: "",
        yield: 0.0,
        comments: "",
    });
    
    const [idList, setIdList] = useState([]);
    const [flag, setFlag] = useState(false);
    const [newId, setNewId] = useState("");
    
    const setCropId = () => {
        generateCropId().then(response => {
            setNewId(response.data);
        }).catch(err => {
            console.error("Error generating Crop ID:", err);
        });
    };

    const setFarmIds = () => {
        getAllFarmIdsByUser().then(response => {
            const fetchedIds = response.data || [];
            setIdList(fetchedIds);
            if (fetchedIds.length > 0) {
                const recentId = Math.max(...fetchedIds);
                setCrop(prev => ({ ...prev, farmId: String(recentId) }));
            }
        }).catch(err => {
            console.error("Error fetching farm IDs:", err);
        });
    }

    useEffect(() => {
        setCropId();
        setFarmIds();
        setFlag(false);
    }, []);

    const onChangeHandler = (event) => {
        event.persist();
        setFlag(false);
        const name = event.target.name;
        const value = event.target.value;
        setCrop(values => ({ ...values, [name]: value }));
    };

    const saveCrop = (event) => {
        event.preventDefault();
        const cropToSave = {
            ...crop,
            cropId: newId,
            cropArea: Number(crop.cropArea),
            yield: Number(crop.yield),
            farmId: Number(crop.farmId)
        };
        addCrop(cropToSave).then(response => {
            setFlag(true);
        }).catch(err => {
            console.error("Error saving crop:", err);
        });
    };

    const clearAll = (event) => {
        if (event) event.preventDefault();
        setCrop({
            cropId: "",
            farmId: "",
            username: "abcd",
            cropName: "",
            cropArea: 0.0,
            sownMonthYear: "",
            harvestMonthYear: "",
            yield: 0.0,
            comments: "",
        });
        setErrors({});
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

        if (crop.cropArea === undefined || crop.cropArea === null || String(crop.cropArea).trim() === "" || Number(crop.cropArea) <= 0) {
            tempErrors.cropArea = "Crop area must be greater than 0";
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

                    <form>
                        <div className="form-group text-left" style={{ marginBottom: '18px' }}>
                            <label style={{ color: '#00e5ff', fontWeight: '800', fontSize: '0.9rem' }}>CROP ID (AUTO-GENERATED):</label>
                            <input name="cropId" className="form-control" value={newId} readOnly style={{ background: '#07171e', color: '#00d2aa', fontWeight: '800', fontSize: '1.1rem', border: '1.5px solid rgba(255,255,255,0.15)' }} />
                        </div>

                        <div className="form-group text-left" style={{ marginBottom: '18px' }}>
                            <label style={{ color: '#00e5ff', fontWeight: '800', fontSize: '0.9rem' }}>ASSIGNED FARM PLOT ID:</label>
                            <select name="farmId" className="form-control" value={crop.farmId} onChange={onChangeHandler} style={{ background: '#07171e', color: '#ffffff', fontWeight: '700', fontSize: '1rem', border: '1.5px solid rgba(255,255,255,0.2)' }}>
                                <option value="">Select a Farm ID</option>
                                {idList.map(id => (
                                    <option key={id} value={id}>Farm Plot #{id}</option>
                                ))}
                            </select>
                            {errors.farmId && <p style={{ color: "#fb7185", fontSize: "0.85rem", marginTop: "4px", fontWeight: '700' }}>{errors.farmId}</p>}
                        </div>

                        <div className="form-group text-left" style={{ marginBottom: '18px' }}>
                            <label style={{ color: '#00e5ff', fontWeight: '800', fontSize: '0.9rem' }}>CROP NAME / VARIETY:</label>
                            <input placeholder="e.g. Basmati Rice, Golden Corn" name="cropName" className="form-control" value={crop.cropName} onChange={onChangeHandler} style={{ background: '#07171e', color: '#ffffff', fontWeight: '700', fontSize: '1rem', border: '1.5px solid rgba(255,255,255,0.2)' }} />
                            {errors.cropName && <p style={{ color: "#fb7185", fontSize: "0.85rem", marginTop: "4px", fontWeight: '700' }}>{errors.cropName}</p>}
                        </div>

                        <div className="form-group text-left" style={{ marginBottom: '18px' }}>
                            <label style={{ color: '#00e5ff', fontWeight: '800', fontSize: '0.9rem' }}>CULTIVATED AREA (ACRES):</label>
                            <input placeholder="e.g. 5.0" name="cropArea" className="form-control" value={crop.cropArea} onChange={onChangeHandler} style={{ background: '#07171e', color: '#ffffff', fontWeight: '700', fontSize: '1rem', border: '1.5px solid rgba(255,255,255,0.2)' }} />
                            {errors.cropArea && <p style={{ color: "#fb7185", fontSize: "0.85rem", marginTop: "4px", fontWeight: '700' }}>{errors.cropArea}</p>}
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '18px' }}>
                            <div className="form-group text-left">
                                <label style={{ color: '#00e5ff', fontWeight: '800', fontSize: '0.9rem' }}>SOWN MONTH & YEAR:</label>
                                <input type="month" name="sownMonthYear" className="form-control" value={crop.sownMonthYear} onChange={onChangeHandler} style={{ background: '#07171e', color: '#ffffff', fontWeight: '700', fontSize: '1rem', border: '1.5px solid rgba(255,255,255,0.2)' }} />
                                {errors.sownMonthYear && <p style={{ color: "#fb7185", fontSize: "0.85rem", marginTop: "4px", fontWeight: '700' }}>{errors.sownMonthYear}</p>}
                            </div>

                            <div className="form-group text-left">
                                <label style={{ color: '#00e5ff', fontWeight: '800', fontSize: '0.9rem' }}>HARVEST MONTH & YEAR:</label>
                                <input type="month" name="harvestMonthYear" className="form-control" value={crop.harvestMonthYear} onChange={onChangeHandler} style={{ background: '#07171e', color: '#ffffff', fontWeight: '700', fontSize: '1rem', border: '1.5px solid rgba(255,255,255,0.2)' }} />
                                {errors.harvestMonthYear && <p style={{ color: "#fb7185", fontSize: "0.85rem", marginTop: "4px", fontWeight: '700' }}>{errors.harvestMonthYear}</p>}
                            </div>
                        </div>

                        <div className="form-group text-left" style={{ marginBottom: '24px' }}>
                            <label style={{ color: '#00e5ff', fontWeight: '800', fontSize: '0.9rem' }}>EXPECTED YIELD (TONS):</label>
                            <input placeholder="e.g. 24.5" name="yield" className="form-control" value={crop.yield} onChange={onChangeHandler} style={{ background: '#07171e', color: '#ffffff', fontWeight: '700', fontSize: '1rem', border: '1.5px solid rgba(255,255,255,0.2)' }} />
                            {errors.yield && <p style={{ color: "#fb7185", fontSize: "0.85rem", marginTop: "4px", fontWeight: '700' }}>{errors.yield}</p>}
                        </div>

                        <div style={{ display: 'flex', gap: '14px', marginTop: '28px' }}>
                            <button className="btn btn-success flex-grow-1" style={{ fontWeight: '900', padding: '12px' }} onClick={handleValidation}>Save Crop</button>
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
