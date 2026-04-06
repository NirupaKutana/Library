import { useEffect, useState } from 'react'
import '../style/ImgPage.css'
import API from '../Api/axios';
import { toast } from 'react-toastify';
const ImgPage = () => {
    // const [image,setImage] = useState([]);
    const[img_page,setImg_page]=useState([]);
    const[currentpage,setcurrentpage]=useState(1);
    const [hasNext, setHasNext] = useState(false);
    // const itemsPerPage =4;
    const pagesize=4;
    
    useEffect(()=>{
     API.get(`/image/pag/?page=${currentpage}&page_size=${pagesize}`)
     .then(res=>{
        setImg_page(res.data);
        setHasNext(res.data.length === pagesize);
     })
     .catch(err=>toast.error(err.response?.data?.error))
    },[currentpage])
    // const totalPages = Math.ceil(ImgPage.length/itemsPerPage)

    const downloadPDF= (pdf:string) =>{
       if(!pdf)
       {
        toast.error("PDF Not Found..!");
        return;
       }
       const pdfUrl = `http://127.0.0.1:8000/media/${pdf}`;
       window.open(pdfUrl, "_blank", "noopener,noreferrer");
      
    };
  return (
    <div  className="home-gallery">
    

    <div className="gallery-row">    
     {img_page.map((data:any)=>
     <div className="image-card"  key={data[0]}>
     <img src={`http://127.0.0.1:8000/media/${data[1]}`} alt={data[1]} />
     <h3>{data[2]}</h3>
     {localStorage.getItem("access_token") &&
     <button className='ibtn' onClick={()=>{downloadPDF(data[3])}}>Download</button>}
     </div>
     
     )}
    </div>
    <div className="pagination">
        <button  disabled={currentpage===1} onClick={()=>setcurrentpage(currentpage-1)}>◀ Prev</button>
        <span className="page-info">page {currentpage} </span>
        {/* <button disabled ={currentpage===totalPages} onClick={()=>setcurrentpage(currentpage+1)}>Next ▶</button> */}
        <button disabled={!hasNext} onClick={() => setcurrentpage(p => p + 1)}>Next ▶</button>
    </div>
    </div>


  )
}

export default ImgPage
