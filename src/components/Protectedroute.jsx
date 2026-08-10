import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/authprovider';
const ProtectedRoute = ({children}) => {
  const isAuthorised = useAuth();

  if (isAuthorised) {
    return children
  } else {
    return <Navigate to="/login" replace />
  }
} 
export default ProtectedRoute;  
