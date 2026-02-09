import React, { useEffect, useState } from 'react'
import '../style/Books.css' 
import axios from 'axios';
// import { error } from 'console';
import { NavLink } from 'react-router-dom';
import Addbook from './Addbook';
import { toast } from 'react-toastify';
import Loader from './Loader';
// import Category from './Category';
const Books = () => {
    const BASE_URL = "http://127.0.0.1:8000";
    const [Loading,setLoading] = useState(false)
    const [category,setcategory]=useState([]);
    // const[filter,setfilter]=useState("")
    const[bookdata,setbookdata] = useState([]);
    const [isshow,setshowmodel] = useState<Boolean>(false)
    const[filterdata,setfilterdata] =useState([])
    const [search,setsearch] = useState("")
    // const isFilter = filter.trim().length > 0 ;
    const isSearch = search.trim().length>0;
    const dataToshow = isSearch ? filterdata : bookdata;
    useEffect(()=>{
            setLoading(true)
            axios.get(`${BASE_URL}/book/`,{
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}`}
           })
           .then(res => {
              setbookdata(res.data)
         }).catch(err => console.log(err))
         .finally(()=>{
          setLoading(false)
         })
         axios.get(`${BASE_URL}/category/`).then(res=>{
         setcategory(res.data)
         }).catch(err=>console.log(err))
  },[])

    useEffect(()=>{
      fetchcat(search)
    },[search])

  const fetchcat = ((name :string)=>{
      axios.get(`${BASE_URL}/search/book/?name=${encodeURIComponent(name)}`)
     .then(res=>{
          setfilterdata(res.data)
        }).catch(err=>console.log(err))
  })

const handleDelete = async(book_id : number)=>
  {   
     
      try
      {
        const res = await axios.delete(`${BASE_URL}/book/delete/${book_id}/`,{
        data: { book_id: book_id }
        })
        toast.warning(res.data.Detail)
        window.location.reload();
      }
      catch(err:any){
          toast.error(err.res?.data?.error)
      }
    
  }
  return (
    <>
     {Loading && <Loader/>}
    <div className={isshow ? "book-container dimmed" : "" }>
    <div className="book-container">
      <div className="table-actions">
           {/*<NavLink to="addbook/"> </NavLink> */}
           <select className="filter-select" value={search} onChange={(e)=>setsearch(e.target.value)}>
                  <option value="">None</option>
                  {category.map((data:any)=>(
                  <option key={data[0]}>{data[1]}</option>
                  ))}
              </select>
           {/* <input type="text" placeholder='🔍  Search Here..!' className='srch' value={search} onChange={(e)=>setsearch(e.target.value)}/>   */}
           {localStorage.getItem("role") === "ADMIN" && (
           <button className="add-book-btn" onClick={()=>setshowmodel(true)}>+ Add Book</button>
           )}
     </div>
      <table className="book-table">
        <thead> 
          <tr>  {localStorage.getItem("role")==="ADMIN" &&(
                <th>Book ID</th>)}
                <th>NAME</th>
                <th>Category</th>
                <th>Author</th>
                <th>Bock Page</th>
                <th>Copies</th>
                 {localStorage.getItem("role")==="ADMIN" &&(
                <th>Status</th>)}
                <th>Action</th>
                
        </tr>
        </thead>
        <tbody>{dataToshow.map((data :any,index)=>(
              <tr key={index}>
                {localStorage.getItem("role")==="ADMIN" &&(
                <td>{data[0]}</td>)}
                <td>{data[1]}</td>
                <td>{data[2]}</td>
                <td>{data[3]}</td>
                <td>{data[4]}</td>
                <td>{data[5]}</td>
                {localStorage.getItem("role")==="ADMIN" &&(
                 <>
                    <td>{data[6]}</td>
                    <td className="action-col">
                    <NavLink to ='addbook/' state={{id:data[0],name :data[1],c_id:data[2],a_id:data[3],page:data[4],copy:data[5]}}>
                    <button className="btn btn-update">Update</button></NavLink>
                    <button className="btn btn-delete" onClick={()=>handleDelete(data[0])}>Delete</button>
                    </td>
                  </>
                )}
                {localStorage.getItem("role")==="USER" &&(
                  <>
                  <td className="action-col">
                    <button className="btn btn-issue">ISSUE</button>
                  </td>
                  </>
                )}
              </tr>
        ))}
         <tr></tr>

        </tbody>
      </table>
   </div>
   </div>
   {isshow && (
    <>
    <div className='overlay'></div>
    <div className='modal'>
      
      <button className='modal-close' onClick={()=>setshowmodel(false)}>&times;</button>
      <Addbook/>
    </div>
    </>
   )}
   </>
  )
}

export default Books
