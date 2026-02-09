import React, { useEffect, useState } from 'react'
import '../style/Author.css'
import axios from 'axios'
import { NavLink } from 'react-router-dom'
import { toast } from 'react-toastify'
import { error } from 'console'
import Loader from './Loader'
const Author = () => {
  const BASE_URL = "http://127.0.0.1:8000";
  const[authordata,setauthordata]=useState([]);
  const [search,setsearch]=useState("");
  const[filterdata,setfilterdata] =useState([])
  const IsSearch = search.trim().length>0;
  const dataToshow = IsSearch ? filterdata : authordata;
  const [Loading,setLoading] = useState(false)
  useEffect(()=>{
      setLoading(true)
      axios.get(`${BASE_URL}/author/`)
        .then(res=>{
          setauthordata(res.data)
        }).catch(err=>toast.error(err.res?.data?.error))  
        .finally(()=>{
          setLoading(false)
        })    
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
         window.location.reload();
      }
      catch(err:any)
      {
         toast.error(err.res?.data?.error)
      }
    }
  return (
    <>
    {Loading && <Loader/>}
    <div className="book-container">
        <div className="table-actions">
           <input type="text" placeholder='🔍  Search Here..!' className='srch' value={search} onChange={(e)=>setsearch(e.target.value)} />
           <NavLink to='addauthor/'> <button className="add-book-btn">+Add Author</button></NavLink>
        </div>
        <table className="book-table">
          <thead>
            <tr>
                <th>Author Id</th>
                <th>Author Name </th>
                <th>Action</th>
            </tr>
          </thead>
          <tbody>{dataToshow.map((data:any,index)=>
           <tr key={index}>
            <td>{data[0]}</td>
            <td>{data[1]}</td>
            <td className="action-col">
                <NavLink to='addauthor/' state={{id:data[0],name:data[1]}}><button className="btn btn-update">Update</button></NavLink>
                <button className="btn btn-delete" onClick={()=>handleDelete(data[0])}>Delete</button>
            </td>
          </tr>

          )}
          </tbody>
        </table>
      
    </div>
  </>
  )
}

export default Author
