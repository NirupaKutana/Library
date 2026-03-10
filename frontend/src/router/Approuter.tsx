import React from 'react'
import {Routes,Route} from 'react-router-dom'
import Header from '../components/Header'
import Home from '../components/Home'
import Books from '../components/Books'
import Category from '../components/Category'
import Author from '../components/Author'
// import Addbook from '../components/Addbook'
// import Addcategory from '../components/Addcategory'
// import Addauthor from '../components/Addauthor'
import Profile from '../components/Profile'
import Signup from '../components/Signup'
import ImageFile from '../components/ImageFile'
// import AddImage from '../components/AddImage'
import Login from '../components/Login'
import AdminRouter from '../components/AdminRouter'
import Unauthorized from '../components/Unauthorized'
import ResetPassword from '../components/ResetPassword'
import IssueBook from '../components/IssueBook'
import Issue from '../components/Issue'
import Footer from '../components/Footer'
import ContactUs from '../components/ContactUs'
import ImgPage from '../components/ImgPage'
import Dashboard from '../components/Dashboard'
import Audit from '../components/Audit'
import LoginAudit from '../components/LoginAudit'
import UserList from '../components/UserList'
import VerifyEmail from '../components/VerifyEmail'
import SessionLock from '../components/SessionLock'


const Approuter = () => {
  return (
    <div>
        
        <Routes>
            <Route path='' element={<> <Header/> <Home/><ImgPage/><ContactUs/><Footer/></>}/>
            <Route path='/books' element={<> <Header/> <Books/><Footer/> </>}/>
            {/* <Route path='/profile/addbook' element ={<><AdminRouter><Header/><Addbook/></AdminRouter></>} /> */}
            
            <Route path='/issue' element={<><Header/><Issue/><Footer/></>}></Route>
            <Route path='/profile/issuebook' element={<><AdminRouter><IssueBook/></AdminRouter></>}></Route>
           
    
            <Route path='/categories' element={<><Header/> <Category/><Footer/></>}/>
            {/* <Route path='/profile/addcategory' element={<><AdminRouter><Addcategory/></AdminRouter></>}/> */}

            <Route path='/authors' element={<> <Header/><Author/><Footer/></>} />
            {/* <Route path='/profile/addauthor' element={<><AdminRouter><Addauthor/></AdminRouter></>}/> */}

            <Route path='/dashboard' element={<><Dashboard/></>}></Route>
            <Route path='/profile' element={<><Header/> <Profile/></>}/>
            <Route path='/SignUp' element={<><Header/><Signup/></>}/>
            <Route path='/Verify' element={<><Header/><VerifyEmail/></>}/>

            
            <Route path='/image' element={<><Header/><ImageFile/></>}/>
            {/* <Route path='/image/addimage' element={<><AdminRouter><Header/><AddImage/><Footer/></AdminRouter></>}/> */}
            <Route path='/image/page' element={<><ImgPage/></>}></Route>

            <Route path='/contact'element={<><ContactUs/></>}></Route>
            <Route path='/login' element={<><Header/><Login/><Footer/></>}></Route>
            {/* <Route path='/forgot' element={<><Forgot/></>}></Route> */}
            <Route path='/reset/:token' element={<><ResetPassword/></>}></Route>
  
            <Route path='/unauthorized' element={<Unauthorized/>}></Route>
            <Route path='/audit' element={<><Audit/></>}></Route>
            <Route path='/LoginAudit' element={<><LoginAudit/></>}></Route>
            <Route path='/users' element={<><UserList/></>}></Route>

            {/* <Route path='/Pagination' element={<><Pagination/></>}></Route> */}
            {/* <Route path='/session'element={<><SessionLock/></>}></Route> */}
        </Routes>
      
    </div>
  )
}


export default Approuter
