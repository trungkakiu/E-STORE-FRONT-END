import { useState, useEffect, useContext } from "react";
import { Modal } from "react-bootstrap";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UserContext } from "../../../Context/userContext";
import ResfulAPI from "../../RouteAPI/ResfulAPI";
import "../Scss/UpdateCategory.scss";
import { ProductContext } from "../../../Context/productContext";

const modalVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } },
};

const UpdateCategory = ({ show, close, data, data2 }) => {
  const { user } = useContext(UserContext);
  const { products } = useContext(ProductContext);
  const [cateName, setCategoryName] = useState("");
  const [parent_id, setParent_id] = useState(null);
  const [selectedParentId, setSelectedParentId] = useState(null);

  useEffect(() => {
    if (data) {
      setCategoryName(data.name || "");
      setParent_id(data.parent_id || null);
      setSelectedParentId(data.parent_id || null);
    }
  }, [show, data]);

  const updateCategory = async () => {
    if (!cateName.trim()) {
      toast.error("Category name cannot be empty! ❌");
      return;
    }

    try {
      const response = await ResfulAPI.UpdateCategory(
        { CataID: data.id, cateName, parent_id },
        user.token
      );
      if (response.status === 200) {
        toast.success("Category updated successfully ✅");
        setTimeout(() => {
          close();
        }, 500);
      }
    } catch (error) {
      console.error(error);
      toast.error("Error while updating category 😾");
    }
  };

  return (
    <Modal show={show} onHide={close} animation={true}>
      <motion.div
        variants={modalVariants}
        initial="hidden"
        animate={show ? "visible" : "hidden"}
        exit="exit"
      >
        <Modal.Body>
          <ToastContainer />
          <div className="addCategoris">
            <div className="title">
              <p>Update Category</p>
            </div>
            <div className="inputraw">
              <label>Category Name</label>
              <input
                value={cateName}
                onChange={(e) => setCategoryName(e.target.value)}
              />
              <div className="category-parent">
                <p>Parent Category:</p>
                <div className="listcate">
                  {Array.isArray(data2) &&
                    data2
                      .filter((item) => item.id !== data.id)
                      .map((item) => (
                        <div
                          key={item.id}
                          className={`item ${
                            selectedParentId === item.id ? "itemchoose" : ""
                          }`}
                          onClick={() => {
                            setSelectedParentId(item.id);
                            setParent_id(item.id);
                          }}
                        >
                          {item.name}
                        </div>
                      ))}
                </div>
              </div>
              <div className="d-flex button">
                <div onClick={close} className="btn cancel">
                  Cancel
                </div>
                <div onClick={updateCategory} className="btn success">
                  Submit
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
      </motion.div>
    </Modal>
  );
};

export default UpdateCategory;
