import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { logoutUser } from '../../Services/LoginService';
import '../../DisplayView.css';

const BlurAdminLayout = ({ children, title = "DASHBOARD", breadcrumb = "Home / Dashboard" }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  
  // Expanded menu items state
  const [openSubmenus, setOpenSubmenus] = useState({
    farms: true,
    crops: true,
    expenses: true,
    reports: true
  });

  const toggleSubmenu = (key) => {
    setOpenSubmenus(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleLogout = () => {
    logoutUser()
      .then(() => {
        localStorage.clear();
        sessionStorage.clear();
        navigate('/');
      })
      .catch(() => {
        localStorage.clear();
        sessionStorage.clear();
        navigate('/');
      });
  };

  const currentPath = location.pathname;

  return (
    <div className="blur-admin-wrapper">
      {/* Background Aurora Mesh Overlay */}
      <div className="blur-aurora-bg"></div>

      {/* Left Sidebar */}
      <aside className={`blur-sidebar ${sidebarOpen ? 'open' : 'collapsed'}`}>
        {/* Sidebar Brand Header */}
        <div className="blur-brand-header">
          <div className="blur-brand-logo" onClick={() => navigate('/farmer-menu')}>
            <span className="blur-brand-title">FarmVerse</span>
            <span className="blur-brand-accent">.</span>
          </div>
          <button 
            type="button"
            className="blur-menu-toggle-btn"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            title="Toggle Sidebar"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Search Bar in Sidebar */}
        <div className="blur-sidebar-search">
          <div className="blur-search-input-wrap">
            <svg className="blur-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input 
              type="text"
              placeholder="Search farm or crop..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="blur-search-input"
            />
          </div>
        </div>

        {/* Sidebar Navigation Menu */}
        <nav className="blur-nav-menu">
          {/* Dashboard Item */}
          <div 
            className={`blur-nav-item ${currentPath === '/farmer-menu' ? 'active-pill' : ''}`}
            onClick={() => navigate('/farmer-menu')}
          >
            <div className="blur-nav-item-content">
              <svg className="blur-nav-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
              <span className="blur-nav-label">Dashboard</span>
            </div>
          </div>

          {/* Farm Operations Navigation Group */}
          <div className="blur-nav-category-title">FARM MANAGEMENT</div>

          {/* Farms Submenu */}
          <div className="blur-nav-dropdown">
            <div 
              className={`blur-nav-item ${currentPath.includes('/farm-') && currentPath !== '/farmer-menu' ? 'active-category' : ''}`}
              onClick={() => toggleSubmenu('farms')}
            >
              <div className="blur-nav-item-content">
                <svg className="blur-nav-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                <span className="blur-nav-label">Farm Plots</span>
              </div>
              <svg className={`blur-caret ${openSubmenus.farms ? 'rotated' : ''}`} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </div>
            {openSubmenus.farms && (
              <div className="blur-submenu">
                <Link to="/farm-list" className={`blur-sub-link ${currentPath === '/farm-list' ? 'active' : ''}`}>
                  <span>•</span> Farm Plots List
                </Link>
                <Link to="/farm-add" className={`blur-sub-link ${currentPath === '/farm-add' ? 'active' : ''}`}>
                  <span>•</span> Register New Farm
                </Link>
              </div>
            )}
          </div>

          {/* Crop Operations Submenu */}
          <div className="blur-nav-dropdown">
            <div 
              className={`blur-nav-item ${currentPath.includes('/crop-') || currentPath.includes('/farm-crop') ? 'active-category' : ''}`}
              onClick={() => toggleSubmenu('crops')}
            >
              <div className="blur-nav-item-content">
                <svg className="blur-nav-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
                </svg>
                <span className="blur-nav-label">Crop Operations</span>
              </div>
              <svg className={`blur-caret ${openSubmenus.crops ? 'rotated' : ''}`} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </div>
            {openSubmenus.crops && (
              <div className="blur-submenu">
                <Link to="/crop-list" className={`blur-sub-link ${currentPath === '/crop-list' ? 'active' : ''}`}>
                  <span>•</span> Manage Crops List
                </Link>
                <Link to="/crop-add" className={`blur-sub-link ${currentPath === '/crop-add' ? 'active' : ''}`}>
                  <span>•</span> Add New Crop
                </Link>
              </div>
            )}
          </div>

          {/* Agro Expenses Submenu */}
          <div className="blur-nav-dropdown">
            <div 
              className={`blur-nav-item ${currentPath.includes('/expense-') ? 'active-category' : ''}`}
              onClick={() => toggleSubmenu('expenses')}
            >
              <div className="blur-nav-item-content">
                <svg className="blur-nav-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="1" x2="12" y2="23"></line>
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                </svg>
                <span className="blur-nav-label">Agro Expenses</span>
              </div>
              <svg className={`blur-caret ${openSubmenus.expenses ? 'rotated' : ''}`} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </div>
            {openSubmenus.expenses && (
              <div className="blur-submenu">
                <Link to="/expense-list" className={`blur-sub-link ${currentPath === '/expense-list' ? 'active' : ''}`}>
                  <span>•</span> Agro Expense Rates
                </Link>
                <Link to="/expense-add" className={`blur-sub-link ${currentPath === '/expense-add' ? 'active' : ''}`}>
                  <span>•</span> Add New Expense
                </Link>
              </div>
            )}
          </div>

          {/* Analytics & Reports Group */}
          <div className="blur-nav-category-title">ANALYTICS & AI</div>

          <div className="blur-nav-dropdown">
            <div 
              className={`blur-nav-item ${currentPath.includes('/final-crop-report') || currentPath.includes('/farm-crop') ? 'active-category' : ''}`}
              onClick={() => toggleSubmenu('reports')}
            >
              <div className="blur-nav-item-content">
                <svg className="blur-nav-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="20" x2="18" y2="10"></line>
                  <line x1="12" y1="20" x2="12" y2="4"></line>
                  <line x1="6" y1="20" x2="6" y2="14"></line>
                </svg>
                <span className="blur-nav-label">AI Crop Reports</span>
              </div>
              <svg className={`blur-caret ${openSubmenus.reports ? 'rotated' : ''}`} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </div>
            {openSubmenus.reports && (
              <div className="blur-submenu">
                <Link to="/crop-list" className="blur-sub-link">
                  <span>•</span> Yield AI Predictions
                </Link>
                <Link to="/crop-list" className="blur-sub-link">
                  <span>•</span> Crop Input Estimator
                </Link>
                <Link to="/crop-list" className="blur-sub-link">
                  <span>•</span> Final Crop Reports
                </Link>
                <Link to="/crop-list" className="blur-sub-link">
                  <span>•</span> Profit & AI Review Engine
                </Link>
              </div>
            )}
          </div>
        </nav>
      </aside>

      {/* Main Layout Area */}
      <div className={`blur-main-layout ${sidebarOpen ? '' : 'expanded'}`} style={{ background: '#07161c', minHeight: '100vh' }}>
        {/* Top Header Bar */}
        <header className="blur-top-header" style={{ background: '#081a21', borderBottom: '1.5px solid rgba(255, 255, 255, 0.15)' }}>
          {/* Left Title & Breadcrumbs */}
          <div className="blur-header-left">
            <h1 className="blur-page-title" style={{ color: '#ffffff', fontWeight: '900', letterSpacing: '0.04em' }}>{title}</h1>
            <div className="blur-breadcrumb">
              <span className="blur-breadcrumb-link" style={{ color: '#00e5ff', fontWeight: '800' }} onClick={() => navigate('/farmer-menu')}>Home</span>
              <span className="blur-breadcrumb-separator" style={{ color: '#94a3b8' }}>/</span>
              <span className="blur-breadcrumb-current" style={{ color: '#ffffff', fontWeight: '800' }}>{breadcrumb.replace('Home / ', '')}</span>
            </div>
          </div>

          {/* Right Header */}
          <div className="blur-header-right">
            <div className="blur-contact-link" style={{ color: '#00e5ff', fontWeight: '800', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>🌾</span>
              <span>Intelligent Farm Operations</span>
            </div>

            {/* Notification Bell with Badge */}
            <div className="blur-icon-badge-wrap" onClick={() => { setShowNotifications(!showNotifications); setShowProfileMenu(false); }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
              </svg>
              <span className="blur-badge blur-badge-orange">3</span>

              {showNotifications && (
                <div className="blur-dropdown-panel" onClick={(e) => e.stopPropagation()}>
                  <div className="blur-panel-header">Farm Alerts (3)</div>
                  <div className="blur-panel-item">
                    <span className="blur-dot blur-dot-mint"></span>
                    <div>
                      <div className="blur-panel-title">Soil Moisture Optimal</div>
                      <div className="blur-panel-time">Plot A • 5 mins ago</div>
                    </div>
                  </div>
                  <div className="blur-panel-item">
                    <span className="blur-dot blur-dot-orange"></span>
                    <div>
                      <div className="blur-panel-title">Scheduled Harvest Window Approaching</div>
                      <div className="blur-panel-time">Plot B • 1 hour ago</div>
                    </div>
                  </div>
                  <div className="blur-panel-item">
                    <span className="blur-dot blur-dot-cyan"></span>
                    <div>
                      <div className="blur-panel-title">Agro Resource Rates Synchronized</div>
                      <div className="blur-panel-time">System • 3 hours ago</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Avatar with Dropdown */}
            <div className="blur-profile-wrap" onClick={() => { setShowProfileMenu(!showProfileMenu); setShowNotifications(false); }}>
              <img 
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80" 
                alt="Profile Avatar" 
                className="blur-profile-avatar"
              />
              <span className="blur-status-indicator"></span>

              {showProfileMenu && (
                <div className="blur-dropdown-panel blur-profile-panel" onClick={(e) => e.stopPropagation()}>
                  <div className="blur-profile-info">
                    <div className="blur-profile-name">Farm Operator</div>
                    <div className="blur-profile-role">Lead Agriculturist</div>
                  </div>
                  <hr className="blur-panel-divider" />
                  <div className="blur-panel-action" onClick={() => navigate('/farmer-menu')}>
                    Dashboard Overview
                  </div>
                  <div className="blur-panel-action" onClick={() => navigate('/farm-list')}>
                    My Farm Plots
                  </div>
                  <div className="blur-panel-action" onClick={() => navigate('/crop-list')}>
                    Crop Operations
                  </div>
                  <div className="blur-panel-action" onClick={() => navigate('/expense-list')}>
                    Agro Expense Rates
                  </div>
                  <hr className="blur-panel-divider" />
                  <div className="blur-panel-action blur-danger-action" onClick={handleLogout}>
                    Logout from FarmVerse
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="blur-page-container">
          {children}
        </main>
      </div>
    </div>
  );
};

export default BlurAdminLayout;
