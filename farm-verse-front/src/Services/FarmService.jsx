import axios from "axios";
 
const FARM_URL = "http://localhost:9696/farmverse/farm";
const ID_URL = "http://localhost:9696/farmverse/farm-id";
const FNO_URL="http://localhost:9696/farmverse/farm-no";
export const addFarm = (farm) => {
  // TODO Auto-generated method stub
  return axios.post(FARM_URL, farm, {
    withCredentials: true,
  });
};
 
export const updateFarm = (farm) => {
  return axios.put(FARM_URL, farm, {
    withCredentials: true,
  });
};
 
export const getFarmById = (id) => {
  // TODO Auto-generated method stub
  return axios.get(`${FARM_URL}/${id}`, {
    withCredentials: true,
  });
};
 
export const getFarmsByUsername = () => {
  return axios.get(FARM_URL, {
    withCredentials: true,
  });
};
 
export const deleteFarmById = (id) => {
  // TODO Auto-generated method stub
  return axios.delete(`${FARM_URL}/${id}`, {
    withCredentials: true,
  });
};
 
export const generateFarmId = () => {
  return axios.get(ID_URL, {
    withCredentials: true,
  });
}
  export const getAllFarmIdsByUser=()=>{
    return axios.get(FNO_URL,{
      withCredentials:true
    });

}
 
 

	