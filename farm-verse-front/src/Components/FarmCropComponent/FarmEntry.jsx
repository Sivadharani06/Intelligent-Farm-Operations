import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BlurAdminLayout from '../Layout/BlurAdminLayout';
import { addFarm, generateFarmId } from "../../Services/FarmService";
import '../../DisplayView.css';

const FarmEntry = () => {
  let navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [farm, setFarm] = useState({
    farmId: 0,
    farmName: "",
    area: 0.0,
    soil: "",
    username: "abcd",
  });

  const [flag, setFlag] = useState(false);
  const [newId, setNewId] = useState(0);

  const setFarmId = () => {
    generateFarmId().then(response => {
      setNewId(response.data);
    });
  }

  useEffect(() => {
    setFarmId();
    setFlag(false);
  }, []);

  const onChangeHandler = (event) => {
    event.persist();
    setFlag(false);
    const name = event.target.name;
    const value = event.target.value;
    setFarm(values => ({ ...values, [name]: value }));
  };

  const saveFarm = (event) => {
    event.preventDefault();
    const farmToSave = {
      ...farm,
      farmId: newId,
      area: Number(farm.area)
    };
    addFarm(farmToSave).then(response => {
      setFlag(true);
    }).catch(err => {
      console.error("Error saving farm:", err);
    });
  };

  const clearAll = (event) => {
    if (event) event.preventDefault();
    setFarm({
      farmId: 0,
      farmName: "",
      area: 0.0,
      soil: "",
      username: "abcd",
    });
    setErrors({});
    setFlag(false);
  };

  const handleValidation = (event) => {
    event.preventDefault();
    let tempErrors = {};
    let isValid = true;

    if (!farm.farmName || !farm.farmName.trim()) {
      tempErrors.farmName = "Farm name is required";
      isValid = false;
    }

    if (farm.area === undefined || farm.area === null || String(farm.area).trim() === "" || Number(farm.area) <= 0) {
      tempErrors.area = "Farm area must be greater than 0";
      isValid = false;
    }

    if (!farm.soil || !farm.soil.trim()) {
      tempErrors.soil = "Soil type is required";
      isValid = false;
    }

    setErrors(tempErrors);
    if (isValid) {
      saveFarm(event);
    }
  };

  const returnBack = () => {
    navigate('/farmer-menu');
  }

  return (
    <BlurAdminLayout title="REGISTER FARM" breadcrumb="Home / Farms / Register">
      <div style={{ maxWidth: '600px', margin: '20px auto' }}>
        <div className="blur-card" style={{ padding: '36px', background: '#0d222a', border: '1.5px solid rgba(255,255,255,0.18)' }}>
          <div className="menu-header" style={{ marginBottom: '28px', textAlign: 'center' }}>
            <h2 style={{ fontSize: '1.9rem', fontWeight: '900', color: '#ffffff', letterSpacing: '-0.02em', margin: 0 }}>Register New Farm Plot</h2>
            <p style={{ color: '#00e5ff', fontSize: '1.05rem', fontWeight: '700', marginTop: '8px' }}>Enter property details and soil characteristics</p>
          </div>

          <form>
            <div className="form-group text-left" style={{ marginBottom: '18px' }}>
              <label style={{ color: '#00e5ff', fontWeight: '800', fontSize: '0.9rem' }}>FARM ID (AUTO-GENERATED):</label>
              <input 
                name="farmId" 
                className="form-control" 
                value={newId} 
                readOnly 
                style={{ background: '#07171e', color: '#00d2aa', fontWeight: '800', fontSize: '1.1rem', border: '1.5px solid rgba(255,255,255,0.15)' }}
              />
            </div>

            <div className="form-group text-left" style={{ marginBottom: '18px' }}>
              <label style={{ color: '#00e5ff', fontWeight: '800', fontSize: '0.9rem' }}>FARM NAME:</label>
              <input 
                placeholder="e.g. Green Valley Plot A" 
                name="farmName" 
                className="form-control" 
                value={farm.farmName} 
                onChange={onChangeHandler} 
                style={{ background: '#07171e', color: '#ffffff', fontWeight: '700', fontSize: '1rem', border: '1.5px solid rgba(255,255,255,0.2)' }}
              />
              {errors.farmName && <p style={{ color: "#fb7185", fontSize: "0.85rem", marginTop: "4px", fontWeight: '700' }}>{errors.farmName}</p>}
            </div>

            <div className="form-group text-left" style={{ marginBottom: '18px' }}>
              <label style={{ color: '#00e5ff', fontWeight: '800', fontSize: '0.9rem' }}>FARM AREA (ACRES):</label>
              <input 
                placeholder="e.g. 15.5" 
                name="area" 
                className="form-control" 
                value={farm.area} 
                onChange={onChangeHandler} 
                style={{ background: '#07171e', color: '#ffffff', fontWeight: '700', fontSize: '1rem', border: '1.5px solid rgba(255,255,255,0.2)' }}
              />
              {errors.area && <p style={{ color: "#fb7185", fontSize: "0.85rem", marginTop: "4px", fontWeight: '700' }}>{errors.area}</p>}
            </div>

            <div className="form-group text-left" style={{ marginBottom: '24px' }}>
              <label style={{ color: '#00e5ff', fontWeight: '800', fontSize: '0.9rem' }}>SOIL CLASSIFICATION:</label>
              <select name="soil" className="form-control" value={farm.soil} onChange={onChangeHandler} style={{ background: '#07171e', color: '#ffffff', fontWeight: '700', fontSize: '1rem', border: '1.5px solid rgba(255,255,255,0.2)' }}>
                <option value="">Select Soil Type</option>
                <option value="Alluvial">Alluvial</option>
                <option value="Black">Black</option>
                <option value="Lateriate">Lateriate</option>
                <option value="Red">Red</option>
              </select>
              {errors.soil && <p style={{ color: "#fb7185", fontSize: "0.85rem", marginTop: "4px", fontWeight: '700' }}>{errors.soil}</p>}
            </div>

            <div style={{ display: 'flex', gap: '14px', marginTop: '28px' }}>
              <button className="btn btn-success flex-grow-1" style={{ fontWeight: '900', padding: '12px' }} onClick={handleValidation}>Save Plot</button>
              <button className="btn btn-secondary flex-grow-1" style={{ fontWeight: '800', padding: '12px' }} onClick={clearAll}>Reset</button>
              <button className="btn btn-secondary flex-grow-1" style={{ fontWeight: '800', padding: '12px' }} onClick={returnBack}>Back</button>
            </div>
          </form>

          {flag && (
            <div style={{ marginTop: '24px', textAlign: 'center', background: '#07171e', border: '2px solid #00d2aa', padding: '14px', borderRadius: '8px', color: '#00d2aa', fontWeight: '800', fontSize: '1rem' }}>
              ✓ New Farm Successfully Registered!
            </div>
          )}
        </div>
      </div>
    </BlurAdminLayout>
  );
}

export default FarmEntry;