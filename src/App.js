import {React, useContext, useEffect, useState} from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import ClientNav from "./Nav/clientNav/ClientNav";
import AdminNav from "./Nav/AdminNav/AdminNav";
import { UserContext } from "./Context/userContext";
import { useLocation } from "react-router-dom";
import ManagerNav from "./Nav/AdminNav/ManagerNav";

function App() {
  const { user, login, logout } = useContext(UserContext);
  const [userRole, setUserrole] = useState("Custumer")
  const location = useLocation(); 
  const hiddenRoutes = ["/User/UserProfile"]; 
  const showNavbar = !hiddenRoutes.includes(location.pathname);

  useEffect(() =>{
    if(user.Authen ? (setUserrole(user.data.role)) : (setUserrole("Custumer")));
  },[user])
  return (
    // <AdminNav />
    <div className="PublicRoutes">

      {(userRole === "Admin" || userRole === "Staff") && user.Authen ? (
          <ManagerNav />
        ) : (
          <ClientNav />
      )}
    </div>
    
  );
}

export default App;
