import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom';
import "../style/Header.css";
import Notification from './Notification';

const Header = () => {
  const navigate = useNavigate(); 
  const [showNotifications, setShowNotifications] = useState(false);

  const logout = () =>{
     localStorage.clear();
     window.location.reload()
     navigate("/");
   }
  return (
    <div>
    {localStorage.getItem("role")==="USER" &&(
      <>

      <header className="header">
      <div className="logo">📚 Library System</div>

      <nav className="nav">
       
        <NavLink to="/">Home</NavLink>
        {/* <NavLink to="/books">Books</NavLink> 
        <NavLink to="/categories">Category</NavLink>        
        <NavLink to="/authors">Author</NavLink>         */}

        <div className="nav-actions">
          <NavLink to="/" title="Wishlist" className="icon-link">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </NavLink>

          <div 
            title="Notifications" 
            className={`icon-link notification-link ${showNotifications ? 'active' : ''}`}
            onClick={() => setShowNotifications(!showNotifications)}
            style={{ cursor: 'pointer' }}
          >
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="dot"></span>
          </div>

          <span className="nav-divider"></span>

          <NavLink to='/Uprofile'>Profile</NavLink>
          <button className='btn-logout'><img className='imgg' src="\Image\image.png" onClick={logout} alt="logout"/></button>
        </div>
      </nav>
    </header>
    
    {showNotifications && <Notification onClose={() => setShowNotifications(false)} />}
    </>
    )}
    </div>
  )
}

export default Header
