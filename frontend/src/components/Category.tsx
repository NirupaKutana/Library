import { useEffect ,useState} from 'react'
import '../style/Category.css'
import Addcategory from './Addcategory'
import { toast } from 'react-toastify'
import Loader from './Loader'
import Pagination from './Pagination'
import { hasAnyPermission, hasPermission } from './RBAC'
import API from '../Api/axios'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

const fetchCategory = async() =>{
  const res = await API.get(`/category/`);
  return res.data
}
const deleteCategory = async(id:number) =>{
  const res = await API.delete(`/category/delete/${id}/`,{ data :{id}});
  return res.data
}
const fetchSearch = async(name :string) => {
   const res = await API.get(`/cat/filter/?name=${encodeURIComponent(name)}`);
   return res.data
}
const Category = () => {
    const [categorydata,setcategorydata] = useState<any>([]);
    const [isshow,setshowmodel]=useState<boolean>(false);
    const [search,setsearch] = useState("");
    const [filterdata,setfilterdata] = useState<any>([]);
    const isSearch = search.trim().length > 0;  
    const [selectedCategory, setSelectedCategory] = useState<any>(null);
    const [currentPage,setCurrentPage]=useState(1);
    const itemPerPage = 6;
    const indexOfLast = currentPage * itemPerPage ;
    const indexOfFirst = indexOfLast - itemPerPage;
    const currentUsers = categorydata.slice(indexOfFirst,indexOfLast) ;
    const datatoSHow = isSearch ? filterdata : currentUsers;

const queryclient = useQueryClient();
const {data :allCategory,isLoading :isMainLoading,isError:isMianError} = useQuery({
    queryKey : ["category"],
    queryFn : fetchCategory,
});
const {data:searchData,isLoading:isSearchLoading,isError:isSearchError} = useQuery({
   queryKey:["searchCategory",search],
   queryFn:()=>fetchSearch(search),
   enabled :search.trim().length>0,
});
useEffect(() => {
  if(search.trim().length>0){
    setfilterdata(searchData || []);
  }
  else if (allCategory)
  {
    setcategorydata(allCategory);
  }
},[allCategory,searchData,search]);

const deleteMutation = useMutation({
  mutationFn : deleteCategory ,
  onSuccess :(data)=>{queryclient.invalidateQueries({queryKey:["category"]});
                  toast.warning(data.Detail)},
});

{if(isMainLoading) return <Loader/>}
  return (
    <>
    <div className={isshow?"category-container dimmed":""}>
    <div className="category-container">
      <h2>Categoy View</h2>
        <div className="category-table-actions">
                
        <input type="text" className='srch' placeholder='🔍  Search Here..!' value={search} onChange={(e)=>setsearch(e.target.value)}/>
                  
          
          {hasPermission("AddCategory") &&(
            <button className="add-category-btn" onClick={() => {setSelectedCategory(null);   // important
              setshowmodel(true);  }}>
            +Add Category </button> 
          )}
          </div>
      <table className="category-table">
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
                <button className="btn btn-delete" onClick={()=>deleteMutation.mutate(data[0])}>Delete</button>}
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
               queryclient.invalidateQueries({queryKey:["category"]});
              //  fetchAllCategories();
          }}/>
          </div>
          </div>
        </>
          )}
        </>
      )}

export default Category
