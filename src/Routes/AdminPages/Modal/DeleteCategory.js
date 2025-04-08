import React, { useState, useEffect, useContext } from "react";
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
import '../Scss/Dellcate.scss'


const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.2 } },
    exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } },
};


const DeleteCate = ({ show, close, data }) => {
    const { user } = useContext(UserContext);
    const destroyCate = async() =>{
        try {
            const respone = await ResfulAPI.Delecategory(data, user.token);
            if(respone.status === 200){
                toast.success("Delete complate category 🫥")
                setTimeout(() => {
                    close();
                }, 1000);
                return
            }
        } catch (error) {
            console.error(error);
            toast.error("ehh??? 🫥");
            return;
        }
    }
    
    return (
        <Modal  show={show} onHide={close} animation={true}>
            <motion.div
                variants={modalVariants}
                initial="hidden"
                animate={show ? "visible" : "hidden"}
                exit="exit"
            >
                <Modal.Body style={{height: "200px"}}>
                    <ToastContainer />
                    <div className="delecategory-container">
                        <div className="contents">
                            <p className="p7762">Confirm deletion of this product category</p>
                            <div className="d-flex button">
                                <p onClick={()=>close()} className="disdell">Cancel</p>
                                <p onClick={()=>destroyCate()} className="dell">Confirm</p>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
            </motion.div>
        </Modal>
    );
};

export default DeleteCate;
