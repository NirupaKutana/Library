import React, { useEffect, useState } from 'react'
import '../style/VerifyEmail.css'
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify';
import axios from 'axios';
const VerifyEmail = () => {
   const navigate = useNavigate()
   const email = localStorage.getItem("verify_email")
   console.log("verify_email",email)
   const handleLogin = async()=>{
    try{
      const res = await axios.post("http://127.0.0.1:8000/check-verification/",{email});
      if (res.data.is_active) {
        navigate("/login");
      } else {
        toast.error("Please verify your email first.");
      }
    }
    catch(err:any)
    {
        toast.error("Something went wrong.");
    }
   }
   const handleResend = ()=>{
    try{
       const res = axios.post("http://127.0.0.1:8000/resend-verify/",{email})
       toast.success(`${res}`)

    }
    catch(err:any)
    {
        toast.error("fail to send mail")
    }
   
   }
    return (
    <div className="verify-container">
      <div className="verify-card">
      <h2>Email Verification</h2>
      <p>Please verify your email to continue.</p>
     <button onClick={handleLogin} className="verify-btn login-btn">Login</button>   
     <button onClick={handleResend} className="verify-btn resend-btn">Resend Varification mail</button>
    </div>
    </div>
  )
}

export default VerifyEmail
