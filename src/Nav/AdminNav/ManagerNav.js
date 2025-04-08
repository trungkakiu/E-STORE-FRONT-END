
import "../../Routes/AdminPages/Scss/ManagerNav.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBeerMugEmpty, faBell, faClipboard, faClipboardUser, faDumbbell, faGear, faHome, faRightFromBracket, faRocket, faTruck, faUser, faUsers } from "@fortawesome/free-solid-svg-icons";
import "bootstrap/dist/css/bootstrap.min.css";
import {React, use, useContext, useState} from 'react';
import { UserContext } from "../../Context/userContext";
import { NavLink } from "react-router-dom";
import ManagerRoutes from "../../Routes/AdminPages/Routes/ManagerRoutes";
import { useLocation } from "react-router-dom";
import AdminNav from "./AdminNav";
import StaffNav from './StaffNav'

const ManagerNav = () =>{
    const { user, login, logout } = useContext(UserContext);
    const hiddenRoutes = ["/Admin/Product/AddProduct","/Admin/UserManagement","/Admin/StaffManagement", "/Admin/Detail-Product"]; 
    const location = useLocation(); 
    const DisShowNavbar = hiddenRoutes.includes(location.pathname);

    
    return(
        <div className="Admin">
            <div className="container d-flex">
                {(user.Authen && user.data.role === "Admin") && (
                    <AdminNav/>
                )}
                {(user.Authen && user.data.role === "Staff") && (
                    <StaffNav/>
                )}
                <div className="content-center">
                    {DisShowNavbar ? (<>
                    </>):(
                        <div className="header d-flex">
                            <div className="alert">
                                <FontAwesomeIcon icon={faBell} className="ic5"/>
                            </div>  
                            <div className="adminAC d-flex">
                                <p className="p9">{user.data.username}</p>
                                <div className="adminAvatar">
                                <FontAwesomeIcon icon={faUser} className="ic6"/>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    <div className="contents">
                        <ManagerRoutes/>
                    </div>
                </div>
            </div>
        </div>
       
    )
}

export default ManagerNav;