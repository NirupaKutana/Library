import React, { useState } from 'react'
import '../style/addimage.css'
import axios from 'axios'
import { NavLink, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
interface AddImageProps {
    onSuccess: () => void;
    }
const AddImage = ({onSuccess}:AddImageProps) => {
    const[ifile,setifile]=useState<File | null>(null);
    const[name,setname]=useState("");
    const[imageData,setImageData]=useState([]);
    const navigate = useNavigate();
     
    const BASE_URL = 'http://127.0.0.1:8000/image/'

    const handlesubmit =() =>{
        const data = new FormData();
        if(ifile)
        {
            data.append("image_file",ifile);
        }
        data.append("image_name",name);
        axios.post(`${BASE_URL}`,data,{
            headers :{
                
               Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "multipart/form-data"
           }
        }).
        then(res=>{
            setImageData(res.data)
            toast.success(res.data.success)
            onSuccess();
            navigate("/profile", { state: { activeTab: "AddImage" } })
            window.location.reload();
        }).catch((err:any)=>{
            toast.error(err.response?.data?.error)
        })
    
    }
  return (
    <div className="image-page">
      <div className="image-card">  
            <form onSubmit={handlesubmit}>
            <label>Isert Image :</label>
            <input type="file" accept='image/*' onChange={(e)=>{if(e.target.files){setifile(e.target.files[0]);}}}  placeholder='Enter Your Pick'/>
        
            <label>Image Name :</label>
            <input type="text" value={name} onChange={(e)=>setname(e.target.value)} placeholder='Enter Image Name' />
            <div>
            <button type='submit'>Submit</button>
            <NavLink to='/profile'><button>Cancle</button></NavLink>
            </div>
            </form>
        </div>
    </div>
  )
}

export default AddImage
