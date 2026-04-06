import { useState } from 'react'
import '../style/reset.css'
import { toast } from 'react-toastify'
import API from '../Api/axios'
import { useParams } from 'react-router-dom'
import Loader from './Loader'
const ResetPassword = () => {
    const[Password,setPassword] =useState("")
    const {token} = useParams()
    const [Loading,setLoading] = useState(false)
    const handlesubmit = async() =>
    {
        try
        {
               const response = await API.post("/reset/",{
                token :token,
                user_password : Password 
               });
               toast.success(response.data.message)
        }
        catch(err : any)
        {
            toast.error(`${err.response?.data?.error}`)
        }
        finally{setLoading(false)}
    }
  return (
    <>
    {Loading && <Loader/>}
    <div className="reset-page">
        <div className='reset-card'>
            <h2>Reset Password</h2>
            <div className="reset-field">
                <label >Enter New Password :</label>
                <input type="email" value={Password} onChange={(e)=>setPassword(e.target.value)}/>
            </div>
            <button className="reset-btn" onClick={()=>handlesubmit()}>Update Password</button>
       </div>
    </div>
   </>
  )
}

export default ResetPassword
