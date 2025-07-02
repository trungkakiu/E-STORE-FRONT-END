import { useState, useEffect, useContext } from "react";
import { Modal } from "react-bootstrap";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UserContext } from "../../../Context/userContext";
import "../Scss/addCategoris.scss";
import { ProductContext } from "../../../Context/productContext";
import ResfulAPI from "../../RouteAPI/ResfulAPI";

const modalVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } },
};

const AddCategory = ({ show, close, data }) => {
  const { user } = useContext(UserContext);
  const {
    category,
    products,
    addCategory,
    addProduct,
    removeProduct,
    updateProduct,
    fecthCategory,
  } = useContext(ProductContext);
  const [cateName, setCategoryName] = useState("");
  const [parent_id, setParent_id] = useState("");

  const [selectedIndex, setSelectedIndex] = useState("");

  const addNewCategory = async () => {
    try {
      console.log("dt: ", data);
      const resopne = await ResfulAPI.AddCategory(
        { cateName, parent_id },
        user.token
      );
      if (resopne.status === 201) {
        toast.success("Create successfuly new category 🤓");
        setTimeout(() => {
          close();
        }, 1000);
      }
      return;
    } catch (error) {
      console.log(error);
      toast.error("Error while fetch categories😾");
      return;
    }
  };
  useEffect(() => {
    setSelectedIndex("");
    setCategoryName("");
    setParent_id("");
  }, [show]);

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
            <div className="title ">
              <p>Add Category</p>
            </div>
            <div className="inputraw">
              <lable>Category name</lable>
              <input
                value={cateName}
                onChange={(e) => setCategoryName(e.target.value)}
              />
              <div className="category-parent">
                <p>Parent Category:</p>
                <div className="listcate">
                  {data?.map((item, index) => (
                    <div
                      key={index}
                      className={`item ${
                        selectedIndex === index ? "itemchoose" : ""
                      }`}
                      onClick={() => {
                        setSelectedIndex(index);
                        setParent_id(item.id);
                      }}
                    >
                      {item.name}
                    </div>
                  ))}
                </div>
              </div>
              <div className="d-flex button">
                <div onClick={() => close()} className="btn cancel">
                  Cancel
                </div>
                <div onClick={addNewCategory} className="btn success">
                  Summit
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
      </motion.div>
    </Modal>
  );
};

export default AddCategory;
