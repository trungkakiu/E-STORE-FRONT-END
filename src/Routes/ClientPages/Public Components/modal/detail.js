import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTruck, faAward, faPersonWalkingArrowLoopLeft,
     faBell, faThumbsUp, faStar, faCartShopping, faMagnifyingGlass, faUser,
     faPhoneVolume
    } from "@fortawesome/free-solid-svg-icons";
import '../scss/detailProduct.scss'
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ResfulAPI from "../../../RouteAPI/ResfulAPI";
import logo from '../../../../img/E house store logo.jpg'
import { Link } from "react-router-dom";

const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.2 } },
    exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } },
};

const ModalForm = ({ show, close, data }) => {
    return (
        <Modal show={show} onHide={close}>
            <motion.div
                variants={modalVariants}
                initial="hidden"
                animate={show ? "visible" : "hidden"}
                exit="exit"
            >
                <Modal.Body>
                    <ToastContainer />
                    <div className="detail-container">
                        <ol className='routes row'>
                            <li>
                                <Link to="/" className='Homelink'>
                                    Home
                                </Link>
                            </li>
                            <span> {`>`} </span>
                            <li>
                                Tên sản phẩm ở đây 
                            </li>
                        </ol>
                        <div className="leftcontents">
                            <div className="product-pictures d-flex">
                                <div className="another-picture">
                                     {[...Array(6)].map((_, index) => (
                                        <div className="card" style={{ width: "5rem" }}>
                                        <img src={logo} className="card-img-top" alt="..." />
                                        </div>
                                    ))}
                                </div>
                                <div className="topic-picture">
                                    <img src={logo} className="ptr987"/>
                                </div>
                            </div>
                               
                        </div>
                        <div className="rightcontents">

                        </div>
                    </div>
                </Modal.Body>
            </motion.div>
        </Modal>
    );
};

export default ModalForm;
