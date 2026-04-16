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
import AddLibrarian from '../components/AddLibrarian'
import UserProfile from '../components/UserProfile'
import ProtectRouter from '../components/ProtectRouter'
import NotFound from '../components/NotFound'
import LearnForm from '../components/LearnForm'
import DemoFile from '../components/DemoFile'
const Approuter = () => {
  return (
    <div>
        
        <Routes>
            <Route path='' element={<> <Header/><Home/><ContactUs/><Footer/></>}/>

            <Route path='/books' element={<><ProtectRouter><Header/><Books/></ProtectRouter></>}/>
            {/* <Route path='/profile/addbook' element ={<><AdminRouter><Header/><Addbook/></AdminRouter></>} /> */}
            <Route path='/issue' element={<><ProtectRouter><AdminRouter permision="IssueBook"><Header/><Issue/></AdminRouter></ProtectRouter></>}></Route>
            <Route path='/profile/issuebook' element={<><AdminRouter permision="IssueBook"><IssueBook/></AdminRouter></>}></Route>
           
    
            <Route path='/categories' element={<><ProtectRouter><Header/><Category/></ProtectRouter></>}/>
            {/* <Route path='/profile/addcategory' element={<><AdminRouter><Addcategory/></AdminRouter></>}/> */}
            <Route path='/authors' element={<> <ProtectRouter><Header/><Author/></ProtectRouter></>} />
            {/* <Route path='/profile/addauthor' element={<><AdminRouter><Addauthor/></AdminRouter></>}/> */}
           
            <Route path='/image/page' element={<><ProtectRouter><ImgPage/></ProtectRouter></>}></Route>
            <Route path='/contact'element={<><ProtectRouter><ContactUs/></ProtectRouter></>}></Route>

            <Route path='/image' element={<><AdminRouter permision={"AddImage"}><Header/><ImageFile/></AdminRouter></>}/>
            {/* <Route path='/image/addimage' element={<><AdminRouter><Header/><AddImage/><Footer/></AdminRouter></>}/> */}

            <Route path='/dashboard' element={<><Dashboard/></>}></Route>
            <Route path='/profile' element={<><ProtectRouter><Profile/></ProtectRouter></>}/>
            <Route path='Uprofile' element={<><ProtectRouter><UserProfile/></ProtectRouter></>}></Route>
            <Route path='/SignUp' element={<><Header/><Signup/></>}/>
            <Route path='/login' element={<><Header/><Login/></>}></Route>
            <Route path='/reset/:token' element={<><ResetPassword/></>}></Route>
            <Route path='/Verify' element={<><Header/><VerifyEmail/></>}/>

            <Route path='/audit' element={<><AdminRouter permision={"ViewAudit"}><Audit/></AdminRouter></>}></Route>
            <Route path='/LoginAudit' element={<><AdminRouter permision={"ViewLoginAudit"}><LoginAudit/></AdminRouter></>}></Route>
            <Route path='/users' element={<><AdminRouter permision={"ViewUsers"}><UserList/></AdminRouter></>}></Route>
            <Route path='/add' element={<><AddLibrarian/></>}></Route>
            
            <Route path='/unauthorized' element={<Unauthorized/>}></Route>
            <Route path='*' element={<NotFound />} />
            <Route path='/learnUseForm' element={<LearnForm/>}></Route>
            <Route path='/demofile' element={<DemoFile/>}></Route>

        </Routes>
      
    </div>
  )
}


export default Approuter
