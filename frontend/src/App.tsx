import React, { useEffect, useState } from 'react';
import Approuter from './router/Approuter';
import './App.css';

import SessionLock from './components/SessionLock';
import useIdeleTimer from './components/useIdeleTimer';
import { fetchPermission } from './components/RBAC';



function App() {
  
  
  const[Locked,setLocked]=useState(false);
  useIdeleTimer(()=>{
    setLocked(true);
  },10*60*1000);
  
  const logout = ()=>{
    localStorage.removeItem("token");
    window.location.href ="/login";
  };

  if(Locked)
  {
    return(
      <SessionLock onSuccess={()=>setLocked(false)}
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
