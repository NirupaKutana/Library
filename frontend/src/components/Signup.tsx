import React, { useState } from 'react'
import '../style/Signup.css'
import API from '../Api/axios';
import { NavLink, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

const IconUser = () => (
  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
);
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
const IconAlert = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);

const Signup = () => {

  const [userdata, setUserData] = useState([]);
  const [name, setname]         = useState("");
  const [email, setemail]       = useState("");
  const [password, setpassword] = useState("");
  const [repass, setrepass]     = useState("");
  const [error, setError]       = useState("");
  const navigate = useNavigate();

  const validpass = (password: string) => {
    const relax = /^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,15}$/;
    return relax.test(password);
  };

  const signupAPI = async () => {
    axios.post(`http://127.0.0.1:8000/user/`, {
      user_name:     name,
      user_email:    email,
      user_password: password,
    }).then(res => {
      setUserData(res.data);
      toast.success(res.data.Detail);
    }).catch(err => console.log(err));
  };

  const handlesubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== repass) {
      setError("Passwords do not match");
      return;
    }
    if (!validpass(password)) {
      setError("Password must be 6–15 chars, include 1 uppercase & 1 special character");
      return;
    }
    setError("");
    try {
      const res = await signupAPI();
      localStorage.setItem("verify_email", email);
      navigate("/Verify");
    } catch (err) {
      console.log(err);
      setError("Sign Up failed. Please try again.");
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-card">

        {/* Header */}
        <div className="card-header">
          <span className="eyebrow">Join the Library</span>
          <h2>Create your account</h2>
          <p>Register to borrow books, track dues, and explore our catalogue.</p>
        </div>

        <form onSubmit={handlesubmit}>

          {/* Name */}
          <div className="field-group">
            <label>Full Name</label>
            <div className="input-wrapper">
              <span className="input-icon"><IconUser /></span>
              <input
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setname(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Email */}
          <div className="field-group">
            <label>Email Address</label>
            <div className="input-wrapper">
              <span className="input-icon"><IconMail /></span>
              <input
                type="email"
                placeholder="john@example.com"
                value={email}
                onChange={(e) => setemail(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Password row */}
          <div className="field-row">
            <div className="field-group">
              <label>Password</label>
              <div className="input-wrapper">
                <span className="input-icon"><IconLock /></span>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setpassword(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="field-group">
              <label>Confirm Password</label>
              <div className="input-wrapper">
                <span className="input-icon"><IconLock /></span>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={repass}
                  onChange={(e) => setrepass(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          {/* Error */}
          {error && (
            <p className="error-text">
              <IconAlert /> {error}
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="btn-signup"
            disabled={password !== repass}
          >
            Create Account
          </button>

        </form>

        {/* Login link */}
        <NavLink to="/login" className="login-link">
          <p>Already have an account? <span>Sign in →</span></p>
        </NavLink>

      </div>
    </div>
  );
};

export default Signup;