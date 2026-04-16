import React, { useState } from 'react'
import '../style/Register.css'
import API from '../Api/axios';
import { NavLink, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Registe = () => {
const[userdata,setUserData] = useState([]);
 
    const[name,setname]=useState("");
    const[email,setemail]=useState("")
    const[password,setpassword]=useState("")
    const[repass,setrepass]=useState("")
    const [error, setError] = useState("");
     const navigate = useNavigate();
    
      
    const validpass=(password:string)=>{
       const relax =/^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,15}$/;
       return relax.test(password);
    };
//  setTimeout (()=>{
//     setError("");
//  },3000); 
    
    const signupAPI=async()=>
    {
        
         API.post(`/user/`,{
          user_name :name,
          user_email:email,
          user_password:password,
        }).then(res=>{
            setUserData(res.data);
            toast.success(res.data.Detail )
            
        }).catch(err=>console.log(err))
    }
    const handlesubmit =async (e:React.FormEvent) =>{
        e.preventDefault()
        if(password!==repass){
            
            setError("password do not match");
            return;
        }
        if (!validpass(password)) {
            setError(
            "Password must be 6-15 chars, include 1 uppercase & 1 special character"
            );
            return;
        }
        setError("");
        try{
            const res = await signupAPI();
            localStorage.setItem("verify_email", email);
            navigate("/Verify");
            
        }catch(err){
          console.log(err)
          setError("SignUp Failed")
        }
        
    }
  return (
    <div className="signup-page">
         <div className="signup-card">  
            <h2>Create Account</h2>
            <form onSubmit={handlesubmit}>
                    
                    <label>Name:</label>
                    <input type="text" placeholder='Enter Your Name' value={name} onChange={(e)=>setname(e.target.value)}/>
                  
                    <label>Email:</label>
                    <input type="email" placeholder='Enter Your Email' value={email} onChange={(e)=>setemail(e.target.value)}/>
                    <label>Password:</label>
                    <input type="password" placeholder='Enter password' value={password} onChange={(e)=>setpassword(e.target.value)}/>
                 
                    
                    <label>Re Enter Password:</label>
                    <input type="password" placeholder='Re Enter password'value={repass} onChange={(e)=>setrepass(e.target.value)}/>
                     <NavLink to ='/login'><p>If You Have already Registered ?</p></NavLink>
                  
                     {error && <p className="error-text">{error}</p>}
                    
                    <button type='submit' disabled={password !== repass}>SignUp</button>
            </form>
        </div>
    </div>
  )
}



export default Registe
