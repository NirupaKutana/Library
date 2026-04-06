import React, { useEffect, useState } from 'react';
import Approuter from './router/Approuter';
import './App.css';

import SessionLock from './components/SessionLock';
import useIdeleTimer from './components/useIdeleTimer';
import { fetchPermission } from './components/RBAC';



function App() {
  
  const token =localStorage.getItem("access_token") ;
 
  const[Locked,setLocked]=useState(localStorage.getItem("sessionLocked") === "true");
  useIdeleTimer(()=>{
    localStorage.setItem("sessionLocked", "true");
    setLocked(true);
  },10*60*1000);
  
  const logout = ()=>{
    localStorage.removeItem("token");
    window.location.href ="/login";
  };

  if(Locked && token)
  {
    return(
      <SessionLock onSuccess={() => {
       localStorage.removeItem("sessionLocked");
       setLocked(false);}}
      onLogout={logout}/>
    );
  }
  
  return (
    <div className="App">
     
      <Approuter/>
      
    </div>
  );
}

export default App;
