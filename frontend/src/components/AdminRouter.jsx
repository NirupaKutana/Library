
import { Navigate } from 'react-router-dom';

const AdminRouter = ({children}) => {
    const role = localStorage.getItem("role");
    if (role!='ADMIN'){
        return <Navigate to={"/unauthorized"} replace/>
    }
  return children
    
}

export default AdminRouter
