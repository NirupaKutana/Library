import React, { useEffect, useState } from 'react'
import '../style/ImgPage.css'
import axios from 'axios';
import { toast } from 'react-toastify';
const ImgPage = () => {
    const [image,setImage] = useState([]);
    const[img_page,setImg_page]=useState([]);
    const[currentpage,setcurrentpage]=useState(1);
    const itemsPerPage =4;
    const pagesize=4;
    
    useEffect(()=>{
     axios.get("http://127.0.0.1:8000/image/")
     .then(res=>{ setImage(res.data)})
     .catch(err=>toast.error(err.response?.data?.error))

     axios.get(`http://127.0.0.1:8000/image/pag/?page=${currentpage}&page_size=${pagesize}`)
     .then(res=>{
        setImg_page(res.data)
     })
     .catch(err=>toast.error(err.response?.data?.error))
    },[currentpage])
    const totalPages = Math.ceil(image.length/itemsPerPage)

    const downloadPDF= (pdf:string) =>{
       if(!pdf)
       {
        toast.error("PDF Not Found..!");
        return;
       }
       const pdfUrl = `http://127.0.0.1:8000/media/${pdf}`;
       window.open(pdfUrl, "_blank", "noopener,noreferrer");
      //  const link = document.createElement("a");
      //  link.href = `http://127.0.0.1:8000/media/${pdf}`;
      //  link.setAttribute("download",pdf);
      //  document.body.appendChild(link);
      //  link.click();
      //  document.body.removeChild(link);
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
        <span className="page-info">page {currentpage} of {totalPages}</span>
        <button disabled ={currentpage===totalPages} onClick={()=>setcurrentpage(currentpage+1)}>Next ▶</button>

    </div>
    </div>


  )
}

export default ImgPage
