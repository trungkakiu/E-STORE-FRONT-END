import { Modal } from "react-bootstrap";
import { motion } from "framer-motion";
import "../scss/login.scss";
import "react-toastify/dist/ReactToastify.css";

const modalVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } },
};

const ModalForm = ({ show, close }) => {
  return (
    <Modal show={show} onHide={close} animation={false}>
      <motion.div
        variants={modalVariants}
        initial="hidden"
        animate={show ? "visible" : "hidden"}
        exit="exit"
      >
        <Modal.Body>
          <ToastContainer />
        </Modal.Body>
      </motion.div>
    </Modal>
  );
};

export default ModalForm;
