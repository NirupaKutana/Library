import React, { useEffect,useState } from 'react'
import '../style/Imagefile.css'
import { NavLink } from 'react-router-dom'
import axios from 'axios'
import { Api } from './Token' 

import { refreshAccessToken } from './RefreshToken'
import Loader from './Loader'
const ImageFile = () => {
    const[imgdata,setImgData] =useState<any[]>([])
    const BASE_URL = 'http://127.0.0.1:8000/image/'
    const[Loading,setLoading] = useState(false)
        // const fetchImage = async () => {
        //     try {
        //         const res = await Api("http://127.0.0.1:8000/image/");
        //         const data= res.data
        //     } catch (err) {
        //         console.error(err);
        //     }
        //     };
        //     useEffect(() => {
        //    fetchImage();
        //   }, []);
        // useEffect(()=>{
        //        axios.get('http://127.0.0.1:8000/image/',{
        //         headers: {
        //              Authorization: `Bearer ${localStorage.getItem("access_token")}`
        //          }
                
        //     }).then(res=>{
        //         setImgData(res.data)
        //     }).catch(er=>console.log(er))
        // },[])
       useEffect(()=>{
        const fetchImage = async() =>
        {       
                setLoading(true)
                try{
                    const res = await axios.get('http://127.0.0.1:8000/image/',{
                      headers: {
                            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                            },
                        })
                    setImgData(res.data)
                }catch(err :any)
                {
                    if(err.response?.status === 401)
                    {
                        const newtoken = await refreshAccessToken();
                        fetchImage();
                        console.log("hello")
                        // if(newtoken){
                        //     const retry = await axios.get("http://127.0.0.1:8000/image/",{
                        //         headers :{
                        //             Authorization:`Bearer${newtoken}`
                        //         },
                        //     });
                        //     setImgData(retry.data)
                        // }
                    }
                }
                finally{setLoading(false)}
        };
        fetchImage();
       },[])
       const handleDelete = (id : number)=>{
            axios.delete(`${BASE_URL}${id}/`,{
                 headers: {
                   Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            }).then(res=>{
                alert("Image Deleted");
                window.location.reload();
            }).catch(er=>console.log(er))
            
        }
  
  return (
    <>  
    {Loading && <Loader/>}
    <div className="image-page">
        <div className="table-actions">
        {localStorage.getItem("role")==="ADMIN" &&(
        <NavLink to='addimage/' className="add-image-link"><button className="add-image-btn">+ADD Image</button></NavLink>
        )}  
           <div className="image-list">
            {imgdata.map((data:any)=>
            <div className="image-card-view" key={data[0]}>
                <img src={`http://127.0.0.1:8000/media/${data[1]}`} alt={data[1]} />
                <h4>{data[2]}</h4><br />
                {localStorage.getItem("role")==="ADMIN" &&(
                <button onClick={()=>handleDelete(data[0])}>Delete</button>
                )}
            </div>
            )}
           </div>
         </div>  
    </div>
   </>
  )
}

export default ImageFile
