import React, { useEffect, useState } from 'react'
import '../style/AddRight.css'
import { toast } from 'react-toastify';
import API from '../Api/axios';
import { useNavigate } from 'react-router-dom';
const AddRights = ({right,onSuccess}:any) => {
  const [name,setName] = useState("");
  const [description,setDescription]=useState("");
  const isEdit = Boolean(right);
  const navigate = useNavigate();
  useEffect(()=>{
    if(isEdit)
    {
      setName(right.permission_name);
      setDescription(right.description);
    }
  },[right])
  const handleSubmit = async (e:React.FormEvent) =>{
        e.preventDefault()
        if(isEdit)
        {
            try
            {
                const res= await API.put(`/right/${right.id}/`,{
                  permission_name:name,
                  description:description
                });
                toast.success(res.data.success);
                navigate("/profile", { state: { activeTab: "Role-Right" } })

                
            }
            catch(err:any)
            {
               toast.error(err.response?.data?.error);
            }
        }
        else
        {
            try
            {
                const res = await API.post("/right/",{
                permission_name:name,
                description:description
                });
                toast.success(res.data.success);
                navigate("/profile", { state: { activeTab: "Role-Right" } })

            }
            catch(err:any)
            {
              toast.error(err.response?.data?.error);
            }
        }
        onSuccess();
  };

  return (
    <div>
       <div>
      <form onSubmit={handleSubmit} className="Right-form">
        <h2>{isEdit?"Update Right":"Add Right"}</h2>
        <label>Right : </label>
        <input type="text" value={name} onChange={(e)=>setName(e.target.value)}/>
        <label>Description : </label>
        <input type="text" value={description} onChange={(e)=>setDescription(e.target.value)}/>
        <button type='submit'>{isEdit?"Update":"submit"}</button>
     </form>
   </div>
  </div>
  )
}

export default AddRights
