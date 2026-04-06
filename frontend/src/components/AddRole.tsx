import React, { useState } from 'react'
import '../style/AddRole.css'
import API from '../Api/axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
const AddRole = () => {

  const [name,setName]=useState("");
  const [description,setDescription] = useState("");
  const navigate = useNavigate();
  const handleSubmit =async(e:React.FormEvent)=>{
       e.preventDefault();
       try
       {
         const res = await API.post("/role/",{
          role_name:name,
          description:description
         })
         toast.success(res.data.success);
         navigate("/profile", { state: { activeTab: "Role-Right" } });

       }
       catch(err:any)
       {
          toast.error(err.response?.data?.error);
       }
  };
  return (
    <div>
      <form onSubmit={handleSubmit} className="Role-form">
        <h2>Add Role</h2>
        <label>Role : </label>
        <input type="text" value={name} onChange={(e)=>setName(e.target.value)}/>
        <label>Description : </label>
        <input type="text" value={description} onChange={(e)=>setDescription(e.target.value)}/>
        <button type='submit'>submit</button>
     </form>
   </div>
  )
}

export default AddRole
