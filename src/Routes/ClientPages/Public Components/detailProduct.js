import { Navigate, useLocation, useNavigate } from "react-router-dom";
import React, { useState, useEffect, useContext } from "react";
import './scss/detailProduct.scss'
import { Modal, Button } from "react-bootstrap";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTruck, faAward, faPersonWalkingArrowLoopLeft,
     faBell, faThumbsUp, faStar, faCartShopping, faMagnifyingGlass, faUser,
     faPhoneVolume,
     faLock,
     faTicket,
     faComments,
     faSpinner
    } from "@fortawesome/free-solid-svg-icons";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import logo from '../../../img/E house store logo.jpg'
import { Link } from "react-router-dom";
import { UserContext } from "../../../Context/userContext";
import ResfulAPI from "../../RouteAPI/ResfulAPI";

const DetailProduct = () =>{
    const navigate = useNavigate();
    const location = useLocation();
    const { data } = location.state || {};
    const [AddLoading, setAddLoading] = useState(false);
    const { user, login, logout } = useContext(UserContext);
    const [loginModalup, setloginModal] = useState(false);

    const openModal = (code) =>{
        if(code ==="login"){
            setloginModal(true)
        }
    }
    const closeModal = (code) => {
        if (code === "login") {
            setloginModal(false);
        }
    };
    useEffect(() => {
        if (!data) {
            navigate("/", { replace: true });
        }
       
    }, [data, navigate]);
    const defaultImage = data?.images?.find(img => img.is_default) || data?.images?.[0];
    const [expanded, setExpanded] = useState(false);
    const IMGPATH = process.env.REACT_APP_IMG_APP_PATH;
    const NewPrice = data?.price - ((data?.price / 100) * data?.discount) || 0
    const loadingDefautl = {
        dataLoading: true,
        ImgLoading: true
    }
    const OtherIMG = data.images.filter(im => !im.is_default);
    const [otherPicture, setOtherPicture] = useState(OtherIMG);
    const [loading, setLoading] = useState(loadingDefautl);
    const [otherIMGLoading, setotherIMGLoading] = useState({});

    const AddCart = async() =>{
        if (!user?.data?.id || !user?.token) {
            openModal("login");
            return;
        }
        try {
        setAddLoading(true)
        const response = await ResfulAPI.AddCart(data?.id, user?.data.id, user?.token);
        if (response.status === 201) {
            toast.success("Thêm vào giỏ hàng thành công! 🛒");
            setAddLoading(false)
        } else {
            toast.error("Lỗi khi thêm sản phẩm vào giỏ hàng! ❌");
        }
        } catch (error) {
        console.error(error);
        toast.error("Lỗi server, vui lòng thử lại sau! 🚨");
        }
    }

    const handleImageLoad = (id) => {
        setotherIMGLoading(prev => ({ ...prev, [id]: true }));
    };
    
    return(
       <div className="detail-container">
        <ToastContainer/>
        {data ? (
            <>
            <ol className='routes d-flex'>
                <li>
                    <Link to="/" className='Homelink'>
                        Home
                    </Link>
                </li>
                <li> {`>`} </li>
                <li>
                    {data.name}
                </li>
            </ol>
            <div className="contents d-flex">
            <div className="leftcontents">
                <div className="product-pictures d-flex">
                    <div className="another-picture">
                        {otherPicture?.map((it, index) => (
                            <div className="card" style={{ width: "5rem" }}>
                             {!otherIMGLoading[it.id] && (
                                <div className="image-placeholder" style={{ height: "7rem", width: "100%" }}>
                                    <div className="loading-spinner">
                                        <FontAwesomeIcon icon={faSpinner} className="ic8s"/>
                                    </div>
                                </div>
                            )}
                            <img 
                            onLoad={() => handleImageLoad(it.id)}
                            onError={() => handleImageLoad(it.id)}
                            style={{display: otherIMGLoading[it.id] ? "block" : "none"}}
                            src={`${IMGPATH}=${it?.url  || "default.jpg"}`} className="card-img-top" alt="..." />
                            </div>
                        ))}
                    </div>
                    <div className="topic-picture">
                        <img src={`${IMGPATH}=${defaultImage?.url  || "default.jpg"}`} style={{objectFit: "cover"}} className="ptr987"/>
                    </div>
                </div>
                <div className="review-product d-flex">
                    <div className="slrv">
                        <p>0 reviews</p>
                    </div>
                    <div className="rate d-flex">
                        <p>5</p>
                        {[...Array(5)].map((_,index) => (
                            <FontAwesomeIcon icon={faStar} className="star"/>
                        ))}
                    </div>
                    <div className="arafvp d-flex">
                        <div className="ldiv">
                        <FontAwesomeIcon icon={faLock} className="lockicon"/>
                        </div>
                        <p>All reviews are from verified purchases</p>
                    </div>
                </div>
                <div className="coments">
                    <div className="review-tag d-flex">
                        <p>GOOD{`(1)`}</p>
                        <p>AWESOME{`(2)`}</p>
                        <p>PERFECT{`(3)`}</p>
                    </div>
                    <div className="comenter">
                        <FontAwesomeIcon icon={faComments} className="cmicon"/>
                        <p>Hãy mua hàng và trở thành người đầu tiên bình luận nào ! </p>
                    </div>
                </div>
                
                    
            </div>
            <div className="rightcontents">
                <div className="FreeShip-banner d-flex">
                    <div className="d-flex fhbn-1">
                        <FontAwesomeIcon icon={faTicket} className="icon"/>
                        <p>Free shipping special for you</p>
                    </div>
                    <div className="fsbn-2">
                        <p>Limited-time offer</p>
                    </div>
                </div>
                <div className="product">
                    <div className="product-name">
                        <p>{data.name}</p>
                    </div>
                    <div className="product-decription">
                        <p>{data.description}</p>
                    </div>
                    <div className="soldcount d-flex">
                        <p className="soldtotal">
                            {`${data?.sole ?? 0} sold`}
                        </p>
                        <div className="d-flex soldstar">
                            <p>5</p>
                            {[...Array(5)].map((_,index) => (
                            <FontAwesomeIcon icon={faStar} className="star"/>
                            ))}
                        </div>
                    </div>
                    <div className="tag d-flex">
                        <p>#Thuc an</p>
                        <p>#Do ve sinh</p>
                        <p>#khong co gi</p>
                    </div>
                    <div className="price d-flex">
                       <p className="priceTopic">{`đ${NewPrice.toLocaleString("vi-VN")}`}</p>
                       <p className="price2">{`đ${data.price.toLocaleString("vi-VN")}`}</p>
                       <span className="discount">
                            <p>
                                {`${data.discount}% limited time`} 
                            </p>
                        </span>
                    </div>
                    <div className="bigsales">
                        <div className="d-flex upbanner">
                            <p className="p1">Big sale:</p>
                            <p className="p2">End in 03/14/2025</p>
                        </div>
                        <div className="downbanner">
                            <div className="d-flex">
                            <p>Color: </p>
                            <p className="Color">White</p>
                            <p className="Color">Black</p>
                            <p className="Color">Blue</p>
                            </div>
                            
                            <div className="d2 d-flex">
                                <label>Qty</label>
                                <input type="number"/>
                            </div>
                        </div>
                        
                    </div>
                    <div onClick={()=>AddCart()} className="btn addcart">
                        {AddLoading ? (
                            <>
                            <p>Wait...</p>
                            </>
                        ):(
                            <>
                            <p className="p1">
                            Add to cart
                            </p> 
                            <p className="p2">
                            {`${data.discount}% of`}
                            </p>
                            </>
                        )}
                       
                    </div>
                   
                </div>
                <div className="detail-product">
                        <p className="Topic">
                            Product details
                        </p>
                        <div className="detail-contents">
                            <p>Major Material: {data.material}</p>
                            <p>Color: White, black, blue, yellow</p>
                            <p>Number of products: {data.stock}</p>
                            <p>Item ID: FR35024</p>
                            <p>Origin: {data.origin}</p>
                            <p>Decription: Music Box is motored by remontoir,not need the battery.
                            The Principle of the Music Box is release of the spring in with remontoir, turn the gear and drive the Sound cylinder.
                            Many bumps on the Sound cylinder, and then it will play the wonderful music ringtone when turning.
                            Main Material: Zinc Alloy + Plastic ABS
                            Music Melody: Random Music
                            Package included: 1 x Music Box Keychain
                            Notes:
                            1. Due to the different monitor and light effect, the actual color of the item might be slightly different from the color showed on the pictures. Thank you!
                            2. Please allow 1-3mm/0.04-0.12in measuring deviation due to manual measurement.
                            </p>
                        </div>
                </div>
            </div>
            </div>
            
            </>
        ) : (
            <>
                <div>
                    Trở về trang chủ ngay
                </div>
            </>
        )}
            
        </div>
    )
}

export default DetailProduct;