import React, { useEffect, useState } from 'react'
import '../style/issuebook.css'
import API from '../Api/axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'


const IssueBook = ({onSuccess}:any) => {
const [user,setUser] = useState<number>()

const [selectedBooks, setSelectedBooks] = useState<number[]>([]);
const[issue,setIssue] = useState<Date | null>(null)
const [userdata,setUserdata] = useState([])
const[bookdata,setBookdata] = useState([])
const today: string = new Date().toISOString().slice(0, 10);
const navigate = useNavigate()


const fetchuser = async ()=>{
    const res = await API.get("/getusers/")
    try
    {
        setUserdata(res.data)

    }
    catch(err:any){toast.error(err.response?.data?.error);}
}

const fetbook = async ()=>{
    const res = await API.get("/book/")
    try
    {
        setBookdata(res.data)
    }
    catch(err:any){toast.error(err.response?.data?.error);}
}
useEffect(()=>{
  fetchuser();
  fetbook();
},[])

const handlesubmit = async(e:React.FormEvent)=>{
    e.preventDefault()
    
    try{
     const res = await API.post(`/issue/`,{
      user_id:user,
      book_ids: selectedBooks,
      issue_date:issue 
    })
        toast.success(res.data.success)
        console.log(res.data)
         navigate("/profile" ,{state : {activeTab : "issue"}})
         window.location.reload()
        onSuccess();
    }
    catch(err:any){
       console.log("Full error:", err);
       if(err.response && err.response.data)
       {toast.error(err.response.data.error || "Something went wrong");}
       else{toast.error("Server error. Please try again.");} 
    }

}

  return (  
    <div className="issue-container">
    
      <form className="issue-form" onSubmit={handlesubmit}>
        
        <h2>Issue Book</h2>
        
        <label>User : </label>
        <div className="custom-dropdown-wrapper">
            <select className="custom-dropdown" value={user} onChange={(e)=>{setUser(Number(e.target.value))}}>
                <option >None</option>
                {userdata.map((b:any)=>(
                <option key={b[0]} value={b[0]}>{b[1]}</option>
                ))}
            </select>
        </div>
      <div className="form-group">
        <label>Book Name : </label>
        <div className="checkbox-list">
          {bookdata.map((b: any) => (
            <div key={b[0]}>
               <input type="checkbox" value={b[0]} checked={selectedBooks.includes(b[0])}
                    onChange={(e) => {const bookId = Number(e.target.value);
                    if (e.target.checked) {setSelectedBooks(prev => [...prev, bookId]);} 
                    else {setSelectedBooks(prev =>prev.filter(id => id !== bookId));}
                }}/>
                {b[1]}
            </div>
          ))}
        </div>
        
      </div>

       <div className="form-group">
       <label>Issue Date  : </label>
       <input type="date" min={today}  max={today} value={issue? issue.toISOString().split('T')[0]: ''} onChange={(e)=>{setIssue(e.target.valueAsDate)}}/>
       </div>

      <button type="submit" className="submit-btn">Issue Book</button>
      </form>
    </div>
  )
}

export default IssueBook
