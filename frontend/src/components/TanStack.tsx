import {  useQuery } from '@tanstack/react-query';
import axios from 'axios'
import Loader from './Loader';
import API from '../Api/axios';


const fetchUsers = async () =>{
    const res = await API.get("/book/");
    return res.data
}

const TanStack = () => {
    const {data,isLoading,isError,error}:any = useQuery({
        queryKey:["users"],
        queryFn : fetchUsers,
        //  onSuccess:()=>{navigate("/profile",{state:{activeTab: "userr"}})}
    });
  if (isLoading) return <Loader></Loader> 
  // if (isError) return <p> {error.message}</p>
  return (
    <div>
      {data?.map((d:any)=>(
        <div key={d[0]}>
          <h2></h2>
          <span>{d[1]}    {d[2]}</span>
        </div>
      ))}
    </div>
  )
}

export default TanStack
