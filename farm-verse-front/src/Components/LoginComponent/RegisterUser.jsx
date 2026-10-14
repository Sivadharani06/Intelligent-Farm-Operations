import React,{useState,useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {registerNewUser} from "../../Services/LoginService";
import '../../DisplayView.css';

const RegisterUser=()=>{
  let navigate=useNavigate();
    const [errors,setErrors]=useState({});
    const [farmUser,setFarmUser]=useState({
         username:"",
         password: "",
         personalName:"",
         email:"",
        });
   const [flag,setFlag]=useState(false);
   const [confirmPassword,setConfirmPassword]=useState("");
   const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
   
   useEffect(() => {
       setFlag(false);
   }, []);
 
    const createNewUser = (event) => {
     event.preventDefault();
        if(farmUser.password===confirmPassword){
          registerNewUser(farmUser).then((response)=>{
           setFlag(true);
           setErrors({});
           }).catch(err => {
             console.error("Registration failed:", err);
             setErrors({ global: "Registration failed. " + (err.response?.data?.message || err.message) });
           });
     }
  };
  const  onChangeHandler = (event) =>{
     event.persist();
     setFlag(false);
     const name = event.target.name;
         const value = event.target.value;
        setFarmUser(values =>({...values, [name]: value }));
    };
  const handleValidation = (event) => {
     event.preventDefault();
     let tempErrors = {};
     let isValid = true;
 
     if (!farmUser.username.trim()) {
       tempErrors.username = "User Name is required";
       isValid = false;
     }
 
     if (!farmUser.password.trim()) {
       tempErrors.password = "Password is required";
       isValid = false;
     }
     else if (farmUser.password.length < 5 || farmUser.password.length > 10) {
        tempErrors.password="Password must be 5-10 characters long";
       isValid = false;
     }
     else if (farmUser.password!==confirmPassword) {
       tempErrors.password="Both the passwords do not match";
      isValid = false;
    }
 
   if (!farmUser.personalName.trim()) {
         tempErrors.personalName = "Personal Name is required";
         isValid = false;
     }
 if (!farmUser.email.trim()) {
         tempErrors.email = "Email is required";
         isValid = false;
       }
       else if(!emailPattern.test(farmUser.email)){
         tempErrors.email = "Invalid Email Format";
         isValid = false;
       }
   
       if (!confirmPassword.trim()) {
         tempErrors.confirmPassword = "Confirm Password is required";
         isValid = false;
       }
 
    setErrors(tempErrors);
     if (isValid) {
         createNewUser(event);
     }
   };
   const returnBack=()=>{
   navigate('/');
  }

 
   return(
    <div className="login-container" style={{ background: '#07161c' }}>
      <div className="login-box" style={{ background: '#0d222a', border: '1.5px solid rgba(255,255,255,0.18)', maxWidth: '520px' }}>
         <h2 className="text-center" style={{ color: '#ffffff', fontWeight: '900', fontSize: '1.8rem', marginBottom: '8px' }}>Farmer Registration</h2>
         <p style={{ textAlign: 'center', color: '#00e5ff', fontWeight: '700', marginBottom: '24px' }}>Create an account to manage your farm plots and crops</p>
         
         <form method="post">
           <div className="form-group text-left" style={{ marginBottom: '16px' }}>
             <label style={{ color: '#00e5ff', fontWeight: '800', fontSize: '0.9rem' }}>User Name: </label>
             <input placeholder="Enter Username" name="username" className="form-control" value={farmUser.username} onChange={(event) => onChangeHandler(event)} style={{ background: '#07171e', color: '#ffffff', fontWeight: '700', border: '1.5px solid rgba(255,255,255,0.2)' }} />
             {errors.username && <p style={{ color: "#fb7185", fontSize: "0.85rem", marginTop: "4px", fontWeight: '700' }}>{errors.username}</p>}
           </div>

           <div className="form-group text-left" style={{ marginBottom: '16px' }}>
             <label style={{ color: '#00e5ff', fontWeight: '800', fontSize: '0.9rem' }}>Password: </label>
             <input type="password" placeholder="Enter Password" name="password" className="form-control" value={farmUser.password} onChange={(event) => onChangeHandler(event)} style={{ background: '#07171e', color: '#ffffff', fontWeight: '700', border: '1.5px solid rgba(255,255,255,0.2)' }} />
             {errors.password && <p style={{ color: "#fb7185", fontSize: "0.85rem", marginTop: "4px", fontWeight: '700' }}>{errors.password}</p>}
           </div>

           <div className="form-group text-left" style={{ marginBottom: '16px' }}>
             <label style={{ color: '#00e5ff', fontWeight: '800', fontSize: '0.9rem' }}>Confirm Password: </label>
             <input type="password" placeholder="Retype Password" name="confirmPassword" className="form-control" value={confirmPassword} onChange={(event) =>setConfirmPassword(event.target.value)} style={{ background: '#07171e', color: '#ffffff', fontWeight: '700', border: '1.5px solid rgba(255,255,255,0.2)' }} />
             {errors.confirmPassword && <p style={{ color: "#fb7185", fontSize: "0.85rem", marginTop: "4px", fontWeight: '700' }}>{errors.confirmPassword}</p>}
           </div>

           <div className="form-group text-left" style={{ marginBottom: '16px' }}>
             <label style={{ color: '#00e5ff', fontWeight: '800', fontSize: '0.9rem' }}>Personal Name: </label>
             <input placeholder="Enter Personal Name" name="personalName" className="form-control" value={farmUser.personalName} onChange={(event) => onChangeHandler(event)} style={{ background: '#07171e', color: '#ffffff', fontWeight: '700', border: '1.5px solid rgba(255,255,255,0.2)' }} />
             {errors.personalName && <p style={{ color: "#fb7185", fontSize: "0.85rem", marginTop: "4px", fontWeight: '700' }}>{errors.personalName}</p>}
           </div>

           <div className="form-group text-left" style={{ marginBottom: '22px' }}>
             <label style={{ color: '#00e5ff', fontWeight: '800', fontSize: '0.9rem' }}>Email: </label>
             <input placeholder="Enter Email" name="email" className="form-control" value={farmUser.email} onChange={(event) => onChangeHandler(event)} style={{ background: '#07171e', color: '#ffffff', fontWeight: '700', border: '1.5px solid rgba(255,255,255,0.2)' }} />
             {errors.email && <p style={{ color: "#fb7185", fontSize: "0.85rem", marginTop: "4px", fontWeight: '700' }}>{errors.email}</p>}
           </div>
          
           <button className='btn btn-primary w-100' style={{ fontWeight: '900', padding: '12px', fontSize: '1rem' }} onClick={handleValidation}>Register Account</button>
           {errors.global && <p style={{ color: "#fb7185", fontSize: "0.9rem", marginTop: "10px", textAlign: "center", fontWeight: '700' }}>{errors.global}</p>}
         </form>

         <div>
              {flag && (
                <div style={{ marginTop: '20px', textAlign: 'center', background: '#07171e', border: '2px solid #00d2aa', padding: '14px', borderRadius: '8px', color: '#00d2aa', fontWeight: '800' }}>
                  New User Created! <button className='btn btn-success btn-sm ms-2' onClick={returnBack}>Go to Login</button>
                </div>
              )}
         </div>
         <hr style={{ borderColor: 'rgba(255,255,255,0.12)' }} />
         <button className='btn btn-secondary w-100' style={{ fontWeight: '800', padding: '12px' }} onClick={returnBack}>Back to Login</button>
       </div>
     </div>
   );
 
};
export default RegisterUser;