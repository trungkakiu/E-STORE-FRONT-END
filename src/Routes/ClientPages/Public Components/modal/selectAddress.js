import { useState, useEffect, useContext } from "react";
import { Modal, Button } from "react-bootstrap";
import { motion } from "framer-motion";
import "../scss/selectAddress.scss";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ResfulAPI from "../../../RouteAPI/ResfulAPI";
import { UserContext } from "../../../../Context/userContext";
import AddressDetail from "./AddressDetail";
import AddnewAddress from "./addNewAddress";

const modalVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } },
};

const SelectAddress = ({ show, close, data }) => {
  const [modalData, setModalData] = useState(data);
  const { user } = useContext(UserContext);
  const stateDefault = {
    updateAdd: false,
    updateAddData: "",
    addNewAdd: false,
  };
  const [modalState, setModalState] = useState(stateDefault);

  const showToast = (id, message, type) => {
    if (toast.isActive(id)) {
      toast.update(id, {
        render: message,
        type,
        containerId: "setDefault",
        autoClose: 5000,
        closeOnClick: true,
      });
    } else {
      toast[type](message, {
        toastId: id,
        containerId: "setDefault",
      });
    }
  };

  const fetchAddress = async () => {
    try {
      const rs = await ResfulAPI.fetchAdd(user.token);
      if (rs.status === 200) {
        setModalData(rs.data);
        return;
      }
      if (rs.status === 401) {
        showToast(
          "Invalid-request",
          "Invalid request or no access 🐝",
          "error"
        );
        return;
      }
      if (rs.status === 404) {
        showToast("Invalid-request", "User does not exist 🐝", "error");
        return;
      }
    } catch (error) {
      console.error(error);
      return;
    }
  };

  const setDefaultAdd = async (AddID) => {
    try {
      if (AddID) {
        const rs = await ResfulAPI.SetDefaultAddress(AddID, user.token);
        if (rs.status === 200) {
          showToast("success", "Set address default !", "success");
          await fetchAddress();
        }
        if (rs.status === 401) {
          showToast("forbidden", "forbidden", "error");
          await fetchAddress();
        }
        if (rs.status === 404) {
          showToast("Missing", "Missing address", "error");
          await fetchAddress();
        }
      }
      return;
    } catch (error) {
      showToast("Error", "Error while set default address", "error");
      return;
    }
  };

  const openModal = (code, data) => {
    if (code === "1") {
      setModalState((prev) => ({ ...prev, updateAdd: true }));
      setModalState((prev) => ({ ...prev, updateAddData: data }));
      return;
    }
    if (code === "2") {
      setModalState((prev) => ({ ...prev, addNewAdd: true }));
      return;
    }
  };

  const closeModal = async (code) => {
    if (code === "1") {
      setModalState((prev) => ({ ...prev, updateAdd: false }));
      setModalState((prev) => ({ ...prev, updateAddData: "" }));
    }
    if (code === "2") {
      setModalState((prev) => ({ ...prev, addNewAdd: false }));
    }
    await fetchAddress();
  };

  useEffect(() => {
    if (!data) {
      close();
    }
  }, [show]);

  const handleCloseModal = () => {
    close();
    return;
  };
  return (
    <Modal show={show} onHide={handleCloseModal} animation={false}>
      <AddressDetail
        show={modalState.updateAdd}
        close={() => closeModal("1")}
        data={{
          AddressData: modalState?.updateAddData,
          onlyDefault: modalData?.length < 2 ? true : false,
        }}
      />
      <AddnewAddress
        show={modalState.addNewAdd}
        close={() => closeModal("2")}
        data={{ AddressData: modalData }}
      />
      <motion.div
        variants={modalVariants}
        initial="hidden"
        animate={show ? "visible" : "hidden"}
        exit="exit"
      >
        <Modal.Body>
          <ToastContainer containerId={"setDefault"} />
          <div className="select-address">
            <div className="header">
              <p>My Address</p>
            </div>
            {modalData?.length > 0 ? (
              <>
                <div className="contents">
                  {modalData
                    ?.sort(
                      (a, b) => (b.is_default ? 1 : 0) - (a.is_default ? 1 : 0)
                    )
                    ?.map((Item, id) => (
                      <>
                        <div key={id} className="d-flex cardIT">
                          <input
                            checked={Item.is_default}
                            onChange={() => setDefaultAdd(Item.id)}
                            type="checkbox"
                          />
                          <div style={{ width: "100%" }}>
                            <div
                              style={{ justifyContent: "space-between" }}
                              className="d-flex div_s87"
                            >
                              <div className="d-flex">
                                <p className="p_hs6">{Item.full_name}</p>
                                <p className="p_js6">{Item.phone_number}</p>
                              </div>
                              <p
                                onClick={() => openModal("1", Item)}
                                style={{
                                  paddingTop: "5px",
                                  color: "blue",
                                  marginRight: "20px",
                                  cursor: "pointer",
                                  userSelect: "none",
                                }}
                              >
                                Update
                              </p>
                            </div>
                            <p className="p_hs2">{Item.state}</p>
                            <p className="p_77sa">{`${Item.street_address}, ${Item.district}, ${Item.city}`}</p>

                            {Item.is_default && (
                              <div className="idDefault">
                                <p>Default</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </>
                    ))}
                </div>
              </>
            ) : (
              <>
                <div className="contents-noaddress">
                  <p>
                    You currently do not have any shipping addresses, please add
                    a new one now.
                  </p>
                  <button onClick={() => openModal("2")}>Add now</button>
                </div>
              </>
            )}

            <div className="footeModal d-flex">
              <button onClick={handleCloseModal} className="btn btn-danger">
                Cancer
              </button>
              <button onClick={handleCloseModal} className="btn btn-success">
                Confirm
              </button>
            </div>
          </div>
        </Modal.Body>
      </motion.div>
    </Modal>
  );
};

export default SelectAddress;
