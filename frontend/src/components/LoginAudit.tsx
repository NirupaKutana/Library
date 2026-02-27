import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import '../style/LoginAudit.css';
import Pagination from './Pagination';
import Loader from './Loader';

const LoginAudit = () => {
    const [Loading,setLoading] = useState(false)
    const [logs,setLogs] = useState([]);
    const navigate = useNavigate();
    const[filterdata,setFilterdata] =useState([]);
    const [search,setsearch] = useState("")
    const isSearch = search.trim().length>0;
    const [currentPage,setCurrentPage] = useState(1);
    const itemPerPage = 6;
    const indexOfLast = currentPage * itemPerPage;
    const indexOfFirst = indexOfLast - itemPerPage;
    const currentUsers = logs.slice(indexOfFirst, indexOfLast);
    const datatoshow = isSearch ? filterdata : currentUsers;


       useEffect(()=>{
         setLoading(true)
         axios.get("http://127.0.0.1:8000/LoginAudit/")
         .then(res=>{
            setLogs(res.data);
            navigate("/profile", { state: { activeTab: "LoginAudit" } }) 
         }).finally(()=>setLoading(false));
       },[])
        
       const serachAudit = async(name :string)=>
       {
          console.log("searchname:",name);
        const res = await axios.get(`http://127.0.0.1:8000/search/LoginAudit/?name=${encodeURIComponent(name)}`)
        
          setFilterdata(res.data);
        
       }

       useEffect(()=>{
                     
            serachAudit(search);
          
          
       },[search]);

      
  return (
    <>
    {Loading && <Loader/>}
    <div>
      <div className="audit-container">
      <h2>Login Audit</h2>
   
      <input type="text" placeholder='🔍  Search Here..!' className='srchbar' value={search} onChange={(e)=>setsearch(e.target.value)}/>        
    
      <div className="audit-table-wrapper">
      <table className="audit-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>User Email</th>
            <th>User Name</th>
            <th>Activity</th>
            <th>status</th>
            <th>Date</th>
          </tr>
        </thead>

        <tbody>
          {datatoshow.map((log: any) => (
            <tr key={log[0]}>
              <td>{log[0]}</td>
              <td>{log[1]}</td>
              <td>{log[2]}</td>
              <td>{log[3]}</td>
              <td>{log[4]}</td>
              <td>{new Date(log[5]).toLocaleString("en-GB",{day:"numeric",month:"short",year:"numeric"})}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination 
      currentPage={currentPage}
      totalItems={logs.length}
      itemPerPage={itemPerPage}
      onPageChange={(page)=>setCurrentPage(page)}/>
      </div>
    </div>
    </div>
    </>
  )
}

export default LoginAudit
