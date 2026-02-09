import React, { useEffect, useState } from 'react'
import '../style/Profile.css'
import axios from 'axios'
import { NavLink, useNavigate } from 'react-router-dom'
const Profile = () => {
  const[userdata,setUserData]=useState<any>(null)
  const email   = localStorage.getItem("email")
  const navigate = useNavigate()
 
    useEffect(() => {
    const token = localStorage.getItem("access_token")
    if (!token) {
      navigate("/login")
      return
    }
    
    const user = localStorage.getItem("user")  
    console.log(user)
    if(user){
       const parseUser = JSON.parse(user)
       const id = parseUser.user_id
       console.log(id)

       axios.get(`http://127.0.0.1:8000/user/${id}/`)
      .then(res => {
        setUserData(res.data)
        console.log(res.data)
    })
    .catch(err=>console.log(err))
    } 
    
  },[])

  
  const handleLogout =()=>{
    localStorage.clear();
    navigate('/login')

  }
  return (
     <div className="profile-card">
      {userdata && (
        <>
          <h2>User Profile</h2>
          
          
            <div >
            {/* <p><b>ID:</b> {userdata.user_id}</p> */}
            <p><b>Name:</b> {userdata.user_name}</p>
            <p><b>Email:</b> {userdata.user_email}</p>
            </div>
         
           
          <button onClick={handleLogout}>Logout</button>
        </>
      )}
    </div>
  )
}

export default Profile
