import '../style/Home.css'
import ImgPage from './ImgPage';
import { NavLink } from 'react-router-dom';
import Slider from './Slider';
import { useState } from 'react';
import Books from './Books';
import Category from './Category';
import Author from './Author';
const Home = () => {
    const [activeTab, setActiveTab] = useState("books");
  return (
  <>
  {localStorage.getItem("role")!=="USER" &&
  <Slider/>}
 
  {/* ===== TWO SIDE LAYOUT ===== */}
      {localStorage.getItem("role")==="USER" &&(
      <div className="home-wrapper">
     
        {/* LEFT CARD */}
        <div className="tab-card">
           
          <span className="card-title">Library</span>

          <button
            className={activeTab === "books" ? "side-btn active" : "side-btn"}
            onClick={() => setActiveTab("books")}
          >
            📚 Books
          </button>

          <button
            className={activeTab === "category" ? "side-btn active" : "side-btn"}
            onClick={() => setActiveTab("category")}
          >
            🗂 Category
          </button>

          <button
            className={activeTab === "author" ? "side-btn active" : "side-btn"}
            onClick={() => setActiveTab("author")}
          >
            ✍ Author
          </button>

        </div>

        {/* RIGHT CONTENT */}
        <div className="content-card">
          {activeTab === "books" && <Books />}
          {activeTab === "category" && <Category />}
          {activeTab === "author" && <Author />}
        </div>
       
      </div>)}
       <ImgPage/>
  </>
 
  )
}

export default Home
