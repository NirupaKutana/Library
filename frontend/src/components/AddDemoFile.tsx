import React, { useEffect, useState } from 'react'
import '../style/AddDemoFile.css'
import { useForm } from 'react-hook-form'
import API from '../Api/axios'
import { useMutation, useQueryClient } from '@tanstack/react-query'
type form =
    {
        name :string,
        image:FileList,
        pdf:FileList
    };
export const SaveFile = async({data ,edit,id }:any) =>{
  const formData = new FormData();
  formData.append("file_name",data.name);
  if(data.image?.[0])
     formData.append("file_image",data.image[0]);
  if(data.pdf?.[0])
    formData.append("file_pdf",data.pdf[0]);
  if(edit){
    const res = await API.put(`/file/${id}/`,formData)
    return res.data
  }
  else{
      const res =await API.post('/file/',formData);
      return res.data
  }
}

const AddDemoFile = ({closeModel,file}:any) => {
    const queryClient = useQueryClient();
    const {register,handleSubmit,formState:{errors},reset,setValue} = useForm<form>();
    const edit = Boolean(file?.id);
    useEffect(()=>{
      if(file)
      {
        setValue("name",file.file_name);
        // setValue("image",file.file_image);
        // setValue("pdf",file.file_pdf);
      }
      else {reset()}
    },[file]);
    const mutation = useMutation({
      mutationFn : SaveFile,
      onSuccess : ()=>{queryClient.invalidateQueries({queryKey:["file"]})
                   reset()
                   closeModel()
                  //  window.location.reload();
                  }
    });
    const onSubmit =(data:form)=>{
        mutation.mutate({data,edit,id:file?.id})
    };
  return (
     <div className="demo-container">
    <div className="demo-card">
      <h2 >FILE LEARNING</h2>

      <form  onSubmit={handleSubmit(onSubmit)}>
        
      <label>File Name :</label>
      <input type="text" placeholder='Eneter name'
      {...register("name",{required:edit ? false :"Name is Required."})}/>
      {errors&& <p>{errors.name?.message}</p>}


     <label>File Image:</label>
     <input  className="demo-file" type='file' placeholder='Enter Image'
     {...register("image",{required:edit ? false :"Image Required.",
     minLength:{value:3,message:"min Length 3"}})}/>
     {errors&& <p>{errors.image?.message}</p>}


      <label>File Pdf:</label>
      <input className="demo-file" type='file' placeholder='Enter Pdf'
     {...register("pdf",{required:edit ? false :"pdf Required.",
     minLength:{value:3,message:"min Length 3"}})}/>
     {errors&& <p>{errors.pdf?.message}</p>}
     
     <button type='submit'>{mutation.isPending ? "Loading.." : "Submit"}</button>
     </form>
     </div>
    </div>
  )
}

export default AddDemoFile
