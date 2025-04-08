import React, { useMemo } from 'react';
import '../Public Components/scss/cartComponent.scss'
import { CartContext } from "../../../Context/cartContext";
import { UserContext } from '../../../Context/userContext';
import { useContext, useEffect, useState } from 'react';
import LoginModal from './modal/login';
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTruck, faChartBar, faPlus, faMinus, faTrash, faSpinner, faCartArrowDown } from "@fortawesome/free-solid-svg-icons";
import  logo from '../../../img/E house store logo.jpg'
import { ProductContext } from '../../../Context/productContext';
import ResfulAPI from '../../RouteAPI/ResfulAPI';
import LoadingPage from './LoadingPage'
import { toast, ToastContainer } from 'react-toastify';

const CartComponent = () => {
  const IMGPATH = process.env.REACT_APP_IMG_APP_PATH;
  const { cart, AddCart, RemoveCart , fetchCart, RemoveItem } = useContext(CartContext);
  const { user, login, logout } = useContext(UserContext);
  const [loginModalup, setloginModal] = useState(false);
  const [visibleCount, setVisibleCount] = useState(12);
  const { products, category, addProduct, removeProduct, updateProduct, fetchProducts, fecthCategory } = useContext(ProductContext);
  const visibleProducts = products.slice(0, visibleCount);
  const [selectedItems, setSelectedItems] = useState([]);
  const [AddLoading, setAddLoading] = useState({});
  const [loadingItems, setLoadingItems] = useState({});
  const navigate = useNavigate();
  const loadingDefautl = {
    dataLoading: true,
    ImgLoading: true
  }
  const [loading, setLoading] = useState(loadingDefautl);
  const PriceDefault = {
        RealPrice: 0,
        SalePrice: 0
  }

  useEffect(() => {
      const loadData = async () => {
          setLoading(prev => ({ ...prev, dataLoading: true }));
          if (user?.Authen) {
              await fetchCart(user.token);
              await fetchProducts();
          }
          setLoading(prev => ({ ...prev, dataLoading: false }));
      };
      loadData();
  }, [user]);

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
    if (user?.Authen && user?.token) {
      fetchCart(user.token);
    }
  }, []);


  const handleCheckboxChange = (productId) => {
    setSelectedItems((prevSelected) => {
      const isSelected = prevSelected.includes(productId);
      if (isSelected) {
        return prevSelected.filter(id => id !== productId); 
      } else {
        return [...prevSelected, productId]; 
      }
    });
  };

  const orderSummary = useMemo(() => {
    if (!cart || !Array.isArray(cart)) {
      return { total: "0", discount: "0" };
    }
  
    let totalPrice = 0;
    let discountPrice = 0;
    cart.forEach(item => {
      if (item && item.product && selectedItems.includes(item.product.id)) {
        totalPrice += item.product.price * item.quantity;
        discountPrice += (item.product.price * item.product.discount / 100) * item.quantity;
      } else {
        console.warn(`Item with ID ${item?.id || "unknown"} has null or undefined product`);
      
      }
    });
  
    return {
      total: totalPrice.toLocaleString("vi-VN"),
      discount: discountPrice.toLocaleString("vi-VN"),
      lastTotal: (totalPrice - discountPrice).toLocaleString("vi-VN")
    };
  }, [selectedItems, cart]);
    
    const handleAddToCart = async (productId) => {

      if (!user?.data?.id || !user?.token) {
        openModal("login");
        return;
      }
      try {
        setAddLoading(
          (prev) => ({...prev, [productId]: true})
        )
        const response = await AddCart(productId, user.data.id, user.token);
        if (response.status === 201) {
          setAddLoading(
            (prev) => ({...prev, [productId]: true})
          )
          toast.success("Thêm vào giỏ hàng thành công! 🛒");
           setAddLoading(
          (prev) => ({...prev, [productId]: false})
        )
        } else {
          toast.error("Lỗi khi thêm sản phẩm vào giỏ hàng! ❌");
        }
      } catch (error) {
        console.error(error);
        toast.error("Lỗi server, vui lòng thử lại sau! 🚨");
      }
    };

    
    const updateQuantity = async (CartID, quantity) => {
      if (quantity < 1) {
        await RemoveItemP(CartID);
        return;
      }
      try {
        setLoadingItems(prev => ({ ...prev, [CartID]: true }));
        const response = await ResfulAPI.UpdateQuanity(CartID, quantity, user?.token);
        await fetchCart(user.token);
        if (response.status === 200) {
          toast.success("Cập nhật số lượng thành công!");
        }
        if (response?.status === 400) {
          toast.error("Sản phẩm trong kho đạt giới hạn 💀");
        }
      } catch (error) {
        console.error(error);

      } finally {
        setLoadingItems(prev => ({ ...prev, [CartID]: false }));
      }
    };
    
    const RemoveItemP = async(cartID) =>{
      try {
        setLoading(
          (prev)=>({...prev, dataLoading: true})
        )
        const response = await RemoveItem(cartID,user.token);
        if(response.status === 200){
          await fetchCart(user.token);
          setLoading(
            (prev)=>({...prev, dataLoading: false})
          )
          toast.success("Remove complete ✅");
          return;
        }
      } catch (error) {
        console.error("Lỗi Axios:", error);
      
        if (error.response) {
          console.log("Lỗi API:", error.response.data);
          console.log("Mã lỗi:", error.response.status);
      
          if (error.response.status === 400) {
            toast.error(error.response.data?.message || "Sản phẩm trong kho đạt giới hạn 💀");
            return;
          }
        } else if (error.request) {
          console.error("Request đã gửi nhưng không nhận phản hồi từ server:", error.request);
          toast.error("Không nhận được phản hồi từ server ❌");
        } else {
          console.error("Lỗi không liên quan đến request:", error.message);
          toast.error("Lỗi không xác định 🚨");
        }
      }
    }
    const handleLoadMore = () => {
        setVisibleCount((prev) => prev + 8);
    };

    const handleRedirect = () =>{

      const cartCheckout = cart.filter(c => selectedItems.includes(c.product.id));
      console.log(cartCheckout)
      navigate("/cart/checkOut", { state: { order: cartCheckout } }); 
    }


    if (loading.dataLoading || (!cart)) {
      return (
        <LoadingPage/>
      );
    }
    
  return (
    <div className='cart-contents row'>
      <ToastContainer/>
      <LoginModal show={loginModalup} close={()=>closeModal("login")}/>
        <div className='price'>
          <div className='checkout'>
            <p className='order-summary'>Order Summary</p>
            <div className='products'>
              <div className='total d-flex' style={{justifyContent: "space-between"}}>
                <p >Item{`(s)`} total:</p>
                <p style={{textDecoration: "line-through"}}>{orderSummary.total} VND</p>
              </div>
              <div className='discount d-flex' style={{justifyContent: "space-between"}}>
                <p>Item{`(s)`} discount: </p>
                <p>{orderSummary.discount} VND</p>
              </div>
              <div className='Lasttotal d-flex' style={{justifyContent: "space-between"}}>
                <p>Total: </p>
                <p style={{color: "orangered"}}>{orderSummary.lastTotal} VND</p>
              </div>
            </div>
            <div onClick={handleRedirect} className='checkout-btn' style={{marginBottom: "20px"}}>
                Checkout now
            </div>
            
          </div>
          <div>
            
          </div>
        </div>
        <div className='cart_left'>
          <ol className='routes row'>
            <li>
              <Link to="/" className='Homelink'>
                  Home
              </Link>
            </li>
            <span> {`>`} </span>
            <li>
              Cart
            </li>
          </ol>
          <div className='cart-storage'>
              <div className='free-shiporder d-flex'>
                  <FontAwesomeIcon icon={faTruck} className='fatruck'/>
                  <p>Free shipping on all orders</p>
              </div>
          </div>
          <div className='cart-recomment'>
          { cart.length === 0 ? (
            <div className='no-product'>
              <div className='empty-cart d-flex'>
                <FontAwesomeIcon icon={faChartBar} className='cf-1'/>
                <div className='row'>
                  <p className='cp-1'>Your shopping cart is empty</p>
                  <p className='cp-2'>Add your favorite items in it.</p>
                </div>
              </div>
              { user.Authen === false ? (
                <div className='no-login'>
                  <div onClick={() => openModal("login")} className='login-btn'>Sign in / Register</div>
                  <Link to="/" className='link'>
                    <div className='shoping-btn'>Shoping now</div>
                  </Link>
                </div>
              ) : (
                <div className='no-login'>
                  <Link to="/" className='link'>
                    <div className='shoping-btn'>Shoping now</div>
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <div className='cartContents'>
                { cart?.map((item, index) => {
                  const defaultImage = item?.product?.images?.find(img => img.is_default)
                    || item?.product?.images?.[0]
                    || { url: "default.jpg" };
                  return (
                    <div style={{width:"97%"}} key={item.id || index} className='cartItem d-flex'>
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(item?.product?.id || "")}
                        onChange={() => handleCheckboxChange(item?.product?.id || "")}
                        className='check'
                        style={{ marginRight: "10px" }}
                      />
                      <Link to={"/production/detail"} state={{ data: item.product }} >
                        <img
                          className='productIMG'
                          style={{height: "8rem", width: "7rem"}}
                          src={`${IMGPATH}=${defaultImage?.url || "default.jpg"}`}
                          alt={item?.product?.name || "Product"}
                        />
                      </Link>
                      <div className='Productinfo d-flex'>
                        <div className='left'>
                          <p className='name'>{item?.product?.name}</p>
                          <p className='brand'>{item?.product?.brand}</p>
                          <div className='d-flex'>
                            <p className='SalePrice'>{`đ${(item?.product?.price - ((item?.product?.price / 100) * item?.product?.discount)).toLocaleString("vi-VN")}`}</p>
                            <p className='Realprice'>{`đ${item?.product?.price.toLocaleString("vi-VN")}`}</p>
                          </div>
                        </div>
                        <div className='right'>
                          <div className='Trash'>
                            <FontAwesomeIcon onClick={() => RemoveItemP(item.id)} icon={faTrash}/>
                          </div>
                          <div className='Quantity d-flex'>
                            <div onClick={() => updateQuantity(item.id, (item.quantity - 1))} className='Minus'>
                              <FontAwesomeIcon icon={faMinus}/>
                            </div>
                            <div>
                              {loadingItems[item.id] ? (
                                <div className='divQttSp'>
                                  <FontAwesomeIcon className='QuantityLoadingIC' icon={faSpinner}/>
                                </div>
                              ) : (
                                <div className='QttVl'>
                                  <p>{item.quantity}</p>
                                </div>
                              )}
                            </div>
                            <div onClick={() => updateQuantity(item.id, (item.quantity + 1))} className='Plus'>
                              <FontAwesomeIcon icon={faPlus}/>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
            
             <div className='add-items'>
                  <div className='header'>
                      <p>Items you may want to add</p>
                  </div>
                  <div className='items-container  d-flex flex-wrap justify-content-between'>
                  {visibleProducts.map((item, index) => { 
                    const defaultImage = item.images?.find(img => img.is_default) || item.images?.[0];
                    return(
                      <div key={index} className="card" style={{ width: "15rem" }}>
                        <Link key={index} to="/production/detail" state={{ data: item }}>
                          <img style={{height: "16rem", with: "100%"}} src={`${IMGPATH}=${defaultImage?.url || "default.jpg"}`} className="card-img-top" alt="..." />
                        </Link>
                          <div className="card-body">
                             <div className='pDiv'>
                              <p  style={{
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                maxWidth: "200px",
                                height: "20px",
                                paddingTop: "2px"
                              }}
                               className='name'>{item.name}</p>
                              <div className='d-flex'>
                              <p className='salePrice'>{`đ${(item.price - ((item.price / 100) * item.discount)).toLocaleString("vi-VN")}`}</p>
                              <p className='realPrice'>{`đ${item.price.toLocaleString("vi-VN")}`}</p>
                              </div>
                             </div>
                             <button disabled={!AddLoading} style={{cursor: "pointer"}} onClick={() => handleAddToCart(item.id)} className='addCart'>
                              {
                                AddLoading[item.id]? (
                                  <div style={{fontSize: "20px"}}>
                                    Loading...
                                  </div>
                                ):(
                                  <FontAwesomeIcon icon={faCartArrowDown}/>)
                              }
                             
                            </button>
                          </div>
                     </div>
                    )
                  })}
                  {visibleCount < products.length && (
                    <div style={{cursor: 'pointer', userSelect: "none"}} onClick={handleLoadMore} className='viewmore-btn'>
                     view more +
                    </div>
                  )}
                  </div>
                  
             </div>
          </div>
        </div>
       
    </div>
  );
};

export default CartComponent;