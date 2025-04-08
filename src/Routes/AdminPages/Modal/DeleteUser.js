import React, { useState, useEffect, useContext, use} from "react";
import { Modal, Button } from "react-bootstrap";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTruck, faAward, faPersonWalkingArrowLoopLeft,
     faBell, faThumbsUp, faStar, faCartShopping, faMagnifyingGlass, faUser,
     faPhoneVolume
    } from "@fortawesome/free-solid-svg-icons";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ResfulAPI from "../../RouteAPI/ResfulAPI";
import { UserContext } from "../../../Context/userContext";
import '../Scss/DeleteUser.scss'


const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.2 } },
    exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } },
};

const DeleteUser = ({ show, close, data }) => {
    const {user} = useContext(UserContext);
    const [userData, setuserData] = useState(data);
    const [confirm, setconfirm] = useState("");
    const [isValid, setIsValid] = useState(false);

    useEffect(()=>{
        setuserData(data);
        setconfirm("");
    },[data])

    useEffect(()=>{
        if(confirm === "confirm" || confirm === "CONFIRM" || confirm === "Confirm"){
            setIsValid(true);
        }else{
            setIsValid(false);
        }
    },[confirm])

    const DeleteUser = async()=>{
        const toastId = toast.loading("Deleting user...");
        try {
            const rs = await ResfulAPI.DeleteUser( userData.id ,user.token);
            if(rs.status === 200){
                toast.update(toastId, {
                render: "User deleted successfully !",
                type: "success",
                isLoading: false,
                autoClose: 3000,
                });
                setTimeout(()=>{
                    close();
                }, 1000)
            }
            if(rs.status === 403){
                toast.update(toastId, {
                render: "Cannot delete admin account !",
                type: "error",
                isLoading: false,
                autoClose: 3000,
                });
                
            }
            if(rs.status === 404){
                toast.update(toastId, {
                render: "User not found !",
                type: "error",
                isLoading: false,
                autoClose: 3000,
                });
               
            }
        } catch (error) {
            console.error(error);
            return;
        }
    }
    return (
        <Modal  show={show} onHide={close} animation={false}>
            <motion.div
                variants={modalVariants}
                initial="hidden"
                animate={show ? "visible" : "hidden"}
                exit="exit"
            >
                <Modal.Body style={{height: "40%"}}>
                    <ToastContainer containerId={"deleteUser"}/>
                    <div className="DeleteUser-container">
                        <div className="contents">
                            <p className="p7762">{`Are you sure you want to delete user: "${userData?.username}" ? 🤓`}</p>
                            <p className="p7763">Enter "Confirm" exactly to delete the user.</p>
                            <input
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && isValid) {
                                    DeleteUser();
                                }
                            }}
                            value={confirm}
                            onChange={(e)=>setconfirm(e.target.value)}
                            />
                            <div className="d-flex button">
                                <button onClick={()=>close()} className="btn disdell">Cancel</button>
                                <button onClick={()=>DeleteUser()}
                               
                                disabled={!isValid} 
                                className="btn dell">Confirm</button>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
            </motion.div>
        </Modal>
    );
};

export default DeleteUser;
