import { useContext, useEffect, useState } from "react";
import "./scss/CartHistory.scss";
import RestfulAPI from "../../RouteAPI/ResfulAPI";
import { UserContext } from "../../../Context/userContext";
import { toast, ToastContainer } from "react-toastify";
import bgimg from "../../../img/4751043c866ed52f9661.png";
import RocketLoad from "../../../Utils/RocketLoad";
import RatingWithComment from "./decorate/RattingStart";
import ResfulAPI from "../../RouteAPI/ResfulAPI";

const CartHistory = () => {
  const defaultStates = {
    All: true,
    WaitShip: false,
    Delivery: false,
    Complete: false,
    Cancer: false,
    Return: false,
  };
  const IMGPATH = process.env.REACT_APP_IMG_APP_PATH;
  const { user } = useContext(UserContext);
  const [states, setState] = useState(defaultStates);
  const [CartOrderData, setCartOrderData] = useState([]);
  const [hovered, setHovered] = useState(0);
  const [selected, setSelected] = useState(0);
  const [isLoad, setisLoad] = useState(false);
  const [UserRatting, setUserRatting] = useState([]);

  const handleTabClick = (tabName) => {
    setState({
      All: false,
      WaitShip: false,
      Delivery: false,
      Complete: false,
      Cancer: false,
      Return: false,
      [tabName]: true,
    });
  };

  const showToast = (id, message, type, containerID) => {
    if (toast.isActive(id)) {
      toast.update(id, {
        render: message,
        type,
        containerId: containerID,
        autoClose: 5000,
        closeOnClick: true,
      });
    } else {
      toast[type](message, {
        toastId: id,
        containerId: containerID,
      });
    }
  };

  const fetchUserOrder = async () => {
    try {
      setisLoad(true);
      const rs = await RestfulAPI.fetchUserOrder(user.token);
      if (rs.status === 200) {
        setCartOrderData(rs.data);
      } else {
        showToast(
          "Error",
          "Error while fetching user order history",
          "error",
          "CartHistories"
        );
      }
    } catch (error) {
      showToast(
        "Error",
        "Error while fetching user order history",
        "error",
        "CartHistories"
      );
      console.error(error);
    } finally {
      setTimeout(() => {
        setisLoad(false);
      }, 1500);
    }
  };

  const FetchRatting = async () => {
    try {
      const rs = await ResfulAPI.GetProductRating(user.data.id, user.token);
      if (rs.status === 200) {
        setUserRatting(rs.data);
      }
    } catch (error) {
      toast.error("server error", { containerId: "Ratting" });
      console.error(error);
      return;
    }
  };

  const handleMouseEnter = (index) => {
    setHovered(index);
  };

  const handleMouseLeave = () => {
    setHovered(0);
  };

  const handleClick = (index) => {
    setSelected(index);
  };

  useEffect(() => {
    if (user.Authen) {
      fetchUserOrder();
      FetchRatting();
    }
  }, [user.Authen]);

  const ItemAll = CartOrderData;
  const WaitShip = CartOrderData.filter((i) => i.status === "Pending");
  const Delivery = CartOrderData.filter((i) => i.status === "Shipping");
  const Complete = CartOrderData.filter((i) => i.status === "Completed");
  const Cancer = CartOrderData.filter((i) => i.status === "Canceled");
  const Return = CartOrderData.filter((i) => i.status === "Returned");

  const Cancel = async (orderID) => {
    try {
      const rs = await RestfulAPI.CancelOrder(orderID, user.token);
      if (rs.status === 200) {
        await fetchUserOrder();
        showToast(
          "Success",
          "Your order has been cancelled.",
          "success",
          "CartHistories"
        );
        handleTabClick("Cancelled");
        return;
      }
      if (rs.status === 400) {
        showToast(
          "Error",
          "Orders cannot be cancelled.",
          "error",
          "CartHistories"
        );
        return;
      } else {
        showToast(
          "Error",
          "Error while cancel user order",
          "error",
          "CartHistories"
        );
        return;
      }
    } catch (error) {
      showToast(
        "Error",
        "Error while cancel user order",
        "error",
        "CartHistories"
      );
      console.error(error);
      return;
    }
  };
  return (
    <div className="Cart-histories">
      <ToastContainer containerId={"CartHistories"} />
      <div className="headerBar">
        <div className="d-flex">
          <div
            onClick={() => handleTabClick("All")}
            className={states.All ? "All itemHeader_active" : "All itemHeader"}
          >
            <p>All</p>
          </div>
          <div
            onClick={() => handleTabClick("WaitShip")}
            className={
              states.WaitShip
                ? "WaitShip itemHeader_active"
                : "WaitShip itemHeader"
            }
          >
            <p>Wait delivery</p>
          </div>
          <div
            onClick={() => handleTabClick("Delivery")}
            className={
              states.Delivery
                ? "Delivery itemHeader_active"
                : "Delivery itemHeader"
            }
          >
            <p>On delivery</p>
          </div>
          <div
            onClick={() => handleTabClick("Complete")}
            className={
              states.Complete
                ? "Complete itemHeader_active"
                : "Complete itemHeader"
            }
          >
            <p>Complete</p>
          </div>
          <div
            onClick={() => handleTabClick("Cancer")}
            className={
              states.Cancer ? "Cancer itemHeader_active" : "Cancer itemHeader"
            }
          >
            <p>Cancelled</p>
          </div>
          <div
            onClick={() => handleTabClick("Return")}
            className={
              states.Return ? "Return itemHeader_active" : "Return itemHeader"
            }
          >
            <p>Return/refund</p>
          </div>
        </div>
      </div>
      <div className="ContentBody">
        {isLoad ? (
          <>
            <div className="LoadingPage">
              <RocketLoad w={200} h={200} />
            </div>
          </>
        ) : (
          <>
            {CartOrderData.length === 0 ? (
              <div
                className="NoContent"
                style={{ backgroundImage: `url(${bgimg})` }}
              >
                <p>You have no orders yet!</p>
              </div>
            ) : (
              <div className="Contents">
                {states.All && (
                  <div className="status">
                    {ItemAll.length != 0 ? (
                      <>
                        {ItemAll.map((order, index) => (
                          <>
                            <div key={index} className="Item">
                              <div className="d-flex top">
                                <p>Status: {order.status}</p>
                                <p>
                                  Total:{" "}
                                  {order.total_price.toLocaleString("vi-VN")}đ
                                </p>
                              </div>
                              <div className="bot d-flex flex-wrap">
                                {order.items?.map((it, id) => (
                                  <>
                                    <div
                                      key={id}
                                      className="cardPr d-flex flex-wrap"
                                    >
                                      <img
                                        style={{
                                          width: "4rem",
                                          height: "4rem",
                                        }}
                                        src={
                                          it.product_image
                                            ? `${IMGPATH}=${it.product_image}`
                                            : "Product IMG"
                                        }
                                        alt="Avatar"
                                      />
                                      <p
                                        style={{ color: "gray" }}
                                      >{`x${it.quantity}`}</p>
                                      <p>{it.product_name}</p>
                                      <p
                                        style={{ color: "orangered" }}
                                      >{`${it.price.toLocaleString(
                                        "vi-VN"
                                      )}đ`}</p>
                                    </div>
                                  </>
                                ))}
                              </div>
                              {order.status === "Pending" && (
                                <div className="optional">
                                  <button
                                    onClick={() => Cancel(order.id)}
                                    className="btn btnCancer"
                                  >
                                    Cancel order
                                  </button>
                                </div>
                              )}
                            </div>
                          </>
                        ))}
                      </>
                    ) : (
                      <>
                        <div className="NoOrder">
                          <p style={{ fontSize: "20px", fontWeight: "500" }}>
                            No orders available
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                )}
                {states.WaitShip && (
                  <div className="status">
                    {WaitShip.length != 0 ? (
                      <>
                        {WaitShip.map((order, index) => (
                          <>
                            <div key={index} className="Item">
                              <div className="d-flex top">
                                <p>Status: {order.status}</p>
                                <p>
                                  Total:{" "}
                                  {order.total_price.toLocaleString("vi-VN")}đ
                                </p>
                              </div>
                              <div className="bot d-flex flex-wrap">
                                {order.items?.map((it, id) => (
                                  <>
                                    <div
                                      key={id}
                                      className="cardPr d-flex flex-wrap"
                                    >
                                      <img
                                        style={{
                                          width: "4rem",
                                          height: "4rem",
                                        }}
                                        src={
                                          it.product_image
                                            ? `${IMGPATH}=${it.product_image}`
                                            : "Product IMG"
                                        }
                                        alt="Avatar"
                                      />
                                      <p>{it.product_name}</p>
                                      <p
                                        style={{ color: "orangered" }}
                                      >{`${it.price.toLocaleString(
                                        "vi-VN"
                                      )}đ`}</p>
                                    </div>
                                  </>
                                ))}
                              </div>
                              <div className="optional">
                                <button className="btn btnCancer">
                                  Cancel order
                                </button>
                              </div>
                            </div>
                          </>
                        ))}
                      </>
                    ) : (
                      <>
                        <div className="NoOrder">
                          <p style={{ fontSize: "20px", fontWeight: "500" }}>
                            No orders WaitShipping
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                )}
                {states.Delivery && (
                  <div className="status">
                    {Delivery.length != 0 ? (
                      <>
                        {Delivery.map((order, index) => (
                          <>
                            <div key={index} className="Item">
                              <div className="d-flex top">
                                <p>Status: {order.status}</p>
                                <p>
                                  Total:{" "}
                                  {order.total_price.toLocaleString("vi-VN")}đ
                                </p>
                              </div>
                              <div className="bot d-flex flex-wrap">
                                {order.items?.map((it, id) => (
                                  <>
                                    <div
                                      key={id}
                                      className="cardPr d-flex flex-wrap"
                                    >
                                      <img
                                        style={{
                                          width: "4rem",
                                          height: "4rem",
                                        }}
                                        src={
                                          it.product_image
                                            ? `${IMGPATH}=${it.product_image}`
                                            : "Product IMG"
                                        }
                                        alt="Avatar"
                                      />
                                      <p>{it.product_name}</p>
                                      <p
                                        style={{ color: "orangered" }}
                                      >{`${it.price.toLocaleString(
                                        "vi-VN"
                                      )}đ`}</p>
                                    </div>
                                  </>
                                ))}
                              </div>
                            </div>
                          </>
                        ))}
                      </>
                    ) : (
                      <>
                        <div className="NoOrder">
                          <p style={{ fontSize: "20px", fontWeight: "500" }}>
                            No orders on delivery
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                )}
                {states.Complete && (
                  <div className="status">
                    {Complete.length != 0 ? (
                      <>
                        {Complete.map((order, index) => (
                          <>
                            <div key={index} className="Item">
                              <div className="d-flex top">
                                <p>Status: {order.status}</p>
                                <p>
                                  Total:{" "}
                                  {order.total_price.toLocaleString("vi-VN")}đ
                                </p>
                              </div>
                              <div className="bot">
                                {order.items?.map((it, id) => (
                                  <>
                                    <div
                                      key={id}
                                      className="cardPr d-flex flex-wrap"
                                    >
                                      <div className="d-flex flex-wrap">
                                        <img
                                          style={{
                                            width: "5rem",
                                            height: "6rem",
                                          }}
                                          src={
                                            it.product_image
                                              ? `${IMGPATH}=${it.product_image}`
                                              : "Product IMG"
                                          }
                                          alt="Avatar"
                                        />
                                        <p
                                          className="name"
                                          style={{ marginTop: "30px" }}
                                        >
                                          {it.product_name}
                                        </p>
                                        <p
                                          style={{
                                            color: "orangered",
                                            marginTop: "30px",
                                          }}
                                        >{`${it.price.toLocaleString(
                                          "vi-VN"
                                        )}đ`}</p>
                                      </div>
                                      <RatingWithComment
                                        PrdID={it.product_id}
                                        UserRatting={UserRatting}
                                      />
                                    </div>
                                  </>
                                ))}
                              </div>
                            </div>
                          </>
                        ))}
                      </>
                    ) : (
                      <>
                        <div className="NoOrder">
                          <p style={{ fontSize: "20px", fontWeight: "500" }}>
                            No completed orders yet
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                )}
                {states.Cancer && (
                  <div className="status">
                    {Cancer.length != 0 ? (
                      <>
                        {Cancer.map((order, index) => (
                          <>
                            <div key={index} className="Item">
                              <div className="d-flex top">
                                <p>Status: {order.status}</p>
                                <p>
                                  Total:{" "}
                                  {order.total_price.toLocaleString("vi-VN")}đ
                                </p>
                              </div>
                              <div className="bot d-flex flex-wrap">
                                {order.items?.map((it, id) => (
                                  <>
                                    <div
                                      key={id}
                                      className="cardPr d-flex flex-wrap"
                                    >
                                      <img
                                        style={{
                                          width: "4rem",
                                          height: "4rem",
                                        }}
                                        src={
                                          it.product_image
                                            ? `${IMGPATH}=${it.product_image}`
                                            : "Product IMG"
                                        }
                                        alt="Avatar"
                                      />
                                      <p>{it.product_name}</p>
                                      <p
                                        style={{ color: "orangered" }}
                                      >{`${it.price.toLocaleString(
                                        "vi-VN"
                                      )}đ`}</p>
                                    </div>
                                  </>
                                ))}
                              </div>
                            </div>
                          </>
                        ))}
                      </>
                    ) : (
                      <>
                        <div className="NoOrder">
                          <p style={{ fontSize: "20px", fontWeight: "500" }}>
                            No orders canceled yet
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                )}
                {states.Return && (
                  <div className="status">
                    {Return.length != 0 ? (
                      <>
                        {Return.map((order, index) => (
                          <>
                            <div key={index} className="Item">
                              <div className="d-flex top">
                                <p>Status: {order.status}</p>
                                <p>
                                  Total:{" "}
                                  {order.total_price.toLocaleString("vi-VN")}đ
                                </p>
                              </div>
                              <div className="bot d-flex flex-wrap">
                                {order.items?.map((it, id) => (
                                  <>
                                    <div
                                      key={id}
                                      className="cardPr d-flex flex-wrap"
                                    >
                                      <img
                                        style={{
                                          width: "4rem",
                                          height: "4rem",
                                        }}
                                        src={
                                          it.product_image
                                            ? `${IMGPATH}=${it.product_image}`
                                            : "Product IMG"
                                        }
                                        alt="Avatar"
                                      />
                                      <p>{it.product_name}</p>
                                      <p
                                        style={{ color: "orangered" }}
                                      >{`${it.price.toLocaleString(
                                        "vi-VN"
                                      )}đ`}</p>
                                    </div>
                                  </>
                                ))}
                              </div>
                            </div>
                          </>
                        ))}
                      </>
                    ) : (
                      <>
                        <div className="NoOrder">
                          <p style={{ fontSize: "20px", fontWeight: "500" }}>
                            No orders returned or refunded
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CartHistory;
