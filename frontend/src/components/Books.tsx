import React, { use, useEffect, useState } from 'react'
import '../style/Books.css' 
import axios from 'axios';
// import { error } from 'console';
import { NavLink, useNavigate } from 'react-router-dom';
import Addbook from './Addbook';
import { toast } from 'react-toastify';
import Loader from './Loader';
import Pagination from './Pagination';
import API from '../Api/axios';
import { hasAnyPermission, hasPermission } from './RBAC';

const Books = () => {
    const BASE_URL = "http://127.0.0.1:8000";
    const [Loading,setLoading] = useState(false);
    const [category,setcategory]=useState([]);
    const[bookdata,setbookdata] = useState([]);
    const [isshow,setshowmodel] = useState<Boolean>(false);
    const[filterdata,setfilterdata] =useState([]);
    const [search,setsearch] = useState("");
    const navigate = useNavigate();
    const isSearch = search.trim().length>0;
    const [selectedBook,setSelectedBook] = useState<any>(null);
    const [currentPage,setCurrentPage] = useState(1);
    const itemPerPage =5;
    const indexOfLast = currentPage * itemPerPage;
    const indexOfFirst = indexOfLast - itemPerPage;
    const currentUsers = bookdata.slice(indexOfFirst, indexOfLast);
    const dataToshow = isSearch ? filterdata : currentUsers;


    const fetchAllBook =() =>{
       setLoading(true)
            API.get(`/book/`,{
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}`}
           })
           .then(res => {
              setbookdata(res.data)
         }).catch(err => console.log(err))
         .finally(()=>{
          setLoading(false)
         })
    }
    useEffect(()=>{
      fetchAllBook();
    },[]);


    useEffect(()=>{
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
          navigate("/profile", { state: { activeTab: "Book" } })
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
        navigate("/profile", { state: { activeTab: "Book" } })
        window.location.reload()
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
      <h2>Book View</h2>
      <div className="table-actions">
           <select className="filter-select" value={search} onChange={(e)=>setsearch(e.target.value)}>
                  <option value="">None</option>
                  {category.map((data:any)=>(
                  <option key={data[0]}>{data[1]}</option>
                  ))}
              </select>
           {hasPermission("AddBook")  && (
            <>
            <button className="add-book-btn" onClick={()=>{setshowmodel(true); setSelectedBook(null)}}>+ Add Book</button>
           </>
           )}
     </div>
      <table className="book-table">
        <thead> 
          <tr>  {localStorage.getItem("role")==="ADMIN" &&(
                <th>Book ID</th>)}
                <th>NAME</th>
                <th>Category</th>
                <th>Author</th>
                <th>Book Page</th>
               
                {hasPermission("AddBook") &&(
               <>
                <th>Copies</th>
                </>)}

                <th>Available</th>
              {hasPermission("AddBook") &&(
              
                <th>Status</th>)}

                {hasAnyPermission(["UpdateBook","DeleteBook"]) &&(
                <th>Action</th>
                )}
                
                
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
                {hasPermission("AddBook")&&(
                 <>
                    <td>{data[6]}</td>
                    <td>{data[7]}</td>
                    </>)}
                    <td className="action-col">
                     {hasPermission("UpdateBook")&&(
                    <button className="btn btn-update" onClick={()=>{setshowmodel(true);
                      setSelectedBook({id:data[0],name :data[1],c_id:data[2],a_id:data[3],page:data[4],copy:data[5]})
                    }}>Update</button>)}
                    {hasPermission("DeleteBook")&&(
                    <button className="btn btn-delete" onClick={()=>handleDelete(data[0])}>Delete</button>)}
                    </td>
                  
             
              
              </tr>
        ))}
         <tr></tr>

        </tbody>
      </table>
      <Pagination 
      currentPage={currentPage}
      totalItems={bookdata.length}
      itemPerPage={itemPerPage}
      onPageChange={(page)=>setCurrentPage(page)}/>
   </div>
   </div>
   {isshow && (
    <>
    <div className='overlay'></div>
    <div className='bookmodal'>
      
      <button className='modal-close' onClick={()=>setshowmodel(false)}>&times;</button>
      <Addbook book ={selectedBook}
      onSuccess={()=>{setshowmodel(false);
               fetchAllBook();}}/>
    </div>
    </>
   )}
   </>
  )
}

export default Books
