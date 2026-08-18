import axios from 'axios';

const CROP_INPUT_URL = "http://localhost:9696/farmverse/crop-input";
const CROP_EXPENSE_URL = "http://localhost:9696/farmverse/crop-exp";


export const addCropInput = (cropInput) => {
    return axios.post(CROP_INPUT_URL, cropInput, {
        withCredentials: true,
    });
};

export const getCropInputById = (id) => {
    return axios.get(`${CROP_INPUT_URL}/${id}`, {
        withCredentials: true,
    });
};

export const deleteCropInputById = (id) => {
    return axios.delete(`${CROP_INPUT_URL}/${id}`, {
        withCredentials: true,
    });
};

export const getCropExpenseCalculation = (id) => {
    return axios.get(`${CROP_EXPENSE_URL}/${id}`, {
        withCredentials: true,
    });
};

