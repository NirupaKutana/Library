import { useEffect, useState } from 'react'
import '../style/EditUser.css'
import API from '../Api/axios'
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
export const handleChange = async({id,name}:any) =>{
    const res = await API.put(`/user/${id}/`,{user_name:name});
    return res.data 
}
const EditUser = ({user}:any) => {
    const [name,setName] = useState("");
    useEffect(()=>{
     if(user)
     {
        setName(user.name);
     }
    },[user]);
const EditMutation = useMutation({
    mutationFn:handleChange,
    onSuccess :(data)=>{toast.success(data.success);window.location.reload()},
    onError:()=>{toast.error("Somthing Wrong")}
})
const id = user?.id
  return (
    <div className="edit-user-container">
    <form onSubmit={(e)=>{e.preventDefault();EditMutation.mutate({id,name});}}>

      <div className="form-group">
        <label>Name:</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)}/>
      </div>

      <button className="save-btn" type="submit" >SAVE</button>
       </form>
    </div>
  )
}

export default EditUser
