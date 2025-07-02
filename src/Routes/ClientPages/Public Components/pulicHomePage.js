import { useState, useEffect, useContext } from "react";
import "./scss/publicHomePage.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAward, faBell } from "@fortawesome/free-solid-svg-icons";
import CardItem from "./CardItem";
import "bootstrap/dist/css/bootstrap.min.css";
import { ProductContext } from "../../../Context/productContext";
import banner from "../../../img/image.png";
import banner2 from "../../../img/Screenshot 2025-03-05 222716.png";
import banner01 from "../../../img/ProductIMG/TopicIMG/img_three_banner_1.webp";
import banner02 from "../../../img/ProductIMG/TopicIMG/img_three_banner_2.webp";
import banner03 from "../../../img/ProductIMG/TopicIMG/img_three_banner_3.webp";
import { CartContext } from "../../../Context/cartContext";
import ResfulAPI from "../../RouteAPI/ResfulAPI";
import { UserContext } from "../../../Context/userContext";
import { toast, ToastContainer } from "react-toastify";
import CategoryContents from "./modal/CateGoryContents";
import LoginModal from "../Public Components/modal/login";

const PublicHomePage = () => {
  const { user } = useContext(UserContext);
  const { products, category, fetchProducts } = useContext(ProductContext);
  const { fetchCart } = useContext(CartContext);

  const [visibleCount, setVisibleCount] = useState(10);
  const [randomProducts, setRandomProducts] = useState([5]);
  const [isOpen, setIsOpen] = useState({ login: false, cateContent: false });
  const [modalData, setModalData] = useState({ category: [] });

  const visibleProducts = products.slice(0, visibleCount);

  const showToast = (id, message, type, containerId) => {
    if (toast.isActive(id)) {
      toast.update(id, { render: message, type, containerId, autoClose: 5000 });
    } else {
      toast[type](message, { toastId: id, containerId });
    }
  };

  const openModal = (code, data) => {
    setIsOpen((prev) => ({ ...prev, [code]: true }));
    if (code === "CateContent") {
      const filtered = products.filter((m) => m.category_id === data.id);
      setModalData({ category: { ProductFiler: filtered, Cate: data } });
    }
  };

  const closeModal = (code) => {
    setIsOpen((prev) => ({ ...prev, [code]: false }));
  };

  const getRandomProducts = (products, count = 5) => {
    return [...products].sort(() => 0.5 - Math.random()).slice(0, count);
  };

  const AddCart = async (ProductID) => {
    try {
      const res = await ResfulAPI.AddCart(ProductID, user.data.id, user.token);
      if (res.status === 201) {
        showToast("success", "Added to cart!", "success", "HomePage");
        fetchCart(user.token);
      } else if (res.status === 401) {
        showToast("error", "Out of stock!", "error", "HomePage");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleLoadMore = () => setVisibleCount((prev) => prev + 10);

  useEffect(() => {
    if (user?.Authen) {
      fetchCart(user.token);
      fetchProducts();
    }
  }, [user]);

  useEffect(() => {
    setRandomProducts(getRandomProducts(products));
    const interval = setInterval(() => {
      setRandomProducts(getRandomProducts(products));
    }, 5000);
    return () => clearInterval(interval);
  }, [products]);

  return (
    <div className="Container">
      <LoginModal show={isOpen.login} close={() => closeModal("login")} />
      <ToastContainer
        containerId="HomePage"
        position="bottom-center"
        autoClose={3000}
      />

      <div className="noice d-flex align-items-center">
        <FontAwesomeIcon icon={faBell} color="#ADFFA2" className="bell col-1" />
        <p className="noicecontent">
          E - STORE is working with Vietnam's e-commerce authority to register
        </p>
      </div>

      <div className="banner">
        <img className="banner_img" src={banner} alt="Banner" />
      </div>

      <div className="product-contents">
        <div className="banner_2">
          <img className="banner_2_img" src={banner2} alt="Banner2" />
        </div>

        <div className="best-salers">
          {randomProducts.map((item, index) => (
            <CardItem key={index} data={item} />
          ))}
        </div>

        <div className="banner-img d-flex">
          {[banner01, banner02, banner03].map((src, i) => (
            <img key={i} src={src} alt={`banner${i}`} />
          ))}
        </div>

        <div className="cateBlog">
          <div className="d-flex header">
            <FontAwesomeIcon className="icoo92" icon={faAward} />
            <p>Categories</p>
          </div>
          <div className="cateBody d-flex flex-wrap">
            {category?.map((it, index) => (
              <p
                key={index}
                onClick={() => openModal("CateContent", it)}
                className="item"
              >
                {it.name}
              </p>
            ))}
          </div>
        </div>

        <CategoryContents
          show={isOpen.cateContent}
          close={() => closeModal("CateContent")}
          data={modalData.category}
          addCart={AddCart}
        />

        <div className="Product-show">
          <div className="title">
            <p>You might also like these products</p>
          </div>
          <div className="showP998a">
            <div className="best-salers d-flex flex-wrap justify-content-between">
              {visibleProducts.map((item, index) => (
                <CardItem key={index} data={item} width="100%" height="15rem" />
              ))}
            </div>
          </div>
          {visibleCount < products.length && (
            <div
              className="showmore"
              onClick={handleLoadMore}
              style={{ cursor: "pointer" }}
            >
              <p>See more</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PublicHomePage;
