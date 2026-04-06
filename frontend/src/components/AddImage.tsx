import React, { useState } from 'react'
import '../style/addimage.css'
import { NavLink, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import API from '../Api/axios'
interface AddImageProps {
    onSuccess: () => void;
    }
const AddImage = ({onSuccess}:AddImageProps) => {
    const[ifile,setifile]=useState<File | null>(null);
    const[name,setname]=useState("");
    const [pdf,setPdf] = useState<File | null>(null)
    const[imageData,setImageData]=useState([]);
    const navigate = useNavigate();
     

    const handlesubmit =(e:React.FormEvent) =>{
        e.preventDefault();
        const data = new FormData();
        if(ifile)
        {
            data.append("image_file",ifile);
        }
        if(pdf)
        {
            data.append("image_pdf",pdf);
        }
        data.append("image_name",name);
        API.post(`/image/`,data).
        then(res=>{
            setImageData(res.data)
            toast.success(res.data.success)
            onSuccess();
            navigate("/profile", { state: { activeTab: "AddImage" } })
        }).catch((err:any)=>{
            toast.error(err.response?.data?.error)
        })
    
    }
  return (
    <div className="image-page">
      <div className="image-card">  
            <form onSubmit={handlesubmit}>
            <label>Isert Image :</label>
            <input type="file" accept='image/*' onChange={(e)=>{if(e.target.files){setifile(e.target.files[0]);}}}  placeholder='Enter Book Image'/>
            

            <label>Image Name :</label>
            <input type="text" value={name} onChange={(e)=>setname(e.target.value)} placeholder='Enter Image Name' />
            <div>

            <label>Book PDF :</label>
            <input type="file" accept='application/pdf' onChange={(e)=>{if(e.target.files){setPdf(e.target.files[0]);}}}  placeholder='Enter Book PDF'/>
            <button className='bttn' type='submit'>Submit</button>
            <NavLink to='/profile'><button className='bttn' type='button'>Cancle</button></NavLink>
            </div>
            </form>
        </div>
    </div>
  )
}

export default AddImage
