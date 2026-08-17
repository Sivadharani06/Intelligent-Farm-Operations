import axios from "axios";

const Y_URL='http://localhost:9696/farmverse/yield';

export const getExpectedYield=(id)=>{
      return axios.post(`${Y_URL}/${id}`, {
        withCredentials: true
   });
}

const P_URL = 'http://localhost:9696/farmverse/predict';

export const getExpectedExpenses = (id) => {
    return axios.post(`${P_URL}/${id}`, null, {
        withCredentials: true
    });
}

