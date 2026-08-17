import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
    <div 
      style={{
        backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.4), rgba(15, 23, 42, 0.6)), url('https://images.unsplash.com/photo-1495107334309-fcf20504a5ab?auto=format&fit=crop&w=2832&q=80')`,
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
        maxWidth: '500px', 
        width: '100%',
        textAlign: 'left',
        background: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(15px)',
        WebkitBackdropFilter: 'blur(15px)',
        borderRadius: '24px',
        boxShadow: '0 25px 50px rgba(0,0,0,0.2)',
        padding: '40px'
      }}>
        <h2 className="text-center" style={{ color: '#0f172a', fontWeight: '800', marginBottom: '20px' }}>Register New Farm</h2>
        <form>
          <div className="form-group text-left" style={{ marginBottom: '15px' }}>
            <label style={{ fontWeight: '600', color: '#475569' }}>Farm Id: </label>
            <input placeholder="Farm Id" name="farmId" className="form-control" value={newId} readOnly style={{ borderRadius: '8px', border: '1px solid #cbd5e1', background: '#f1f5f9' }} />
          </div>
          <div className="form-group text-left" style={{ marginBottom: '15px' }}>
            <label style={{ fontWeight: '600', color: '#475569' }}> Farm Name: </label>
            <input placeholder="Farm Name" name="farmName" className="form-control" value={farm.farmName} onChange={onChangeHandler} style={{ borderRadius: '8px', border: '1px solid #cbd5e1' }} />
            {errors.farmName && <p style={{ color: "#ef4444", fontSize: "0.85rem", marginTop: "4px", textAlign: "left" }}>{errors.farmName}</p>}
          </div>

          <div className="form-group text-left" style={{ marginBottom: '15px' }}>
            <label style={{ fontWeight: '600', color: '#475569' }}> Farm Area (Acres): </label>
            <input placeholder="Farm Area" name="area" className="form-control" value={farm.area} onChange={onChangeHandler} style={{ borderRadius: '8px', border: '1px solid #cbd5e1' }} />
            {errors.area && <p style={{ color: "#ef4444", fontSize: "0.85rem", marginTop: "4px", textAlign: "left" }}>{errors.area}</p>}
          </div>

          <div className="form-group text-left" style={{ marginBottom: '25px' }}>
            <label style={{ fontWeight: '600', color: '#475569' }}> Soil Type: </label>
            <select name="soil" className="form-control" value={farm.soil} onChange={onChangeHandler} style={{ borderRadius: '8px', border: '1px solid #cbd5e1' }}>
              <option value="">Select Soil Type</option>
              <option value="Alluvial">Alluvial</option>
              <option value="Black">Black</option>
              <option value="Lateriate">Lateriate</option>
              <option value="Red">Red</option>
            </select>
            {errors.soil && <p style={{ color: "#ef4444", fontSize: "0.85rem", marginTop: "4px", textAlign: "left" }}>{errors.soil}</p>}
          </div>

          <div className="form-group" style={{ display: 'flex', gap: '10px' }}>
            <button className="btn btn-success" onClick={handleValidation} style={{ flex: 1, padding: '10px', borderRadius: '8px', fontWeight: 'bold' }}>Save</button>
            <button className="btn btn-secondary" onClick={clearAll} style={{ flex: 1, padding: '10px', borderRadius: '8px', fontWeight: 'bold' }}>Reset</button>
            <button className="btn btn-warning" onClick={returnBack} style={{ flex: 1, padding: '10px', borderRadius: '8px', fontWeight: 'bold' }}>Return</button>
          </div>
        </form>
        <div style={{ marginTop: '15px', textAlign: 'center' }}>
          {flag && <p style={{ color: "#047857", fontWeight: "700", background: '#d1fae5', padding: '10px', borderRadius: '8px', border: '1px solid #a7f3d0' }}>✅ New Farm Successfully Registered!</p>}
        </div>
      </div>
    </div>

  );

}

export default FarmEntry;