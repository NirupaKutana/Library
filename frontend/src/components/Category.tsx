import React, { useEffect ,useState} from 'react'

import '../style/Category.css'
import axios from 'axios'
import { NavLink } from 'react-router-dom'
import Addcategory from './Addcategory'
import { toast } from 'react-toastify'
import Loader from './Loader'
const Category = () => {
    const BASE_URL = "http://127.0.0.1:8000";
    const [categorydata,setcategorydata] = useState([]);
    const [isshow,setshowmodel]=useState<boolean>(false);
    const [search,setsearch] = useState("");
    const [filterdata,setfilterdata] = useState([]);
   const isSearch = search.trim().length > 0;
    const datatoSHow = isSearch ? filterdata : categorydata;
    const [Loading,setLoading] =useState(false)
  
    useEffect(()=>{
        setLoading(true)
        axios.get(`${BASE_URL}/category/`)
        .then(res=>{
            setcategorydata(res.data)

        }).catch(err=>console.log(err))
        .finally(()=>
          {setLoading(false)})
    },[])
      useEffect(()=>{
            fetchcategory(search)
    },[search])

    const fetchcategory = (name :string) =>{
       axios.get(`${BASE_URL}/cat/filter/?name=${encodeURIComponent(name)}`)
       .then(res=>{
        setfilterdata(res.data)
       }).catch(err=>console.log(err))
    }

  const handleDelete = async(c_id : number) =>{
  
       try
       {   const res = await axios.delete(`${BASE_URL}/category/delete/${c_id}/`,{
                data :{c_id}
            })
            toast.warning(res.data.Detail)
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
    <div className={isshow?"book-container dimmed":""}>
    <div className="book-container">
        <div className="table-actions">
                
                   <input type="text" className='srch' placeholder='🔍  Search Here..!' value={search} onChange={(e)=>setsearch(e.target.value)}/>
                  
          {/* <NavLink to='addcategory/'></NavLink>  */}
          
          <button  className="add-book-btn" onClick={()=>setshowmodel(true)}>+Add Category</button> 
          
          </div>
      <table className="book-table">
        <thead>
         <tr>
            <th>Category Id</th>
            <th>Category Name</th>
            <th>Action</th>
         </tr>
        </thead>
  
      
        <tbody>{datatoSHow.map((data:any,index:number)=>
        <tr key={index}>
            <td>{data[0]}</td>
            <td>{data[1]}</td>
           
            <td className="action-col">
               <NavLink to='addcategory/' state={{id:data[0],name:data[1]}}><button className="btn btn-update">Update</button></NavLink>
                <button className="btn btn-delete" onClick={()=>handleDelete(data[0])}>Delete</button>
            </td>
        </tr>
        )}
           
        </tbody>

      </table>
      
        </div>
        </div>
        {isshow && (
        <>
        <div className="overlay">
        <div className="modal">
          <button onClick={()=>setshowmodel(false)}>-</button>
          <Addcategory/>
          </div>
          </div>
        </>
          )}
        </>
      )}

export default Category
