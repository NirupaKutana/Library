import API from '../Api/axios'
import '../style/issue.css'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import IssueBook from './IssueBook'
import Pagination from './Pagination'
import Loader from './Loader';

const Issue = () => {
const [Loading,setLoading] = useState(false);
const [issuedata,setIssuedata]=useState([]);
const navigate = useNavigate();
const [isshow,setshowmodel] = useState<Boolean>(false)
const [search,setsearch] = useState("");
const [searchdata,setsearchdata] = useState([]);
const isSearch = search.trim().length > 0; 
const [currentPage,setCurrentPage] = useState(1);
const itemPerPage = 6;
const indexOfLast = currentPage * itemPerPage;
const indexOfFirst = indexOfLast - itemPerPage;
const currentUsers = issuedata.slice(indexOfFirst,indexOfLast)
const datatoSHow = isSearch ? searchdata : currentUsers;

const fetdata =async()=>{
  
  try{
      setLoading(true)
      const res = await API.get("/issue/")
      setIssuedata(res.data)
      
  }
  catch(err:any)
  {
    toast.error(err.res?.data?.error || "Failed to fetch data")
  }
  finally
  {
    setLoading(false)
  }
}
const Overduedata = async() =>{
    try
    {  
       const res = await API.get('/issue/overdue/')
       setIssuedata(res.data)
    }
    catch(err:any)
    {
        toast.error(err.response?.data?.error)
    }
}
const fetchsearchdata =async(name : string)=>{
    try
    {
       const res = await API.get(`/issue/search/?name=${encodeURIComponent(name)}`)
       setsearchdata(res.data)
       navigate("/profile",{state :{activeTab:"issue"}})

    }
    catch(err:any)
    {
       toast.error(err.res?.data?.error|| "Search failed")
    }
}
useEffect(()=>{
   fetdata();
},[])

useEffect(()=>{
   fetchsearchdata(search);
  
},[search])

const sendMail =()=>{
    API.get("/overdue/mail/")
    .then(res=>{
        toast.success(res.data.message)
    })
}
const handleReturn = async(id : number)=>
    {
        
        try
        {
            const res = await API.post("/return/",{
            issue_id : id})
            toast.success(res.data.message)
            navigate("/profile",{state :{activeTab:"issue"}})
            window.location.reload()
            
        }
        catch(err:any)
        {
             toast.error(err.response?.data?.message)
        }

    }
return (
    <>
     {Loading && <Loader/>}
      {/* <h2>Issue Book</h2> */}

    <div className='action'>
    <input type="text" className='srch' placeholder='🔍  Search Here..!' value={search} onChange={(e)=>setsearch(e.target.value)}/>
    <button className="btn-issue" onClick={fetdata}>All Issue List</button>
    <button className="btn-issue" onClick={Overduedata}>Overdue List</button>
    <button className="btn-issue" onClick={sendMail}>Overdue Mail</button>
    <button className="btn-issue" onClick={()=>setshowmodel(true)}>+ Issue</button>
    </div>
    <div className="issue-list-container">
        <div className="issue-card">
        <table className="issue-table">
            <thead>
             <tr>
                <th>issue id</th>
                <th>user</th>
                <th>book</th>
                <th>issue_date</th>
                <th>duedate</th>
                <th>status</th>
                <th>Fine</th>
                <th>action</th>
             </tr>
            </thead>
            <tbody>
                {datatoSHow.map((u:any,index)=>(
                <tr key={index}>
                   <td>{u[0]}</td>
                   <td>{u[1]}</td>
                   <td>{u[2]}</td>
                   <td>{new Date(u[3]).toLocaleDateString("en-GB",{day: "2-digit",month: "short",year: "numeric",})}</td>
                   <td>{new Date(u[4]).toLocaleDateString("en-GB",{day: "2-digit",month: "short",year: "numeric",})}</td>
                   {/* <td>{u[5]}</td> */}
                   <td><span className={`status ${u[6].toLowerCase()}`}>{u[6]}</span></td>
                   <td>{u[7]}</td>
                   <td><button className="return-btn" disabled={u[6] === "RETURNED"}onClick={()=>{handleReturn(u[0])}}>Return</button></td>   
               </tr>
               ))}
            </tbody>
        </table>
        <Pagination
        currentPage={currentPage}
        totalItems={issuedata.length}
        itemPerPage={itemPerPage}
        onPageChange={(page)=>{setCurrentPage(page)}}/>
      </div>
    </div>
   {isshow &&(
    <>
    <div className='overlay'></div>
    <div className='modall'>
    <button className='modal-close' onClick={()=>setshowmodel(false)}>&times;</button>
    <IssueBook onSuccess={()=>{setshowmodel(false)}}/>
    </div>
    </>
   )}

 </>
  )
}

export default Issue
