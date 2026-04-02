import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import '../style/UserProfile.css'
import { NavLink } from 'react-router-dom';
import EditUser from './EditUser';
const UserProfile = () => {
    const location = useLocation()
  const [userdata, setUserData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("");
  const[userList,setUserList] = useState([]);
  const[issue,setIssue] = useState([]);
  const navigate = useNavigate();
  const [issuedata,setIssuedata] = useState([]);
  const [isshow,setIsShow]=useState<Boolean>(false);
  const [editUser,setEditUser]=useState<any>(null);
    const logout = () =>{
       localStorage.clear();
       window.location.reload()
       navigate("/");
     }
    useEffect(() => {
        const token = localStorage.getItem("access_token");
        if (!token) {
          navigate("/login");
          return;
        }
        const user = localStorage.getItem("user");
        if (user) {
          const parseUser = JSON.parse(user);
          const id = parseUser.user_id;
          axios.get(`http://127.0.0.1:8000/user/${id}/`)
            .then((res) => {
              setUserData(res.data);
            })
            .catch((err) => console.log(err));
        }
      }, [navigate]);

    useEffect(()=>{
    const user = localStorage.getItem("user");
    if(user) {
        const parseUser = JSON.parse(user);
        const id = parseUser.user_id;
    
        axios.get(`http://127.0.0.1:8000/issue/user/${id}/`)
        .then(res=>{
        setIssuedata(res.data)
        }).catch((err:any)=>{ toast.error(err.response?.data?.error)})
    
     }
   
    },[])

    useEffect(() => {
      if(location.state?.activeTab){
        setActiveTab(location.state.activeTab)
      }
      else{ setActiveTab("profile");}
    }, [location.state]);

    const handleLogout = () => {
    localStorage.clear();
    navigate("/");
    };

const handleUserReport = async(e:React.FormEvent)=>{
  e.preventDefault() 
      const user = localStorage.getItem("user");
      if (!user) return;
      const parseUser = JSON.parse(user);
      window.open(`http://127.0.0.1:8000/user/report/${parseUser.user_id}/`)

};

useEffect(()=>{
    axios.get(`http://127.0.0.1:8000/getusers/`).then(res=>{
    setUserList(res.data);
  })
},[])

useEffect(()=>{
    const user = localStorage.getItem("user");
    if (!user) return;
    const parseUser = JSON.parse(user);
    const id = parseUser.user_id
    axios.get(`http://127.0.0.1:8000/issue/user/${id}/`)
    .then(res=>{
      setIssue(res.data)  
    })
},[])


  return (
  <>
   <div className="dashboard-container">

      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-top">
          <div className="avatar-small">
            {userdata?.user_name?.charAt(0).toUpperCase()}
          </div>
          <h3>{userdata?.user_email}</h3>
        </div>
         
        <ul className="sidebar-menu">
          {localStorage.getItem("role")==="USER" &&(
            <>
          <li className={activeTab === "profile" ? "active" : ""}
            onClick={() => setActiveTab("profile")}>
            Profile
          </li>
           <li className={activeTab === "issued" ? "active" : ""}
          onClick={() => setActiveTab("issued")} >
            Issued Books
          </li>
         </>
          )}
          </ul>
        <div className="sidebar-bottom">
          <button onClick={handleLogout}>Logout</button>
        </div>
      </div>
      
      <div className='tonav'>
       
        <NavLink to="/">🏡 Home</NavLink>
        <NavLink to="/"  onClick={logout}>Logout</NavLink>
        {/* <button className='btn-logoutt'><img className='imgg' src="\Image\image.png" onClick={logout}/></button> */}

        </div>
      {/* Content Area */}
      <div className="content-areaa">
        
         {localStorage.getItem("role")==="USER" &&(
          <>
        {activeTab === "profile" && userdata && (
          <div className="content-cardd">
            <h2>Profile Details</h2>

            <div className="info-row">
              <span>Name</span>
              <span>{userdata.user_name}</span>
            </div>

            <div className="info-row">
              <span>Email</span>
              <span>{userdata.user_email}</span>
            </div>
            
            <button className='edit-tbnnn' onClick={()=>{setIsShow(true);setEditUser({id:userdata.user_id,name:userdata.user_name});}}>
               ✏️EDIT</button>
          </div>
        )}
        
        {activeTab === "issued" && (
          <div className="content-cardd">
         
            <h2>Issued Books</h2>
            
           <div className="book-header">
          <span>Book Name</span>
          <span>Issue Date</span>
          <span>Return Date</span>
          <span>Status</span>
        </div>
        <hr />

        {issuedata.map((i: any) => (
          <div key={i[0]} className="book-row">
            <p>{i[2]}</p>
            <p>{new Date(i[3]).toLocaleDateString("en-GB", {
            day: "2-digit",month: "short", year: "numeric",})}</p>

            <p>{new Date(i[5]).toLocaleDateString("en-GB", {
            day: "2-digit",month: "short", year: "numeric",})}
             </p>

            {i[6] === "ISSUED" && (<span className="status issued">{i[6]}</span>)}

            {i[6] === "RETURNED" && (<span className="status returned">{i[6]}</span>)}

            </div>
            ))}
          <button className="tbnnn" onClick={handleUserReport}>Get Report</button>
          </div>
        )}
        </>
        )}

      </div>
      
    </div>
    <>
    {isshow &&(
      <>
          <div className='overlay'></div>
          <div className='modal-edit'>
            <button className='modal-close' onClick={()=>setIsShow(false)}>&times;</button>
            <EditUser user={editUser}/>
          </div>
      </>
    )}
    </>
  </>
  )
}

export default UserProfile
