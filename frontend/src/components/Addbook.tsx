import React, { use, useEffect, useState } from 'react'
import '../style/Addbook.css'
import axios from 'axios'
import { NavLink } from 'react-router-dom'
import { useNavigate,useLocation } from 'react-router-dom'
import { toast } from 'react-toastify'
import API from '../Api/axios'
const Addbook = ({book,onSuccess}:any) => {
  const BASE_URL = "http://127.0.0.1:8000";
  const [name ,setname] =useState<string>("")
  const [cat,setcat] = useState<number >()
  const[auth,setauth] = useState<number>()
  const[page,setpage] = useState<number>()
  const[copy,setcopy]=useState<number>()
  const [up_by,setup_by]=useState<number>()
  const[reason,setreason]=useState<string>("")
  const navigate = useNavigate()
  // const location = useLocation()
  const isEdit = Boolean(book)
  const[category,setCategory] = useState([])
  const[author,setauthor]=useState([])
  useEffect(()=>{
    API.get(`/category/`)
    .then(res=>{
      setCategory(res.data)
    }).catch(err=>console.log(err))

  },[])

  useEffect(()=>{
    API.get(`/author/`)
    .then(res=>{
        setauthor(res.data)
    }).catch(err=>console.log(err))
  },[])
  
  useEffect(()=>{
    if(book)
    {
     setname(book.name)
     setcat(book.c_id)
     setauth(book.a_id)
     setpage(book.page)
     setcopy(book.copy)
    }
  },[book])

  const handlechange =async (e:React.FormEvent)=>
  {
    e.preventDefault()
    if(isEdit)
    {
        API.put(`/book/update/${book.id}/`,{
          book_name:name,
          category_id :cat,
          author_id:auth,
          book_page:page,
          copies:copy,
          updated_by:up_by,
          update_reason:reason,

        }).then((res)=>{
          toast.success(res.data.success)
          navigate("/profile", { state: { activeTab: "Book" } })
        }).catch((err:any)=>{
          toast.error(err.response?.data?.error)
        })
    }
    else
      {
         try{
            const res = await API.post(`/book/`,{
            book_name :name,
            category_id:cat,
            author_id :auth,
            book_page :page,
            copies :copy
            })
            toast.success(res.data.success)
            navigate("/profile", { state: { activeTab: "Book" } })
           
            
        }catch(error:any)
        {  
          //  console.log("full error",error.response)
          //  toast.error(error.response?.data?.error)
          const errors = error.response?.data;
          if(errors){
                Object.entries(errors).forEach(([field, messages]: any) => {
                toast.error(`${field}: ${messages[0]}`);
                });
              }
        }
      }
      onSuccess()
  }
  return (
    <div className="addbook-container">
      <form onSubmit={handlechange}>
        <h3>{isEdit?"Update Book":"Book Details"}</h3>
       
        <label>Name :</label>
        <input type="text" placeholder='Bock Name' value={name} onChange={(e)=>setname(e.target.value)} />
        
         
       
       
        <label >Category:</label>
        <select name="course_id" value={cat} onChange={(e)=>setcat(Number(e.target.value))}>
          <option value="">Select Category</option>
            {category.map((c:any)=>(
              <option key={c[0]} value={c[0]}>{c[1]} </option>
            ))}
        </select>
        
         
        <label>Author:</label>
        <select name='author_id' value={auth} onChange={(e)=>setauth(Number(e.target.value))}>
          <option value="">Select Author</option>
           {author.map((a:any)=>(
            <option key={a[0]} value={a[0]}>{a[1]}</option>
           ))}
        </select>
        
          
        <label>Book Page:</label>
        <input type="number" min={0} placeholder='book page' value={page} onChange={(e)=>setpage(e.target.valueAsNumber)}/>
         
         
        <label >Copies:</label>
        <input type="number" placeholder='Copies'value={copy} onChange={(e)=>setcopy(e.target.valueAsNumber)} />
        
        {isEdit &&(
          <>
          <label>Updated_By:</label>
          <input type="number" value={up_by} onChange={(e)=>setup_by(e.target.valueAsNumber)}/>
          <label>Update Reason:</label>
          <input type="text"  value={reason} onChange={(e)=>setreason(e.target.value)}/>
          </>
        )}

        
        <button type='submit'>{!isEdit?"Save Information":"Update Information"}</button>
      </form>
    </div>
  )
}

export default Addbook
