import React, { useEffect, useState } from 'react'
import '../style/AddLibrarian.css'
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import API from '../Api/axios';
const AddLibrarian = ({librarian,onSuccess}:any) => {
    const [name,setname] = useState("");
    const [email ,setemail] = useState("");
    const isEdit =Boolean(librarian);
    const navigate = useNavigate();
    useEffect(()=>{
     if(librarian)
     {
      setname(librarian.user_name);
      setemail(librarian.user_email);
     }
    },[librarian]);

    const handleSubmit = async(e:React.FormEvent)=>{
           e.preventDefault();
          if(isEdit){
           
            API.put(`/register/librarian/${librarian.id}/`,{
              user_name:name,
              user_email:email
            }).then((res)=>{
              toast.success(res.data.success);
              navigate("/profile", { state: { activeTab: "Librarian" } })

            }).catch((err:any)=>{
              toast.error(err.response?.data?.error);
            })
          }
          else{
            API.post("/register/librarian/",{
            user_name:name,
            user_email:email}).then((res)=>{
                  toast.success(res.data.message);
            }).catch((err:any)=>{
            toast.error(err.response?.data?.error);

            });
          }
        onSuccess();   
    };
return (
     <div className=''>
      <form className="library-form" onSubmit={handleSubmit}>
        <h2>{isEdit?"Update Librarian":"Add Librarian"}</h2>
        <label>Name : </label>
        <input type="text" value={name} onChange={(e)=>setname(e.target.value)}/>
        <label>Email : </label>
        <input type="email" value={email} onChange={(e)=>setemail(e.target.value)}/>
        <button type='submit'>{isEdit?"Update":"submit"}</button>
    </form>
</div>

    
  )
}

export default AddLibrarian
