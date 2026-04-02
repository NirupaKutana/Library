import React, { useEffect, useState } from 'react'
import '../style/Addcategory.css'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import API from '../Api/axios'
import { useMutation } from '@tanstack/react-query'

const handleChange = async ({isEdit,id,name}:any)=>{
  if(isEdit)
    {
      const res = await API.put(`/category/update/${id}/`,{category_name :name});
      return res.data
    }
    else 
    {
      const res = await API.post(`/category/`,{category_name : name});
      return res.data
    } 

}
const Addcategory = ({ category, onSuccess }: any) => {
    const[name,setname]=useState("");
    const navigate = useNavigate();
    const isEdit = Boolean(category?.id);
    const id = category?.id;
  
  useEffect(() => {
  if (category) {
    setname(category.name);
  } else {
    setname("");
  }
}, [category]);

const Mutation = useMutation({
  mutationFn:handleChange,
  onSuccess: (data)=>{
      toast.success(data.success || data.Detail || "Success!");
      navigate("/profile", { state: { activeTab: "Category" } });
      onSuccess?.();
      },
  onError:(err:any)=>{
    const data = err.response.data
    if(typeof data ==="object")
    {
      Object.values(data).forEach((msg:any)=>{toast.error(Array.isArray(msg)?msg[0] :msg)})
    }
    else {
      toast.error("Something went wrong");
    }},
});

  return (
    <div className='addbook-container'>
       <form onSubmit={(e)=>{e.preventDefault();Mutation.mutate({isEdit,id,name});}}>
        <h2>{isEdit ? "Update category" : "Add category"}</h2>
        <label htmlFor="">Name</label>
        <input type="text" value={name} onChange={(e)=>setname(e.target.value)}/>
        <button type='submit'>Submit</button>
       </form>
    </div>
  )
}

export default Addcategory
