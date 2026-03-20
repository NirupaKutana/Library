
import { Navigate } from 'react-router-dom';
import { hasPermission } from './RBAC';

const AdminRouter = ({permision,children}) => {
    const role = localStorage.getItem("role");
    if (!hasPermission(permision)){
        return <Navigate to={"/unauthorized"} replace/>
    }
  return children
    
}

export default AdminRouter
