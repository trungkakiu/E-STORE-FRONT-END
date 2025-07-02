import React, { useState, useEffect, useContext } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom"; 
import './scss/detailProduct.scss';
import { Modal, Button } from "react-bootstrap";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTruck, faAward, faPersonWalkingArrowLoopLeft, faBell, faThumbsUp, faStar, faCartShopping, faMagnifyingGlass, faUser, faPhoneVolume, faLock, faTicket, faComments, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import logo from '../../../img/E house store logo.jpg';
import { Link } from "react-router-dom";
import { UserContext } from "../../../Context/userContext";
import ResfulAPI from "../../RouteAPI/ResfulAPI";
import Avatar from '../../../img/UserIMG/avatar/boy01.png';
import { CartContext } from "../../../Context/cartContext";

const DetailProduct = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { data } = location.state || {};
    const [AddLoading, setAddLoading] = useState(false);
    const { user, login, logout } = useContext(UserContext);
    const [loginModalup, setloginModal] = useState(false);
    const [originalComments, setOriginalComments] = useState([]);
    const [filteredComments, setFilteredComments] = useState([]);
    const [visibleCommentsCount, setVisibleCommentsCount] = useState(5);
    const { fetchCart } = useContext(CartContext);

    const openModal = (code) => {
        if (code === "login") {
            setloginModal(true);
        }
    };

    const closeModal = (code) => {
        if (code === "login") {
            setloginModal(false);
        }
    };

    const defaultImage = data?.images?.find(img => img.is_default) || data?.images?.[0];
    const [expanded, setExpanded] = useState(false);
    const IMGPATH = process.env.REACT_APP_IMG_APP_PATH;
    const NewPrice = data?.price - ((data?.price / 100) * data?.discount) || 0;
    const loadingDefautl = {
        dataLoading: true,
        ImgLoading: true,
        commentLoading: true,
    };
    const OtherIMG = data.images.filter(im => !im.is_default);
    const [otherPicture, setOtherPicture] = useState(OtherIMG);
    const [loading, setLoading] = useState(loadingDefautl);
    const [otherIMGLoading, setotherIMGLoading] = useState({});
    const [categories, setCategories] = useState([]);

    const FetchTag = async () => {
        try {
            const rs = await ResfulAPI.fetchCategory(data.category_id);
            if (rs.status === 200) {
                setCategories(rs.data);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const showToast = (id, message, type, containerId) => {
        if (toast.isActive(id)) {
          toast.update(id, {
            render: message,
            type,
            containerId: containerId,
            autoClose: 5000, 
            closeOnClick: true
          });
        } else {
          toast[type](message, {
            toastId: id,
            containerId: containerId
          });
        }
    };

    const AddCart = async () => { 
        if (!user?.data?.id || !user?.token) {
            openModal("login");
            return;
        }
        try {
            setAddLoading(true);
            const response = await ResfulAPI.AddCart(data?.id, user?.data.id, user?.token);
            if (response.status === 201) {
                showToast("success" , "Add product to card ✅", "success", "detail-container");
                await fetchCart(user.token);
                return;
            } else if(response.status === 403){
                showToast("error" , "Your account has been banned! ❌", "error", "detail-container");
                setTimeout(()=>{
                    logout();
                    navigate('/');
                }, 1000)
                return;
            }
        } catch (error) {
            console.error(error);
            showToast("error" , "Server error please try again 🚨", "error", "detail-container");
            return;
        } finally {
            setAddLoading(false);
            return;
        }
    };

    const handleImageLoad = (id) => {
        setotherIMGLoading(prev => ({ ...prev, [id]: true }));
    };

    const fetchProductRatting = async () => {
        try {
            setLoading(prev => ({ ...prev, commentLoading: true }));
            const rs = await ResfulAPI.fetchProductRatting(data?.id, user.token);
            if (rs.status === 200) {
                setOriginalComments(rs.data);
                setFilteredComments(rs.data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(prev => ({ ...prev, commentLoading: false }));
        }
    };

    const RattingFilter = (status) => {
        if (status === "all") {
            setFilteredComments(originalComments);
        } else if (status === "bad") {
            setFilteredComments(originalComments.filter(m => m.rating >= 1 && m.rating <= 2));
        } else if (status === "normal") {
            setFilteredComments(originalComments.filter(m => m.rating >= 3 && m.rating <= 3));
        } else if (status === "good") {
            setFilteredComments(originalComments.filter(m => m.rating >= 4 && m.rating <= 5));
        }
        setVisibleCommentsCount(5);
    };

    const handleSeeMore = () => {
        setVisibleCommentsCount(prev => prev + 5); 
    };

    const ReviewCount = originalComments.length;
    const badCount = originalComments.filter(m => m.rating >= 1 && m.rating <= 2).length;
    const normalCount = originalComments.filter(m => m.rating >= 3 && m.rating <= 3).length;
    const goodCount = originalComments.filter(m => m.rating >= 4 && m.rating <= 5).length;

    useEffect(() => {
        if (!data) {
            navigate("/", { replace: true });
        }
        FetchTag();
        fetchProductRatting();
    }, [data, navigate]);

    return (
        <div className="detail-container">
            <ToastContainer containerId={"detail-container"}/>
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
                                        <div className="card" style={{ width: "5rem" }} key={index}>
                                            {!otherIMGLoading[it.id] && (
                                                <div className="image-placeholder" style={{ height: "7rem", width: "100%" }}>
                                                    <div className="loading-spinner">
                                                        <FontAwesomeIcon icon={faSpinner} className="ic8s" />
                                                    </div>
                                                </div>
                                            )}
                                            <img
                                                onLoad={() => handleImageLoad(it.id)}
                                                onError={() => handleImageLoad(it.id)}
                                                style={{ display: otherIMGLoading[it.id] ? "block" : "none" }}
                                                src={`${IMGPATH}=${it?.url || "default.jpg"}`} className="card-img-top" alt="..." />
                                        </div>
                                    ))}
                                </div>
                                <div className="topic-picture">
                                    {!otherIMGLoading[defaultImage.id] && (
                                        <div className="image-placeholder ptr987" style={{ height: "7rem", width: "100%" }}>
                                            <div className="loading-spinner">
                                                <FontAwesomeIcon icon={faSpinner} className="ic8s" />
                                            </div>
                                        </div>
                                    )}
                                    <img
                                        onLoad={() => handleImageLoad(defaultImage.id)}
                                        onError={() => handleImageLoad(defaultImage.id)}
                                        style={{ display: otherIMGLoading[defaultImage.id] ? "block" : "none" }}
                                        src={`${IMGPATH}=${defaultImage?.url || "default.jpg"}`} className="ptr987" alt="..." />
                                   
                                </div>
                            </div>
                            <div className="review-product d-flex">
                                <div className="slrv">
                                    <p>
                                        {ReviewCount >= 1000
                                            ? `${(ReviewCount / 1000).toFixed(1)}K`
                                            : ReviewCount}{" "}
                                        {ReviewCount !== 1 ? "reviews" : "review"}
                                    </p>
                                </div>
                                <div className="rate d-flex">
                                    <p>{data?.rate}</p>
                                    {[...Array(5)].map((_, index) => (
                                        <FontAwesomeIcon
                                            key={index + 1}
                                            icon={faStar}
                                            className={`star ${index + 1 <= data?.rate ? "StarActive" : "Star"}`}
                                        />
                                    ))}
                                </div>
                                <div className="arafvp d-flex">
                                    <div className="ldiv">
                                        <FontAwesomeIcon icon={faLock} className="lockicon" />
                                    </div>
                                    <p>All reviews are from verified purchases</p>
                                </div>
                            </div>
                            <div className="coments">
                                <div className="review-tag d-flex">
                                    <p 
                                        onClick={() => RattingFilter("all")} 
                                        className="filter-option"
                                    >
                                        All {originalComments?.length}
                                    </p>
                                    <p 
                                        onClick={badCount > 0 ? () => RattingFilter("bad") : null} 
                                        className={`filter-option ${badCount === 0 ? "disabled" : ""}`}
                                    >
                                        BAD RATING {badCount}
                                    </p>
                                    <p 
                                        onClick={normalCount > 0 ? () => RattingFilter("normal") : null} 
                                        className={`filter-option ${normalCount === 0 ? "disabled" : ""}`}
                                    >
                                        NORMAL {normalCount}
                                    </p>
                                    <p 
                                        onClick={goodCount > 0 ? () => RattingFilter("good") : null} 
                                        className={`filter-option ${goodCount === 0 ? "disabled" : ""}`}
                                    >
                                        PERFECT {goodCount}
                                    </p>
                                </div>
                                <div className="comenter">
                                    {filteredComments?.length === 0 ? (
                                        <>
                                            <div className="Nodata">
                                                <FontAwesomeIcon icon={faComments} className="cmicon" />
                                                <p>Buy now and be the first to comment ! </p>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="CommentData flex-column">
                                                {filteredComments.slice(0, visibleCommentsCount).map((it, id) => (
                                                    <div key={id} className="itemComment d-flex">
                                                        <img className="avatar" src={Avatar} style={{ width: "3rem", height: "3rem" }} />
                                                        <div style={{width: "81%", paddingLeft: "20px", lineHeight: "0.3"}} className="flex">
                                                            <p style={{fontSize: "15px", fontWeight: "500"}}>{it.user ? it.user : "No name"}</p>
                                                            <p className="Comment" style={{lineHeight: "1"}}> {it.comment} </p>
                                                        </div>
                                                        
                                                        <div>
                                                            {[...Array(5)].map((_, index) => (
                                                                <FontAwesomeIcon
                                                                    key={index + 1}
                                                                    icon={faStar}
                                                                    className={`star ${index + 1 <= it?.rating ? "StarActive" : "Star"}`}
                                                                />
                                                            ))}
                                                        </div>
                                                    </div>
                                                ))}
                                                {filteredComments.length > visibleCommentsCount && (
                                                    <button className="btn" onClick={handleSeeMore}>
                                                        See more
                                                    </button>
                                                )}
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="rightcontents">
                            <div className="FreeShip-banner d-flex">
                                <div className="d-flex fhbn-1">
                                    <FontAwesomeIcon icon={faTicket} className="icon" />
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
                                    <p>{data.brand}</p>
                                </div>
                                <div className="soldcount d-flex">
                                    <p className="soldtotal">
                                        {data?.sold >= 1000
                                            ? `${(data?.sold / 1000).toFixed(1)}K`
                                            : data?.sold}{" "}
                                        sold
                                    </p>
                                    <div className="d-flex soldstar">
                                    <p>{data?.rate}</p>
                                        {[...Array(5)].map((_, index) => (
                                            <FontAwesomeIcon
                                                key={index + 1}
                                                icon={faStar}
                                                className={`star ${index + 1 <= data?.rate ? "StarActive" : "Star"}`}
                                            />
                                        ))}
                                    </div>
                                </div>
                                <div className="tag d-flex">
                                    <p>#{categories[0]?.name}</p>
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
                                            <input type="number" />
                                        </div>
                                    </div>
                                </div>
                                {data.stock === 0 ? (
                                    <div style={{ backgroundColor: "gray", cursor: "not-allowed" }} className="btn addcart">
                                        <p className="p1">
                                            Out of stock
                                        </p>
                                    </div>
                                ) : (
                                    <div onClick={() => AddCart()} className="btn addcart">
                                        {AddLoading ? (
                                            <>
                                                <p>Wait...</p>
                                            </>
                                        ) : (
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
                                )}
                            </div>
                            <div className="detail-product">
                                <p className="Topic">
                                    Product details
                                </p>
                                <div className="detail-contents">
                                    <p>Major Material: {data.material}</p>
                                    <p>Color: Indevelop</p>
                                    <p>Stock of products: {data.stock}</p>
                                    <p>Item ID: Indevelop</p>
                                    <p>Origin: {data.origin}</p>
                                    <p>Description: {data.description}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <>
                    <div className="btn btn-danger">
                        Trở về trang chủ ngay
                    </div>
                </>
            )}
        </div>
    );
};

export default DetailProduct;