import React, { useEffect, useState } from 'react'
import '../style/Addcategory.css'
import axios from 'axios'
import { useLocation,useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
const Addcategory = () => {
    const BASE_URL = "http://127.0.0.1:8000";
    const[name,setname]=useState("");
    const locatin = useLocation()
    const navigate = useNavigate()
    const category = locatin.state;
    console.log(category)
    const isEdit = Boolean(category)

    // ----------------------------------fatching and set data from book table
    useEffect(()=>{
      if(category)
      {
        setname(category.name)
      }
    },[])


    const handlechange = async (e:React.FormEvent) =>{
      e.preventDefault()
      if(isEdit)
      {
          axios.put(`${BASE_URL}/category/update/${category.id}/`,{
                category_name :name
          }).then((res)=>{
            toast.success(res.data.Detail)
            navigate("/categories");
          }).catch(err=>console.log(err))
      }
      else
      {
          axios.post(`${BASE_URL}/category/`,{
          category_name : name
          }).then((res)=>{
            toast.success(res.data.Detail)
            navigate("/categories")
          }).catch((error)=>{
              
              // alert(error.res?.data?.error)
          })
      }
    }

  return (
    <div className='addbook-container'>
       <form action="">
        <h2>{isEdit ? "Update category" : "Add category"}</h2>
        <label htmlFor="">Name</label>
        <input type="text" value={name} onChange={(e)=>setname(e.target.value)}/>
        <button type='submit' onClick={handlechange}>Submit</button>
       </form>
    </div>
  )
}

export default Addcategory
