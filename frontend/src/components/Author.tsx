import  { useEffect, useState } from 'react'
import '../style/Author.css'
import { useNavigate } from 'react-router-dom'
import Loader from './Loader'
import Addauthor from './Addauthor'
import Pagination from './Pagination'
import { hasAnyPermission, hasPermission } from './RBAC'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import API from '../Api/axios'
const fetchAuthor = async() =>{
  const res = await API.get(`/author/`);
  return res.data
}
const deleteAathor = async(id:number) =>{
  const res = await API.delete(`/author/delete/${id}/`)
  return res.data
}
const Author = () => {
  const[authordata,setauthordata]=useState([]);
  const [search,setsearch]=useState("");
  const[filterdata,setfilterdata] =useState([])
  const IsSearch = search.trim().length>0;
  const [isshow,setshowmodel]=useState<boolean>(false);
  const navigate = useNavigate()
  const [selectedAuthor, setSelectedAuthor] = useState<any>(null);
  const [currentPage,setCurrentPage]=useState(1);
  const itemPerPage = 6;
  const indexOfLast = currentPage * itemPerPage ;
  const indexOfFirst = indexOfLast - itemPerPage;
  const currentUsers = authordata.slice(indexOfFirst,indexOfLast) ;
  const dataToshow = IsSearch ? filterdata : currentUsers;

const {data,isLoading ,isError} = useQuery({
    queryKey : ["authors"],
    queryFn :fetchAuthor,
  })

  useEffect(()=>{
    if(data)
    {
      setauthordata(data);
    }
  },[data])
  useEffect(()=>{
        setfilterdata(authordata.filter((a:any)=>a[1].toLowerCase().includes(search.toLowerCase())))
   },[search])

  const queryClient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn:deleteAathor,
    onSuccess :()=>{queryClient.invalidateQueries({queryKey:["authors"]});},
  });
  
     {if (isLoading) return <Loader></Loader>}
     
  return (
    <>
   
    <div className="author-container">
      <h2>Author View</h2>

        <div className="author-table-actions">
           <input type="text" placeholder='🔍  Search Here..!' className='srch' value={search} onChange={(e)=>setsearch(e.target.value)} />
           {hasPermission("AddAuthor")  &&(
            <button className="add-author-btn" onClick={() => {setSelectedAuthor(null);   
              setshowmodel(true);  }}>+Add Author</button>
           )}
          </div>
        <table className="author-table">
          <thead>
            <tr>
                <th>Author Id</th>
                <th>Author Name </th>
                {hasAnyPermission(["UpdateAuthor","DeleteAuthor"]) &&(
                <th>Action</th>)}
            </tr>
          </thead>
          <tbody>{dataToshow.map((data:any,index)=>
           <tr key={index}>
            <td>{data[0]}</td>
            <td>{data[1]}</td>
            
            <td className="action-col">
                {hasPermission("UpdateAuthor") &&(
                <button className="btn btn-update" onClick={() => 
                {setSelectedAuthor({ id: data[0], name: data[1] });setshowmodel(true);}}>
                 Update </button>)}
                {hasPermission("DeleteAuthor") &&(
                <button className="btn btn-delete" onClick={()=>deleteMutation.mutate(data[0])}>Delete</button>)}
             </td>
            
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
        <div className="Authormodal">
          <button className='modal-close' onClick={()=>setshowmodel(false)}>&times;</button>
          <Addauthor author={selectedAuthor}
               onSuccess={() => {
               setshowmodel(false);
               queryClient.invalidateQueries({queryKey:["authors"]});}}/>
          </div>
          </div>
        </>
        )}
  </>
  )
}

export default Author

// const fetchAllAuthor = () =>{
//    setLoading(true)
//       axios.get(`${BASE_URL}/author/`)
//         .then(res=>{
//           setauthordata(res.data)
//           navigate("/profile", { state: { activeTab: "Author" } })

//         }).catch(err=>toast.error(err.res?.data?.error))  
//         .finally(()=>{
//           setLoading(false)
//         })  
// }
//   useEffect(()=>{
//         fetchAllAuthor();
//     },[])


// const handleDelete = async(a_id : number) =>{
   
  //    try{
  //         const res = await axios.delete(`${BASE_URL}/author/delete/${a_id}/`,{
  //         data :{a_id}
  //         })
  //         toast.warning(res.data.message)
  //         queryClient.invalidateQueries({queryKey:["authors"]});
  //         navigate("/profile", { state: { activeTab: "Author" } })
  //         // window.location.reload();
  //     }
  //     catch(err:any)
  //     {
  //        toast.error(err.response?.data?.error)
  //     }
  //   }