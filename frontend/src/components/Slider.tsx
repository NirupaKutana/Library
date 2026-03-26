import React from 'react'
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { Link } from 'react-router-dom';
import '../style/Slider.css'
import 'swiper/css';
import "swiper/css/navigation";
import "swiper/css/pagination";
const Slider = () => {
  const isLogin = localStorage.getItem("access_token")
  return (
    <div>
        <div className='back'>
   <div className="hero">
      <Swiper modules={[Navigation, Pagination, Autoplay]} navigation pagination={{ clickable: true }}
        autoplay={{ delay: 4000 }} loop={true} className="mySwiper">
        <SwiperSlide>
          <div className="slide-bg"
            style={{backgroundImage:"url(https://images.unsplash.com/photo-1524995997946-a1c2e315a42f)",
            }}>
            <div className="overlay">
              <div className="hero-content">
                <h1>Library Management System</h1>
                <p className="hero-subtitle">
                  Organize, Manage & Explore Knowledge Efficiently
                </p>
                {!isLogin &&(
                <Link to="/login">
                  <button className="hero-btn">Login</button>
                </Link>
                )}
              </div>
            </div>
          </div>
        </SwiperSlide>

        <SwiperSlide>
          <div className="slide-bg"style={{backgroundImage:
                "url(https://images.unsplash.com/photo-1512820790803-83ca734da794)",
            }}>
            <div className="overlay">
            <div className="hero-content">
              <h1>Library Management System</h1>
              <p className="hero-subtitle">
                Organize, Manage & Explore Knowledge Efficiently
              </p>
              {!isLogin &&(
              <Link to="/login">
                <button className="hero-btn">Login</button>
              </Link>
              )}
            </div>
          </div>
          </div>
        </SwiperSlide>

        <SwiperSlide>
          <div className="slide-bg" style=
          {{ backgroundImage:"url(https://images.unsplash.com/photo-1495446815901-a7297e633e8d)",
            }}>
            <div className="overlay">
            <div className="hero-content">
              <h1>Library Management System</h1>
              <p className="hero-subtitle">
                Organize, Manage & Explore Knowledge Efficiently
              </p>
              
              {!isLogin &&(
              <>
              <Link to="/login">
                <button className="hero-btn">Login</button>
              </Link>
              </>
             )}
            </div>
          </div>
          </div>
        </SwiperSlide>
      </Swiper>
     
    </div>
  </div>
      
    </div>
  )
}

export default Slider
