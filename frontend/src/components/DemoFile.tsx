import React, { useEffect, useState } from 'react'
import '../style/DemoFile.css'
import AddDemoFile from './AddDemoFile'
import API from '../Api/axios'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import Loader from './Loader'
const MEDIA_URL = "http://127.0.0.1:8000/media"

export const getfile = async() =>{
   const res = await API.get(`/file/`);
   return res.data
}
export const deleteFile = async (id :Number) =>{
    const res = await API.delete(`/file/${id}/`);
    return res.data
}


const DemoFile = () => {
const [selected,setSelected] =useState<any>(null);
const [show,setShow]=useState(false);
const {data,isLoading,isError} = useQuery({
    queryKey : ["file"],
    queryFn : getfile
});

const queryClient  = useQueryClient();
const deleteMutation = useMutation({
    mutationFn : deleteFile,
    onSuccess : ()=>{queryClient.invalidateQueries({queryKey:["file"]})}
})
// useEffect (()=>{
// if(data){setData(data);
// }
// },[data]);
{if (isLoading) return <Loader></Loader> }
return (
   <>
   <div className="file-page">
    <div className="file-header">
        <h2 className="file-title">Files</h2>
        <button  className="add-file-btn" onClick={()=>setShow(true)}>Add File</button> 
    </div>
    <div className="table-wrapper">
    <table className="file-table">
        <thead>
            <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Image</th>
                <th>PDF</th>
                <th>Date</th>
                <th>Action</th>
            </tr>
        </thead>
        <tbody>{data.map((d:any,index:any)=>
           <tr key={index}>
                <td>{d[0]}</td>
                <td>{d[1]}</td>
                {/* <td>{d[2]}</td>
                <td>{d[3]}</td> */}
                <td><img src={`${MEDIA_URL}/${d[2]}`} alt="img" width="60" height="60"
                     style={{ objectFit: "cover", borderRadius: "6px" }}/></td>
                
                <td><a href={`${MEDIA_URL}/${d[3]}`} target="_blank" 
                rel="noopener noreferrer"> View PDF </a></td>

                <td>{new Date(d[4]).toLocaleDateString("en-GB",{day: "2-digit",month: "short",year: "numeric",})}</td>
                <td>
                <div className='file-act'>
                <button  onClick={()=>
                {setSelected({id:d[0],file_name:d[1],file_image:d[2],file_pdf:d[3]});setShow(true);}
                }>Update</button>        
                <button onClick={()=>deleteMutation.mutate(d[0])}>delete</button></div></td>
            </tr>
          )}    
        </tbody>
    </table></div>
   </div>
   {show &&(
    <>
    <div className='overlay'></div>
    <div className='filemodel'>
        <button className='modal-close' onClick={()=>setShow(false)}>&times;</button>
        <AddDemoFile file = {selected} 
        closeModel = {()=>setShow(false)}/>
    </div>
    </>
   )}
   </>
  )
}

export default DemoFile
