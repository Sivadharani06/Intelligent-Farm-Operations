import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
            setIdList(response.data || []);
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
            farmId: Number(crop.farmId),
            cropArea: Number(crop.cropArea),
            yield: Number(crop.yield)
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
            yield: 0.0
        });
        setErrors({});
        setFlag(false);
    };

    const handleValidation = (event) => {
        event.preventDefault();
        let tempErrors = {};
        let isValid = true;

        if (!crop.farmId) {
            tempErrors.farmId = "Farm ID is required";
            isValid = false;
        } else if (isNaN(crop.farmId) || Number(crop.farmId) <= 0) {
            tempErrors.farmId = "Farm ID must be a positive number";
            isValid = false;
        } else if (idList.length > 0 && !idList.includes(Number(crop.farmId))) {
            tempErrors.farmId = `Invalid Farm ID. Choose from your registered farms (Available IDs: ${idList.join(', ')})`;
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
        <div 
            style={{
                backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.4), rgba(15, 23, 42, 0.6)), url('https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=2832&q=80')`,
                height: '100vh',
                overflowY: 'auto',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'flex-start',
                padding: '40px 20px',
                boxSizing: 'border-box'
            }}
        >
            <div className="login-box" style={{ 
                maxWidth: '550px', 
                width: '100%',
                textAlign: 'left',
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(15px)',
                WebkitBackdropFilter: 'blur(15px)',
                borderRadius: '24px',
                boxShadow: '0 25px 50px rgba(0,0,0,0.2)',
                padding: '40px'
            }}>
                <h2 className="text-center" style={{ color: '#0f172a', fontWeight: '800', marginBottom: '20px' }}>Register New Crop</h2>
                <form>
                    <div className="form-group text-left" style={{ marginBottom: '15px' }}>
                        <label style={{ fontWeight: '600', color: '#475569' }}>Crop Id: </label>
                        <input placeholder="Crop Id" name="cropId" className="form-control" value={newId} readOnly style={{ borderRadius: '8px', border: '1px solid #cbd5e1', background: '#f1f5f9' }} />
                    </div>
                    <div className="form-group text-left" style={{ marginBottom: '15px' }}>
                        <label style={{ fontWeight: '600', color: '#475569' }}>Farm ID: </label>
                        <input placeholder="Enter Farm ID" name="farmId" className="form-control" value={crop.farmId} onChange={onChangeHandler} style={{ borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                        {errors.farmId && <p style={{ color: "#ef4444", fontSize: "0.85rem", marginTop: "4px", textAlign: "left" }}>{errors.farmId}</p>}
                    </div>
                    <div className="form-group text-left" style={{ marginBottom: '15px' }}>
                        <label style={{ fontWeight: '600', color: '#475569' }}>Crop Name: </label>
                        <input placeholder="Crop Name" name="cropName" className="form-control" value={crop.cropName} onChange={onChangeHandler} style={{ borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                        {errors.cropName && <p style={{ color: "#ef4444", fontSize: "0.85rem", marginTop: "4px", textAlign: "left" }}>{errors.cropName}</p>}
                    </div>
                    <div className="form-group text-left" style={{ marginBottom: '15px' }}>
                        <label style={{ fontWeight: '600', color: '#475569' }}>Crop Area: </label>
                        <input placeholder="Crop Area" name="cropArea" className="form-control" value={crop.cropArea} onChange={onChangeHandler} style={{ borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                        {errors.cropArea && <p style={{ color: "#ef4444", fontSize: "0.85rem", marginTop: "4px", textAlign: "left" }}>{errors.cropArea}</p>}
                    </div>
                    <div className="form-group text-left" style={{ marginBottom: '15px' }}>
                        <label style={{ fontWeight: '600', color: '#475569' }}>Sown Month & Year: </label>
                        <input type="month" name="sownMonthYear" className="form-control" value={crop.sownMonthYear} onChange={onChangeHandler} style={{ borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                        {errors.sownMonthYear && <p style={{ color: "#ef4444", fontSize: "0.85rem", marginTop: "4px", textAlign: "left" }}>{errors.sownMonthYear}</p>}
                    </div>
                    <div className="form-group text-left" style={{ marginBottom: '15px' }}>
                        <label style={{ fontWeight: '600', color: '#475569' }}>Harvest Month & Year: </label>
                        <input type="month" name="harvestMonthYear" className="form-control" value={crop.harvestMonthYear} onChange={onChangeHandler} style={{ borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                        {errors.harvestMonthYear && <p style={{ color: "#ef4444", fontSize: "0.85rem", marginTop: "4px", textAlign: "left" }}>{errors.harvestMonthYear}</p>}
                    </div>
                    <div className="form-group text-left" style={{ marginBottom: '25px' }}>
                        <label style={{ fontWeight: '600', color: '#475569' }}>Yield: </label>
                        <input placeholder="Yield" name="yield" className="form-control" value={crop.yield} onChange={onChangeHandler} style={{ borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                        {errors.yield && <p style={{ color: "#ef4444", fontSize: "0.85rem", marginTop: "4px", textAlign: "left" }}>{errors.yield}</p>}
                    </div>
                    <div className="form-group" style={{ display: 'flex', gap: '10px' }}>
                        <button className="btn btn-success" onClick={handleValidation} style={{ flex: 1, padding: '10px', borderRadius: '8px', fontWeight: 'bold' }}>Save</button>
                        <button className="btn btn-secondary" onClick={clearAll} style={{ flex: 1, padding: '10px', borderRadius: '8px', fontWeight: 'bold' }}>Reset</button>
                        <button className="btn btn-warning" onClick={returnBack} style={{ flex: 1, padding: '10px', borderRadius: '8px', fontWeight: 'bold' }}>Return</button>
                    </div>
                </form>
                <div style={{ marginTop: '15px', textAlign: 'center' }}>
                    {flag && <p style={{ color: "#047857", fontWeight: "700", background: '#d1fae5', padding: '10px', borderRadius: '8px', border: '1px solid #a7f3d0' }}>✅ New Crop Successfully Registered!</p>}
                </div>
            </div>
        </div>
    );
};

export default CropEntry;
