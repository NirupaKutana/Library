import React, { useState } from 'react'
import '../style/Login.css'
import { NavLink, useNavigate } from 'react-router-dom'
import API from '../Api/axios'
import { toast } from 'react-toastify'
import Forgot from './Forgot'
import axios from 'axios'

const IconMail = () => (
  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
  </svg>
);
const IconLock = () => (
  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);

const Login = () => {

  const [isshow, setIsshow]     = useState<Boolean>(false)
  const [email, setEmail]       = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await axios.post("http://127.0.0.1:8000/login/", {
        user_email:    email,
        user_password: password,
      })
      toast.success(response.data.message)
      if (response.data.access_token) {
        localStorage.setItem("access_token",  response.data.access_token)
        localStorage.setItem("refresh_token", response.data.refresh_token)
        localStorage.setItem("role",          response.data.user.roles)
        localStorage.setItem("permissions",   JSON.stringify(response.data.user.permissions))
        localStorage.setItem("user",          JSON.stringify(response.data.user))
        { localStorage.getItem("role") === "ADMIN"     && navigate("/profile") }
        { localStorage.getItem("role") === "LIBRARIAN" && navigate("/profile") }
        { localStorage.getItem("role") === "USER"      && navigate("/") }
      }
    } catch (error: any) {
      toast.error(`${error.response?.data?.error}`)
    }
  }

  return (
    <>
      <div className={isshow ? "book-container dimmed" : ""}>
        <div className="login-page">
          <div className="login-card">

            {/* Header */}
            <div className="card-header">
              <span className="eyebrow">Welcome Back</span>
              <h2>Sign in to Library</h2>
              <p>Access your account to borrow books and manage your reads.</p>
            </div>

            <form onSubmit={handleLogin}>

              {/* Email */}
              <div className="field-group">
                <label>Email Address</label>
                <div className="input-wrapper">
                  <span className="input-icon"><IconMail /></span>
                  <input
                    type="email"
                    placeholder="john@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="field-group">
                <label>Password</label>
                <div className="input-wrapper">
                  <span className="input-icon"><IconLock /></span>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Forgot */}
              <div className="forgot-link-wrapper">
                <span className="forgot-link" onClick={() => setIsshow(true)}>
                  Forgot Password?
                </span>
              </div>

              {/* Submit */}
              <button type="submit" className="btn-login">
                Sign In
              </button>

            </form>

            {/* Signup link */}
            <NavLink to="/SignUp" className="signup-link">
              <p>Don't have an account? <span>Register →</span></p>
            </NavLink>

          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {isshow && (
        <>
          <div className="overlay"></div>
          <div className="modal-container">
            <button className="modal-close" onClick={() => setIsshow(false)}>&times;</button>
            <Forgot onClose={() => setIsshow(false)} />
          </div>
        </>
      )}
    </>
  )
}

export default Login