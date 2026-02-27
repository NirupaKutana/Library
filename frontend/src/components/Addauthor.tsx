import React, { useEffect, useState } from 'react'
import '../style/Addauthor.css'
import axios from 'axios'
import { useNavigate,useLocation, Navigate } from 'react-router-dom'
import { toast } from 'react-toastify'
const Addauthor = ({ author, onSuccess }: any) => {
  const BASE_URL = "http://127.0.0.1:8000";
  const[name,setname]= useState("")
  const navigate=useNavigate()
  const isEdit = Boolean(author?.id)
  
  useEffect(()=>{
      if(author)
    {
        setname(author.name)
    } 
    else{
        setname("")
    }
    },[author])

  const handlechange = async (e:React.FormEvent)=>
    {
    e.preventDefault()  
    if(isEdit)
      {
          axios.put(`${BASE_URL}/author/update/${author.id}/`,{
           author_name:name 
          }).then((res)=>{
            
            toast.success(res.data.success)
            navigate("/profile", { state: { activeTab: "Author" } })
            window.location.reload()
          }).catch((err:any)=>{
      
            toast.error(err.response?.data?.error)
          })
      }
    else
      {
        axios.post(`${BASE_URL}/author/`,{
           author_name :name
          }).then((res)=>{
          toast.success(res.data.success)
          navigate("/profile", { state: { activeTab: "Author" } })
          }).catch((error)=>{
              toast.error(error.response?.data?.error)
          })
      }
      onSuccess()
   }

  return (
    <div className='addbook-container'>
       <form onSubmit={handlechange}>
        <h3>{isEdit ? "Upadte Author " : "Add Author Details"}</h3>
        <label htmlFor="">Name</label>
        <input type="text" value={name} onChange={(e)=>setname(e.target.value)}/>
        <button type='submit'>Submit</button>
       </form>
    </div>
  )
}

export default Addauthor
