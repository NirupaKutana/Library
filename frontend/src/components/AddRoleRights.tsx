import React, { useEffect, useState } from 'react'
import '../style/AddRoleRights.css'
import { toast } from 'react-toastify';
import API from '../Api/axios';
import { useNavigate } from 'react-router-dom';
const AddRoleRights = () => {
    const[roleData,setRoleData]= useState([]);
    const[rightData,setRightData]=useState([]);
    const[role,setRole]=useState<number>();
    const[right,setRight]=useState<number[]>([]);
    const navigate = useNavigate();
    const fetchRole =async()=>{
        try
        {
           const res = await API.get("/role/");
           setRoleData(res.data);
        }
        catch(err:any)
        {
            toast.error(err.response?.data?.erroe);
        }

    };
    const fetchRight =async()=>{
        try
        {
           const res = await API.get("/right/");
           setRightData(res.data);
        }
        catch(err:any)
        {
            toast.error(err.response?.data?.erroe);
        }

    };
    useEffect(()=>{
       fetchRole();
       fetchRight();
    },[]);

    const handleSubmit = async(e:React.FormEvent)=>{
        e.preventDefault();
        try
        {
            const res = await API.post("/role/rights/",{
            role_id:role,
            permission_ids:right
            });
            toast.success(res.data.success);
            navigate("/profile", { state: { activeTab: "Role-Right" } });

        }
        catch(err:any)
        {

        }
    };
  return (
    <div >
     <form className='RR-form' onSubmit={handleSubmit}>
     <h2>Role & Righte</h2>
     <label>Role:</label>
     <div className="custom-dropdown-wrapper">
     <select name="Role_id" className="custom-dropdown" value={role} onChange={(e)=>setRole(Number(e.target.value))}>
          <option value="" >None</option>
         {roleData.map((r:any)=>(<option value={r[0]} key={r[0]}>{r[1]}</option>))}
     </select></div>


      <div className="form-group">
     <label >Right:</label>
     <div className="checkbox-list">
     {rightData.map((r:any)=>(
     <div key={r[0]}>
        <input type="checkbox" value={r[0]} checked ={right.includes(r[0])} 
        onChange={(e)=>{const r_id =Number(e.target.value);
        if(e.target.checked){setRight(prev => [...prev,r_id]);}
        else{setRight(prev=>prev.filter(id => id !== r_id));}
        }}/>
        {r[1]}
     </div>))}
     </div>
     </div>

     {/* <div className="custom-dropdown-wrapper">
     <select name="Right_id" className="custom-dropdown" value={right} onChange={(e)=>setRight(Number(e.target.value))}>
         {rightData.map((r:any)=>(<option value={r[0]} key={r[0]}>{r[1]}</option>))}
    </select></div>
     */}
    <button type='submit'>Submit</button>
    </form>
    </div>
  )
}

export default AddRoleRights
