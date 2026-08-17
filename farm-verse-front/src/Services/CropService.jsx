import axios from "axios";

const CROP_URL = "http://localhost:9696/farmverse/crop";
const ID_URL = "http://localhost:9696/farmverse/crop-id";

export const addCrop = (crop) => {
    return axios.post(CROP_URL, crop, {
        withCredentials: true,
    });
};

export const updateCrop = (crop) => {
    return axios.put(CROP_URL, crop, {
        withCredentials: true,
    });
};

export const getCropById = (id) => {
    return axios.get(`${CROP_URL}/${id}`, {
        withCredentials: true,
    });
};

export const getCropsByUsername = () => {
    return axios.get(CROP_URL, {
        withCredentials: true,
    });
};

export const deleteCropById = (id) => {
    return axios.delete(`${CROP_URL}/${id}`, {
        withCredentials: true,
    });
};

export const generateCropId = () => {
    return axios.get(ID_URL, {
        withCredentials: true,
    });
};