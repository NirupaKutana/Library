import axios from 'axios';
import React, { useState } from 'react'
import { toast } from 'react-toastify';
import '../style/SessionLock.css'
interface props{
    onSuccess:()=>void;
    onLogout:()=>void;
}
const SessionLock = ({onSuccess,onLogout}:props) => {
  const [password,setPassword] = useState("");
  const user = JSON.parse( localStorage.getItem("user") || '{}');
  console.log(user)

  const verify = async ()=>{
    try{
        await axios.post("http://127.0.0.1:8000/session/verify/",{
            password: password,   // password from input state
            user_id: user.user_id
        });
        onSuccess();
    }
    catch(err:any)
    {
        toast.error(err.response?.data?.error);
        
    }
  }
  return (
    <div className="session-lock">
    <div className="lock-card">
        <h2>Session Locked 🔒</h2>
        <input type="password" placeholder='Enter Password' 
        value={password} onChange={(e)=>setPassword(e.target.value)} />

        <div className="btn-group">
        <button className="continue-btn" onClick={verify}>Continue</button>
        <button className="logout-btn" onClick={onLogout}>Logout</button>
        </div>
    </div>
    </div>
  );
};

export default SessionLock
