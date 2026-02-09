import React, { useEffect, useState } from 'react'
import '../style/Cat_Page.css'
import axios from 'axios'
import { toast } from 'react-toastify';
import Loader from './Loader';
const Cat_Page = () => {
    const[category,setcategory]=useState([]);
    const[cat_page,setcat_page]=useState([]);
     const [currentpage,setcurrentpage]=useState(1);
     const itemsPerPage = 4;
     const pagesize =4;
     const [Loading,setLoading] = useState(false)
    useEffect(()=>{
        axios.get("http://127.0.0.1:8000/category/").then(res=>{
            setcategory(res.data)
        }).catch(err=>console.log(err))

        setLoading(true)
        axios.get(`http://127.0.0.1:8000/cat/?page=${currentpage}&page_size=${pagesize}`)
        .then(res=>{
            setcat_page(res.data)
        }).catch((err :any)=>{
           toast.error(err.res?.data?.error)
        })
        .finally(()=>{
          setLoading(false)
        })
    },[currentpage])
    
     
    // pagination  logic
    // const lastIndex = currentpage * itemsPerPage ;
    // const firstIndex = lastIndex - itemsPerPage;
    // const currentCategories =category.slice(firstIndex,lastIndex)
    const totalPages = Math.ceil(category.length / itemsPerPage)
    return (
    <>
      {/*  
      {Loading && <Loader/>}
        <div className='category-grid'>
           {currentCategories.map((data:any)=>
            <article className="cat-card" key={data[0]}>
               
                <header className="cat-card-header">
                    <span className="cat-badge">#{data[0]}</span>
                </header>
              
                <section className="cat-card-body">
                    <h3 className="cat-title">{data[1]}</h3>
                    <p className="cat-subtitle">Book Category</p>
                </section>
    
          </article>)}
    </div> 
     
     <div className='pagination'>
        <button className='page-btn' disabled={currentpage===1} 
        onClick={()=>setcurrentpage(currentpage-1)}>prev</button>

        <span className='page-info'>
            page {currentpage} of {totalPages}
        </span>

        <button className='page-btn' disabled ={currentpage===totalPages}
        onClick={()=>setcurrentpage(currentpage+1)}>next</button>
     </div>*/}
      
     <>
       {Loading && <Loader/>}
        <div className='category-grid'>
            {cat_page.map((data:any)=>
            <article className="cat-card" key={data[0]} >
                <header className="cat-card-header">
                    <span className="cat-badge">#{data[0]}</span>
                </header>
                <section className="cat-card-body">
                <h3 className="cat-title">{data[1]}</h3>
                <p className="cat-subtitle">Book Category</p>
                </section>
            </article> )}
            </div>
            {/* pagination */}
             <div className='pagination'>
                <button className='page-btn' disabled={currentpage===1} 
                onClick={()=>setcurrentpage(currentpage-1)}>prev</button>
                    <span className='page-info'>page {currentpage} of {totalPages}</span>
                <button className='page-btn' disabled ={currentpage===totalPages}
                onClick={()=>setcurrentpage(currentpage+1)}>next</button>
             </div>
         </>
    </>
  )
}

export default Cat_Page
