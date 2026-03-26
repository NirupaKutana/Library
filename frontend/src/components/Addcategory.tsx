import React, { useEffect, useState } from 'react'
import '../style/Addcategory.css'
import axios from 'axios'
import { useLocation,useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { error } from 'console'
import API from '../Api/axios'
const Addcategory = ({ category, onSuccess }: any) => {
    const BASE_URL = "http://127.0.0.1:8000";
    const[name,setname]=useState("");
    const navigate = useNavigate();
    const isEdit = Boolean(category?.id);

    // ----------------------------------fatching and set data from book table
  useEffect(() => {
  if (category) {
    setname(category.name);
  } else {
    setname("");
  }
}, [category]);


    const handlechange = async (e:React.FormEvent) =>{
      e.preventDefault()
      if(isEdit)
      {
          API.put(`/category/update/${category.id}/`,{
                category_name :name
          }).then((res)=>{
            toast.success(res.data.Detail) 
            navigate("/profile", { state: { activeTab: "Category" } })
            
          }).catch((err :any)=>
          {
              toast.error(err.response?.data?.error)
          })
      }
      else
      {
          API.post(`/category/`,{
          category_name : name
          }).then((res)=>{
            toast.success(res.data.Detail)
             navigate("/profile", { state: { activeTab: "Category" } })
          }).catch((error)=>{
              
             toast.error(error.response?.data?.error)
          })
      }
      onSuccess(); // this closes modal + refresh list
    }

  return (
    <div className='addbook-container'>
       <form onSubmit={handlechange}>
        <h2>{isEdit ? "Update category" : "Add category"}</h2>
        <label htmlFor="">Name</label>
        <input type="text" value={name} onChange={(e)=>setname(e.target.value)}/>
        <button type='submit'>Submit</button>
       </form>
    </div>
  )
}

export default Addcategory
