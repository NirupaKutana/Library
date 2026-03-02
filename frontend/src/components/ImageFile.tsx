import React, { useEffect,useState } from 'react'
import '../style/Imagefile.css'
import { NavLink, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Api } from './Token' 
import AddImage from './AddImage'
import { refreshAccessToken } from './RefreshToken'
import Loader from './Loader'
import Pagination from './Pagination'
import { toast } from 'react-toastify'
const ImageFile = () => {
    const[imgdata,setImgData] =useState<any[]>([]);
    const [isshow,setshowmodel] = useState<Boolean>(false);
    const navigate = useNavigate()
    const BASE_URL = 'http://127.0.0.1:8000/image/'
    const[Loading,setLoading] = useState(false);
    const [currentPage,setCurrentPage]=useState(1);
    const itemPerPage = 3;
    const indexOfLast = currentPage * itemPerPage ;
    const indexOfFirst = indexOfLast - itemPerPage;
    const currentUsers = imgdata.slice(indexOfFirst,indexOfLast) ;
    
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
                    setImgData(res.data);
                    navigate("/profile", { state: { activeTab: "AddImage" } })
                }catch(err :any)
                {
                    if(err.response?.status === 401)
                    {
                        const newtoken = await refreshAccessToken();
                        fetchImage();
                    
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
                toast.success(res.data.detail)
                navigate("/profile", { state: { activeTab: "AddImage" } })
                window.location.reload();
            }).catch((err:any)=>{
                toast.error(err.response?.data?.err)
            })
            
        }
  
  return (
    <>  
    {Loading && <Loader/>}
   
    <div className="image-page">
        <div className="table-actions">
        {localStorage.getItem("role")==="ADMIN" &&(
      <div className="add-image-link"><button className="add-image-btn" onClick={()=>{setshowmodel(true)}}>+ADD Image</button></div>
        )}  
           <div className="image-list">
            {currentUsers.map((data:any)=>
            <div className="image-card-view" key={data[0]}>
                <img src={`http://127.0.0.1:8000/media/${data[1]}`} alt={data[1]} />
                <h4>{data[2]}</h4><br />
                {localStorage.getItem("role")==="ADMIN" &&(
                <button onClick={()=>handleDelete(data[0])}>Delete</button>
                )}
            </div>
            )}
        <div className='pag'>
        <Pagination
        currentPage={currentPage}
        totalItems={imgdata.length}
        itemPerPage={itemPerPage}
        onPageChange={(page)=>{setCurrentPage(page)}}/>
        </div>
        </div>
    </div>
    </div>  
  
     
    {isshow && (
    <>
    <div className='overlay'></div>
    <div className='modal'>
      
      <button className='modal-close' onClick={()=>setshowmodel(false)}>&times;</button>
      <AddImage onSuccess={()=>{setshowmodel(false)}}/>
    </div>
    </>
   )}
   </>
  )
}

export default ImageFile
