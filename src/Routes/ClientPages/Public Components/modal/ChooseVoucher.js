import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTruck, faAward, faPersonWalkingArrowLoopLeft,
     faBell, faThumbsUp, faStar, faCartShopping, faMagnifyingGlass, faUser,
     faPhoneVolume,
     faTicket,
     faFaceSmile
    } from "@fortawesome/free-solid-svg-icons";
import '../scss/VoucherList.scss'
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ResfulAPI from "../../../RouteAPI/ResfulAPI";


const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.2 } },
    exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } },
};

const ModalForm = ({ show, close, data, onVoucherSelect }) => {
    const defaultData = {
        UserVoucher: [],
        parentData: "",
        parentID: ""
    }
    const [Voucher, setVouCher] = useState(defaultData);

    useEffect(()=>{
        if(data.UserVoucher && data.ModalData){
            setVouCher(
                (prev) => ({...prev, UserVoucher: data.UserVoucher, parentData: data.ModalData.price, parentID: data.ModalData.id})
            );
        }else{
            close();
        }
       
    },[show])

    const handleVoucher = (id) => {
        onVoucherSelect(id, Voucher.parentID);
        close();
    }

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
                    <div className="VoucherList">
                        <div className="VCbody">
                            {
                                Voucher.UserVoucher.length > 0 ? (
                                    <>
                                        {Voucher.UserVoucher?.map((it, id) => (
                                            <>  
                                                <div key={id} className={'item'}>
                                                    {
                                                        (it.minimum_order_value > Voucher.parentData || Math.ceil((new Date(it.expiration_date) - new Date()) / (1000 * 60 * 60 * 24)) <= 0 ) ? (
                                                            <>
                                                            <div className="invalid">
                                                                <p>Not suitable</p>
                                                            </div>
                                                            </>
                                                        ) : (
                                                            <>
                                                            </>
                                                        )
                                                    }
                                                    <div onClick={()=>handleVoucher(it.code)} className='d-flex'>
                                                        <FontAwesomeIcon className='icon' icon={faTicket}/>
                                                        <div className='contents'>
                                                            <div className='top d-flex'>
                                                                <p style={{fontWeight: "500"}}>CODE: {it.code}</p>
                                                                <p className='dis'>{`${it.discount_percent}%`}</p>
                                                            </div>
                                                            <div className='d-flex bot'>
                                                                <p style={{fontWeight: "400" ,color: "orangered"}}>PRICE: {it.minimum_order_value}</p>
                                                                <p style={{ fontSize: "15px", paddingTop: "2px" }}>
                                                                {
                                                                    Math.ceil((new Date(it.expiration_date) - new Date()) / (1000 * 60 * 60 * 24)) > 0
                                                                    ? `${Math.ceil((new Date(it.expiration_date) - new Date()) / (1000 * 60 * 60 * 24))} days left`
                                                                    : 'Expired'
                                                                }
                                                                </p>
                                                            </div>
                                                            
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                            
                                        ))}
                                    </>
                                ) : (
                                    <>
                                    <div className="Nodata">
                                        <FontAwesomeIcon icon={faFaceSmile}/>
                                        <p>
                                            No vouchers available !
                                        </p>
                                    </div>
                                    </>
                                )
                            }

                        </div>
                        <div className="Option">
                            <button onClick={close} className="btn btn-danger">Cancel</button>
                        </div>
                    </div>
                </Modal.Body>
            </motion.div>
        </Modal>
    );
};

export default ModalForm;
