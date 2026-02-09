import React, { useEffect, useState } from 'react'
import '../style/Login.css'
import { NavLink, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import Forgot from './Forgot'
const Login = () => {
    
    const [isshow,setIsshow] = useState<Boolean>(false)
    const [email,setEmail] =useState("")
    const [password,setPassword]=useState("")
    // const [error,setError]=useState("")
    const navigate = useNavigate()

     
    const handleLogin = async (e:React.FormEvent) =>
        {   e.preventDefault()
            // setError("")
            try 
            {
                const response = await axios.post("http://127.0.0.1:8000/login/",{
                user_email :email,
                user_password:password})
                if(response.data.access_token)
                {   
                    
                    toast.success("login Successfully")
                    //  save token
                    localStorage.setItem("access_token", response.data.access_token);
                    localStorage.setItem("refresh_token", response.data.refresh_token);
                    // optional: save user
                    localStorage.setItem("role", response.data.user.role);
                    localStorage.setItem("user", JSON.stringify(response.data.user));
                    navigate("/");
                }
                }catch(error:any)
                {   
               
                    console.log("login error",error.response?.data?.error)
                    toast.error(`${error.response?.data?.error}`)
                    //setError(error.response?.data?.error)
                }
            
    };     
  return (
    <>
    <div className={isshow ? "book-container dimmed" : "" }>
            <div className="login-page">
            <div className="login-card">
                <h2>Login</h2>
                {/* {error && <p className="error">{error}</p>} */}
            <form >
                <label>Email:</label>
                <input type="email" placeholder='Enter Your Email'value={email} onChange={(e)=>setEmail(e.target.value)} />
                <label>Password:</label>
                <input type="password" placeholder='Enter password' value={password} onChange={(e)=>setPassword(e.target.value)} />
                 <div className="forgot-link-wrapper">
                 <span className="forgot-link" onClick={() => setIsshow(true)}>Forgot Password?</span>
                 </div>
                <button type='submit' onClick={handleLogin}>Login</button>
                <NavLink to="/SignUp"><p>If You Have Not register Yest ?</p></NavLink>
                </form>
            </div>
        </div>
   </div>
   {isshow &&(
    <>
     <div className='overlay'></div>
    <div className='modal-container'>
      
      <button className='modal-close' onClick={()=>setIsshow(false)}>&times;</button>
       <Forgot onClose={() => setIsshow(false)} />
    </div>
    </>
   )}
   </>
  )
}

export default Login
