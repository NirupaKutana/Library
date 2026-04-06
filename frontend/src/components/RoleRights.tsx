import '../style/RoleRights.css'
import { useEffect, useState } from 'react'
import AddRole from './AddRole'
import AddRights from './AddRights'
import AddRoleRights from './AddRoleRights'
import { toast } from 'react-toastify'
import API from '../Api/axios'
import { useNavigate } from 'react-router-dom'
import Loader from './Loader'
import Pagination from './Pagination'
const RoleRights = () => {
  const[Loading,setLoading]=useState(false); 
  const [isshowRole,setIsShowRole]=useState(false) ;
  const [isshowRight,setIsShowRight]=useState(false) ;
  const [isshowRoleRights,setIsShowRoleRights]=useState(false) ;
  const [currentPage,setCurrentPage]=useState(1);
  const itemPerPage = 6;
  const [right,setRight] = useState([]);
  const indexOfLast = currentPage * itemPerPage ;
  const indexOfFirst = indexOfLast - itemPerPage;
  const currenData= right.slice(indexOfFirst,indexOfLast) ;

  const [selectedRights,setSelectedRIghts]=useState<any>([]);
  const navigate=useNavigate()
  const fetchRights=()=>{
        setLoading(true)
        API.get("/right/").then((res)=>{       
        setRight(res.data);
        navigate("/profile", { state: { activeTab: "Role-Right" } });

      }).catch((err:any)=>{toast.error(err.response?.data?.error)})
      .finally(()=>{
          setLoading(false)
         })
  }
  const handleDelete = (right_id:number) =>{
    API.delete(`/right/${right_id}/`).then((res=>{
      toast.warning("Deleted Successfuly..!");
    }));
    
   };
  
  useEffect(()=>{  
    fetchRights();
  },[]);
  return (
    <>{Loading && <Loader/>}
    <div className='roleright-container'>
      <h2>Role And Rights</h2>
      <div className='space'>
      <button className='add-role-btn' onClick={()=>setIsShowRole(true)}>+Add Role</button>  
      <button className='add-role-btn' onClick={()=>{setIsShowRight(true);setSelectedRIghts(null)}}>+Add Right</button>
      <button className='add-role-btn' onClick={()=>setIsShowRoleRights(true)}>+Add RoleRight</button>
      </div>
      <table>
        <thead>
          <tr>
            <td>id</td>
            <td>Permission</td>
            <td>Description</td>
            <td>Action</td>
          </tr>
        </thead>
        <tbody>
          {currenData.map((data:any)=>(
            <>
            <tr key={data[0]}>
              <td>{data[0]}</td>
              <td>{data[1]}</td>
              <td>{data[2]}</td>
              <td className='action-btn'>
                <button className='u-btn'onClick={()=>{setIsShowRight(true)
                  setSelectedRIghts({id:data[0],permission_name:data[1],description:data[2]})
                }}>Update</button>
                 <button className='d-btn' onClick={()=>handleDelete(data[0])}>Delete</button></td>
            </tr>
          </>
          ))}
          
        </tbody>
      </table>
      <Pagination currentPage={currentPage}
      totalItems={right.length}
      itemPerPage={itemPerPage}
      onPageChange={(page)=>{setCurrentPage(page)}}
      />
      <>
        {isshowRole &&(
          <>
          <div className='overlay'></div>
          <div className='modal'>
      
          <button className='modal-close' onClick={()=>setIsShowRole(false)}>&times;</button>
          <AddRole/>
          </div>
          </>
        )}
      </>
      <>
        {isshowRight &&(
          <>
          <div className='overlay'></div>
          <div className='modal'>
      
          <button className='modal-close' onClick={()=>setIsShowRight(false)}>&times;</button>
          <AddRights right={selectedRights}
          onSuccess={()=>{setIsShowRight(false);
               fetchRights();}}/>
          </div>
          </>
        )}
        </>
        <>
        {isshowRoleRights &&(
          <>
          <div className='overlay'></div>
          <div className='modal'>
      
          <button className='modal-close' onClick={()=>setIsShowRoleRights(false)}>&times;</button>
          <AddRoleRights/>
          </div>
          </>
        )}
        </>
    </div>
  </>
  )
}

export default RoleRights
