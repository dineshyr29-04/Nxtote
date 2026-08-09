import { useState } from "react";
import AuthContext from "./authcontext";

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  return (
    <AuthContext.Provider value={{user,setUser}}>{children}</AuthContext.Provider>
  )
}

export default AuthProvider;
