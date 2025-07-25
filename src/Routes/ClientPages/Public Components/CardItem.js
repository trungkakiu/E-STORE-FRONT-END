import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AnimatedCard from "./modal/AnimatedCard";
import "./scss/CardItem.scss";
import { faCartArrowDown, faSpinner } from "@fortawesome/free-solid-svg-icons";
import ResfulAPI from "../../RouteAPI/ResfulAPI";
import { useContext, useState } from "react";
import { UserContext } from "../../../Context/userContext";
import { toast } from "react-toastify";
import { CartContext } from "../../../Context/cartContext";
import { Link } from "react-router-dom";
import { ProductContext } from "../../../Context/productContext";
import LoginModal from "./modal/login";

const CartItem = ({ data, width, height }) => {
  const { user } = useContext(UserContext);
  const { products } = useContext(ProductContext);
  const IMGPATH = process.env.REACT_APP_IMG_APP_PATH;
  const { cart, fetchCart } = useContext(CartContext);
  const [imageLoaded, setImageLoaded] = useState({});
  const StateDefautl = {
    login: false,
    cateContent: false,
  };
  const [addingToCart, setAddingToCart] = useState({});
  const [isOpen, setisOpen] = useState(StateDefautl);
  const handleImageLoad = (id) => {
    setImageLoaded((prev) => ({ ...prev, [id]: true }));
  };
  const ModaldataDefault = {
    category: [],
  };
  const [ModalData, setModalData] = useState(ModaldataDefault);
  const showToast = (id, message, type, containerId) => {
    if (toast.isActive(id)) {
      toast.update(id, {
        render: message,
        type,
        containerId: containerId,
        autoClose: 5000,
        closeOnClick: true,
      });
    } else {
      toast[type](message, {
        toastId: id,
        containerId: containerId,
      });
    }
  };

  const openModal = (code, data) => {
    if (code === "login") {
      setisOpen((prev) => ({ ...prev, login: true }));
    }
    if (code === "CateContent") {
      setisOpen((prev) => ({ ...prev, cateContent: true }));
      const ProductFiler =
        products?.filter((m) => m.category_id === data.id) || {};
      const NewData = {
        ProductFiler: ProductFiler,
        Cate: data,
      };
      setModalData((prev) => ({ ...prev, category: NewData }));
    }
  };
  const closeModal = (code) => {
    if (code === "login") {
      setisOpen((prev) => ({ ...prev, login: false }));
    }
    if (code === "CateContent") {
      setisOpen((prev) => ({ ...prev, cateContent: false }));
    }
  };

  const AddCart = async (ProductID) => {
    setAddingToCart((prev) => ({ ...prev, [ProductID]: true }));

    try {
      const response = await ResfulAPI.AddCart(
        ProductID,
        user.data.id,
        user.token
      );

      if (response.status === 201) {
        showToast("success", "Add product complete!", "success", "HomePage");
        fetchCart(user.token);
      } else if (response.status === 401) {
        showToast("error", "Out of stock!", "error", "HomePage");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        setAddingToCart((prev) => ({ ...prev, [ProductID]: false }));
      }, 500);
    }
  };

  const defaultImage =
    data?.images?.find((img) => img.is_default) || data.images?.[0];
  return (
    <AnimatedCard key={data?.id}>
      <LoginModal show={isOpen.login} close={() => closeModal("login")} />
      <div key={data?.id} className="linktodetail">
        <div
          className="card"
          style={{
            width: { width } || "8.5rem",
            height: { height } || "25rem",
          }}
        >
          {!imageLoaded[data.id] && (
            <div
              className="image-placeholder"
              style={{
                width: { width } || "8.5rem",
                height: { height } || "25rem",
              }}
            >
              <div className="loading-spinner">
                <FontAwesomeIcon icon={faSpinner} className="ic8s" />
              </div>
            </div>
          )}
          <Link
            to="/production/detail"
            className="linktodetail"
            state={{ data: data }}
          >
            <img
              className="productIMG"
              style={{
                height: "19rem",
                width: "100%",
                display: imageLoaded[data.id] ? "block" : "none",
              }}
              src={`${IMGPATH}=${defaultImage?.url || "default.jpg"}`}
              onLoad={() => handleImageLoad(data.id)}
              onError={() => handleImageLoad(data.id)}
              alt={data?.name}
            />
          </Link>
          <div className="card-body">
            <span className="PrdName">{data?.name}</span>
            <div className="d-flex divoois">
              <div className="Sold_counts">
                <span style={{ paddingRight: "5px" }}>Sold</span>
                <span className="sold">
                  {data?.sold >= 1000
                    ? `${(data?.sold / 1000).toFixed(1)}K`
                    : data?.sold}{" "}
                </span>
              </div>
              <div className="prdPrice">
                <span>{Number(data?.price).toLocaleString("vi-VN")}đ</span>
              </div>
              {data.stock != 0 ? (
                <>
                  <div
                    className={`addtocart ${
                      addingToCart[data.id] ? "disabled" : ""
                    }`}
                    onClick={() => {
                      if (addingToCart[data.id]) return;

                      if (user.Authen) {
                        AddCart(data?.id);
                      } else {
                        openModal("login");
                      }
                    }}
                  >
                    {addingToCart[data.id] ? (
                      <FontAwesomeIcon icon={faSpinner} spin />
                    ) : (
                      <FontAwesomeIcon icon={faCartArrowDown} />
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div className="outStock">
                    <span>Out stock</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </AnimatedCard>
  );
};

export default CartItem;
