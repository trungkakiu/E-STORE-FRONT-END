import React, { useState, useEffect, useContext } from "react";
import { Modal, Button } from "react-bootstrap";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTruck, faAward, faPersonWalkingArrowLoopLeft,
     faBell, faThumbsUp, faStar, faCartShopping, faMagnifyingGlass, faUser,
     faPhoneVolume
    } from "@fortawesome/free-solid-svg-icons";
import '../scss/ChangeEmail.scss'
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ResfulAPI from "../../../RouteAPI/ResfulAPI";
import {UserContext} from '../../../../Context/userContext'


const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.2 } },
    exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } },
};

const State1 = {
    hidden: { opacity: 0, x: 150 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, x: -150, transition: { duration: 0.3 } },
};

const State2 = {
    hidden: { opacity: 0, x: 150 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, x: -150, transition: { duration: 0.3 } },
};


const ChangeEmail = ({ show, close }) => {
    const defaultState = {
        state1: true,
        state2: false,
    }
    const LineDefault = { 
        state1: "LineActive",
        state2: "LineOff",
    }
    const UserData = {
        Email: "",
        OTP: "",
    }
    const [isLoad, setIsLoad] = useState(false);
    const [UserInput, setUserInput] = useState(UserData);
    const [state, setState] = useState(defaultState);
    const [stateLine, setStateLine] = useState(LineDefault)
    const {user} = useContext(UserContext)

    const SendEmail = async() =>{
        try {
            if(
                !UserInput.Email
            ){
                toast.warning("Please enter your email! 😾", {containerId: "top-right"})
                return;
            }
            if(UserInput.Email === user.data.email){
                toast.warning("You have already linked this Email! 😡", {containerId: "top-right"})
                return;
            }
            setIsLoad(true);
            const respone = await ResfulAPI.SendOTPchangeEmail(UserInput.Email, user.token);
            if(respone.status === 200){
                setState(
                    (prev)=>({...prev, state1: false, state2: true})
                )
                setStateLine(
                    (prev) =>({...prev, state1: "LineOn", state2: "LineActive"})
                )
                setIsLoad(false);
            }
            if(respone.status === 400){
                toast.warning("This email is already associated with another account 💀" , {containerId: "top-right"})
                setIsLoad(false);
                return;
            }
        } catch (error) {
            toast.warning("There was an error trying to send the OTP code. 🤓" , {containerId: "top-right"})
            console.error(error);
            return;
        }
    }

    const NextStep = ()=>{
        if(!UserInput.Email){
            toast.warning("Please enter the Email that received your OTP code ! 🫥" , {containerId: "top-right"})
            return;
        }
        setState(
            (prev)=>({...prev, state1: false, state2: true})
        )
        setStateLine(
            (prev) =>({...prev, state1: "LineOn", state2: "LineActive"})
        )
    }

    const PrevStep = () =>{
        setState(
            (prev)=>({...prev, state1: true, state2: false})
        )
        setStateLine(
            (prev) =>({...prev, state1: "LineActive", state2: "LineOff"})
        )
    }
    const ComfirmChange = async() =>{
        try {
            if(!UserInput.OTP){
                toast.warning("Please enter OTP !" , {containerId: "top-right"})
                return;
            }
            setIsLoad(true);
            const respone = await ResfulAPI.ComfirmChange(UserInput.OTP, UserInput.Email, user.token);
            if(respone.status === 200){
                toast.success("Email changed successfully !" , {containerId: "top-right"})
                setStateLine(
                    (prev) =>({...prev, state2: "LineOn"})
                )
                setTimeout(()=>{
                    setIsLoad(false);
                    setUserInput(UserData);
                    setStateLine(LineDefault);
                    close();
                }, 1500)
                setIsLoad(false);
                return;
            }
            if(respone.status === 400){
                toast.warning("OTP is incorrect or expired", {containerId: "top-right"})
                setIsLoad(false);
            }
        } catch (error) {
            setIsLoad(false);
            console.error(error);
            return;
        }
    }
    
    //===================================================================================================================================//
   
   
    return (
        <Modal style={{paddingTop: "4%"}} show={show} onHide={close} animation={false}>
            <motion.div
                variants={modalVariants}
                initial="hidden"
                animate={show ? "visible" : "hidden"}
                exit="exit"
            >
                <Modal.Body style={{height: "300px"}} >
                    <ToastContainer containerId="top-right"/>
                    <div className="ChangeEmail-container">
                        <div className="ChangeHeader">
                            <div className="pgHead">
                                <p>
                                    Change Email
                                </p>
                            </div>
                            <div className="d-flex stateLine">
                                {
                                    stateLine.state1 !== "LineOn" ? (
                                        <>
                                        <div className={stateLine.state1 ? `${stateLine.state1}` : "LineOff"} style={{borderTopRightRadius: "0px", borderBottomRightRadius: "0px"}}>
                                            <p>
                                                Email
                                            </p>
                                        </div>
                                            
                                        </>
                                    ) : (
                                        <>
                                        <div className={stateLine.state1 ? `${stateLine.state1}` : "LineOff"} style={{borderTopRightRadius: "0px", borderBottomRightRadius: "0px"}}>
                                        
                                        </div>
                                        </>
                                    )
                                }
                                {
                                    stateLine.state2 !== "LineOn" ? (
                                        <>
                                        <div className={stateLine.state2 ? `${stateLine.state2}` : "LineOff"} style={{borderTopLeftRadius: "0px", borderBottomLeftRadius: "0px"}}>
                                            <p>
                                                OTP
                                            </p>
                                        </div>
                                            
                                        </>
                                    ) : (
                                        <>
                                        <div className={stateLine.state2 ? `${stateLine.state2}` : "LineOff"} style={{borderTopLeftRadius: "0px", borderBottomLeftRadius: "0px"}} >
                                        
                                        </div>
                                        </>
                                    )
                                }
                            
                               
                            </div>
                        </div>

                        {
                            state?.state1 === true && (
                                <>
                                <motion.div
                                key="State1"
                                variants={State1}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                style={{ position: 'absolute', width: '100%' }}
                                >
                                <div className="State1">
                                    <div className="Header">
                                        <p>Enter a new Email to receive OTP, if you have received OTP before, re-enter your Email and click I have OTP</p>
                                    </div>
                                    <div className="EmailInput">
                                        <label>Email</label>
                                        <input 
                                        placeholder="Enter your Email"
                                        value={UserInput.Email}
                                        onChange={(e)=>setUserInput(
                                            (prev)=>({...prev, Email: e.target.value})
                                        )}
                                        />
                                    </div>
                                    <div className="d-flex">
                                        <button disabled={isLoad } onClick={()=>SendEmail()} className={isLoad? ("btn-load btn") : ("btn btn-on")}>
                                            <p>{isLoad? ("Sending...") : ("Send")}</p>
                                        </button>
                                        <p 
                                        style={{ color: UserInput.Email ? "blue" : "gray" }} 
                                        onClick={NextStep} 
                                        className="HaveOTP"
                                        >
                                        I have OTP!
                                        </p>
                                    </div>
                                   
                                </div>  
                                </motion.div>
                                  
                                </>
                            )
                        }
                        {
                             state?.state2 === true && (
                                <>
                                <motion.div
                                key="State2"
                                variants={State2}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                style={{ position: 'absolute', width: '100%' }}
                                >
                                <div className="State2">
                                    <div className="Header">
                                        <p>Please enter the OTP sent to new Email: {UserInput.Email}</p>
                                    </div>
                                    <div className="OTPInput">
                                        <label>OTP</label>
                                        <input
                                        placeholder="Enter OTP"
                                        value={UserInput.OTP}
                                        onChange={(e)=>setUserInput(
                                            (prev)=>({...prev, OTP: e.target.value})
                                        )}
                                        />
                                    </div>
                                    <div className="d-flex">
                                    <p onClick={PrevStep} className="PrevStep"> {`< `}Send OTP</p>
                                    <button disabled={isLoad || !UserInput.OTP} onClick={()=>ComfirmChange()} className={isLoad? ("btn-load btn") : ("btn btn-on")}>
                                        <p>{isLoad? ("Vetifing...") : ("Vetify")}</p>
                                    </button>
                                    </div>
                                   
                                </div>  
                                </motion.div>
                                  
                                </>
                            )
                        }
                        
                        <div>
                            
                        </div>
                    </div>
                </Modal.Body>
            </motion.div>
        </Modal>
    );
};

export default ChangeEmail;
