import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({children}) => {
  const isAuthorised = localStorage.getItem("isuserauthenticated")==="true";

  if (isAuthorised) {
    return children
  } else {
    return <Navigate to="/login" replace />
  }
} 
export default ProtectedRoute;  
