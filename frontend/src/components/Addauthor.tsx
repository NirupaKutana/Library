import React, { useEffect, useState } from 'react'
import '../style/Addauthor.css'
import axios from 'axios'
import { useNavigate,useLocation, Navigate } from 'react-router-dom'
import { toast } from 'react-toastify'
const Addauthor = () => {
  const BASE_URL = "http://127.0.0.1:8000";
  const[name,setname]= useState("")
  const navigate=useNavigate()
  const locatin = useLocation()
  const author = locatin.state
  const isEdit = Boolean(author)
  
  useEffect(()=>{
      if(author)
    {
        setname(author.name)
    } 
    },[])

  const handlechange = async (e:React.FormEvent)=>
    {
    e.preventDefault()  
    if(isEdit)
      {
          axios.put(`${BASE_URL}/author/update/${author.id}/`,{
           author_name:name 
          }).then((res)=>{
            
            toast.success(res.data.success)
            navigate("/authors")
          }).catch(err=>console.log(err))
      }
    else
      {
        axios.post(`${BASE_URL}/author/`,{
           author_name :name
          }).then((res)=>{
          // alert("Author added ..!")
          toast.success(res.data.success)
          navigate("/authors")
          }).catch((error)=>{
          alert(error.response.data.error)
          })
      }
   }

  return (
    <div className='addbook-container'>
       <form action="">
        <h3>{isEdit ? "Upadte Author " : "Author Details"}</h3>
        <label htmlFor="">Name</label>
        <input type="text" value={name} onChange={(e)=>setname(e.target.value)}/>
        <button type='submit' onClick={handlechange}>Submit</button>
       </form>
    </div>
  )
}

export default Addauthor
