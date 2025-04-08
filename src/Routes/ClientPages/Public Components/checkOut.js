import { faLocation, faLocationDot, faTicket } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useEffect, useState } from "react";
import ResfulAPI from "../../RouteAPI/ResfulAPI";
import { UserContext } from "../../../Context/userContext";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import AddnewAddress from "./modal/addNewAddress";
import SelectAddress from "./modal/selectAddress";
import './scss/checkOut.scss'


const CheckOut = () =>{
        const stateModalDefault = {
            addAddress: false,
            selectAddress: false
        }
        const IMGPATH = process.env.REACT_APP_IMG_APP_PATH; 
        const [userAdd, setUserAdd] = useState([]);
        const location = useLocation();
        const { user } = useContext(UserContext);
        const order = location.state?.order;
        const [modalState, setModalState] = useState(stateModalDefault);
        const navigate = useNavigate();

        
        const showToast = (id, message, type) => {
            if (toast.isActive(id)) {
                toast.update(id, {
                render: message,
                type,
                containerId: "CheckOut",
                autoClose: 5000, 
                closeOnClick: true
                });
            } else {
                toast[type](message, {
                toastId: id,
                containerId: "CheckOut"
                });
            }
        };

        const fetchAddress = async() =>{
            try {
                const rs = await ResfulAPI.fetchAdd(user.token);
                if(rs.status === 200){
                    setUserAdd(rs.data);
                    return;
                }
                if(rs.status === 401){
                    showToast("Invalid-request", "Invalid request or no access 🐝", "error");
                    return;
                }
                if(rs.status === 404){
                    showToast("Invalid-request", "User does not exist 🐝", "error");
                    return;
                }
    
            } catch (error) {
                console.error(error);
                return;
            }
        }
        
        useEffect(()=>{
            
            if(user.Authen === true && order.length !== 0){
                fetchAddress();
            }else{
                navigate("/production/cart", { replace: true })
            }
        }, [])

        const openModal = (code, data)=>{
            if(code === "1"){
                setModalState(
                    (prev) => ({...prev, addAddress: true})
                )
            }
            if(code === "2"){
                setModalState(
                    (prev) => ({...prev, selectAddress: true})
                )
            }
        }

        const closeModal = async(code, data)=>{
            if(code === "1"){
                setModalState(
                    (prev) => ({...prev, addAddress: false})
                )
                await fetchAddress();
            }
            if(code === "2"){
                setModalState(
                    (prev) => ({...prev, selectAddress: false})
                )
                await fetchAddress();
            }
        }
    
    

    return(
        <div className="checkout-container">
            <SelectAddress show={modalState.selectAddress} close={()=>closeModal("2")} data={userAdd}/>
            <AddnewAddress show={modalState.addAddress} close={()=>closeModal("1")} data={userAdd}/>
            <div className="checkout-header">
                <div className="d-flex top">
                    <FontAwesomeIcon className="icon" icon={faLocationDot}/>
                    <p>SHIPPING ADDRESS</p>
                </div>
                <div className="shipping-add">
                    {
                        userAdd.length === 0 ? (
                            <>
                            
                            <div style={{userSelect: "none"}} className="d-flex ">
                                <p style={{fontSize: "17px"}}>You do not have a shipping address</p>
                                <p onClick={()=>openModal("1")} 
                                style={{fontSize: "17px", marginLeft: "5px", fontWeight: "500", color: "blue", cursor: "pointer"}}>[ add it now ]</p>
                            </div>
                            </>
                        ):(
                            <>
                                {
                                (() => {
                                    const isDefaultAdd = userAdd.find(a => a.is_default === true);
                                    if (isDefaultAdd) {
                                    return (
                                        <div className="add d-flex">
                                        <p style={{fontWeight: "500"}}>{`${isDefaultAdd.full_name} (+84) ${isDefaultAdd.phone_number}`}</p>
                                        <p style={{marginLeft: "5px"}}>{`${isDefaultAdd.state} - ${isDefaultAdd.street_address} - ${isDefaultAdd.district} - ${isDefaultAdd.city}`}</p>
                                        <p onClick={() => openModal("2")} style={{userSelect: "none", fontSize: "17px", marginLeft: "30px", fontWeight: "500", color: "blue", cursor: "pointer"}}>[ Change ]</p>
                                        </div>
                                    );
                                    } else {
                                    return (
                                        <div className="add d-flex">
                                        <p>Please select your default address</p>
                                        <p onClick={() => openModal("2")} style={{userSelect: "none", fontSize: "17px", marginLeft: "30px", fontWeight: "500", color: "blue", cursor: "pointer"}}>[ Change ]</p>
                                        </div>
                                    );
                                    }
                                })()
                                }
                           
                            </>
                        )
                    }
                </div>
            </div>
            <div className="checkOut-contents">
                <div className="d-flex header">
                    <p style={{ fontSize: "19px", fontWeight: "500" }}>Product</p>
                    <p style={{ marginLeft: "600px", color: "gray" }}>Price</p>
                    <p style={{ marginLeft: "200px", color: "gray" }}>Qty</p>
                    <p style={{ marginLeft: "190px", color: "gray" }}>Total</p>
                </div>
                <div className="contents">
                    {order?.map((it, id) => {
                        const defaultImg = it.product.images.find(i => i.is_default) || {};
                        return (
                            <>
                            <div key={id} className="itemCart">
                                <div className="d-flex">
                                    <img
                                        style={{width: "5rem", height: "5rem"}}
                                        src={`${IMGPATH}=${defaultImg.url || "default.jpg"}`}
                                        alt="product-img"
                                    />
                                    <div style={{width: "25%"}}>
                                        <p  style={{
                                        whiteSpace: "nowrap",
                                        paddingLeft: "20px",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        minWidth: "300px",
                                        maxWidth: "300px",
                                        fontSize: "17px"
                                        }}>{it.product.name}</p>
                                    </div>
                                    <div className="d-flex" style={{marginLeft: "230px", textAlign: "center", width: "25%"}}>
                                        <p style={
                                            {
                                                color: "orangered",
                                                fontSize: "18px",
                                                fontWeight: "500",
                                                marginRight: "10px"
                                            }
                                        }>
                                            {`đ${(it.product.price - ((it.product.price / 100) * it.product.discount)).toLocaleString("vi-VN")}`}
                                        </p>
                                        <p style={
                                            {
                                                color: "gray",
                                                fontSize: "18px",
                                                fontWeight: "500",
                                                textDecoration: "line-through"
                                            }
                                        }>
                                            {`đ${it.product.price}`}
                                        </p>
                                    </div>

                                    <p style={{width: "25%", textAlign: "center", marginLeft: "60px"}}>
                                        {it.quantity}
                                    </p>
                                    <p style={{width: "25%", textAlign: "center", marginLeft: "20px", paddingLeft: "30px"}}>
                                        {`đ${((it.product.price - ((it.product.price / 100) * it.product.discount)) * (it.quantity)).toLocaleString("vi-VN")}` }
                                    </p>
                                </div>
                               
                                <div className="voucher d-flex">
                                    <div className="d-flex">
                                        <FontAwesomeIcon className="icon" icon={faTicket}/>
                                        <p className="p009s">Voucher</p>
                                    </div>
                                    <p style={{color: "blue", cursor: "pointer", userSelect: "none"}}>Choose voucher</p>

                                </div>
                                <div className="d-flex bottom">
                                    <div className="note"> 
                                        <label>Message</label>
                                        <textarea></textarea>
                                    </div>
                                    <div className="final">

                                    </div>
                                </div>
                                
                            </div>
                            </>
                            
                        );
                    })}
                </div>
            </div>
        </div>
    )
}

export default CheckOut;