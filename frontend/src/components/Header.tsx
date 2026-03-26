import React from 'react'
import { NavLink } from 'react-router-dom';
import "../style/Header.css";
const Header = () => {
  return (
    <div>
    {localStorage.getItem("role")==="USER" &&(
      <>

      <header className="header">
      <div className="logo">📚 Library System</div>

      <nav className="nav">
        <NavLink to="/">Home</NavLink>
        <NavLink to="/books">Books</NavLink> 
        <NavLink to="/categories">Category</NavLink>        
        <NavLink to="/authors">Author</NavLink>        
        <NavLink to='/Uprofile'> profile </NavLink>

      </nav>
    </header>

    </>
    )}
    </div>
  )
}


export default Header
