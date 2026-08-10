import { useState,useEffect,useContext } from "react";
import AuthContext from "./authcontext";

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isauthenticated, setisauthenticated] = useState(() => {
     
  });
  const [loading, setloading] = useState(true);

  useEffect(() => {
    //checking whether the user already logged in
    const isAuth = localStorage.getItem("isuserauthenticated") === "true";
    const email = localStorage.getItem("user_email");
    const name = localStorage.getItem("user_name");

    if (isAuth && email) {
      setisauthenticated(true);
      setUser({ email, name: name || "User" });
    }
    setloading(false);
  }, []);

  const loginUser = (token, email, name = "User") => {
    localStorage.setItem("access_token", token);
    localStorage.setItem("isuserauthenticated", "true");
    localStorage.setItem("user_email", email);
    localStorage.setItem("user_name", name);

    setUser({ email, name });
    setisauthenticated(true);
  }

  const logoutUser = (() => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_email");
    localStorage.removeItem("user_name");
    localStorage.removeItem("isuserauthenticated");

    setUser(null);
    setisauthenticated(false);
  })
  return (
    <AuthContext.Provider
      value={{ user, isauthenticated, loginUser, logoutUser, loading }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
export default AuthProvider;
