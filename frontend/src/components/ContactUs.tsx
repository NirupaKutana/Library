import React, { useState } from 'react'
import '../style/contactUs.css'
import { toast } from 'react-toastify'
import API from '../Api/axios'
const ContactUs = () => {
    const[name,setName] = useState("")
    const[email,setEmail] = useState("")
    const[msg ,setMsg] = useState("")

    const [contactData,setContactData]=useState([])
    const handleContact = async(e:React.FormEvent) =>{
        e.preventDefault()
        try
        {
           const res = await API.post("/contactUs/",{
            contact_name :name,
            contact_email:email,
            contact_msg:msg
           })
           toast.success(res.data.success)
        }
        catch(err:any)
        {
           toast.error(err.response?.data?.error)
        }

    }
  return (
    <section className="contact-section">
    <div className="contact-wrapper">

      {/* LEFT SIDE */}
      <div className="contact-left">
        <div className="left-content">
          <h2>Contact Us</h2>
          <p>
            Have questions? We'd love to hear from you.
            Send us a message and we’ll respond as soon as possible.
          </p>

          <div className="contact-info">
            <p><strong>Email:</strong> library@gmail.com</p>
            <p><strong>Phone:</strong> +91 9876543210</p>
            <p><strong>Address:</strong> 123 Library Street, India</p>
          </div>
        </div>
      </div>

        <div className="contact-right">
          <form onSubmit={handleContact}>
            <div className="form-group">
              <label>Name</label>
              <input type="text" value={name} onChange={(e)=>setName(e.target.value)} placeholder="Enter your name" />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Enter your email" />
            </div>

            <div className="form-group">
              <label>Message</label>
              <textarea value={msg} onChange={(e)=>setMsg(e.target.value)} placeholder="Write your message..." rows={4}></textarea>
            </div>

            <button type="submit" className="send-btn">
              Send Message
            </button>
          </form>
        </div>

      </div>
    </section>
    

  
  )
}

export default ContactUs
