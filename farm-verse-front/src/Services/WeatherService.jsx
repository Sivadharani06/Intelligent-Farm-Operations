import axios from "axios";

const WEATHER_URL = "http://localhost:9696/farmverse/weather";

export const getWeatherByFarmId = (farmId) => {
    return axios.get(`${WEATHER_URL}/${farmId}`, {
        withCredentials: true
    });
};

export const getRegionalWeather = () => {
    return axios.get(WEATHER_URL, {
        withCredentials: true
    });
};
