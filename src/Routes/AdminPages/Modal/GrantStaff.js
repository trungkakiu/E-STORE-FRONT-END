import { useContext } from "react";
import { Modal } from "react-bootstrap";
import { motion } from "framer-motion";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ResfulAPI from "../../RouteAPI/ResfulAPI";
import { UserContext } from "../../../Context/userContext";
import "../Scss/GrantStaff.scss";

const modalVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } },
};

const GrantStaff = ({ show, close, data }) => {
  const { user } = useContext(UserContext);
  const userID = data;
  const GrantStaffRequest = async () => {
    try {
      const response = await ResfulAPI.GrantStaffRequest(userID, user.token);
      if (response.status === 200) {
        toast.success("Grant user complete ✅");
        setTimeout(() => {
          close();
        }, 1000);
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
          <div className="GrantStaff-container">
            <div className="contents">
              <p className="p7762">
                Are you sure you want to upgrade this user to staff? 🤓
              </p>
              <div className="d-flex button">
                <p onClick={() => close()} className="disdell">
                  Cancel
                </p>
                <p onClick={() => GrantStaffRequest()} className="dell">
                  Confirm
                </p>
              </div>
            </div>
          </div>
        </Modal.Body>
      </motion.div>
    </Modal>
  );
};

export default GrantStaff;
