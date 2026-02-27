import React from "react";
import "../style/footer.css";
import { NavLink } from "react-router-dom";

const Footer = () => {
   const islogin =localStorage.getItem("access_token")
   
  return (
    <div>
    {islogin && (
    <footer className="footer">

      {/* Top CTA Section */}
      <div className="footer-cta">
        <h2>Let’s Explore Knowledge Together</h2>
        <NavLink to='/'><button className="footer-btn">Contact Us</button></NavLink>
      </div>

      {/* Main Footer Content */}
      <div className="footer-main">

        <div className="footer-column brand">
          <h3>Library System</h3>
          <p>Smart Library Management System</p>
          <p>Manage Books • Issue & Return • Track Records</p>
        </div>

        <div className="footer-column">
          <h4>Books</h4>
          <ul>
            <NavLink to ='/books'><li>All Books</li></NavLink>
             <NavLink to ='/Categories'><li>Categories</li></NavLink>
             <NavLink to ='/authors'><li>Authors</li></NavLink>
             <NavLink to ='/books'><li>New Arrivals</li></NavLink>
          </ul>
        </div>

        <div className="footer-column">
          <h4>Quick Links</h4>
          <ul>
          
            {localStorage.getItem("role")==="ADMIN" &&(
            <li>Dashboard</li>
            )}
            <NavLink to ='/profile'><li>Issue Book</li></NavLink>
            <NavLink to ='/profile'><li>Return Book</li></NavLink>
            <NavLink to ='/profile'><li>Profile</li></NavLink>
          </ul>
        </div>

        <div className="footer-column">
          <h4>Support</h4>
          <ul>
            <li>Help Center</li>
            <NavLink to ='/'><li>Contact</li></NavLink>
            <li>Privacy Policy</li>
            <li>Terms</li>
          </ul>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        © 2026 Library Management System. All rights reserved.
      </div>

    </footer>
    )}

    
   {!islogin &&(
    <footer className="footer">

      {/* Top CTA Section */}
      <div className="footer-cta">
        <h2>Let’s Explore Knowledge Together</h2>
        <NavLink to='/'><button className="footer-btn">Contact Us</button></NavLink>
      </div>

      {/* Main Footer Content */}
      <div className="footer-main">

        <div className="footer-column brand">
          <h3>Library System</h3>
          <p>Smart Library Management System</p>
          <p>Manage Books • Issue & Return • Track Records</p>
        </div>

        <div className="footer-column">
          <h4>Books</h4>
          <ul>
           <li>All Books</li>
             <li>Categories</li>
             <li>Authors</li>
            <li>New Arrivals</li>
          </ul>
        </div>

        <div className="footer-column">
          <h4>Quick Links</h4>
          <ul>
          
            <li>Issue Book</li>
            <li>Return Book</li>
            <li>Profile</li>
          </ul>
        </div>

        <div className="footer-column">
          <h4>Support</h4>
          <ul>
            <li>Help Center</li>
            <NavLink to ='/'><li>Contact</li></NavLink>
            <li>Privacy Policy</li>
            <li>Terms</li>
          </ul>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        © 2026 Library Management System. All rights reserved.
      </div>

    </footer>
    )}
    </div>
    
  );
};

export default Footer;
