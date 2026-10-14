import React,{useState} from 'react';
import {useNavigate} from 'react-router-dom';
import { validateUser } from "../../Services/LoginService";
import '../../DisplayView.css';
 
const LoginPage=()=>{
  let navigate=useNavigate();
   const [errors,setErrors]=useState({});
   const [loginData,setLoginData]=useState({
      username :"",
      password:""
 });
 const [flag,setFlag]=useState(true);
 
 
 const validateLogin=(e)=>{
     e.preventDefault();
     validateUser(loginData.username,loginData.password).then((response)=>{
      let reply=String(response.data);
       if(reply==="True" || reply==="true")
          navigate("/farmer-menu");
        else
        setFlag(false);
     });
  }
  
  const  onChangeHandler = (event) =>{
     event.persist();
     setFlag(true);
     const name = event.target.name;
     const value = event.target.value;
     setLoginData(values =>({...values, [name]: value }));
 };

 const handleValidation = (event) => {
     event.preventDefault();
     let tempErrors = {};
     let isValid = true;
 
     if (!loginData.username.trim()) {
       tempErrors.username = "User Name is required";
       isValid = false;
     }
 
     if (!loginData.password.trim()) {
       tempErrors.password = "Password is required";
       isValid = false;
     }
 
     setErrors(tempErrors);
     if (isValid) {
       validateLogin(event);
     }
   };
 
   const registerNewUser=(e)=>{
     navigate('/register');
 }
 
    return (
      <div className="login-container" style={{ background: '#07161c' }}>
        <div className="login-card-centered" style={{ background: '#0d222a', border: '1.5px solid rgba(255,255,255,0.18)' }}>
          
          <h1 className="login-app-title" style={{ fontSize: '1.8rem', fontWeight: '900', color: '#ffffff' }}>Farm Verse Platform</h1>
          <hr className="title-divider" />
          
          <div className="login-form-body">
            <h2 className="login-form-title" style={{ fontSize: '1.4rem', fontWeight: '900', color: '#ffffff' }}>User Login</h2>
            <p className="login-form-subtitle" style={{ color: '#00e5ff', fontWeight: '700', fontSize: '0.95rem' }}>Welcome back! Enter credentials to manage your estate.</p>
            
            <form onSubmit={handleValidation}>
               <div className="form-group text-left" style={{ marginBottom: '18px' }}>
                  <label style={{ color: '#00e5ff', fontWeight: '800', fontSize: '0.9rem' }}>User Name</label>
                  <input 
                    placeholder="Enter Username" 
                    name="username" 
                    className="form-control" 
                    value={loginData.username} 
                    onChange={onChangeHandler} 
                    style={{ background: '#07171e', color: '#ffffff', fontWeight: '700', fontSize: '1rem', border: '1.5px solid rgba(255,255,255,0.2)' }}
                  />
                  {errors.username && <p style={{ color: "#fb7185", fontWeight: '700', fontSize: '0.85rem', marginTop: '4px' }}>{errors.username}</p>}
               </div>
               
               <div className="form-group text-left" style={{ marginBottom: '22px' }}>
                  <label style={{ color: '#00e5ff', fontWeight: '800', fontSize: '0.9rem' }}>Password</label>
                  <input 
                    type="password" 
                    placeholder="Enter Password" 
                    name="password" 
                    className="form-control" 
                    value={loginData.password} 
                    onChange={onChangeHandler}
                    style={{ background: '#07171e', color: '#ffffff', fontWeight: '700', fontSize: '1rem', border: '1.5px solid rgba(255,255,255,0.2)' }}
                  />
                  {errors.password && <p style={{ color: "#fb7185", fontWeight: '700', fontSize: '0.85rem', marginTop: '4px' }}>{errors.password}</p>}
               </div>
               
               <button type="submit" className='btn btn-primary w-100 login-submit-btn' style={{ fontWeight: '900', padding: '12px' }} onClick={handleValidation}>Sign In</button>
            </form>
            
            <div className="mt-3 text-center">
               {!flag && <p style={{ color: "#fb7185", fontWeight: "800", background: '#07171e', padding: '10px', borderRadius: '8px', border: '1px solid #e11d48' }}>Invalid User Id or Password</p>}
            </div>
            
            <hr style={{ borderColor: 'rgba(255,255,255,0.12)' }} />
            
            <div className="text-center">
               <button className='btn btn-secondary w-100' style={{ fontWeight: '800', padding: '12px' }} onClick={(e) => registerNewUser(e)}>Register New User</button>
            </div>
          </div>

        </div>
      </div>
    );
 
};
export default LoginPage;