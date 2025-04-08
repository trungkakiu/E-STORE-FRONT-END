import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTruck, faAward, faPersonWalkingArrowLoopLeft,
     faBell, faThumbsUp, faStar, faCartShopping, faMagnifyingGlass, faUser,
     faPhoneVolume
    } from "@fortawesome/free-solid-svg-icons";
import '../scss/login.scss'
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ResfulAPI from "../../RouteAPI/ResfulAPI";


const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.2 } },
    exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } },
};

const ModalForm = ({ show, close }) => {
   
    return (
        <Modal show={show} onHide={close} animation={false}>
            <motion.div
                variants={modalVariants}
                initial="hidden"
                animate={show ? "visible" : "hidden"}
                exit="exit"
            >
                <Modal.Body>
                    <ToastContainer />
                    
                </Modal.Body>
            </motion.div>
        </Modal>
    );
};

export default ModalForm;
