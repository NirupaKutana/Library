import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom';
import "../style/Header.css";

const Header = () => {
  const navigate = useNavigate(); 
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
        <NavLink to='/Uprofile'> profile </NavLink>
        <button className='btn-logout'><img className='imgg' src="\Image\image.png" onClick={logout}/></button>
      </nav>
    </header>

    </>
    )}
    </div>
  )
}


export default Header
