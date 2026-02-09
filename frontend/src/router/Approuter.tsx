import React from 'react'
import {Routes,Route} from 'react-router-dom'
import Header from '../components/Header'
import Home from '../components/Home'
import Books from '../components/Books'
import Category from '../components/Category'
import Author from '../components/Author'
import Addbook from '../components/Addbook'
import Addcategory from '../components/Addcategory'
import Addauthor from '../components/Addauthor'
import Profile from '../components/Profile'
import Signup from '../components/Signup'
import Cat_Page from '../components/Cat_Page'
import ImageFile from '../components/ImageFile'
import AddImage from '../components/AddImage'
import Login from '../components/Login'
import AdminRouter from '../components/AdminRouter'
import Unauthorized from '../components/Unauthorized'
import Forgot from '../components/Forgot'
import ResetPassword from '../components/ResetPassword'

const Approuter = () => {
  return (
    <div>
        
        <Routes>
            <Route path='' element={<> <Header/> <Home/><Cat_Page/></>}/>
            <Route path='/books' element={<> <Header/> <Books/> </>}/>
            <Route path='/books/addbook' element ={<><AdminRouter><Header/><Addbook/></AdminRouter></>} />

            <Route path='/categories' element={<><AdminRouter> <Header/> <Category/></AdminRouter></>}/>
            <Route path='/categories/addcategory' element={<><AdminRouter><Header/><Addcategory/></AdminRouter></>}/>

            <Route path='/authors' element={<> <Header/><AdminRouter> <Author/></AdminRouter> </>} />
            <Route path='/authors/addauthor' element={<><AdminRouter><Header/><Addauthor/></AdminRouter></>}/>

            <Route path='/profile' element={<><Header/> <Profile/></>}/>
            <Route path='/SignUp' element={<><Header/><Signup/></>}/>
            
            <Route path='/image' element={<><Header/><ImageFile/></>}/>
            <Route path='/image/addimage' element={<><AdminRouter><Header/><AddImage/></AdminRouter></>}/>

            <Route path='/login' element={<><Header/><Login/></>}></Route>
            {/* <Route path='/forgot' element={<><Forgot/></>}></Route> */}
            <Route path='/reset/:token' element={<><ResetPassword/></>}></Route>
 
            <Route path='/unauthorized' element={<Unauthorized/>}></Route>
            


        </Routes>
      
    </div>
  )
}


export default Approuter
