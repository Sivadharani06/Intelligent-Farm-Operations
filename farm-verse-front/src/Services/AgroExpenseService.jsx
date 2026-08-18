import axios from "axios";

const EXP_URL = "http://localhost:9696/farmverse/exp";
const GET_EXP_URL = "http://localhost:9696/farmverse/getexp";
const DEL_EXP_URL = "http://localhost:9696/farmverse/agroexp";
const EXP_ID_URL = "http://localhost:9696/farmverse/expid";

export const addAgroExpense = (expense) => {
  return axios.post(EXP_URL, expense, {
    withCredentials: true,
  });
};

export const updateAgroExpense = (expense) => {
  return axios.put(EXP_URL, expense, {
    withCredentials: true,
  });
};

export const getAgroExpenseById = (id) => {
  return axios.get(`${GET_EXP_URL}/${id}`, {
    withCredentials: true,
  });
};

export const getAllAgroExpenses = () => {
  return axios.get(GET_EXP_URL, {
    withCredentials: true,
  });
};

export const deleteAgroExpenseById = (id) => {
  return axios.delete(`${DEL_EXP_URL}/${id}`, {
    withCredentials: true,
  });
};

export const generateExpenseId = () => {
  return axios.get(EXP_ID_URL, {
    withCredentials: true,
  });
};
