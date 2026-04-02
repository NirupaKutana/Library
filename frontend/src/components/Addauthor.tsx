import React, { useEffect, useState } from 'react'
import '../style/Addauthor.css'
import { useNavigate,useLocation, Navigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useMutation } from '@tanstack/react-query'
import API from '../Api/axios'
const saveAuthor = async({name,isEdit ,id} :any) =>{
  if(isEdit)
    {
      const res = await API.put(`/author/update/${id}/`,{author_name:name})
      return res.data
    }
    
  
  else
  {
      const res= await API.post(`/author/`,{author_name:name});
      return res.data
  }
 
}
const Addauthor = ({ author, onSuccess }: any) => {
 
  const[name,setname]= useState("")
  const navigate=useNavigate()
  const isEdit = Boolean(author?.id)
  const id : any= author?.id;
  useEffect(()=>{
      if(author)
    {
        setname(author.name)
    } 
    else{
        setname("")
    }
    },[author])

  const Mutation = useMutation({
    mutationFn:saveAuthor,
    onSuccess :(data)=>{
      toast.success(data.success);
      navigate("/profile", { state: { activeTab: "Author" } });
      onSuccess?.();
    },
    onError :(err:any)=>{
                 const data = err.response.data
                
                 if (typeof data === "object") {
                 Object.values(data).forEach((msg: any) => {
                  toast.error(Array.isArray(msg) ? msg[0] : msg);
                });
              } else {
                toast.error("Something went wrong");
              }
                },
  })
  
  return (
    <div className='addbook-container'>
       <form onSubmit={(e)=>{e.preventDefault();Mutation.mutate({name,isEdit,id});}}>
        <h3>{isEdit ? "Upadte Author " : "Add Author Details"}</h3>
        <label htmlFor="">Name</label>
        <input type="text" value={name} onChange={(e)=>setname(e.target.value)}/>
        <button type='submit'disabled={Mutation.isPending}>{Mutation.isPending?"Saving..":"Submit"}</button>
       </form>
    </div>
  )
}

export default Addauthor




  // const handlechange = async (e:React.FormEvent)=>
  //   {
  //   e.preventDefault()  
  //   if(isEdit)
  //     {
  //         axios.put(`${BASE_URL}/author/update/${author.id}/`,{
  //          author_name:name 
  //         }).then((res)=>{
            
  //           toast.success(res.data.success)
  //           navigate("/profile", { state: { activeTab: "Author" } })
  //           window.location.reload()
  //         }).catch((err:any)=>{
      
  //           toast.error(err.response?.data?.error)
  //         })
  //     }
  //   else
  //     {
  //       axios.post(`${BASE_URL}/author/`,{
  //          author_name :name
  //         }).then((res)=>{
  //         toast.success(res.data.success)
  //         navigate("/profile", { state: { activeTab: "Author" } })
  //         }).catch((error)=>{
  //             toast.error(error.response?.data?.error)
  //         })
  //     }
  //     onSuccess()
  //  }