import React, { useState, useEffect, useContext } from "react";
import { Modal, Button } from "react-bootstrap";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTruck, faAward, faPersonWalkingArrowLoopLeft,
     faBell, faThumbsUp, faStar, faCartShopping, faMagnifyingGlass, faUser,
     faPhoneVolume
    } from "@fortawesome/free-solid-svg-icons";
import '../scss/login.scss'
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ResfulAPI from "../../../RouteAPI/ResfulAPI";
import { UserContext } from "../../../../Context/userContext";
import { jwtDecode } from "jwt-decode"; 
import { redirect } from "react-router-dom";
import ForgotPassword from "./fogetPassword";


const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.2 } },
    exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } },
};

const loginPartVariants = {
    hidden: { opacity: 0,  scale: 0.8, x: 120 },
    visible: { opacity: 1, x: 0, scale: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, x: 150,transition: { duration: 0.3 } },
};

const registerPartVariants = {
    hidden: {opacity: 0, x: -120 , scale: 0.8},
    visible: {opacity: 1, x: 0, scale: 1, transition: { duration: 0.3 }},
    exit: { opacity: 0, x: 150, scale: 0.8, transition: { duration: 0.3 } },
}

const LoginModal = ({ show, close }) => {
    const { user, login, logout } = useContext(UserContext);

    const userData = {
        EmailorPhonenumber: "",
        Password: "",
        Repassword: ""
    };
    const validValue = {
        Email: "normal_novalue",
        Password: "normal_novalue",
        Repassword: "normal_novalue"
    }
    const [isLogin, setIsLogin] = useState(true);
    const [loginpart, setLoginpart] = useState(userData)
    const [loginStatus, setloginStatus] = useState(validValue)
    const [isLoading, setIsLoading] = useState();

    useEffect(() => {
        const { EmailorPhonenumber, Password, Repassword } = loginpart;
        const updates = {};
    
        updates.Email = EmailorPhonenumber.length === 0
            ? "normal_novalue"
            : EmailorPhonenumber.length < 10
            ? "invalid_length"
            : "valid";
    
        updates.Password = Password.length === 0
            ? "normal_novalue"
            : Password.length < 6
            ? "invalid_length"
            : "valid";
    
        updates.Repassword = Repassword.length === 0
            ? "normal_novalue"
            : Repassword !== Password
            ? "invalid_norepeat"
            : "valid";
    
        setloginStatus((prev) => ({ ...prev, ...updates }));
    }, [loginpart]);

    const handleInputChange = (event, field) => {
        const value = event.target.value;
        setLoginpart(prev => ({ ...prev, [field]: value }));
       
    };

    useEffect(() => {
        if (!show) {
            setLoginpart(userData);
            setloginStatus(validValue);
        }
    }, [show]);
    
    const showToast = (id, message, type = "error") => {
        if (toast.isActive(id)) {
          toast.update(id, {
            render: message,
            type,
            containerId: "LOGIN",
            autoClose: 5000, 
            closeOnClick: true
          });
        } else {
          toast[type](message, {
            toastId: id,
            containerId: "LOGIN"
          });
        }
    };
      
    const testRegisterValue = () =>{
        try {
            if(!loginpart.EmailorPhonenumber){
                toast.error("Vui lòng nhập Email hoặc số điện thoại 🤷‍♂️")
                return
            }else if(loginStatus.Email === "invalid_length"){
                toast.error("Email hoặc số điện thoại tối thiểu 10 ký tự 🤏")
                return
            }
            if(!loginpart.Repassword){
                toast.error("Vui lòng nhập lại mật khẩu 🐝");
                return false;
              }else if(loginStatus.Repassword === "invalid_norepeat" || loginStatus.Repassword === "invalid_length"){
                toast.error("Nhập lại mật khẩu không khớp 😡");
                return false;
              }
            return true;
        } catch (error) {
            console.error(error)
            return
        }
    }

    const testLoginValue = () => {
        try {
          if (!loginpart.EmailorPhonenumber) {
            setloginStatus((prev) => ({ ...prev, Email: "normal_novalue" }));
            showToast("missing-email", "Please enter your email or phone number 🐝");
            return false;
          } else if (loginStatus.Email === "invalid_length") {
            showToast("short-email", "Email or phone number must be at least 10 characters 👌");
            return false;
          }
      
          if (!loginpart.Password) {
            showToast("missing-password", "Please enter your password 🐝");
            return false;
          } else if (loginpart.Password.length < 6) {
            showToast("short-password", "Password is too short 🐝");
            return false;
          }
      
          return true;
        } catch (error) {
          console.error(error);
          return false;
        }
      };
      
    
      

      const handleLogin = async () => {
        try {
          if (testLoginValue()) {
            setIsLoading(true);
            const response = await ResfulAPI.loginAPI(loginpart);
      
            if (response.status === 200) {
              const profile = await ResfulAPI.Getprofile(response.data.access_token);
              setIsLoading(false);
              if (!profile) {
                showToast("profile-error", "Cannot retrieve profile information!", "error");
                return;
              }
      
              showToast("login-success", "Login successful 🤓", "success");
      
              setTimeout(() => {
                login(profile.data, response.data.access_token);
              }, 100);
      
              close();
              return;
            }
          } else {
            setIsLoading(false);
            return;
          }
        } catch (error) {
          const status = error.response?.status;
      
          if (status === 401) {
            showToast("login-error", "Incorrect username or password 😾", "error");
            setIsLoading(false);
            return;
          }
          if (status === 403) {
            showToast("account-locked", "Account is locked, please contact admin 👌", "error");
            setIsLoading(false);
            return;
          }
          showToast("general-error", "An error occurred 🤏", "error");
          setIsLoading(false);
          return;
        }
      };
      
    
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            isLogin ? handleLogin() : handleRegister();
        }
    };
    
    const handleRegister = async () => {
        try {
            if (testRegisterValue()) {
                setIsLoading(true);
                const response = await ResfulAPI.Register(loginpart);
    
                if (response.status === 201) {
                    const successId = "register-success";
                    if (!toast.isActive(successId)) {
                        toast.success("Account created successfully ✅", {
                            containerId: "LOGIN",
                            toastId: successId,
                        });
                    }
                    setIsLogin(true);
                    setIsLoading(false);
                    return;
                }
    
                if (response.status === 400) {
                    const badRequestId = "register-bad-request";
                    if (!toast.isActive(badRequestId)) {
                        toast.error("Please fill out all required fields or check minimum length ⏺️", {
                            containerId: "LOGIN",
                            toastId: badRequestId,
                        });
                    }
                    setIsLoading(false);
                    return;
                }
    
                if (response.status === 409) {
                    const duplicateId = "register-duplicate";
                    if (!toast.isActive(duplicateId)) {
                        toast.error("Account already exists. Try a different one ⭐", {
                            containerId: "LOGIN",
                            toastId: duplicateId,
                        });
                    }
                    setIsLoading(false);
                    return;
                }
    
            } else {
                setIsLoading(false);
                return;
            }
        } catch (error) {
            console.error(error);
            const errorId = "register-server-error";
            if (!toast.isActive(errorId)) {
                toast.error("An unexpected error occurred. Please try again 😢", {
                    containerId: "LOGIN",
                    toastId: errorId,
                });
            }
            setIsLoading(false);
            return;
        }
    };
    
    const ModalDefault = {
        forGot: false
    }
    const [ModalState, setModalState] = useState(ModalDefault)
    const opentModal = (code) =>{
        if(code === "forgot"){
            setModalState(
                (prev)=>({...prev, forGot: true})
            )
            return;
        }
    }

    const closeModal = (code) =>{
        if(code === "forgot"){
            setModalState(
                (prev)=>({...prev, forGot: false})
            )
            return;
        }
    }

    // =================================================================================================================================//

    return (
        <Modal show={show} onHide={close} >
            <ForgotPassword show={ModalState.forGot} close={()=>closeModal("forgot")}/>
            <ToastContainer containerId={"LOGIN"}/>
            <motion.div
                key={"openModal"}
                variants={modalVariants}
                initial="hidden"
                animate={show ? "visible" : "hidden"}
                exit="exit"
            >
                <Modal.Body>
                    
                    <AnimatePresence exitBeforeEnter mode="wait">
                        <div className="login-body">
                            <div className="header-modal">
                                <div className="title">
                                    <p className="title_1">
                                    Sign in / Register
                                    </p>
                                    <p className="title_2">
                                    All data will be encrypted
                                    </p>
                                </div>
                                <div className="icon-header d-flex">
                                    <div className="icon_1">
                                        <div  className="icon">
                                        <FontAwesomeIcon icon={faTruck} className="bhr_01" size="2x"/>
                                        </div>
                                        <div className="text-group">
                                            <p className="pr_01">
                                                Free shipping
                                            </p>
                                            <p>
                                                on all orders
                                            </p>
                                        </div>
                                    
                                    </div>
                                    <div className="icon_2">
                                        <div className="icon">
                                        <FontAwesomeIcon icon={faPersonWalkingArrowLoopLeft} className="bhr_02" size="2x"/>
                                        </div>
                                        <div className="text-group">
                                            <p className="pr_02">
                                                Free Returns
                                            </p>
                                            <p>
                                                Up to 90days
                                            </p>
                                        </div>
                                    
                                    </div>
                                </div>
                            </div>
                            {isLogin ? (
                                <motion.div
                                    key="login"
                                    variants={loginPartVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                    style={{ position: 'absolute', width: '100%' }}
                                    >
                                <div className="input-values">
                                    <div className="d-flex form flex-column">
                                        <label className="lbf_email">Email or phone number</label>
                                        <input 
                                        type="text" onKeyDown={handleKeyDown}
                                        autoComplete="off" 
                                        value={loginpart.EmailorPhonenumber} 
                                        onChange={(event) => handleInputChange(event, "EmailorPhonenumber")}  
                                        className={`ipf_email_${loginStatus.Email}`} 
                                        />
                                        <label className="lbf_password">Password</label>
                                        <input 
                                        type="password" 
                                        autoComplete="new-password" 
                                        value={loginpart.Password}
                                        onKeyDown={handleKeyDown}
                                        onChange={(event) => handleInputChange(event, "Password")}  
                                        className={`ipf_password_${loginStatus.Password}`} 
                                        autoCapitalize="off"
                                        />
                                        <button onClick={handleLogin} style={{pointerEvents: isLoading ? "none" : "auto", opacity: isLoading ? 0.5 : 1}} className="btnf_login"> {isLoading ? "Loging..." : "Login"}</button>
                                        <div className="d-flex">
                                        <p style={{ width: "70%",cursor: "pointer",color: "blue", marginTop: "5px", fontSize: "15px"}} onClick={()=>setIsLogin(false)} className="register-link">You do not have an account?</p>
                                        <p onClick={()=>opentModal("forgot")} style={{ width: "35%",cursor: "pointer",color: "blue", marginTop: "5px", fontSize: "15px"}} className="register-link">Forget a password ?</p>                
                                        </div>
                                        </div>
                                </div>
                                </motion.div>
                            ): (
                                <motion.div
                                key="register"
                                variants={registerPartVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                style={{ position: 'absolute', width: '100%' }}
                                >
                                <div className="input-values">
                                    <div className="d-flex form flex-column">
                                        <label className="lbf_email">Email or phone number</label>
                                        <input 
                                        type="text" 
                                        autoComplete="off" 
                                        value={loginpart.EmailorPhonenumber}
                                        onKeyDown={handleKeyDown}
                                        onChange={(event) => handleInputChange(event, "EmailorPhonenumber")}  
                                        className={`ipf_email_${loginStatus.Email}`} 
                                        />
                                        <div className="d-flex">
                                            <label className="lbf_password">Password</label>
                                            <label style={{marginLeft: "36%"}} className="lbf_password">Confirm password</label>
                                        </div>
                                       
                                        <div className="d-flex">
                                            <input 
                                            type="password" 
                                            autoComplete="new-password" 
                                            value={loginpart.Password} 
                                            onKeyDown={handleKeyDown}
                                            onChange={(event) => handleInputChange(event, "Password")}  
                                            className={`ipf_password_${loginStatus.Password}`} 
                                            autoCapitalize="off"
                                            />
                                            <input
                                            style={{marginLeft: "25px"}}
                                            type="password" 
                                            autoComplete="new-password" 
                                            value={loginpart.Repassword} 
                                            onKeyDown={handleKeyDown}
                                            onChange={(event) => handleInputChange(event, "Repassword")}  
                                            className={`ipf_password_${loginStatus.Repassword}`} 
                                            autoCapitalize="off"/>
                                        </div>
                                        <button onClick={handleRegister} style={{pointerEvents: isLoading ? "none" : "auto", opacity: isLoading ? 0.5 : 1}} className="btnf_login">{isLoading ? "Registing..." : "Register"} </button>
                                        <div className="d-flex">
                                            <p style={{width: "55%",cursor: "pointer", color: "blue", marginTop: "5px"}} onClick={()=>setIsLogin(true)} className="register-link">You already have an account?</p>
                                            <p onClick={()=>opentModal("forgot")} style={{marginLeft: "12%", width: "34%",cursor: "pointer",color: "blue", marginTop: "6px", fontSize: "15px"}} className="register-link">Forget a password ?</p> 
                                        </div>
                                        </div>
                                </div>
                            </motion.div>
                            )}
                        </div>
                    </AnimatePresence>
                </Modal.Body>
            </motion.div>
        </Modal>
    );
};

export default LoginModal;
