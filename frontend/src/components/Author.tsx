import React, { useEffect, useState } from 'react'
import '../style/Author.css'
import axios from 'axios'
import { NavLink, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { error } from 'console'
import Loader from './Loader'
import Addauthor from './Addauthor'
import Pagination from './Pagination'
const Author = () => {
  const BASE_URL = "http://127.0.0.1:8000";
  const[authordata,setauthordata]=useState([]);
  const [search,setsearch]=useState("");
  const[filterdata,setfilterdata] =useState([])
  const IsSearch = search.trim().length>0;
  const [Loading,setLoading] = useState(false);
  const [isshow,setshowmodel]=useState<boolean>(false);
  const navigate = useNavigate()
  const [selectedAuthor, setSelectedAuthor] = useState<any>(null);
  const [currentPage,setCurrentPage]=useState(1);
  const itemPerPage = 6;
  const indexOfLast = currentPage * itemPerPage ;
  const indexOfFirst = indexOfLast - itemPerPage;
  const currentUsers = authordata.slice(indexOfFirst,indexOfLast) ;
  const dataToshow = IsSearch ? filterdata : currentUsers;

  
const fetchAllAuthor = () =>{
   setLoading(true)
      axios.get(`${BASE_URL}/author/`)
        .then(res=>{
          setauthordata(res.data)
          navigate("/profile", { state: { activeTab: "Author" } })

        }).catch(err=>toast.error(err.res?.data?.error))  
        .finally(()=>{
          setLoading(false)
        })  
}
  useEffect(()=>{
        fetchAllAuthor();
    },[])

  useEffect(()=>{
        setfilterdata(authordata.filter((a:any)=>a[1].toLowerCase().includes(search.toLowerCase())))
        console.log(filterdata) 
   },[search])

  const handleDelete = async(a_id : number) =>{
   
     try{
          const res = await axios.delete(`${BASE_URL}/author/delete/${a_id}/`,{
          data :{a_id}
          })
          toast.warning(res.data.message)
          navigate("/profile", { state: { activeTab: "Author" } })
          window.location.reload();
      }
      catch(err:any)
      {
         toast.error(err.response?.data?.error)
      }
    }
  return (
    <>
    {Loading && <Loader/>}
    <div className="book-container">
        <div className="table-actions">
           <input type="text" placeholder='🔍  Search Here..!' className='srch' value={search} onChange={(e)=>setsearch(e.target.value)} />
           {localStorage.getItem("role")==="ADMIN" &&(
            <button className="add-book-btn" onClick={() => {setSelectedAuthor(null);   // important
              setshowmodel(true);  }}>+Add Author</button>
           )}
          </div>
        <table className="book-table">
          <thead>
            <tr>
                <th>Author Id</th>
                <th>Author Name </th>
                {localStorage.getItem("role")==="ADMIN" &&(
                <th>Action</th>)}
            </tr>
          </thead>
          <tbody>{dataToshow.map((data:any,index)=>
           <tr key={index}>
            <td>{data[0]}</td>
            <td>{data[1]}</td>
             {localStorage.getItem("role")==="ADMIN" &&(
            <td className="action-col">
                <button className="btn btn-update" onClick={() => 
                {setSelectedAuthor({ id: data[0], name: data[1] });setshowmodel(true);}}>
                 Update </button>
                <button className="btn btn-delete" onClick={()=>handleDelete(data[0])}>Delete</button>
             </td>
             )}
          </tr>

          )}
          </tbody>
        </table>
       <Pagination
        currentPage={currentPage}
        totalItems={authordata.length}
        itemPerPage={itemPerPage}
        onPageChange={(page)=>{setCurrentPage(page)}}/>
    </div>

    {isshow && (
        <>
        <div className="overlay">
        <div className="modal">
          <button className='modal-close' onClick={()=>setshowmodel(false)}>&times;</button>
          <Addauthor author={selectedAuthor}
               onSuccess={() => {
               setshowmodel(false);
               fetchAllAuthor();}}/>
          </div>
          </div>
        </>
        )}
  </>
  )
}

export default Author
