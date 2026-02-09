import React, { useState } from 'react'
import '../style/addimage.css'
import axios from 'axios'
import { NavLink } from 'react-router-dom'
import { toast } from 'react-toastify'
const AddImage = () => {
    const[ifile,setifile]=useState<File | null>(null)
    const[name,setname]=useState("")
    const[imageData,setImageData]=useState([])
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
        }).catch(err=>console.log(err))
    }
  return (
    <div className="image-page">
      <div className="image-card">  
            <form >
            <label>Isert Image :</label>
            <input type="file" accept='image/*' onChange={(e)=>{if(e.target.files){setifile(e.target.files[0]);}}}  placeholder='Enter Your Pick'/>
        
            <label>Image Name :</label>
            <input type="text" value={name} onChange={(e)=>setname(e.target.value)} placeholder='Enter Image Name' />
            <div>
            <button type='submit' onClick={handlesubmit}>Submit</button>
            <NavLink to='/image'><button>Cancle</button></NavLink>
            </div>
            </form>
        </div>
    </div>
  )
}

export default AddImage
