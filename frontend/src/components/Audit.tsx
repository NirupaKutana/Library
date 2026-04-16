import API from '../Api/axios';
import { useEffect, useState } from 'react'
import '../style/Audit.css'
import { useNavigate } from 'react-router-dom';
import Pagination from './Pagination';
import Loader from './Loader';

const Audit = () => {
       const [Loading,setLoading]=useState(false)
       const today : string = new Date().toISOString().slice(0,10);
       const [userData,setUserData] = useState([]);
       const [logs,setLogs] = useState([]);
       const[sdate,setSdate]=useState<Date | null>(null)
       const[edate,setEdate]=useState<Date | null>(null)
       const[user,setUser] = useState<number>()
       const[action,setAction]=useState("")
       const navigate = useNavigate()
       const [currentPage,setCurrentPage]=useState(1);
       const itemPerPage = 6;
       const indexOfLast = currentPage * itemPerPage ;
       const indexOfFirst = indexOfLast - itemPerPage;
       const currentUsers = logs.slice(indexOfFirst,indexOfLast) ;
       useEffect(()=>{
        setLoading(true)
         API.get("/audit/")
         .then(res=>{
            setLogs(res.data);
            navigate("/profile", { state: { activeTab: "Audit" } })
         }).finally(()=>setLoading(false));
       },[])

      useEffect(()=>{
        API.get("/getusers/")
       .then(res=>{
           setUserData(res.data)       
           

       })
    },[])

    const filterAudit =()=>{
       API.get(`/filter/Audit/`,{
        params:{
          sdate: sdate ? sdate.toISOString().split("T")[0] : null,
          edate: edate ? edate.toISOString().split("T")[0] : null,
          user: user || null,
          act: action && action !== "None" ? action : null
        }
       }).then(res=>{
        setLogs(res.data)
        navigate("/profile", { state: { activeTab: "Audit" } })
       })
    }
    const downloadPDF = () => {
    API.get("/audit/pdf/", {
    params: {
      sdate: sdate ? sdate.toISOString().split("T")[0] : null,
      edate: edate ? edate.toISOString().split("T")[0] : null,
      user: user || null,
      act: action !== "None" ? action : null
    },
    responseType: "blob"
     }).then(res => {
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "Audit_Report.pdf");
    document.body.appendChild(link);
    link.click();
  });
};
    
  return (
    <>{Loading && <Loader/>}
    <div className="audit-container">
      {/* <h2>Audit Logs</h2> */}

      <div  className="audit-filter">
      <label>Start Date :</label>
      <input type="date" max={today} value={sdate ? sdate.toISOString().split('T')[0]: ''} onChange={(e)=>{setSdate(e.target.valueAsDate)}}/>
      
      <label>End Date :</label>
      <input type="date" max={today} value={edate ? edate?.toISOString().split('T')[0]: ''} onChange={(e)=>{setEdate(e.target.valueAsDate)}}/>
      
      <label>USER:</label>
      <select value={user} onChange={(e)=>{setUser(Number(e.target.value))}}><option>None</option>
        {userData.map((u:any)=>(
         <option key = {u[0]} value={u[0]}>{u[1]}</option>
        ))}
      </select>
      
      <label>Action :</label>
      <select value={action} onChange={(e)=>{setAction(e.target.value)}}>
        <option >None</option>
        <option >create</option>
        <option >return</option>
        <option>update</option>
        <option >delete</option>
        
      </select>

      <button className="btn-primary"  onClick={filterAudit}>Get Audit</button>
      <button className="btn-dark" onClick={downloadPDF}>pdf</button>
      </div>
      <div className="audit-table-wrapper">
      <table className="audit-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>User</th>
            <th>Action</th>
            <th>Module</th>
            <th>Description</th>
            <th>Date</th>
          </tr>
        </thead>

        <tbody>
          {currentUsers.map((log: any) => (
            <tr key={log[0]}>
              <td>{log[0]}</td>
              <td>{log[1]}</td>
              <td><span className={`badge ${log[2].toLowerCase()}`}>{log[2]}</span></td>
              <td>{log[3]}</td>
              <td>{log[4]}</td>
              <td>{new Date(log[5]).toLocaleString("en-GB",{day:"numeric", month:"short" ,year :"numeric"})}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination
      currentPage={currentPage}
      totalItems={logs.length}
      itemPerPage={itemPerPage}
      onPageChange={(page)=>{setCurrentPage(page)}}/>
      </div>
    </div>
  </>
  )
}

export default Audit
