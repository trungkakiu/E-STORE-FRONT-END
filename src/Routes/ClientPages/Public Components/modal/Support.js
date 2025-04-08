import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTruck, faAward, faPersonWalkingArrowLoopLeft,
     faBell, faThumbsUp, faStar, faCartShopping, faMagnifyingGlass, faUser,
     faPhoneVolume,
     faEnvelope,
     faPhone,
     faHeadset
    } from "@fortawesome/free-solid-svg-icons";
import '../scss/Support.scss'
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { faFacebook } from "@fortawesome/free-brands-svg-icons";


const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.2 } },
    exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } },
};

const Support = ({ show, close }) => {
   
    return (
        <Modal show={show} onHide={close} animation={false}>
            <motion.div
                variants={modalVariants}
                initial="hidden"
                animate={show ? "visible" : "hidden"}
                exit="exit"
               
            >
                <Modal.Body style={{height: "250px", width: "700px", backgroundColor: "white", marginLeft:  "-20%"}}>
                    <ToastContainer />
                    <div className="Support-container">
                        <div className="upHeader">
                            <div className="d-flex div8s">
                                <FontAwesomeIcon icon={faHeadset} className="icKsk"/>
                                <p>Support center</p>
                            </div>
                            <p>If you have any questions or need any assistance, please contact us in the ways below.</p>
                        </div>
                        <div className="d-flex bodyCT">
                            <div className="d-flex mail">
                                <FontAwesomeIcon icon={faEnvelope} className="icon"/>
                                <p>Trungkakiu@gmail.com</p>
                               
                            </div>
                            <div className="d-flex phone">
                                <FontAwesomeIcon icon={faPhone} className="icon"/>
                                <p>{`(+84) 039-3380-603`}</p>
                            </div>
                            <div className="d-flex facebook">
                                <FontAwesomeIcon icon={faFacebook} className="icon"/>
                                <a href="https://www.facebook.com/profile.php?id=61572204860620" target="_blank">
                                    <p>E-House Store</p>
                                </a>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
            </motion.div>
        </Modal>
    );
};

export default Support;
