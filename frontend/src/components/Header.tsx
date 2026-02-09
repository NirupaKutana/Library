import React from 'react'
import { NavLink } from 'react-router-dom';
import "../style/Header.css";
const Header = () => {
  return (
    <div>
      <header className="header">
      <div className="logo">📚 Library System</div>

      <nav className="nav">
        <NavLink to="/">Home</NavLink>
        <NavLink to="/image">Gallery</NavLink>
        <NavLink to="/books">Books</NavLink>
        
        {localStorage.getItem("role")==="ADMIN" && (
        <>
        <NavLink to="/categories">Category</NavLink>
        <NavLink to="/authors">Author</NavLink></>
        )}
        
        <NavLink to="/login">Login</NavLink> 
        <NavLink to='/profile'> profile </NavLink>

      </nav>
    </header>
    </div>
  )
}


export default Header
