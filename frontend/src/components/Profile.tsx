import{ useEffect, useState } from "react";
import "../style/Profile.css";
import API from "../Api/axios";
import {  useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Books from "./Books";
import Category from "./Category";
import Author from "./Author";
import Issue from "./Issue";
import Dashboard from "./Dashboard";
import Audit from "./Audit";
import LoginAudit from "./LoginAudit";
import UserList from "./UserList";
import ImageFile from "./ImageFile";
import Librarian from "./Librarian";
import RoleRights from "./RoleRights";
import { hasPermission ,hasAllPermissions} from "./RBAC";
import ViewRoleRights from "./ViewRoleRights";


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
      API.get(`/user/${id}/`)
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
  
     API.get(`/issue/user/${id}/`)
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



useEffect(()=>{
    API.get(`/getusers/`).then(res=>{
    setUserList(res.data);
  })
},[])

useEffect(()=>{
    const user = localStorage.getItem("user");
    if (!user) return;
    const parseUser = JSON.parse(user);
    const id =parseUser.user_id
    API.get(`/issue/user/${id}/`)
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

      
         {hasAllPermissions(["AddBook","ViewBook"]) && 
        <li className={activeTab === "Book" ? "active" : ""}
            onClick={() => setActiveTab("Book")}>
            Books 
        </li>
}
      
         {hasAllPermissions(["AddCategory","ViewCategory"]) &&
        <li className={activeTab === "Category" ? "active" : ""}
            onClick={() => setActiveTab("Category")}>
            Category
        </li>}

         {hasAllPermissions(["AddAuthor","ViewAuthor"]) &&
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
