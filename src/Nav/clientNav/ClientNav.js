import { useState, useEffect, useContext } from "react";
import "./clientNav.scss";  
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
    faTruck, faAward, faPersonWalkingArrowLoopLeft, faBell, faThumbsUp, 
    faStar, faCartShopping, faMagnifyingGlass, faUser, faPhoneVolume 
} from "@fortawesome/free-solid-svg-icons";
import "bootstrap/dist/css/bootstrap.min.css";
import logo from '../../img/E house store logo.jpg';
import banner from '../../img/image.png';
import React from 'react';
import banner2 from '../../img/Screenshot 2025-03-05 222716.png';
import Footer from "../../Routes/ClientPages/Public Components/modal/footer";
import LoginModal from "../../Routes/ClientPages/Public Components/modal/login";
import { NavLink, useLocation } from "react-router-dom";
import PublicRoutes from "../../Routes/PublicRoutes";
import { UserContext } from "../../Context/userContext";
import UserProflie from "../../Routes/ClientPages/Public Components/userProfile";
import Support from "../../Routes/ClientPages/Public Components/modal/Support";
import { CartContext } from "../../Context/cartContext";


const ClientNav = () => {
    const [lastScrollY, setLastScrollY] = useState(0);
    const location = useLocation(); 
    const [hideHeader, setHideHeader] = useState(false);
    const defaultModal = {
        login: false,
        support: false
    }
    const { cart, AddCart, RemoveCart , fetchCart, RemoveItem } = useContext(CartContext);
    const [ModalUp, setModal] = useState(defaultModal);
    const { user, login, logout } = useContext(UserContext);
    const hiddenRoutes = ["/User/UserProfile"]; 
    const showNavbar = !hiddenRoutes.includes(location.pathname);

    const openModal = (code) => {
        if (code === "login") setModal(
            (prev) =>({...prev, login: true})
        );
        if (code === "support") setModal(
            (prev) =>({...prev, support: true})
        );
    };

    const closeModal = (code) => {
        if (code === "login") setModal(
            (prev) =>({...prev, login: false})
        );
        if (code === "support") setModal(
            (prev) =>({...prev, support: false})
        );
    };

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 100) {
                setHideHeader(window.scrollY > lastScrollY);
            } else {
                setHideHeader(false);
            }
            setLastScrollY(window.scrollY);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [lastScrollY]);

    return (
        <>
            <div className="NavContainer">

                        <div className={`Header ${hideHeader ? "hide-upHeader" : ""}`}>
                            <LoginModal show={ModalUp.login} close={() => closeModal("login")} />
                            <Support show={ModalUp.support} close={() => closeModal("support")}/>
                            {/* Up Header */}
                            <div className="upHeader row">
                                <div className="col-4 topic_1">
                                    <div className="d-flex align-items-center">
                                        <FontAwesomeIcon icon={faTruck} size="2x" color="#ADFFA2" className="me-3" />
                                        <div>
                                            <p className="p_1 mb-0">Free shipping on all orders</p>
                                            <p className="p_2">Limited-time offer</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-4 topic_2">
                                    <div className="icon_p2 d-flex align-items-center">
                                        <FontAwesomeIcon icon={faPersonWalkingArrowLoopLeft} size="2x" color="#ADFFA2" className="me-3" />
                                        <div>
                                            <p className="mb-0 p_3">Free returns</p>
                                            <p className="p_4">Up to 90 days*</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-4 topic_3">
                                    <div className="d-flex align-items-center">
                                        <FontAwesomeIcon icon={faAward} size="2x" color="#ADFFA2" className="me-3" />
                                        <div>
                                            <p className="mb-0 p_5">12-month warranty</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Up 2 Header */}
                            <div className="up2Header row">
                                <div className="col-5 tphd_01 d-flex align-items-center">
                                    <a href="/">
                                        <img className="lgo me-3" src={logo} alt="Logo" />
                                    </a>
                                    <div className="content-hd d-flex flex-column flex-md-row align-items-center">
                                        <div className="hd d-flex align-items-center me-3">
                                            <FontAwesomeIcon icon={faThumbsUp} size="2x" color="white" className="icon-hd-1 me-2" />
                                            <p className="ct-hd-1 mb-0">Best sellers</p>
                                        </div>
                                        <div className="hd d-flex align-items-center me-3">
                                            <FontAwesomeIcon icon={faStar} size="2x" color="white" className="icon-hd-2 me-2" />
                                            <p className="ct-hd-2 mb-0">5-Star Rated</p>
                                        </div>
                                        <div className="hd d-flex align-items-center">
                                            <FontAwesomeIcon icon={faCartShopping} size="2x" color="white" className="icon-hd-3 me-2" />
                                            <p className="ct-hd-3 mb-0">Mega sale</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-3 tphd_02">
                                    <input name="searching-text" className="searching-bar" placeholder="find something" />
                                    <FontAwesomeIcon icon={faMagnifyingGlass} size="2x" color="#ADFFA2" className="searching-icon me-3" />
                                </div>

                                <div className="col-4 tphd_03 row">
                                    <div className="login-part part-hover d-flex align-items-center">
                                        <FontAwesomeIcon icon={faUser} size="2x" color="white" className="icon-lg-3 me-2" />
                                        {user.Authen ? (
                                            <NavLink to={"/User/UserProfile"} style={{ textDecoration: 'none' }}>
                                                <div className="d-flex flex-column div01">
                                                    <p className="user-profile">{user.data.username}</p>
                                                </div>
                                            </NavLink>
                                        ) : (
                                            <div onClick={() => openModal("login")} className="d-flex flex-column">
                                                <p className="login-regis mb-0">Sign in / register</p>
                                                <p className="order mb-0">Orders & Account</p>
                                            </div>
                                        )}
                                    </div>
                                    <div onClick={() => openModal("support")} className="support-part part-hover d-flex align-items-center">
                                        <FontAwesomeIcon icon={faPhoneVolume} size="2x" color="white" className="me-2 support-icon" />
                                        <p className="mb-0 text-white support-text">Support</p>
                                    </div>

                                    <NavLink style={{textDecoration: "none"}} to="/production/cart" className="cart-part">
                                        <div className="part-hover d-flex">
                                            <FontAwesomeIcon icon={faCartShopping} size="2x" color="white" className="cart-icon me-2" />
                                            {user.Authen && (
                                                cart?.length === 0 ? (
                                                    <></>
                                                ) : (
                                                    <div className="cartSlots">
                                                        <p className="cartCount">
                                                            {cart?.length}
                                                        </p>
                                                    </div> 
                                                )
                                            )}
                                           
                                        </div>
                                    </NavLink>
                                </div>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="content">
                            <PublicRoutes />
                        </div>
                        {showNavbar && (
                        <footer>
                            <Footer />
                        </footer>
                        )}
                       
            </div>
                   
        </>
    );
};

export default ClientNav;
