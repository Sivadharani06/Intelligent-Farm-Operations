import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from 'react-router-dom';
import BlurAdminLayout from '../Layout/BlurAdminLayout';
import { getFarmsByUsername } from '../../Services/FarmService';
import { getCropsByUsername } from '../../Services/CropService';
import { getWeatherByFarmId, getRegionalWeather } from '../../Services/WeatherService';
import '../../DisplayView.css';

const FarmerMenu = () => {
  const navigate = useNavigate();
  const [farmsList, setFarmsList] = useState([]);
  const [cropsList, setCropsList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [farmCount, setFarmCount] = useState(0);
  const [cropCount, setCropCount] = useState(0);
  const [totalFarmArea, setTotalFarmArea] = useState(0);
  const [totalCropArea, setTotalCropArea] = useState(0);
  const [totalYield, setTotalYield] = useState(0);

  // Weather state & live backend telemetry
  const [selectedPlotWeather, setSelectedPlotWeather] = useState("regional");
  const [isWeatherRefreshing, setIsWeatherRefreshing] = useState(false);
  const [weatherLastUpdated, setWeatherLastUpdated] = useState("Live Synced");

  const [weatherData, setWeatherData] = useState({
    farmId: null,
    farmName: "Regional Agro-Station",
    soil: "Alluvial",
    temp: 28,
    feelsLike: 30,
    condition: "Scattered Clouds",
    conditionIcon: "🌤️",
    humidity: 71,
    rainProb: 20,
    windSpeed: 16,
    soilMoisture: 72,
    soilMoistureStatus: "Optimal Root Zone",
    solarUV: "4.8 (Moderate)",
    barometer: 1012,
    advisoryAlert: "Connecting to farm microclimate sensor feed and regional telemetry...",
    forecast: [
      { day: "Today", icon: "🌤️", tempMax: 28, tempMin: 21, rain: "20%", advice: "Normal field operations" },
      { day: "Tomorrow", icon: "🌧️", tempMax: 25, tempMin: 19, rain: "75%", advice: "Heavy precipitation alert" },
      { day: "Day 3", icon: "⛅", tempMax: 29, tempMin: 22, rain: "15%", advice: "Clearing skies & favorable winds" }
    ]
  });

  const fetchWeather = (farmIdOrPlot) => {
    setIsWeatherRefreshing(true);
    const apiCall = (farmIdOrPlot && farmIdOrPlot !== "regional" && !isNaN(farmIdOrPlot))
      ? getWeatherByFarmId(farmIdOrPlot)
      : getRegionalWeather();

    apiCall.then((res) => {
      if (res.data) {
        setWeatherData(res.data);
        const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        setWeatherLastUpdated(`Updated at ${timeStr}`);
      }
    }).catch((err) => {
      console.warn("Backend weather API note:", err);
      setWeatherLastUpdated("Refreshed");
    }).finally(() => {
      setIsWeatherRefreshing(false);
    });
  };

  const handleRefreshWeather = () => {
    fetchWeather(selectedPlotWeather);
  };

  const handlePlotSelectChange = (newVal) => {
    setSelectedPlotWeather(newVal);
    fetchWeather(newVal);
  };

  useEffect(() => {
    setIsLoading(true);
    Promise.all([
      getFarmsByUsername().catch(() => ({ data: [] })),
      getCropsByUsername().catch(() => ({ data: [] }))
    ]).then(([farmsRes, cropsRes]) => {
      const farms = (farmsRes && Array.isArray(farmsRes.data)) ? farmsRes.data : [];
      const crops = (cropsRes && Array.isArray(cropsRes.data)) ? cropsRes.data : [];

      setFarmsList(farms);
      setFarmCount(farms.length);
      const farmAreaSum = farms.reduce((acc, f) => acc + (parseFloat(f.area) || 0), 0);
      setTotalFarmArea(farmAreaSum);

      setCropsList(crops);
      setCropCount(crops.length);
      const cropAreaSum = crops.reduce((acc, c) => acc + (parseFloat(c.cropArea) || 0), 0);
      const yieldSum = crops.reduce((acc, c) => acc + (parseFloat(c.yield) || 0), 0);
      setTotalCropArea(cropAreaSum);
      setTotalYield(yieldSum);

      // Auto select first farm plot for weather and fetch dynamic telemetry
      if (farms.length > 0 && farms[0].farmId) {
        setSelectedPlotWeather(farms[0].farmId);
        fetchWeather(farms[0].farmId);
      } else {
        setSelectedPlotWeather("regional");
        fetchWeather("regional");
      }

      setIsLoading(false);
    }).catch(() => {
      fetchWeather("regional");
      setIsLoading(false);
    });
  }, []);

  // Compute dynamic soil classification from user's registered farms
  const soilDistribution = useMemo(() => {
    if (!farmsList.length || totalFarmArea <= 0) return [];
    const soilMap = {};
    farmsList.forEach(f => {
      const soilName = (f.soil && f.soil.trim()) ? f.soil.trim() : "Unclassified Soil";
      const area = parseFloat(f.area) || 0;
      soilMap[soilName] = (soilMap[soilName] || 0) + area;
    });

    const colors = ["#00d2aa", "#00c2ff", "#20c997", "#0f766e", "#38bdf8", "#10b981", "#14b8a6"];
    return Object.entries(soilMap)
      .map(([name, area], idx) => {
        const pct = totalFarmArea > 0 ? Math.round((area / totalFarmArea) * 100) : 0;
        return {
          name,
          area,
          percentage: pct,
          color: colors[idx % colors.length]
        };
      })
      .sort((a, b) => b.area - a.area);
  }, [farmsList, totalFarmArea]);

  // Compute dynamic crop acreage allocation from user's crops
  const cropDistribution = useMemo(() => {
    if (!cropsList.length || totalCropArea <= 0) return [];
    const cropMap = {};
    cropsList.forEach(c => {
      const cropName = (c.cropName && c.cropName.trim()) ? c.cropName.trim() : "Crop Variety";
      const area = parseFloat(c.cropArea) || 0;
      cropMap[cropName] = (cropMap[cropName] || 0) + area;
    });

    const colors = ["#00d2aa", "#00c2ff", "#10b981", "#38bdf8", "#e2e8f0", "#a78bfa", "#f59e0b"];
    return Object.entries(cropMap)
      .map(([name, area], idx) => {
        const pct = totalCropArea > 0 ? Math.round((area / totalCropArea) * 100) : 0;
        return {
          name,
          area,
          percentage: pct,
          color: colors[idx % colors.length]
        };
      })
      .sort((a, b) => b.area - a.area);
  }, [cropsList, totalCropArea]);

  const getSoilIcon = (soilName) => {
    const s = (soilName || "").toLowerCase();
    if (s.includes("alluvial")) return "🌾";
    if (s.includes("black") || s.includes("cotton")) return "🌿";
    if (s.includes("red") || s.includes("loam")) return "🍂";
    if (s.includes("clay")) return "🧱";
    if (s.includes("sand")) return "🏜️";
    if (s.includes("peat") || s.includes("silt")) return "🌱";
    return "🚜";
  };

  const getCropIcon = (cropName) => {
    const c = (cropName || "").toLowerCase();
    if (c.includes("paddy") || c.includes("rice")) return "🌾";
    if (c.includes("maize") || c.includes("corn")) return "🌽";
    if (c.includes("wheat")) return "🌱";
    if (c.includes("pulse") || c.includes("bean") || c.includes("gram")) return "🫘";
    if (c.includes("cotton")) return "☁️";
    if (c.includes("sugarcane")) return "🎋";
    if (c.includes("millet") || c.includes("veg")) return "🥦";
    return "🌿";
  };

  const getWeatherIcon = (condition, fallbackIcon) => {
    if (fallbackIcon && fallbackIcon.length > 0 && !fallbackIcon.includes("?")) return fallbackIcon;
    const c = (condition || "").toLowerCase();
    if (c.includes("rain") || c.includes("shower")) return "🌧️";
    if (c.includes("cloud")) return "⛅";
    if (c.includes("sun") || c.includes("clear") || c.includes("warm")) return "☀️";
    return "🌤️";
  };

  // SVG Circular Gauge Component with high contrast text
  const CircularProgressGauge = ({ percentage, label, value, strokeColor = "#00d2aa" }) => {
    const radius = 34;
    const strokeWidth = 5;
    const normalizedRadius = radius - strokeWidth / 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className="blur-stat-card" style={{ background: '#0d222a', border: '1.5px solid rgba(255,255,255,0.18)' }}>
        <div className="blur-gauge-container">
          <svg height={radius * 2} width={radius * 2} className="blur-gauge-svg">
            <circle
              stroke="rgba(0, 210, 170, 0.2)"
              fill="transparent"
              strokeWidth={strokeWidth}
              r={normalizedRadius}
              cx={radius}
              cy={radius}
            />
            <circle
              stroke={strokeColor}
              fill="transparent"
              strokeWidth={strokeWidth}
              strokeDasharray={`${circumference} ${circumference}`}
              style={{ strokeDashoffset }}
              strokeLinecap="round"
              r={normalizedRadius}
              cx={radius}
              cy={radius}
              className="blur-gauge-circle"
            />
          </svg>
          <div className="blur-gauge-percent-text" style={{ color: '#ffffff', fontWeight: '900', fontSize: '0.95rem' }}>
            {percentage}%
          </div>
        </div>
        <div className="blur-stat-info">
          <span className="blur-stat-label" style={{ color: '#00e5ff', fontWeight: '800', fontSize: '0.85rem', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
            {label}
          </span>
          <span className="blur-stat-value" style={{ color: '#ffffff', fontWeight: '900', fontSize: '1.45rem', marginTop: '2px' }}>
            {value}
          </span>
        </div>
      </div>
    );
  };

  // Gauge values: if 0, show realistic 0 for new accounts
  const farmsGaugePct = farmCount > 0 ? 100 : 0;
  const areaGaugePct = totalFarmArea > 0 ? Math.min(100, Math.round((totalCropArea / totalFarmArea) * 100)) : (totalCropArea > 0 ? 100 : 0);
  const cropsGaugePct = cropCount > 0 ? 100 : 0;
  const yieldGaugePct = totalYield > 0 ? 100 : 0;

  return (
    <BlurAdminLayout title="DASHBOARD" breadcrumb="Home / Dashboard">
      <div className="blur-dashboard-content">
        
        {/* ROW 1: 4 Top Stat Cards with Circular Gauges for Real Farm Operations */}
        <div className="blur-stats-grid">
          <CircularProgressGauge 
            percentage={farmsGaugePct} 
            label="Registered Farms" 
            value={`${farmCount} Plots`} 
            strokeColor="#00d2aa"
          />

          <CircularProgressGauge 
            percentage={areaGaugePct} 
            label="Cultivated Area" 
            value={`${totalCropArea.toFixed(1)} Acres`} 
            strokeColor="#00e5ff"
          />

          <CircularProgressGauge 
            percentage={cropsGaugePct} 
            label="Crop Varieties" 
            value={`${cropCount} Species`} 
            strokeColor="#10b981"
          />

          <CircularProgressGauge 
            percentage={yieldGaugePct} 
            label="Yield Efficiency" 
            value={`${totalYield.toFixed(0)} Qtl`} 
            strokeColor="#00d2aa"
          />
        </div>

        {/* ROW 2: Two Agricultural Analytics Panels */}
        <div className="blur-analytics-grid">
          {/* Panel 1 (Left): CROP ACREAGE ALLOCATION with Donut Chart or Clean Empty State */}
          <div className="blur-panel blur-donut-panel" style={{ background: '#0d222a', border: '1.5px solid rgba(255,255,255,0.18)' }}>
            <div className="blur-panel-title-bar">
              <span className="blur-panel-heading" style={{ color: '#00e5ff', fontWeight: '900', fontSize: '0.9rem', letterSpacing: '0.08em' }}>
                CROP ACREAGE ALLOCATION
              </span>
              {cropsList.length > 0 && (
                <span className="blur-badge blur-badge-mint" style={{ padding: '3px 8px', fontSize: '0.72rem', fontWeight: '800' }}>
                  {cropsList.length} LOGGED
                </span>
              )}
            </div>

            {cropsList.length === 0 ? (
              <div className="blur-empty-state-panel">
                <div className="blur-empty-icon-wrap">
                  <span style={{ fontSize: '2.4rem' }}>🌾</span>
                </div>
                <h4 style={{ color: '#ffffff', fontWeight: '900', fontSize: '1.15rem', margin: '8px 0 6px' }}>
                  No Crops Planted Yet
                </h4>
                <p style={{ color: '#94a3b8', fontSize: '0.86rem', maxWidth: '320px', lineHeight: '1.55', margin: '0 0 18px' }}>
                  Log your first crop variety, acreage, and sowing details to generate live acreage allocation charts.
                </p>
                <button 
                  type="button" 
                  className="blur-btn blur-btn-primary" 
                  style={{ fontWeight: '900', padding: '10px 22px', fontSize: '0.88rem' }}
                  onClick={() => navigate('/crop-add')}
                >
                  + Add First Crop
                </button>
              </div>
            ) : (
              <div className="blur-donut-wrapper">
                <div className="blur-donut-chart-container">
                  {(() => {
                    const radius = 38;
                    const circumference = 2 * Math.PI * radius; // 238.761
                    let cumulativeLength = 0;
                    return (
                      <svg width="240" height="240" viewBox="0 0 100 100" className="blur-donut-svg">
                        {cropDistribution.map((crop, idx) => {
                          const segLength = (crop.percentage / 100) * circumference;
                          const offset = -cumulativeLength;
                          cumulativeLength += segLength;
                          return (
                            <circle
                              key={idx}
                              r={radius}
                              cx="50"
                              cy="50"
                              fill="transparent"
                              stroke={crop.color}
                              strokeWidth="18"
                              strokeDasharray={`${segLength} ${circumference}`}
                              strokeDashoffset={offset}
                            />
                          );
                        })}
                      </svg>
                    );
                  })()}

                  <div className="blur-donut-center-badge" style={{ background: '#07171e', border: '1.5px solid rgba(255,255,255,0.18)' }}>
                    <div className="blur-donut-center-number" style={{ color: '#ffffff', fontWeight: '900', fontSize: '1.25rem' }}>
                      {totalCropArea.toFixed(1)} AC
                    </div>
                    <div className="blur-donut-center-label" style={{ color: '#00e5ff', fontWeight: '800', fontSize: '0.75rem' }}>
                      Total Planted
                    </div>
                  </div>
                </div>

                {/* Crop Acreage Breakdown Legend */}
                <div className="blur-donut-legend">
                  {cropDistribution.map((crop, idx) => (
                    <div key={idx} className="blur-legend-item">
                      <span className="blur-legend-pill" style={{ background: crop.color }}></span>
                      <span className="blur-legend-name" style={{ color: '#ffffff', fontWeight: '700' }}>
                        {getCropIcon(crop.name)} {crop.name}
                      </span>
                      <span className="blur-legend-percent" style={{ color: crop.color, fontWeight: '900' }}>
                        {crop.percentage}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Panel 2 (Right): SOIL CLASSIFICATION & ACREAGE with Real Plot Soils or Clean Empty State */}
          <div className="blur-panel blur-country-panel" style={{ background: '#0d222a', border: '1.5px solid rgba(255,255,255,0.18)' }}>
            <div className="blur-panel-title-bar">
              <span className="blur-panel-heading" style={{ color: '#00e5ff', fontWeight: '900', fontSize: '0.9rem', letterSpacing: '0.08em' }}>
                SOIL CLASSIFICATION & ACREAGE
              </span>
              {farmsList.length > 0 && (
                <span className="blur-badge blur-badge-cyan" style={{ padding: '3px 8px', fontSize: '0.72rem', fontWeight: '800' }}>
                  {totalFarmArea.toFixed(1)} TOTAL AC
                </span>
              )}
            </div>

            {farmsList.length === 0 ? (
              <div className="blur-empty-state-panel">
                <div className="blur-empty-icon-wrap">
                  <span style={{ fontSize: '2.4rem' }}>🚜</span>
                </div>
                <h4 style={{ color: '#ffffff', fontWeight: '900', fontSize: '1.15rem', margin: '8px 0 6px' }}>
                  No Farm Plots Mapped Yet
                </h4>
                <p style={{ color: '#94a3b8', fontSize: '0.86rem', maxWidth: '320px', lineHeight: '1.55', margin: '0 0 18px' }}>
                  Register your land parcels and record soil types (Alluvial, Black Cotton, Red Loam, etc.) to view acreage distribution.
                </p>
                <button 
                  type="button" 
                  className="blur-btn blur-btn-primary" 
                  style={{ fontWeight: '900', padding: '10px 22px', fontSize: '0.88rem' }}
                  onClick={() => navigate('/farm-add')}
                >
                  + Register First Farm
                </button>
              </div>
            ) : (
              <div className="blur-country-list">
                {soilDistribution.map((soil, idx) => (
                  <div key={idx} className="blur-country-item">
                    <div className="blur-country-info">
                      <span className="blur-country-flag" style={{ fontSize: '1.1rem' }}>{getSoilIcon(soil.name)}</span>
                      <span className="blur-country-name" style={{ color: '#ffffff', fontWeight: '800' }}>{soil.name}</span>
                    </div>
                    <div className="blur-country-bar-wrap" style={{ background: 'rgba(255,255,255,0.15)' }}>
                      <div className="blur-country-bar" style={{ width: `${Math.max(5, soil.percentage)}%`, background: soil.color }}></div>
                    </div>
                    <span className="blur-country-count" style={{ color: '#ffffff', fontWeight: '700' }}>{soil.area.toFixed(1)} Acres</span>
                    <span className="blur-country-pct" style={{ color: soil.color, fontWeight: '900' }}>{soil.percentage}%</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ROW 3: AGRI-WEATHER TELEMETRY & RAIN ADVISORY WIDGET */}
        <div className="blur-weather-panel">
          <div className="blur-weather-header">
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.4rem' }}>🛰️</span>
                <span className="blur-panel-heading" style={{ color: '#00e5ff', fontWeight: '900', fontSize: '0.95rem', letterSpacing: '0.08em' }}>
                  AGRI-WEATHER TELEMETRY & RAIN ADVISORY
                </span>
                <span className="blur-badge blur-badge-mint" style={{ padding: '3px 8px', fontSize: '0.72rem', fontWeight: '800' }}>
                  LIVE SENSOR FEED
                </span>
              </div>
              <div style={{ color: '#94a3b8', fontSize: '0.82rem', marginTop: '4px' }}>
                Microclimate weather data synced for precision irrigation & field operations • {weatherLastUpdated}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
              <select
                value={selectedPlotWeather}
                onChange={(e) => handlePlotSelectChange(e.target.value)}
                style={{
                  background: '#07171e',
                  color: '#ffffff',
                  border: '1.5px solid rgba(0, 229, 255, 0.4)',
                  borderRadius: '8px',
                  padding: '8px 12px',
                  fontWeight: '800',
                  fontSize: '0.88rem',
                  cursor: 'pointer'
                }}
              >
                {farmsList.length > 0 ? (
                  farmsList.map((f, idx) => (
                    <option key={idx} value={f.farmId}>
                      🌾 {f.farmName || `Plot ${f.farmId}`} ({f.soil || 'Plot'})
                    </option>
                  ))
                ) : null}
                <option value="regional">🚜 Regional Agro-Station</option>
              </select>

              <button
                type="button"
                onClick={handleRefreshWeather}
                style={{
                  background: isWeatherRefreshing ? 'rgba(0, 210, 170, 0.3)' : 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: '#ffffff',
                  padding: '8px 14px',
                  borderRadius: '8px',
                  fontWeight: '800',
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                <span style={{ transform: isWeatherRefreshing ? 'rotate(360deg)' : 'none', transition: 'transform 0.6s' }}>🔄</span>
                <span>{isWeatherRefreshing ? 'Syncing...' : 'Sync Data'}</span>
              </button>
            </div>
          </div>

          <div className="blur-weather-grid">
            {/* Left Box: Current Temperature & Metrics Pills */}
            <div className="blur-weather-current-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
                    <span style={{ color: '#ffffff', fontSize: '3.2rem', fontWeight: '900', letterSpacing: '-0.03em' }}>
                      {weatherData.temp}°C
                    </span>
                    <span style={{ fontSize: '2.4rem' }}>{getWeatherIcon(weatherData.condition, weatherData.conditionIcon)}</span>
                  </div>
                  <div style={{ color: '#00e5ff', fontSize: '1.05rem', fontWeight: '800' }}>
                    {weatherData.condition}
                  </div>
                  <div style={{ color: '#cbd5e1', fontSize: '0.82rem', marginTop: '2px' }}>
                    Feels like {weatherData.feelsLike}°C • Barometer {weatherData.barometer || 1012} hPa
                  </div>
                </div>

                <div style={{ textAlign: 'right', background: 'rgba(0, 210, 170, 0.1)', border: '1px solid rgba(0, 210, 170, 0.3)', padding: '12px 16px', borderRadius: '10px' }}>
                  <div style={{ color: '#00d2aa', fontSize: '0.75rem', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    SOIL MOISTURE
                  </div>
                  <div style={{ color: '#ffffff', fontSize: '1.65rem', fontWeight: '900' }}>
                    {weatherData.soilMoisture}%
                  </div>
                  <div style={{ color: '#00d2aa', fontSize: '0.75rem', fontWeight: '800' }}>
                    {weatherData.soilMoistureStatus || 'Optimal Root Zone'}
                  </div>
                </div>
              </div>

              {/* Telemetry Metric Pills */}
              <div className="blur-weather-metrics-pills">
                <div className="blur-weather-pill">
                  <span style={{ fontSize: '1.3rem' }}>💧</span>
                  <div>
                    <div style={{ color: '#94a3b8', fontSize: '0.72rem', fontWeight: '800', textTransform: 'uppercase' }}>HUMIDITY</div>
                    <div style={{ color: '#ffffff', fontWeight: '900', fontSize: '0.98rem' }}>{weatherData.humidity}%</div>
                  </div>
                </div>

                <div className="blur-weather-pill">
                  <span style={{ fontSize: '1.3rem' }}>🌧️</span>
                  <div>
                    <div style={{ color: '#94a3b8', fontSize: '0.72rem', fontWeight: '800', textTransform: 'uppercase' }}>RAIN PROBABILITY</div>
                    <div style={{ color: weatherData.rainProb > 40 ? '#00e5ff' : '#ffffff', fontWeight: '900', fontSize: '0.98rem' }}>
                      {weatherData.rainProb}%
                    </div>
                  </div>
                </div>

                <div className="blur-weather-pill">
                  <span style={{ fontSize: '1.3rem' }}>💨</span>
                  <div>
                    <div style={{ color: '#94a3b8', fontSize: '0.72rem', fontWeight: '800', textTransform: 'uppercase' }}>WIND SPEED</div>
                    <div style={{ color: '#ffffff', fontWeight: '900', fontSize: '0.98rem' }}>{weatherData.windSpeed} km/h</div>
                  </div>
                </div>

                <div className="blur-weather-pill">
                  <span style={{ fontSize: '1.3rem' }}>☀️</span>
                  <div>
                    <div style={{ color: '#94a3b8', fontSize: '0.72rem', fontWeight: '800', textTransform: 'uppercase' }}>SOLAR UV</div>
                    <div style={{ color: '#ffffff', fontWeight: '900', fontSize: '0.98rem' }}>{weatherData.solarUV}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Box: 3-Day Agro-Weather Forecast */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', justifyContent: 'space-between' }}>
              <div style={{ color: '#00e5ff', fontSize: '0.8rem', fontWeight: '900', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '2px' }}>
                3-DAY PRECISION AGRO FORECAST
              </div>

              {(weatherData.forecast || []).map((fc, idx) => (
                <div key={idx} className="blur-weather-forecast-card">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '1.5rem' }}>{getWeatherIcon(fc.advice, fc.icon)}</span>
                    <div>
                      <div style={{ color: '#ffffff', fontWeight: '800', fontSize: '0.88rem' }}>{fc.day}</div>
                      <div style={{ color: '#00d2aa', fontSize: '0.75rem', fontWeight: '700' }}>{fc.advice}</div>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ color: '#ffffff', fontWeight: '900', fontSize: '0.92rem' }}>
                      {fc.tempMax}° / {fc.tempMin}°C
                    </div>
                    <div style={{ color: '#00e5ff', fontSize: '0.75rem', fontWeight: '800' }}>
                      🌧️ {fc.rain} Rain
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Agronomic Advisory Banner */}
          <div className="blur-weather-advisory-banner">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span style={{ fontSize: '1.1rem' }}>🌱</span>
              <span style={{ color: '#00d2aa', fontWeight: '900', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                SMART AGRONOMIC ADVISORY FOR CROP OPERATIONS
              </span>
            </div>
            <p style={{ color: '#ffffff', fontSize: '0.92rem', fontWeight: '600', lineHeight: '1.55', margin: 0 }}>
              {weatherData.advisoryAlert}
            </p>
          </div>
        </div>

        {/* ROW 4: Farm Operations Control Matrix */}
        <div className="blur-section-divider" style={{ marginTop: '28px', marginBottom: '16px' }}>
          <span className="blur-section-title" style={{ color: '#00d2aa', fontWeight: '900', fontSize: '0.9rem', letterSpacing: '0.08em' }}>
            INTELLIGENT FARM OPERATIONS MATRIX
          </span>
        </div>

        <div className="blur-cards-grid">
          <div className="blur-card blur-feature-card" style={{ background: '#0d222a', border: '1.5px solid rgba(255,255,255,0.18)' }}>
            <div className="blur-card-icon-banner">
              <div className="blur-card-icon-wrap" style={{ background: 'rgba(0, 210, 170, 0.2)', color: '#00d2aa' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
              </div>
              <span className="blur-badge blur-badge-mint" style={{ padding: '4px 10px', fontSize: '0.78rem', fontWeight: '800' }}>{farmCount > 0 ? `${farmCount} Registered` : 'Plot Manager'}</span>
            </div>
            <h3 className="blur-card-title" style={{ fontSize: '1.35rem', fontWeight: '900', color: '#ffffff' }}>My Farm Plots</h3>
            <p className="blur-card-text" style={{ color: '#e2e8f0', fontSize: '0.92rem', lineHeight: '1.6' }}>
              Register new farm plots, classify soil types, and track acreage details across your digital agriculture estate.
            </p>
            <div className="blur-card-actions">
              <button className="blur-btn blur-btn-primary" style={{ fontWeight: '900', padding: '12px' }} onClick={() => navigate('/farm-add')}>
                + Register Farm
              </button>
              <button className="blur-btn blur-btn-secondary" style={{ fontWeight: '800', padding: '12px' }} onClick={() => navigate('/farm-list')}>
                View Plots List
              </button>
            </div>
          </div>

          <div className="blur-card blur-feature-card" style={{ background: '#0d222a', border: '1.5px solid rgba(255,255,255,0.18)' }}>
            <div className="blur-card-icon-banner">
              <div className="blur-card-icon-wrap" style={{ background: 'rgba(0, 194, 255, 0.2)', color: '#00c2ff' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
                </svg>
              </div>
              <span className="blur-badge blur-badge-cyan" style={{ padding: '4px 10px', fontSize: '0.78rem', fontWeight: '800' }}>{cropCount > 0 ? `${cropCount} Active Crops` : 'Active Crops'}</span>
            </div>
            <h3 className="blur-card-title" style={{ fontSize: '1.35rem', fontWeight: '900', color: '#ffffff' }}>Crop Operations</h3>
            <p className="blur-card-text" style={{ color: '#e2e8f0', fontSize: '0.92rem', lineHeight: '1.6' }}>
              Log crop varieties, track sowing and harvest schedules, manage resource inputs and calculate expected yields.
            </p>
            <div className="blur-card-actions">
              <button className="blur-btn blur-btn-primary" style={{ fontWeight: '900', padding: '12px' }} onClick={() => navigate('/crop-add')}>
                + Add Crop
              </button>
              <button className="blur-btn blur-btn-secondary" style={{ fontWeight: '800', padding: '12px' }} onClick={() => navigate('/crop-list')}>
                Manage Crops
              </button>
            </div>
          </div>

          <div className="blur-card blur-feature-card" style={{ background: '#0d222a', border: '1.5px solid rgba(255,255,255,0.18)' }}>
            <div className="blur-card-icon-banner">
              <div className="blur-card-icon-wrap" style={{ background: 'rgba(236, 72, 153, 0.2)', color: '#ec4899' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="1" x2="12" y2="23"></line>
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                </svg>
              </div>
              <span className="blur-badge blur-badge-pink" style={{ padding: '4px 10px', fontSize: '0.78rem', fontWeight: '800' }}>Cost Matrix</span>
            </div>
            <h3 className="blur-card-title" style={{ fontSize: '1.35rem', fontWeight: '900', color: '#ffffff' }}>Agro Expenses</h3>
            <p className="blur-card-text" style={{ color: '#e2e8f0', fontSize: '0.92rem', lineHeight: '1.6' }}>
              Define standard unit rates for water, fertilizers, pesticides, tractor hours and agricultural machinery tools.
            </p>
            <div className="blur-card-actions">
              <button className="blur-btn blur-btn-primary" style={{ fontWeight: '900', padding: '12px' }} onClick={() => navigate('/expense-add')}>
                + Add Expense
              </button>
              <button className="blur-btn blur-btn-secondary" style={{ fontWeight: '800', padding: '12px' }} onClick={() => navigate('/expense-list')}>
                Expense Directory
              </button>
            </div>
          </div>
        </div>
      </div>
    </BlurAdminLayout>
  );
};

export default FarmerMenu;
