import React, { useEffect ,useState} from 'react'
import '../style/Category.css'
import axios from 'axios'
import { NavLink, useNavigate } from 'react-router-dom'
import Addcategory from './Addcategory'
import { toast } from 'react-toastify'
import Loader from './Loader'
import Pagination from './Pagination'
import { hasAnyPermission, hasPermission } from './RBAC'

const Category = () => {
    const BASE_URL = "http://127.0.0.1:8000";
    const [categorydata,setcategorydata] = useState([]);
    const [isshow,setshowmodel]=useState<boolean>(false);
    const [search,setsearch] = useState("");
    const [filterdata,setfilterdata] = useState([]);
    const isSearch = search.trim().length > 0;  
    const [Loading,setLoading] =useState(false)
    const navigate = useNavigate()
    const [selectedCategory, setSelectedCategory] = useState<any>(null);
    const [currentPage,setCurrentPage]=useState(1);
    const itemPerPage = 6;
    const indexOfLast = currentPage * itemPerPage ;
    const indexOfFirst = indexOfLast - itemPerPage;
    const currentUsers = categorydata.slice(indexOfFirst,indexOfLast) ;
    const datatoSHow = isSearch ? filterdata : currentUsers;

  
  const fetchAllCategories = () => {
   setLoading(true)
  axios.get(`${BASE_URL}/category/`)
    .then(res => setcategorydata(res.data))
    .catch(err=>console.log(err))
    .finally(()=>
         {setLoading(false)})
};

useEffect(() => {
  fetchAllCategories();
}, []);

    useEffect(()=>{
            fetchcategory(search)
    },[search])

    const fetchcategory = (name :string) =>{
       axios.get(`${BASE_URL}/cat/filter/?name=${encodeURIComponent(name)}`)
       .then(res=>{
        setfilterdata(res.data)
        navigate("/profile", { state: { activeTab: "Category" } })

       }).catch(err=>console.log(err))
    }

  const handleDelete = async(c_id : number) =>{
  
       try
       {   const res = await axios.delete(`${BASE_URL}/category/delete/${c_id}/`,{
                data :{c_id}
            })
            toast.warning(res.data.Detail)
            navigate("/profile", { state: { activeTab: "Category" } })
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
      <h2>Categoy View</h2>
        <div className="table-actions">
                
        <input type="text" className='srch' placeholder='🔍  Search Here..!' value={search} onChange={(e)=>setsearch(e.target.value)}/>
                  
          
          {hasPermission("AddCategory") &&(
            <button className="add-book-btn" onClick={() => {setSelectedCategory(null);   // important
              setshowmodel(true);  }}>
            +Add Category </button>
          // <button  className="add-book-btn" onClick={()=>setshowmodel(true)}>+Add Category</button> 
          )}
          </div>
      <table className="book-table">
        <thead>
         <tr>
            <th>Category Id</th>
            <th>Category Name</th>
            {hasAnyPermission(["UpadeteCategory","DeleteCategory"]) &&(
            <th>Action</th>
            )}
         </tr>
        </thead>
  
      
        <tbody>{datatoSHow.map((data:any,index:number)=>
        <tr key={index}>
            <td>{data[0]}</td>
            <td>{data[1]}</td>
           
            <td className="action-col">
              {hasPermission("UpdeteCategory") &&(
              <button className="btn btn-update" onClick={() => 
              {setSelectedCategory({ id: data[0], name: data[1] });setshowmodel(true);}}>
                 Update </button>)}
               {/* <NavLink to='addcategory/' state={{id:data[0],name:data[1]}}><button className="btn btn-update">Update</button></NavLink> */}
                {hasPermission("DeleteCategory")&&
                <button className="btn btn-delete" onClick={()=>handleDelete(data[0])}>Delete</button>}
            </td>
        </tr>
        )}
           
        </tbody>
      </table>
      <Pagination
        currentPage={currentPage}
        totalItems={categorydata.length}
        itemPerPage={itemPerPage}
        onPageChange={(page)=>{setCurrentPage(page)}}/>
        </div>
        </div>
        {isshow && (
        <>
        <div className="overlay">
        <div className="catmodal">
          <button className='modal-close' onClick={()=>setshowmodel(false)}>&times;</button>
           <Addcategory category={selectedCategory}
               onSuccess={() => {
               setshowmodel(false);
               fetchAllCategories();
          }}/>
          </div>
          </div>
        </>
          )}
        </>
      )}

export default Category
