import React, { useEffect, useState } from 'react'
import AddLibrarian from './AddLibrarian'
import '../style/Librarian.css'
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Loader from './Loader';
const Librarian = () => {
    const[Loading,setLoding]=useState(false)
    const [isshow,setIsShow]=useState<Boolean>(false);
    const[data,setData]=useState([]);
    const[selectedLibrarian,setselectedLibrarian]=useState<any>(null);
    const navigate = useNavigate();
    const fetchLibrarian =()=>{
      setLoding(true)
      axios.get("http://127.0.0.1:8000/register/librarian/")
      .then((res)=>{
        setData(res.data);
        navigate("/profile", { state: { activeTab: "Librarian" } });
      }).catch((err:any)=>{
         toast.error(err.response?.data?.error);
      })
      .finally(()=>{
        setLoding(false)
      })
   };
    useEffect(()=>{
      fetchLibrarian();
    },[]);
  const handleDelete = (id :number) =>{
      axios.delete(`http://127.0.0.1:8000/register/librarian/${id}/`)
      .then((res=>{
        toast.warning("Deleted..")
      }))
    }
  return (
    <>
    {Loading && <Loader/>}
    <div className="table-container">
      <h2>Librarian</h2>
      <button className='add-lib-btn' onClick={()=>{setIsShow(true);setselectedLibrarian(null);}}>+Add Librarian</button>
      <table>
        <thead>
          <tr>
            <td>Id</td>
            <td>Name</td>
            <td>Email</td>
            <td>Action</td>
          </tr>
        </thead>
        <tbody>
          {data.map((d:any)=>(
          <tr key={d[0]}>
            <td>{d[0]}</td>
            <td>{d[1]}</td>
            <td>{d[2]}</td>
            <td className='action-btn'><button className='up-btn' onClick={()=>{setIsShow(true);
              setselectedLibrarian({id:d[0],user_name:d[1],user_email:d[2]});
              }} >Update</button> 
            <button className='de-btn' onClick={()=>handleDelete(d[0])}>Delete</button></td>
          </tr>
          ))}
        </tbody>
      </table>
      <>
        {isshow&&(
          <>
          <div className='overlay'></div>
          <div className='modal'>
      
          <button className='modal-close' onClick={()=>setIsShow(false)}>&times;</button>
          <AddLibrarian 
          librarian={selectedLibrarian}
          onSuccess={() => {
             setIsShow(false);
             fetchLibrarian(); // reload data
          }}
          />
          </div>
          </>
        )}
        </>
    </div>
    </>
  )
}

export default Librarian
