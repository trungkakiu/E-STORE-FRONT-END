import { useState, useEffect, useContext,  useRef } from "react";
import "./scss/publicHomePage.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTruck, faAward, faPersonWalkingArrowLoopLeft,
     faBell, faThumbsUp, faStar, faCartShopping, faMagnifyingGlass, faUser,
     faPhoneVolume,
     faCheckToSlot,
     faCartArrowDown,
     faSpinner
    } from "@fortawesome/free-solid-svg-icons";
import "bootstrap/dist/css/bootstrap.min.css";
import { ProductContext } from "../../../Context/productContext";
import logo from '../../../img/E house store logo.jpg';
import banner from '../../../img/image.png';
import React from 'react';
import banner2 from '../../../img/Screenshot 2025-03-05 222716.png'
import Detail from './modal/detail'
import { Link } from "react-router-dom";
import magasles from '../../../img/Screenshot 2025-03-13 230102.png'
import banner01 from '../../../img/ProductIMG/TopicIMG/img_three_banner_1.webp'
import banner02 from '../../../img/ProductIMG/TopicIMG/img_three_banner_2.webp'
import banner03 from '../../../img/ProductIMG/TopicIMG/img_three_banner_3.webp'
import { CartContext } from "../../../Context/cartContext";
import ResfulAPI from "../../RouteAPI/ResfulAPI";
import {UserContext} from '../../../Context/userContext'
import { toast, ToastContainer } from "react-toastify";
import Login from '../Public Components/modal/login'

const PublicHomePage = () => {
    const IMGPATH = process.env.REACT_APP_IMG_APP_PATH; 
    const [visibleCount, setVisibleCount] = useState(10);
    const {user} = useContext(UserContext)
    const { products, category, addProduct, removeProduct, updateProduct, fetchProducts, fecthCategory } = useContext(ProductContext);
    const { cart, addToCart, removeFromCart, fetchCart } = useContext(CartContext);
    const visibleProducts = products.slice(0, visibleCount);
    const [imageLoaded, setImageLoaded] = useState({});
    const [isOpen, setisOpen] = useState(false)
    const openModal = (code)=>{
        if(code === "login"){
            setisOpen(true);
        }
    }
    const closeModal = (code) =>{
        if(code === "login"){
            setisOpen(false)
        }
    }
    const handleImageLoad = (id) => {
        setImageLoaded(prev => ({ ...prev, [id]: true }));
      };

    const [randomProducts, setRandomProducts] = useState([]);
    
    const handleLoadMore = () => {
        setVisibleCount((prev) => prev + 10);
    };
    function getRandomProducts(products, count = 4) {
        return [...products]
            .sort(() => 0.5 - Math.random())
            .slice(0, count);
    }
    useEffect(()=>{
        fetchCart(user?.token);
    },[])
    
    useEffect(() => {
        const loadData = async () => {
            if (user?.Authen) {
                await fetchCart(user.token);
                await fetchProducts();
            }
        };
        loadData();
    }, [user]);

    useEffect(() => {
        setRandomProducts(getRandomProducts(products, 4));
        const interval = setInterval(() => {
            setRandomProducts(getRandomProducts(products, 4));
        }, 5000);
        return () => clearInterval(interval);
    }, [products]); 

    const AddCart = async(ProductID) => {
        try {
            const response = await ResfulAPI.AddCart(ProductID, user.data.id, user.token);
            if(response.status === 201){
                toast.success("Add product complalte!");
                fetchCart(user.token);
                return;
            }
            if(response.status === 401){
                toast.error("Out of stock!");
                return;
            }
        } catch (error) {
            console.error(error);
            return;
        }
       
    }
    return (
        <div className="Container">
            <div className="content">
                <Login show={isOpen} close={()=>closeModal("login")}/>
                <ToastContainer
                position="bottom-center" 
                autoClose={3000} 
                hideProgressBar={false}
                newestOnTop={false} 
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                />
                <div className="noice d-flex align-items-center">
                    <FontAwesomeIcon icon={faBell}  color="#ADFFA2" className="bell col-1" />
                    <p className="noicecontent">
                    Temu is working with the Vietnam E-commerce and Digital Economy Agency and the Ministry of Industry and Trade to register its provision of e-commerce services in Vietnam.
                    </p>
                </div>
                
                <div className="banner">
                    <img className="banner_img" src={banner} alt="Banner" />
                </div>

                <div className="product-contents">
                    <div className="banner_2">
                        <img className="banner_2_img" src = {banner2} alt="banner_2"/>
                    </div>
                    <div className="best-salers d-flex flex-wrap justify-content-between">
                        {randomProducts.map((item, index) => {
                            const defaultImage = item.images?.find(img => img.is_default) || item.images?.[0];
                            return (
                                <div key={index} className="linktodetail" state={{ data: item }}>
                                    <div className="card" style={{width: "18.5rem", height: "25rem"}} >
                                    {!imageLoaded[item.id] && (
                                        <div className="image-placeholder" style={{ height: "19rem", width: "100%" }}>
                                        <div className="loading-spinner">
                                            <FontAwesomeIcon icon={faSpinner} className="ic8s"/>
                                        </div>
                                        </div>
                                    )}
                                    <Link to="/production/detail" className="linktodetail" state={{ data: item }}>
                                    <img
                                        className="productIMG"
                                        style={{
                                        height: "19rem",
                                        width: "100%",
                                        display: imageLoaded[item.id] ? "block" : "none",
                                        }}
                                        src={`${IMGPATH}=${defaultImage?.url || "default.jpg"}`}
                                        onLoad={() => handleImageLoad(item.id)}
                                        onError={() => handleImageLoad(item.id)}
                                        alt={item.name}
                                    />
                                    </Link>
                                        <div className="card-body">
                                            <h5>{`đ${item.price.toLocaleString("vi-VN")}`}</h5>
                                            <div className="d-flex divoois">
                                                <FontAwesomeIcon icon={faCheckToSlot} className="ic992"/>
                                                <p>{item.stock}</p>
                                                <div onClick={
                                                    user.Authen? ()=>AddCart(item.id)
                                                    : ()=>openModal("login")
                                                    } className="addtocart">
                                                    <FontAwesomeIcon icon={faCartArrowDown}/>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <div className="banner-img d-flex">
                        <div>
                            <img src={banner01}/>
                        </div>
                        <div>
                            <img src={banner02}/>
                        </div>
                        <div>
                            <img src={banner03}/>
                        </div>
                    </div>
                    <div className="cateBlog">
                        <div className="d-flex header">
                            <FontAwesomeIcon className="icoo92" icon={faAward}/>
                            <p>Categories</p>
                        </div>
                        <div className="cateBody d-flex flex-wrap">
                            {category.map((it, index) =>(
                                <p className="item">{it.name}</p>
                            ))}
                        </div>
                    </div>
                    <div className="Recoment4u">
                        <div className="rcmheader">
                            
                        </div>
                        <div className="rcmBody">

                        </div>
                        <div className="showmore ">
                            <p>More </p>
                        </div>
                    </div>
                    <div className="Product-show">
                            <div className="showP998a">
                            <div className="best-salers d-flex flex-wrap justify-content-between">
                                {visibleProducts.map((item, index) => {
                                    const defaultImage = item.images?.find(img => img.is_default) || item.images?.[0];
                                    return (
                                        <div key={index} to="/production/detail" className="linktodetail" state={{ data: item }}>
                                        <div className="card" style={{width: "14.5rem", height: "21rem"}} >
                                            {!imageLoaded[item.id] ? (
                                            <div className="image-placeholder" style={{ width: "100%", height: "15rem" }}>
                                            <div className="loading-spinner">
                                                <FontAwesomeIcon icon={faSpinner} className="ic8s"/>
                                            </div>
                                            </div>
                                            ): (
                                            <Link key={index} to="/production/detail" className="linktodetail" state={{ data: item }}>
                                                <img 
                                                onLoad={() => handleImageLoad(item.id)}
                                                onError={() => handleImageLoad(item.id)}
                                                style={{ width: "100%", height: "15rem" }} 
                                                src={`${IMGPATH}=${defaultImage?.url || "default.jpg"}`} 
                                                className="card-img-top" alt="..." />
                                            </Link>
                                            )}
                                            
                                            <div className="card-body">
                                                <h5>{`đ${item.price.toLocaleString("vi-VN")}`}</h5>
                                                <div className="d-flex divoois">
                                                    <FontAwesomeIcon icon={faCheckToSlot} className="ic992"/>
                                                    <p>{item.stock}</p>
                                                    <div onClick={
                                                    user.Authen? ()=>AddCart(item.id)
                                                    : ()=>openModal("login")
                                                    } className="addtocart">
                                                    <FontAwesomeIcon icon={faCartArrowDown}/>
                                                </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    );
                                })}
                            </div>
                            </div>
                            {visibleCount < products.length && (
                                <div style={{cursor: 'pointer', userSelect: "none"}} className="showmore" onClick={handleLoadMore}>
                                    <p>Xem thêm</p>
                                </div>
                            )}
                    </div>
                </div>
              
            </div>
            
        </div>
    );
};

export default PublicHomePage;
