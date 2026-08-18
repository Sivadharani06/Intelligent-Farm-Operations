import React from "react";
import { logoutUser } from '../../Services/LoginService';
import { useNavigate } from 'react-router-dom';
const FarmerMenu = () => {
  let navigate = useNavigate();
  const handleLogout = () => {
    logoutUser()
      .then(() => {
        localStorage.clear();
        sessionStorage.clear();
        navigate('/');
      })
  };
  return (
    <div 
      style={{
        backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.2), rgba(15, 23, 42, 0.4)), url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=2832&q=80')`,
        height: '100vh',
        overflowY: 'auto',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '40px 20px',
        boxSizing: 'border-box'
      }}
    >
      <div className="farmer-menu-container" style={{
        background: 'rgba(255, 255, 255, 0.7)',
        backdropFilter: 'blur(15px)',
        WebkitBackdropFilter: 'blur(15px)',
        borderRadius: '28px',
        padding: '40px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
        margin: '0 auto',
        maxWidth: '1200px'
      }}>
        <div className="menu-header">
          <h1 className="menu-title">FarmVerse</h1>
          <p className="menu-subtitle" style={{color: '#1e293b', fontWeight: '600'}}>Your Digital Agriculture Control Center</p>
        </div>

        <div className="dashboard-grid">
          {/* Farms Card */}
          <div className="dashboard-card" style={{background: 'rgba(255,255,255,0.9)'}}>
            <div className="card-image-wrapper">
              <img 
                src="https://images.unsplash.com/photo-1495107334309-fcf20504a5ab?auto=format&fit=crop&w=600&q=80" 
                alt="Green Farm Field" 
                className="card-image"
              />
            </div>
            <div className="card-content">
              <h3 className="card-title">My Farms</h3>
              <p className="card-description">
                Register new farm plots, classify soil types, and track area details across your registered land.
              </p>
              <div className="card-actions">
                <button className="btn btn-success" onClick={() => navigate('/farm-add')}>Register Farm</button>
                <button className="btn btn-secondary" onClick={() => navigate('/farm-list')}>View List</button>
              </div>
            </div>
          </div>

          {/* Crops Card */}
          <div className="dashboard-card" style={{background: 'rgba(255,255,255,0.9)'}}>
            <div className="card-image-wrapper">
              <img 
                src="https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=600&q=80" 
                alt="Green Crops" 
                className="card-image"
              />
            </div>
            <div className="card-content">
              <h3 className="card-title">Crop Operations</h3>
              <p className="card-description">
                Record new crop items, track sowing/harvest months, and log yields of active plots.
              </p>
              <div className="card-actions">
                <button className="btn btn-success" onClick={() => navigate('/crop-add')}>Add Crop</button>
                <button className="btn btn-secondary" onClick={() => navigate('/crop-list')}>View List</button>
              </div>
            </div>
          </div>

          {/* Agro Expenses Card */}
          <div className="dashboard-card" style={{background: 'rgba(255,255,255,0.9)'}}>
            <div className="card-image-wrapper">
              <img 
                src="https://images.unsplash.com/photo-1605000794699-6660659dcb59?auto=format&fit=crop&w=600&q=80" 
                alt="Agricultural Business" 
                className="card-image"
              />
            </div>
            <div className="card-content">
              <h3 className="card-title">Agro Expenses</h3>
              <p className="card-description">
                Manage base rates and unit costs for agricultural resources.
              </p>
              <div className="card-actions">
                <button className="btn btn-success" onClick={() => navigate('/expense-add')}>Add Expense</button>
                <button className="btn btn-secondary" onClick={() => navigate('/expense-list')}>View List</button>
              </div>
            </div>
          </div>

        </div>

        <div className="dashboard-footer">
          <button className="btn btn-danger" onClick={handleLogout}>Logout from FarmVerse</button>
        </div>
      </div>
    </div>
  );
}
export default FarmerMenu;
