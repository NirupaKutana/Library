import  { useEffect, useState } from 'react'
import '../style/UserList.css'
import API from '../Api/axios'
import { useNavigate } from 'react-router-dom'
import Pagination from './Pagination'
import Loader from './Loader'

const UserList = () => {
    const[Loading,setLoading] =useState(false)
    const [userData,setUserData] = useState([]);
    // const [search,setsearch] = useState("");
    // const [filterdata,setfilterdata] = useState([]);
    // const isSearch = search.trim().length > 0;  
    // const datatoSHow = isSearch ? filterdata :userData;
    const navigate = useNavigate();
    const [currentPage,setCurrentPage]=useState(1);
    const itemPerPage = 6;
    const indexOfLast = currentPage * itemPerPage ;
    const indexOfFirst = indexOfLast - itemPerPage;
    const currentUsers = userData.slice(indexOfFirst,indexOfLast) ;

    useEffect(()=>{
       setLoading(true)
        API.get("/getusers/")
       .then(res=>{
           setUserData(res.data)
            navigate("/profile", { state: { activeTab: "Users" } })

       }).finally(()=>setLoading(false))
    },[])

//     useEffect(()=>{
//         fetchSearch(search)
//     },[search])
// const fetchSearch =(id: number)=>{
//       axios.get(`http://127.0.0.1:8000/UserAudit/${encodeURIComponent(id)}`)
//       .then(res=>{
//         setfilterdata(res.data)
//       })
// }
    const userAudit =(email : string)=>{
        
        window.open(`http://127.0.0.1:8000/usAudit/?email=${encodeURIComponent(email)}`,"_blank");

    };
  return (
    <>
    {Loading && <Loader/>}
    <div className="userlist-container">
        <h2>USER LIST</h2>
        {/* <input type="text" className='srch' placeholder='🔍  Search Here..!' value={search} onChange={(e)=>setsearch(e.target.value)}/> */}

      <table className="user-table">
        <thead>
            <tr>
                <th>ID</th>
                <th>NAME</th>
                <th>EMAIL</th>
                <th>ROLE</th>
                <th>Audit</th>
            </tr>   
        </thead>
        <tbody>
            {currentUsers.map((u :any)=>(
             <tr>
                <td>{u[0]}</td>
                <td>{u[1]}</td>
                <td>{u[2]}</td>
                <td>{u[3]}</td>
                <td><button className="audit-btn" onClick={()=>userAudit(u[2])}>View Audit</button></td>
             </tr>
             ))}
        </tbody>
      </table>
      <Pagination
        currentPage={currentPage}
        totalItems={userData.length}
        itemPerPage={itemPerPage}
        onPageChange={(page)=>{setCurrentPage(page)}}/>
    </div>
   </>
  )
}

export default UserList
