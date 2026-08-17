import axios from 'axios';

const LOGIN_URL='http://localhost:9696/farmverse/login';
const LOGOUT_URL = 'http://localhost:9696/farmverse/logout';
const USR_URL = 'http://localhost:9696/farmverse/user';

    export const registerNewUser=(user)=> {
        return axios.post(LOGIN_URL,user, {
            withCredentials: true
        });
        }
    export const validateUser=(userId,password)=> {
    return axios.get(`${LOGIN_URL}/${userId}/${password}`, {
        withCredentials: true  
    });
    }
    export const getUserDetails=()=>{
    return axios.get(LOGIN_URL,{
        withCredentials: true
    });
    }
    export const getUserId=()=>{
    return axios.get(USR_URL,{
        withCredentials: true
    });
     }
    export const logoutUser=()=>{
    return axios.post(LOGOUT_URL,{},{
        withCredentials: true
    });
    }
  

 





	
	
 
	
 

