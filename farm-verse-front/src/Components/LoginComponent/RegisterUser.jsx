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
       tempErrors.password="Both the passwords are not matched";
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
    <div 
      style={{
        backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.4), rgba(15, 23, 42, 0.6)), url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=2832&q=80')`,
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
      <div className="login-box" style={{ 
        maxWidth: '500px', 
        width: '100%',
        textAlign: 'left',
        background: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(15px)',
        WebkitBackdropFilter: 'blur(15px)',
        borderRadius: '24px',
        boxShadow: '0 25px 50px rgba(0,0,0,0.2)',
        padding: '40px'
      }}>
         <h2 className="text-center">Farmer Registration</h2>
         <br/>
         <form method="post">
           <div className="form-group text-left">
             <label>User Name: </label>
             <input placeholder="Enter Username" name="username" className="form-control" value={farmUser.username} onChange={(event) => onChangeHandler(event)} />
             {errors.username && <p style={{ color: "red", fontSize: "0.85rem", marginTop: "4px", textAlign: "left" }}>{errors.username}</p>}
           </div>
           <div className="form-group text-left">
             <label>Password: </label>
             <input type="password" placeholder="Enter Password" name="password" className="form-control" value={farmUser.password} onChange={(event) => onChangeHandler(event)}/>
             {errors.password && <p style={{ color: "red", fontSize: "0.85rem", marginTop: "4px", textAlign: "left" }}>{errors.password}</p>}
           </div>
           <div className="form-group text-left">
             <label>Confirm Password: </label>
             <input type="password" placeholder="Retype Password" name="confirmPassword" className="form-control" value={confirmPassword} onChange={(event) =>setConfirmPassword(event.target.value)}/>
             {errors.confirmPassword && <p style={{ color: "red", fontSize: "0.85rem", marginTop: "4px", textAlign: "left" }}>{errors.confirmPassword}</p>}
           </div>
           <div className="form-group text-left">
             <label>Personal Name: </label>
             <input placeholder="Enter Personal Name" name="personalName" className="form-control" value={farmUser.personalName} onChange={(event) => onChangeHandler(event)} />
             {errors.personalName && <p style={{ color: "red", fontSize: "0.85rem", marginTop: "4px", textAlign: "left" }}>{errors.personalName}</p>}
           </div>
           <div className="form-group text-left">
             <label>Email: </label>
             <input placeholder="Enter Email" name="email" className="form-control" value={farmUser.email} onChange={(event) => onChangeHandler(event)} />
             {errors.email && <p style={{ color: "red", fontSize: "0.85rem", marginTop: "4px", textAlign: "left" }}>{errors.email}</p>}
           </div>
          
             <br/>
             <button className='btn btn-primary w-100' onClick={handleValidation}>Register</button>
         </form>
         <br/>
         <div>
              {flag && (
                <div className="alert alert-success" style={{ borderRadius: "12px", padding: "12px" }}>
                  New User Created! <button className='btn btn-success btn-sm ms-2' onClick={returnBack}>Go to Login</button>
                </div>
              )}
         </div>
         <hr />
         <button className='btn btn-secondary w-100' onClick={returnBack}>Back to Login</button>
       </div>
     </div>
   );
 
};
export default RegisterUser;