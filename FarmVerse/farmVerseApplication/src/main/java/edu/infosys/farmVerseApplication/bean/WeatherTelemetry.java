package edu.infosys.farmVerseApplication.bean;

import java.util.List;

public class WeatherTelemetry {
    private Long farmId;
    private String farmName;
    private String soil;
    private int temp;
    private int feelsLike;
    private String condition;
    private String conditionIcon;
    private int humidity;
    private int rainProb;
    private int windSpeed;
    private int soilMoisture;
    private String soilMoistureStatus;
    private String solarUV;
    private int barometer;
    private String advisoryAlert;
    private List<DailyForecast> forecast;

    public WeatherTelemetry() {
        super();
    }

    public WeatherTelemetry(Long farmId, String farmName, String soil, int temp, int feelsLike,
                            String condition, String conditionIcon, int humidity, int rainProb,
                            int windSpeed, int soilMoisture, String soilMoistureStatus,
                            String solarUV, int barometer, String advisoryAlert, List<DailyForecast> forecast) {
        super();
        this.farmId = farmId;
        this.farmName = farmName;
        this.soil = soil;
        this.temp = temp;
        this.feelsLike = feelsLike;
        this.condition = condition;
        this.conditionIcon = conditionIcon;
        this.humidity = humidity;
        this.rainProb = rainProb;
        this.windSpeed = windSpeed;
        this.soilMoisture = soilMoisture;
        this.soilMoistureStatus = soilMoistureStatus;
        this.solarUV = solarUV;
        this.barometer = barometer;
        this.advisoryAlert = advisoryAlert;
        this.forecast = forecast;
    }

    public Long getFarmId() {
        return farmId;
    }

    public void setFarmId(Long farmId) {
        this.farmId = farmId;
    }

    public String getFarmName() {
        return farmName;
    }

    public void setFarmName(String farmName) {
        this.farmName = farmName;
    }

    public String getSoil() {
        return soil;
    }

    public void setSoil(String soil) {
        this.soil = soil;
    }

    public int getTemp() {
        return temp;
    }

    public void setTemp(int temp) {
        this.temp = temp;
    }

    public int getFeelsLike() {
        return feelsLike;
    }

    public void setFeelsLike(int feelsLike) {
        this.feelsLike = feelsLike;
    }

    public String getCondition() {
        return condition;
    }

    public void setCondition(String condition) {
        this.condition = condition;
    }

    public String getConditionIcon() {
        return conditionIcon;
    }

    public void setConditionIcon(String conditionIcon) {
        this.conditionIcon = conditionIcon;
    }

    public int getHumidity() {
        return humidity;
    }

    public void setHumidity(int humidity) {
        this.humidity = humidity;
    }

    public int getRainProb() {
        return rainProb;
    }

    public void setRainProb(int rainProb) {
        this.rainProb = rainProb;
    }

    public int getWindSpeed() {
        return windSpeed;
    }

    public void setWindSpeed(int windSpeed) {
        this.windSpeed = windSpeed;
    }

    public int getSoilMoisture() {
        return soilMoisture;
    }

    public void setSoilMoisture(int soilMoisture) {
        this.soilMoisture = soilMoisture;
    }

    public String getSoilMoistureStatus() {
        return soilMoistureStatus;
    }

    public void setSoilMoistureStatus(String soilMoistureStatus) {
        this.soilMoistureStatus = soilMoistureStatus;
    }

    public String getSolarUV() {
        return solarUV;
    }

    public void setSolarUV(String solarUV) {
        this.solarUV = solarUV;
    }

    public int getBarometer() {
        return barometer;
    }

    public void setBarometer(int barometer) {
        this.barometer = barometer;
    }

    public String getAdvisoryAlert() {
        return advisoryAlert;
    }

    public void setAdvisoryAlert(String advisoryAlert) {
        this.advisoryAlert = advisoryAlert;
    }

    public List<DailyForecast> getForecast() {
        return forecast;
    }

    public void setForecast(List<DailyForecast> forecast) {
        this.forecast = forecast;
    }
}
