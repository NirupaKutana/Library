import React, { use, useEffect, useState } from 'react'
import '../style/Addbook.css'
import axios from 'axios'
import { NavLink } from 'react-router-dom'
import { useNavigate,useLocation } from 'react-router-dom'
import { toast } from 'react-toastify'

const Addbook = () => {
  const BASE_URl = "http://127.0.0.1:8000";
  const [name ,setname] =useState<string>("")
  const [cat,setcat] = useState<number>()
  const[auth,setauth] = useState<number>()
  const[page,setpage] = useState<number>()
  const[copy,setcopy]=useState<number>()
  const [up_by,setup_by]=useState<number>()
  const[reason,setreason]=useState<string>("")
  const navigate = useNavigate()
  const location = useLocation()
  const books = location.state
  const isEdit = Boolean(books)

  const[category,setCategory] = useState([])
  const[author,setauthor]=useState([])
  useEffect(()=>{
    axios.get(`${BASE_URl}/category/`)
    .then(res=>{
      setCategory(res.data)
    }).catch(err=>console.log(err))

  },[])

  useEffect(()=>{
    axios.get(`${BASE_URl}/author/`)
    .then(res=>{
        setauthor(res.data)
    }).catch(err=>console.log(err))
  },[])
  
  useEffect(()=>{
    if(books)
    {
     setname(books.name)
     setcat(books.c_id)
     setauth(books.a_id)
     setpage(books.page)
     setcopy(books.copy)
    }
  },[])

  const handlechange =async (e:React.FormEvent)=>
  {
    e.preventDefault()
    if(isEdit)
    {
        axios.put(`${BASE_URl}/book/update/${books.id}/`,{
          book_name:name,
          category_id :cat,
          author_id:auth,
          book_page:page,
          copies:copy,
          updated_by:up_by,
          update_reason:reason,

        }).then((res)=>{
          toast.success(res.data.success)
          navigate("/books")
        }).catch(err=>console.log(err))
    }
    else
      {
         try{
            const res = await axios.post(`${BASE_URl}/book/`,{
            book_name :name,
            category_id:cat,
            author_id :auth,
            book_page :page,
            copies :copy
            })
            toast.success(res.data.success)
              // .then(()=>{
              // alert("Bock Added..!")
            navigate("/books")
            // }).catch((error)=>{
            //   alert(error.response.data.error)
            // })
        }catch(error:any)
        {  
        
           console.log(error.res)
        }
      }
  }
  return (
    <div className="addbook-container">
      <form action="">
        <h3>{isEdit?"Update Book":"Book Details"}</h3>
        <label>Name :</label>
        <input type="text" placeholder='Bock Name' value={name} onChange={(e)=>setname(e.target.value)} />
         
        <label >Category:</label>
        <select name="course_id" value={cat} onChange={(e)=>setcat(Number(e.target.value))}>
          <option value="">--Select Category--</option>
            {category.map((c:any)=>(
              <option key={c[0]} value={c[0]}>{c[1]} </option>
            ))}
        </select>


        <label>Author:</label>
        <select name='author_id' value={auth} onChange={(e)=>setauth(Number(e.target.value))}>
          <option value="">--Select Author--</option>
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

        
        <NavLink to="/books"><button type='submit' onClick={handlechange}>{!isEdit?"Save Information":"Update Information"}</button></NavLink>
      </form>
    </div>
  )
}

export default Addbook
