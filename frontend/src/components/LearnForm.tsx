import { error } from "console";
import { useForm } from "react-hook-form";
import "../style/LearnForm.css"
const LearnForm = () => {
 type FormData = {
    name:string,
    age : BigInt,
    email : string,
    password:string,
 };
  const {register,handleSubmit,formState:{errors}} = useForm<FormData>();
  const onSubmit = (data:any) =>{
     console.log("User Information :",data);
  };
  return (
    <div className="form-wrapper">
    <div className="form-card">
      <h2 className="form-title">User Registration</h2>
     <form onSubmit={handleSubmit(onSubmit)}>
      <label>Name: </label>
      <input placeholder="Enter Name" 
      {...register("name",{required:"Name Field Is Required.",
         minLength:{value:3,message:"Minmum length 3."}
      })}></input>{errors &&<p className="error-text">{errors.name?.message}</p>} <br /><br />
       
      <label>Age: </label>
      <input placeholder="Enter Age" {...register("age",{required:"Age Required.",
        // validate:age => (age >=18)  || ""
      })}/>{errors &&<p className="error-text">{errors.age?.message}</p>}  <br /><br />

     <label>Email: </label>
      <input placeholder="enter Email" {...register("email",{pattern:{
        value:/^\S+@\S+$/i,
        message:"Invalid Email"
      }})}/>{errors &&<p className="error-text">{errors.email?.message}</p>}  <br /><br />

       <label>Password: </label>
      <input placeholder="Password" {...register("password",{required:"password Must Required.",
        minLength:{value:6,message:"Min length 6."},
        maxLength:{value:15,message:"Max Length 10"},
        pattern :{value:/^\S+@\S+$/i ,message:"Password Should be Strong "}
      })}/>{errors &&<p className="error-text">{errors.password?.message}</p>}  <br /><br />
      <button type="submit" className="submit-btn" >Submit</button>
     </form>
     </div>
    </div>
  )
}

export default LearnForm
