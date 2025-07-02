import { useState, useEffect, useContext } from "react";
import { Modal } from "react-bootstrap";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faTrash } from "@fortawesome/free-solid-svg-icons";
import "../Scss/ProductReviews.scss";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ResfulAPI from "../../RouteAPI/ResfulAPI";
import DfImg from "../../../img/UserIMG/avatar/boy02.jpg";
import { UserContext } from "../../../Context/userContext";

const modalVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } },
};

const ProductReviews = ({ show, close, data }) => {
  const [ProductRv, setProductRv] = useState([]);
  const [product, setProduct] = useState(data);
  const { user } = useContext(UserContext);

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

  const FetchProductRv = async () => {
    try {
      const rs = await ResfulAPI.fetchProductRatting(data.id);
      if (rs.status === 200) {
        setProductRv(rs.data);
        return;
      }
    } catch (error) {
      console.error(error);
      return;
    }
  };

  const RemoveComment = async (PrdID) => {
    try {
      const rs = await ResfulAPI.RemoveComment(PrdID, user.token);
      if (rs.status === 200) {
        showToast(
          "success",
          "Delete user ratting complete !",
          "success",
          "ProductRating"
        );
        FetchProductRv();
        return;
      }
      if (rs.status === 403) {
        showToast("error", "Forbiddent!", "error", "ProductRating");
        return;
      }
      if (rs.status === 404) {
        showToast("error", "Server error!", "error", "ProductRating");
        return;
      }
    } catch (error) {
      console.error(error);
      return;
    }
  };
  useEffect(() => {
    if (data) {
      setProduct(data);
      FetchProductRv();
    } else {
      close();
    }
  }, [show]);

  return (
    <Modal show={show} onHide={close} animation={false} size="lg">
      <motion.div
        variants={modalVariants}
        initial="hidden"
        animate={show ? "visible" : "hidden"}
        exit="exit"
      >
        <Modal.Body>
          <ToastContainer containerId={"ProductRating"} />
          <div className="ProductReviews-container">
            <div className="Header d-flex">
              <p className="name">{product.name}</p>
              <p className="rate d-flex">
                <p className="rateCount">{product?.rate}</p>
                {[...Array(5)].map((_, index) => (
                  <FontAwesomeIcon
                    key={index + 1}
                    icon={faStar}
                    className={`star ${
                      index + 1 <= product?.rate ? "StarActive" : "Star"
                    }`}
                  />
                ))}
              </p>
            </div>
            <div className="PrdRV-contents">
              {ProductRv.length === 0 ? (
                <>
                  <div className="noReview">
                    <p>This product has no reviews yet.</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="Reviews">
                    {ProductRv?.map((it, id) => (
                      <>
                        <div className="item d-flex">
                          <img
                            src={DfImg}
                            style={{ width: "5rem", height: "5rem" }}
                          />
                          <p className="comment">{it.comment}</p>
                          <div className="rightSite">
                            <FontAwesomeIcon
                              onClick={() => RemoveComment(it.id)}
                              className="trash"
                              icon={faTrash}
                            />
                            <div className="d-flex jaswd">
                              <p>{it.rating}</p>
                              {[...Array(5)].map((_, index) => (
                                <FontAwesomeIcon
                                  key={index + 1}
                                  icon={faStar}
                                  className={`star ${
                                    index + 1 <= it.rating
                                      ? "StarActive"
                                      : "Star"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                      </>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </Modal.Body>
      </motion.div>
    </Modal>
  );
};

export default ProductReviews;
