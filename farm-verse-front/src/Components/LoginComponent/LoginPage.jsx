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
      <div 
        className="login-container" 
        style={{ 
          backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.15), rgba(15, 23, 42, 0.3)), url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=2832&q=80')`,
          height: '100vh',
          overflowY: 'auto',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          padding: '40px 20px',
          boxSizing: 'border-box'
        }}
      >
        <div className="login-card-centered">
          
          <h1 className="login-app-title">Farm Verse Application Platform</h1>
          <hr className="title-divider" />
          
          <div className="login-form-body">
            <h2 className="login-form-title">User Login</h2>
            <p className="login-form-subtitle">Welcome back! Please enter your credentials to manage your farm.</p>
            
            <form onSubmit={handleValidation}>
               <div className="form-group text-left">
                  <label>User Name</label>
                  <input 
                    placeholder="Enter Username" 
                    name="username" 
                    className="form-control" 
                    value={loginData.username} 
                    onChange={onChangeHandler} 
                  />
                  {errors.username && <p className="error-text">{errors.username}</p>}
               </div>
               
               <div className="form-group text-left">
                  <label>Password</label>
                  <input 
                    type="password" 
                    placeholder="Enter Password" 
                    name="password" 
                    className="form-control" 
                    value={loginData.password} 
                    onChange={onChangeHandler}
                  />
                  {errors.password && <p className="error-text">{errors.password}</p>}
               </div>
               
               <button type="submit" className='btn btn-primary w-100 login-submit-btn' onClick={handleValidation}>Submit</button>
            </form>
            
            <div className="mt-3 text-center">
               {!flag && <p style={{ color: "red", fontWeight: "600" }}>Invalid User Id or Password</p>}
            </div>
            
            <hr />
            
            <div className="text-center">
               <button className='btn btn-info' onClick={(e) => registerNewUser(e)}>Register New User</button>
            </div>
          </div>

        </div>
      </div>
    );
 
};
export default LoginPage;