import { useState, useContext } from "react";
import { Modal } from "react-bootstrap";
import { motion } from "framer-motion";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ResfulAPI from "../../RouteAPI/ResfulAPI";
import { UserContext } from "../../../Context/userContext";
import "../Scss/DeleteProduct.scss";
import { useNavigate } from "react-router-dom";

const modalVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } },
};

const DeleteProduct = ({ show, close, data }) => {
  const { user } = useContext(UserContext);
  const ProductID = data;
  const [isLoad, setIsLoad] = useState(false);
  const navigate = useNavigate();

  const deleteProduct = async () => {
    try {
      setIsLoad(true);
      const toastId = toast.loading("Deleting product...");
      const rs = await ResfulAPI.DeleteProduct(ProductID, user.token);
      if (rs.status === 200) {
        toast.update(toastId, {
          render: "Product deleted successfully !",
          type: "success",
          isLoading: false,
          autoClose: 3000,
        });
        setIsLoad(false);
        setTimeout(() => {
          navigate("/Admin/Product/allProducts");
        }, 1000);
        return;
      } else if (rs.status === 401) {
        toast.update(toastId, {
          render: "You do not have permission to delete this product. !",
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
        setIsLoad(false);
        return;
      } else if (rs.status === 404) {
        toast.update(toastId, {
          render: "product deletion failed !",
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
        setIsLoad(false);
        return;
      }
    } catch (error) {
      console.error(error);
      return;
    }
  };

  return (
    <Modal show={show} onHide={close} animation={false}>
      <motion.div
        variants={modalVariants}
        initial="hidden"
        animate={show ? "visible" : "hidden"}
        exit="exit"
      >
        <Modal.Body style={{ height: "40%" }}>
          <ToastContainer />
          <div className="DeleteProduct-container">
            <div className="contents">
              <p className="p7762">
                Are you sure you want to delete this product? 🤓
              </p>
              <div className="d-flex button">
                <button
                  onClick={() => close()}
                  className={isLoad ? "btn disdell-active" : "btn disdell"}
                >
                  Cancel
                </button>
                <button
                  onClick={() => deleteProduct()}
                  className={isLoad ? "btn dell-active" : "btn dell"}
                >
                  {isLoad ? "Deleting..." : "Confirm"}
                </button>
              </div>
            </div>
          </div>
        </Modal.Body>
      </motion.div>
    </Modal>
  );
};

export default DeleteProduct;
