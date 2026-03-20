import React, { useEffect, useState } from "react";
import "../style/Profile.css";
import axios from "axios";
import {  useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Books from "./Books";
import Category from "./Category";
import Author from "./Author";
// import AddImage from "./AddImage";
import Issue from "./Issue";
import Dashboard from "./Dashboard";
import Audit from "./Audit";
import LoginAudit from "./LoginAudit";
import UserList from "./UserList";
import ImageFile from "./ImageFile";
import Librarian from "./Librarian";
import RoleRights from "./RoleRights";
import { hasPermission } from "./RBAC";
import ViewRoleRights from "./ViewRoleRights";
import TanStack from "./TanStack";

const Profile = () => {
  const location = useLocation()
  const [userdata, setUserData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("");
  const[userList,setUserList] = useState([]);
  const[issue,setIssue] = useState([]);
  const navigate = useNavigate();
  const [issuedata,setIssuedata] = useState([]);
  

  
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
  else{
      const role = localStorage.getItem("role");
      if (role === "ADMIN") {
        setActiveTab("Dashboard");
      } 
      else if (role==="LIBRARIAN") {
        setActiveTab("Users");
       } 
      else{
         setActiveTab("profile");
      }  
      
}
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
    axios.get(`http://127.0.0.1:8000/issue/user/1/`)
    .then(res=>{
      setIssue(res.data)  
    })
},[])

  return (
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
          {/* userrrrr */}
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


          {/* adminnnn */}
         {/* {localStorage.getItem("role")==="ADMIN" &&( */}
            <>
    
          
       
         {localStorage.getItem("role")==="ADMIN" &&
         <>
          <li className={activeTab === "Dashboard" ? "active" : ""}
            onClick={() => setActiveTab("Dashboard")}>
            Dashboard
          </li>  
          
        <li className={activeTab === "Librarian" ? "active" : ""}
            onClick={() => setActiveTab("Librarian")} >
            Librarian
        </li>
         
         <li className={activeTab === "Role-Right" ? "active" : ""}
            onClick={() => setActiveTab("Role-Right")} >
            Role Rights
        </li>
         <li className={activeTab === "View-RoleRight" ? "active" : ""}
            onClick={() => setActiveTab("View-RoleRight")} >
            View RoleRights
        </li>
        </>
         }
        {hasPermission("ViewUsers") &&
         <li className={activeTab === "Users" ? "active" : ""}
            onClick={() => setActiveTab("Users")} >
            User List
         </li>}
      
         {hasPermission("IssueBook") &&
        <li className={activeTab === "issue" ? "active" : ""}
          onClick={() => setActiveTab("issue")} >
            Issue Books
        </li>}
         
         {hasPermission("AddBook") &&
        <li className={activeTab === "Book" ? "active" : ""}
            onClick={() => setActiveTab("Book")}>
            Books 
        </li>
        } 
          
         {hasPermission("AddCategory") &&
        <li className={activeTab === "Category" ? "active" : ""}
            onClick={() => setActiveTab("Category")}>
            Category
        </li>}

         {hasPermission("AddAuthor") &&
        <li className={activeTab === "Author" ? "active" : ""}
            onClick={() => setActiveTab("Author")}>
            Author
        </li>}

        {hasPermission("AddImage") &&
        <li className={activeTab === "AddImage" ? "active" : ""}
            onClick={() => setActiveTab("AddImage")}>
            Book Image
        </li>}

          {hasPermission("ViewAudit") &&
          <li className={activeTab === "Audit" ? "active" : ""}
            onClick={() => setActiveTab("Audit")}>
            Audit Logs
          </li>}

          {hasPermission("ViewLoginAudit") &&
          <li className={activeTab === "LoginAudit" ? "active" : ""}
            onClick={() => setActiveTab("LoginAudit")}>
              Login Audit
          </li>}
          </>
          {/* )} */}
          </ul>
        
          
        <div className="sidebar-bottom">
          <button onClick={handleLogout}>Logout</button>
        </div>
      </div>

      {/* Content Area */}
      <div className="content-area">
         {localStorage.getItem("role")==="USER" &&(
          <>
        {activeTab === "profile" && userdata && (
          <div className="content-card">
            <h2>Profile Details</h2>

            <div className="info-row">
              <span>Name</span>
              <span>{userdata.user_name}</span>
            </div>

            <div className="info-row">
              <span>Email</span>
              <span>{userdata.user_email}</span>
            </div>
          </div>
        )}
        
        {activeTab === "issued" && (
          <div className="content-card">
         
            <h2>Issued Books</h2>
            <div className="book-item">
              {issuedata.map((i:any)=>(
              <div key={i[0]}>
              <div>
                <h4>{i[2]}</h4>
                <p>Issued Date: {new Date(i[3]).toLocaleDateString("en-GB",{
                day: "2-digit",month: "short",year: "numeric",})}</p>
              </div>
              {i[6]==="ISSUED"&&(<span className="status">{i[6]}</span>)}
              {i[6]==="RETURNED" &&(<span className="status pending">{i[6]}</span>)}
              
              </div>
            ))}
           
            </div>
             <button className="tbnnn" onClick={handleUserReport}>Generate Report</button>
          </div>
        )}
        </>
        )}

       
        {activeTab === "Dashboard" && (
          <>
          <Dashboard/>
          </>
        )}
        
        {activeTab === "Users" && (
          <>
           <UserList/>
          </>
        )}

        {activeTab === "Librarian" && (
          <>
           <Librarian/>
          </>
        )}

        {activeTab === "Role-Right" && (
          <>
           <RoleRights/>
          </>
        )}
        {activeTab === "View-RoleRight" && (
          <>
           <ViewRoleRights/>
          </>
        )}

        {activeTab === "issue" && (
          <Issue/>
        )}
        {activeTab === "Book" && (
          <Books/>
        )}
        {activeTab === "AddImage" && (
          // <AddImage/>
          <ImageFile/>
        )}
        {activeTab === "Category" && (
          <Category/>
        )}
        {activeTab === "Author" && (
          <Author/>
        )}
        

        {activeTab === "Audit" && userList &&(
          <><Audit/></>
         )}
        
        {activeTab === "LoginAudit" && userList &&(
          <><LoginAudit/></>
         )}

      </div>
    </div>
  );
};

export default Profile;
