import { useState } from 'react'
import '../style/forgot.css'
import API from '../Api/axios'
import { toast } from 'react-toastify'
import Loader from './Loader'
interface ForgotProps {
        onClose :() =>void;
    }

const Forgot = ({onClose}:ForgotProps) => {
    const [Email,setEmail] = useState("")
    const [Loading,setLoading] = useState(false)
    const handlesubmit = async()=>{
        setLoading(true)
        try 
        {
            const response = await API.post("/forgot/",{
            user_email :Email})
            console.log(response)
            toast.success(`${response.data.message}`)
        }
         catch(err:any)
         {
            console.log(err.response?.data?.error)
            toast.error(`${err.response?.data?.error}`)
         }
         finally{setLoading(false)}       
    }
  return (
    <div>
      {Loading && <Loader/>}
      <div className="forgot-wrapper">
      <h2 className="forgot-title">Forgot Password</h2>
        
      <div className="forgot-field">
      <label >Enter Mail :</label>
      <input type="email" value={Email} onChange={(e)=>setEmail(e.target.value)}/>
      </div>
       <div className="forgot-actions">
          <button onClick={()=>handlesubmit()} className="forgot-yes">YES</button>
          <button onClick={onClose} className="forgot-no">NO</button>
      </div>
      </div>
    </div>
  )
}

export default Forgot
