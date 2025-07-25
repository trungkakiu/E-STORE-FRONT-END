import { faLocationDot, faTicket } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useEffect, useState } from "react";
import ResfulAPI from "../../RouteAPI/ResfulAPI";
import { UserContext } from "../../../Context/userContext";
import { toast, ToastContainer } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import AddnewAddress from "./modal/addNewAddress";
import SelectAddress from "./modal/selectAddress";
import VoucherList from "./modal/ChooseVoucher";
import "./scss/checkOut.scss";
import { CartContext } from "../../../Context/cartContext";

const CheckOut = () => {
  const stateModalDefault = {
    addAddress: false,
    selectAddress: false,
    chooseVoucher: false,
  };
  const [selectedVouchers, setSelectedVouchers] = useState({});
  const IMGPATH = process.env.REACT_APP_IMG_APP_PATH;
  const [userAdd, setUserAdd] = useState([]);
  const location = useLocation();
  const { user } = useContext(UserContext);
  const { cart, fetchCart } = useContext(CartContext);
  const order = location.state?.order;
  const [UserVoucher, setUserVoucher] = useState([]);
  const [modalState, setModalState] = useState(stateModalDefault);
  const navigate = useNavigate();
  const [ModalData, setModalData] = useState();
  const [originalVouchers, setOriginalVouchers] = useState([]);

  const showToast = (id, message, type) => {
    if (toast.isActive(id)) {
      toast.update(id, {
        render: message,
        type,
        containerId: "CheckOut",
        autoClose: 5000,
        closeOnClick: true,
      });
    } else {
      toast[type](message, {
        toastId: id,
        containerId: "CheckOut",
      });
    }
  };

  const fetchAddress = async () => {
    try {
      const rs = await ResfulAPI.fetchAdd(user.token);
      if (rs.status === 200) {
        setUserAdd(rs.data);
      } else if (rs.status === 401) {
        showToast(
          "Invalid-request",
          "Invalid request or no access 🐝",
          "error"
        );
      } else if (rs.status === 404) {
        showToast("Invalid-request", "User does not exist 🐝", "error");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchUserVoucher = async () => {
    try {
      const rs = await ResfulAPI.fetchUserVoucher(user.token);
      if (rs.status === 200) {
        setUserVoucher(rs.data);
        setOriginalVouchers(rs.data);
      } else {
        showToast("error", "Server Error", "error");
      }
    } catch (error) {
      showToast("error", "Server Error", "error");
      console.error(error);
    }
  };

  useEffect(() => {
    if (user.Authen === true && order?.length > 0) {
      fetchAddress();
      fetchUserVoucher();
    } else {
      navigate("/production/cart", { replace: true });
    }
  }, []);

  const openModal = async (code, data) => {
    if (code === "1") {
      setModalState((prev) => ({ ...prev, addAddress: true }));
    }
    if (code === "2") {
      setModalState((prev) => ({ ...prev, selectAddress: true }));
    }
    if (code === "3") {
      setModalState((prev) => ({ ...prev, chooseVoucher: true }));
      setModalData(data);
    }
  };

  const closeModal = async (code) => {
    if (code === "1") {
      setModalState((prev) => ({ ...prev, addAddress: false }));
      await fetchAddress();
    }
    if (code === "2") {
      setModalState((prev) => ({ ...prev, selectAddress: false }));
      await fetchAddress();
    }
    if (code === "3") {
      setModalState((prev) => ({ ...prev, chooseVoucher: false }));
    }
  };

  const handleVoucherSelect = (voucherId, parentID) => {
    setSelectedVouchers((prev) => {
      const oldVoucherId = prev[parentID]?.code;
      const selectedVoucher = originalVouchers.find(
        (v) => v.code === voucherId
      );
      const newSelected = { ...prev, [parentID]: selectedVoucher };

      setUserVoucher((prevVouchers) => {
        let updatedVouchers = [...prevVouchers];
        if (oldVoucherId) {
          const oldVoucher = originalVouchers.find(
            (v) => v.code === oldVoucherId
          );
          if (oldVoucher) {
            updatedVouchers = [...updatedVouchers, oldVoucher];
          }
        }
        updatedVouchers = updatedVouchers.filter((v) => v.code !== voucherId);
        return updatedVouchers;
      });

      return newSelected;
    });
  };

  const calculateTotalWithVoucher = (item) => {
    const basePrice =
      item.product.price - (item.product.price / 100) * item.product.discount;
    const totalBeforeVoucher = basePrice * item.quantity;
    const voucher = selectedVouchers[item.id];
    if (voucher && voucher.discount_percent) {
      const discountAmount =
        totalBeforeVoucher * (voucher.discount_percent / 100);
      return Math.max(totalBeforeVoucher - discountAmount, 0);
    }
    return totalBeforeVoucher;
  };

  const calculateCartTotal = () => {
    return order.reduce(
      (sum, item) => sum + calculateTotalWithVoucher(item),
      0
    );
  };

  const handleCreateOrder = async () => {
    const defaultAddress = userAdd?.find((a) => a.is_default === true);
    if (!defaultAddress) {
      showToast(
        "no-address",
        "Please select a default shipping address!",
        "error"
      );
      return;
    }

    const orderItems = order.map((item) => {
      const voucher = selectedVouchers[item.id];
      return {
        discount_id: voucher ? voucher.discount_id : null,
        product_id: item.product.id,
        quantity: item.quantity,
      };
    });

    const orderData = {
      order_items: orderItems,
    };

    try {
      const response = await ResfulAPI.createOrder(orderData, user.token);
      if (response.status === 200 || response.status === 201) {
        await fetchCart(user.token);
        showToast("order-success", "Order created successfully!", "success");
        navigate("/User/UserProfile", { state: { showCartHistory: true } });
      } else {
        showToast("order-failed", "Failed to create order!", "error");
      }
    } catch (error) {
      showToast("server-error", "Server error occurred!", "error");
      console.error("Error creating order:", error);
    }
  };

  return (
    <div className="checkout-container">
      <ToastContainer containerId={"CheckOut"} />
      <SelectAddress
        show={modalState.selectAddress}
        close={() => closeModal("2")}
        data={userAdd}
      />
      <AddnewAddress
        show={modalState.addAddress}
        close={() => closeModal("1")}
        data={userAdd}
      />
      <VoucherList
        show={modalState.chooseVoucher}
        close={() => closeModal("3")}
        data={{ UserVoucher, ModalData }}
        onVoucherSelect={handleVoucherSelect}
      />
      <div className="checkout-header">
        <div className="d-flex top">
          <FontAwesomeIcon className="icon" icon={faLocationDot} />
          <p>SHIPPING ADDRESS</p>
        </div>
        <div className="shipping-add">
          {userAdd?.length === 0 ? (
            <div style={{ userSelect: "none" }} className="d-flex">
              <p style={{ fontSize: "17px" }}>
                You do not have a shipping address
              </p>
              <p
                onClick={() => openModal("1")}
                style={{
                  fontSize: "17px",
                  marginLeft: "5px",
                  fontWeight: "500",
                  color: "blue",
                  cursor: "pointer",
                }}
              >
                [ add it now ]
              </p>
            </div>
          ) : (
            (() => {
              const isDefaultAdd = userAdd?.find((a) => a.is_default === true);
              if (isDefaultAdd) {
                return (
                  <div className="add d-flex">
                    <p
                      style={{ fontWeight: "500" }}
                    >{`${isDefaultAdd.full_name} (+84) ${isDefaultAdd.phone_number}`}</p>
                    <p
                      style={{ marginLeft: "5px" }}
                    >{`${isDefaultAdd.state} - ${isDefaultAdd.street_address} - ${isDefaultAdd.district} - ${isDefaultAdd.city}`}</p>
                    <p
                      onClick={() => openModal("2")}
                      style={{
                        userSelect: "none",
                        fontSize: "17px",
                        marginLeft: "30px",
                        fontWeight: "500",
                        color: "blue",
                        cursor: "pointer",
                      }}
                    >
                      [ Change ]
                    </p>
                  </div>
                );
              } else {
                return (
                  <div className="add d-flex">
                    <p>Please select your default address</p>
                    <p
                      onClick={() => openModal("2")}
                      style={{
                        userSelect: "none",
                        fontSize: "17px",
                        marginLeft: "30px",
                        fontWeight: "500",
                        color: "blue",
                        cursor: "pointer",
                      }}
                    >
                      [ Change ]
                    </p>
                  </div>
                );
              }
            })()
          )}
        </div>
      </div>
      <div className="checkOut-contents">
        <div className="d-flex header">
          <p
            style={{
              fontSize: "19px",
              width: "57%",
              paddingLeft: "20px",
              fontWeight: "500",
            }}
          >
            Product
          </p>
          <p style={{ width: "25%", color: "gray", textAlign: "center" }}>
            Price
          </p>
          <p style={{ width: "25%", color: "gray", textAlign: "center" }}>
            Qty
          </p>
          <p style={{ width: "25%", color: "gray", textAlign: "center" }}>
            Total
          </p>
        </div>
        <div className="contents">
          {order?.map((it, id) => {
            const defaultImg =
              it.product.images.find((i) => i.is_default) || {};
            const totalWithVoucher = calculateTotalWithVoucher(it);
            return (
              <div key={id} className="itemCart">
                <div className="d-flex">
                  <img
                    style={{ width: "5rem", height: "5rem" }}
                    src={`${IMGPATH}=${defaultImg.url || "default.jpg"}`}
                    alt="product-img"
                  />
                  <div style={{ width: "57%" }}>
                    <p
                      style={{
                        whiteSpace: "nowrap",
                        paddingLeft: "20px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        minWidth: "300px",
                        maxWidth: "300px",
                        fontSize: "17px",
                      }}
                    >
                      {it.product.name}
                    </p>
                  </div>
                  <div
                    className="d-flex"
                    style={{ textAlign: "center", width: "25%" }}
                  >
                    <p
                      style={{
                        color: "orangered",
                        fontSize: "18px",
                        fontWeight: "500",
                        marginRight: "10px",
                      }}
                    >
                      {`đ${(
                        it.product.price -
                        (it.product.price / 100) * it.product.discount
                      ).toLocaleString("vi-VN")}`}
                    </p>
                    <p
                      style={{
                        color: "gray",
                        fontSize: "18px",
                        fontWeight: "500",
                        textDecoration: "line-through",
                      }}
                    >
                      {`đ${it.product.price}`}
                    </p>
                  </div>
                  <p style={{ width: "25%", textAlign: "center" }}>
                    {it.quantity}
                  </p>
                  <p style={{ width: "25%", textAlign: "center" }}>
                    {`đ${totalWithVoucher.toLocaleString("vi-VN")}`}
                  </p>
                </div>
                <div className="voucher d-flex">
                  <div className="d-flex">
                    <FontAwesomeIcon className="icon" icon={faTicket} />
                    {selectedVouchers[it.id] ? (
                      <p
                        style={{
                          marginLeft: "10px",
                          color: "green",
                          fontWeight: "500",
                        }}
                      >
                        Voucher applied: {selectedVouchers[it.id].code} (
                        {selectedVouchers[it.id].discount_percent}%)
                      </p>
                    ) : (
                      <p className="p009s">Voucher</p>
                    )}
                  </div>
                  <p
                    onClick={() =>
                      openModal("3", {
                        price:
                          (it.product.price -
                            (it.product.price / 100) * it.product.discount) *
                          it.quantity,
                        id: it.id,
                      })
                    }
                    style={{
                      color: "blue",
                      cursor: "pointer",
                      userSelect: "none",
                    }}
                  >
                    Choose voucher
                  </p>
                </div>
                <div className="d-flex bottom">
                  <div className="note">
                    <label>Message for store</label>
                    <textarea></textarea>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="final d-flex">
          <div className="title">
            <p>Check out</p>
          </div>
          <div className="d-flex checkoutFinal">
            <div className="d-flex">
              <p>{`Total (${order.length} products): `}</p>
              <p
                style={{
                  color: "orangered",
                  fontWeight: "500",
                  marginLeft: "10px",
                }}
              >
                {`đ${calculateCartTotal().toLocaleString("vi-VN")}`}
              </p>
            </div>
            <button className="btn buyNow" onClick={handleCreateOrder}>
              Buy now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckOut;
