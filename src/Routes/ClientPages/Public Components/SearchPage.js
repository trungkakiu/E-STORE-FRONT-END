import { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ProductContext } from "../../../Context/productContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartArrowDown, faCheckToSlot, faFaceSmile, faLightbulb, faSpinner } from "@fortawesome/free-solid-svg-icons";
import './scss/SearchPage.scss'
import { toast } from "react-toastify";
import { UserContext } from "../../../Context/userContext";
import LoginModal from "./modal/login";
import ResfulAPI from "../../RouteAPI/ResfulAPI";
import AnimatedCard from "./modal/AnimatedCard";


const SearchPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [ProductFilter, setProductFilter] = useState([])
    const {products} = useContext(ProductContext);
    const KeyWord = location.state?.keyword;
    const [imageLoaded, setImageLoaded] = useState({});
    const IMGPATH = process.env.REACT_APP_IMG_APP_PATH; 
    const { user, AddCart } = useContext(UserContext);
    const [visibleCount, setVisibleCount] = useState(15);
    const [visibleRecommentCount, setvisibleRecommentCount] = useState(12);
    const defaultOpen = {
        login: false
    }
    const [isOpen, setisOpen] = useState(defaultOpen)

    const openModal = (code, data)=>{
        if(code === "login"){
            setisOpen(
                (prev) => ({...prev, login: true})
            );
        }
    }
    const closeModal = (code) =>{
        if(code === "login"){
            setisOpen(
                (prev) => ({...prev, login: false})
            );
        }
    }

    const handleLoadMore = () => {
        setVisibleCount((prev) => prev + 10);
    };

    const handleLoadMoreRecmt = () => {
        setvisibleRecommentCount((prev) => prev + 18);
    };

    const AddToCart = async(ProductID) => {
        try {
            const response = await AddCart(ProductID, user.data.id, user.token);
            if(response.status === 201){
                showToast("success" , "Add product complalte!", "success" , "SearchPage");
                return;
            }
            if(response.status === 401){
                showToast("error" , "Out of stock!", "error" , "SearchPage");
                return;
            }
        } catch (error) {
            console.error(error);
            return;
        }
        
    }

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

    const handleImageLoad = (id) => {
        setImageLoaded(prev => ({ ...prev, [id]: true }));
    };

    useEffect(() => {
        if (!KeyWord || KeyWord.trim() === "") {
          navigate("/"); 
          setProductFilter([]);
          return;
        }
      
        const normalizedKeyWord = KeyWord.toLowerCase().trim();
      
        const matchedProducts = products.filter((product) => {
          const nameMatch = product.name?.toLowerCase().includes(normalizedKeyWord);

          const descriptionMatch = product.description
            ? product.description.toLowerCase().includes(normalizedKeyWord)
            : false;
          return nameMatch || descriptionMatch;
        });
      
        if (matchedProducts.length > 0) {

          const matchedCategoryIds = [
            ...new Set(matchedProducts.map((p) => p.category_id)),
          ];
          const filteredProducts = products.filter((product) =>
            matchedCategoryIds.includes(product.category_id)
          );
      

          setProductFilter(filteredProducts);
        } else {

          setProductFilter([]);
        }
      }, [KeyWord, products, navigate, setProductFilter]);


      const VSBProduct = ProductFilter.slice(0, visibleCount);
      const VSBRCMproduct = products.slice(0, visibleRecommentCount);

    return(
        <div className="SearchPage-container">
            <LoginModal show={isOpen.login} close={()=>closeModal("login")}/>
            <div className="TopContent d-flex">
                <div className="filterBar">

                </div>
                <div className="SearhFound">
                    
                    {
                        VSBProduct?.length > 0 ? (
                            <>
                            <div className="Data">
                                <div className="d-flex">
                                    <FontAwesomeIcon icon={faLightbulb} className="iConHD"/>
                                    <p style={{fontWeight: "500", fontSize: "17px"}}>
                                    Search results for keyword: {KeyWord}
                                    </p> 
                                </div>
                                <div className="d-flex flex-wrap justify-content-between">
                                    { VSBProduct?.map((it, id) => {
                                        const defaultImage = it.images?.find(img => img.is_default) || it.images?.[0];
                                        return (
                                        <>
                                        <AnimatedCard key={id}>
                                            <div className="ItemCard">
                                                {!imageLoaded[it.id] && (
                                                    <div className="image-placeholder" style={{ height: "19rem", width: "100%" }}>
                                                        <div className="loading-spinner">
                                                            <FontAwesomeIcon icon={faSpinner} className="ic8s"/>
                                                        </div>
                                                    </div>
                                                )}
                                                <Link to="/production/detail" className="linktodetail" state={{ data: it }}>
                                                    <img
                                                        className="productIMG"
                                                        style={{
                                                        height: "12rem",
                                                        width: "100%",
                                                        display: imageLoaded[it.id] ? "block" : "none",
                                                        }}
                                                        src={`${IMGPATH}=${defaultImage?.url || "default.jpg"}`}
                                                        onLoad={() => handleImageLoad(it.id)}
                                                        onError={() => handleImageLoad(it.id)}
                                                        alt={it.name}
                                                    />
                                                </Link>
                                                <div className="card-body">
                                                    <h6 style={{width: '100%', textAlign: "center", color: "orangered", marginTop: "10px"}}>{`đ${it.price.toLocaleString("vi-VN")}`}</h6>
                                                    <div className="d-flex divoois">
                                                    
                                                        {it.stock != 0  ? (
                                                            <>  
                                                                <div className="d-flex">
                                                                    <FontAwesomeIcon style={{fontSize: "20px" , marginLeft: "10px", paddingTop: "5px"}} icon={faCheckToSlot} className="ic992"/>
                                                                    <p style={{marginLeft: "10px", marginTop: "3px"}} 
                                                                    className="stock">{it?.stock >= 1000
                                                                        ? `${(it?.stock / 1000).toFixed(1)}K`
                                                                        : it?.stock}{" "}
                                                                    </p>
                                                                </div>
                                                                <div onClick={
                                                                    user.Authen? ()=>AddToCart(it.id)
                                                                    : ()=>openModal("login")
                                                                    } className="addtocart">
                                                                    <FontAwesomeIcon icon={faCartArrowDown}/>
                                                                </div>
                                                            </>
                                                            
                                                        ) : (
                                                            <>
                                                                <div className="d-flex">
                                                                    <FontAwesomeIcon style={{fontSize: "20px" , marginLeft: "10px"}} icon={faCheckToSlot} className="ic992"/>
                                                                    <p className="stockOut"> Out Stock</p>
                                                                </div>
                                                                <div 
                                                                    onClick={
                                                                    !user.Authen ? ()=>openModal("login") : null
                                                                    } className="OutStockCart">
                                                                    <FontAwesomeIcon icon={faCartArrowDown}/>
                                                                </div>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            </div> 
                                        </AnimatedCard>

                                    </>
                                    )})}
                                    {visibleCount < ProductFilter.length && (
                                        <div style={{cursor: 'pointer', userSelect: "none" , 
                                        backgroundColor: "orangered", marginLeft: "45%", 
                                        marginTop: "2%", padding: "2px", height: "30px", borderRadius: "5px", color: "white"}} 
                                        className=" btn showmore" onClick={handleLoadMore}>
                                            <p>See more</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                            </>
                        ) : (
                            <>
                            <div className="NoData">
                                <div className="d-flex">
                                    <FontAwesomeIcon icon={faLightbulb} className="iConHD"/>
                                    <p style={{fontWeight: "500", fontSize: "17px"}}>
                                    Search results for keyword: {KeyWord}
                                    </p>
                                </div>
                                <div className="contents">
                                <FontAwesomeIcon className="icon" icon={faFaceSmile}/>
                                <p>Your keyword does not match any product</p>
                                </div>
                                
                            </div>
                            </>
                        )
                    }
                </div>
            </div>
            <div className="bot-contents">
                <div className="title">
                    <p>Recomment for you !</p>
                </div>
                <div className="">
                    {
                    <div className="d-flex flex-wrap justify-content-between">
                        { VSBRCMproduct?.map((it, id) => {
                            const defaultImage = it.images?.find(img => img.is_default) || it.images?.[0];
                            return (
                            <>
                            <AnimatedCard key={id}>
                            <div className="ItemCard">
                                {!imageLoaded[it.id] && (
                                    <div className="image-placeholder" style={{ height: "19rem", width: "100%" }}>
                                        <div className="loading-spinner">
                                            <FontAwesomeIcon icon={faSpinner} className="ic8s"/>
                                        </div>
                                    </div>
                                )}
                                <Link to="/production/detail" className="linktodetail" state={{ data: it }}>
                                    <img
                                        className="productIMG"
                                        style={{
                                        height: "12rem",
                                        width: "100%",
                                        display: imageLoaded[it.id] ? "block" : "none",
                                        }}
                                        src={`${IMGPATH}=${defaultImage?.url || "default.jpg"}`}
                                        onLoad={() => handleImageLoad(it.id)}
                                        onError={() => handleImageLoad(it.id)}
                                        alt={it.name}
                                    />
                                </Link>
                                <div className="card-body">
                                    <h6 style={{width: '100%', textAlign: "center", color: "orangered", marginTop: "10px"}}>{`đ${it.price.toLocaleString("vi-VN")}`}</h6>
                                    <div className="d-flex divoois">
                                    
                                        {it.stock != 0  ? (
                                            <>  
                                                <div className="d-flex">
                                                    <FontAwesomeIcon style={{fontSize: "20px" , marginLeft: "10px", paddingTop: "7px"}} icon={faCheckToSlot} className="ic992"/>
                                                    <p style={{marginLeft: "10px", marginTop: "5px"}} 
                                                    className="stock">{it?.stock >= 1000
                                                        ? `${(it?.stock / 1000).toFixed(1)}K`
                                                        : it?.stock}{" "}
                                                    </p>
                                                </div>
                                                <div onClick={
                                                    user.Authen? ()=>AddToCart(it.id)
                                                    : ()=>openModal("login")
                                                    } className="addtocart" style={{
                                                        marginLeft: "70px", backgroundColor: "orangered", width: "40px", height: "30px", padding: "3px", textAlign: "center", color: "white", borderRadius: "5px"
                                                    }}>
                                                    <FontAwesomeIcon icon={faCartArrowDown}/>
                                                </div>
                                            </>
                                            
                                        ) : (
                                            <>
                                                <div className="d-flex">
                                                    <FontAwesomeIcon style={{fontSize: "20px" , marginLeft: "10px"}} icon={faCheckToSlot} className="ic992"/>
                                                    <p className="stockOut"> Out Stock</p>
                                                </div>
                                                <div 
                                                    onClick={
                                                    !user.Authen ? ()=>openModal("login") : null
                                                    } className="OutStockCart" style={{
                                                        marginLeft: "40px", backgroundColor: "gray", width: "40px", 
                                                        height: "30px", padding: "3px", textAlign: "center", color: "white", borderRadius: "5px",
                                                        cursor: "not-allowed"
                                                    }}>
                                                    <FontAwesomeIcon icon={faCartArrowDown}/>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                            </AnimatedCard>
                               
                        </>
                        )})}
                        {visibleRecommentCount < products.length && (
                            <div style={{cursor: 'pointer', userSelect: "none" , 
                            backgroundColor: "orangered", marginLeft: "45%", 
                            marginTop: "2%", padding: "2px", height: "30px", borderRadius: "5px", color: "white"}} 
                            className=" btn showmore" onClick={handleLoadMoreRecmt}>
                                <p>See more</p>
                            </div>
                        )}
                    </div>
                    }
                </div>
            </div>

        </div>
    )

}

export default SearchPage;