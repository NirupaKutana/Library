import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import '../style/ViewRoleRights.css'
import { useNavigate } from 'react-router-dom';
import { fetchPermission, getPermission, setPermissions } from './RBAC';
import Pagination from './Pagination';

const ViewRoleRights = () => {
    useEffect(() => {
      fetchPermission(1);
    }, []); 
    // const [active,setActive]=useState("user");
    const [active, setActive] = useState( "user");
    const[data,setData]=useState<any[]>([]);
    const [currentPage,setCurrentPage] = useState(1);
    const itemPerPage = 6;
    const indexOfLast = currentPage * itemPerPage;
    const indexOfFirst = indexOfLast - itemPerPage;
    const currentData = data.slice(indexOfFirst, indexOfLast);
    const [activeToggle, setActiveToggle] = useState<number | null>(null);
    const navigate = useNavigate();
    const fetchRoleRights =async(id :number)=>{
        setData([])
    try{   
    const res = await axios.get(`http://127.0.0.1:8000/role/rights/${id}/`)
    const formatted = res.data.map((item:any) => ({
        id: item[0],
        name: item[2],
        active: item[3]
        }));
        // console.log("check",formatted)
        setData(formatted);
        navigate("/profile", { state: { activeTab: "View-RoleRight" } })

    }
    catch(err:any){toast.error(err.response?.data?.error)}
    };
    
    // useEffect(() => {
    //  localStorage.setItem("activeRole", active);
    //  }, [active]);
    // useEffect(()=>{
    //    fetchRoleRights(2);
    // },[]);
    const updateLocalPermission = (permissionName :string ,isActive :boolean) =>{
         let permission = getPermission();
            const loggedInRole = localStorage.getItem("role");
            console.log("asl",active.toLocaleLowerCase())
            if ( !loggedInRole || active.toLowerCase() !== loggedInRole.toLowerCase()) {
            console.log("Not updating local storage because this isn't your role.");
            return; 
            }
         if (isActive)
         {  
            
            if(!permission.includes(permissionName))
            {
                permission.push(permissionName);
            }
         }
         else
         {
            permission=permission.filter(p=>p!==permissionName)
         }
         setPermissions(permission)
    }
    const handleToggle = (id:number) => {
            try {
            
                axios.put(
                `http://127.0.0.1:8000/role/rights/${id}/`
                ).then((res=>{toast.success(res.data.success)}));
                setData(prev =>
                prev.map(item => {
                    if (item.id === id) {
                    const newActive = !item.active;
                    updateLocalPermission(item.name, newActive);
                    return { ...item, active: newActive };
                    }
                   window.location.reload();
                    return item;
                 })
                );

            } catch (error) {toast.error("Failed to update permission");}
    };

  return (
    <div>
        <div className="role-switch">
        <button onClick={()=>{setActive("user");fetchRoleRights(2)}}
        className={`role-btn ${active==="user" ? "active-role" : ""}`}>user</button>
        <button onClick={()=>{setActive("librarian");fetchRoleRights(3)}}
         className={`role-btn ${active==="librarian" ? "active-role" : ""}`}>Librarisn</button>
        <button onClick={()=>{setActive("admin");fetchRoleRights(1)}}
        className={`role-btn ${active==="admin" ? "active-role" : ""}`}>Admin</button>
        </div>
        <div className="rights-wrapper">
        <ul className="rights-list">
            {currentData.map((d:any,index:number)=>
            <li key={index}  className="right-item">
                <span className="right-name">{d.id}  {d.name}</span>
                 <button className={`toggle-btn ${d.active ? "on" : "off"}`}
                    onClick={() => {handleToggle(d.id)}}>
                    {d.active ? "ON" : "OFF"}
                </button>
            </li> )}
        </ul>
        </div>
        <Pagination 
        currentPage={currentPage}
        totalItems={data.length}
        itemPerPage={itemPerPage}
        onPageChange={(page)=>setCurrentPage(page)}
        />
    </div>
  )
}

export default ViewRoleRights
