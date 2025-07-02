import "../../Routes/AdminPages/Scss/ManagerNav.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faUser } from "@fortawesome/free-solid-svg-icons";
import "bootstrap/dist/css/bootstrap.min.css";
import { useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "../../Context/userContext";
import { NavLink, useLocation } from "react-router-dom";
import AdminNav from "./AdminNav";
import StaffNav from "./StaffNav";
import { ToastContainer } from "react-toastify";
import ManagerRoutes from "../../Routes/AdminPages/Routes/ManagerRoutes";
import { OrderContext } from "../../Context/orderContext";

const ManagerNav = () => {
  const { user } = useContext(UserContext);
  const { order, refreshOrder } = useContext(OrderContext);
  const hiddenRoutes = [
    "/Admin/Product/AddProduct",
    "/Admin/UserManagement",
    "/Admin/StaffManagement",
    "/Admin/Detail-Product",
  ];
  const location = useLocation();
  const DisShowNavbar = hiddenRoutes.includes(location.pathname);

  const ActiveDefault = {
    dashBoard: false,
    ProManagement: false,
    indevelop: false,
    comingsoon: false,
    userManagement: false,
    staffManagement: false,
    orderManagement: false,
  };

  const [isActive, setIsActive] = useState(ActiveDefault);

  const intervalRef = useRef(null);

  useEffect(() => {
    if (user.Authen) {
      refreshOrder();
      intervalRef.current = setInterval(() => {
        refreshOrder();
      }, 10000);

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
  }, [user.Authen]);

  const ordersPending = order?.filter((i) => i.status === "Pending");

  return (
    <div className="Admin">
      <ToastContainer containerId="ShowNoice" />
      <div className="container d-flex">
        {user.Authen && user.data.role === "Admin" && (
          <AdminNav
            isActive={isActive}
            setIsActive={setIsActive}
            vouderData={order}
          />
        )}
        {user.Authen && user.data.role === "Staff" && (
          <StaffNav isActive={isActive} setIsActive={setIsActive} />
        )}
        <div className="content-center">
          {!DisShowNavbar && (
            <div className="header d-flex">
              <NavLink
                onClick={() =>
                  setIsActive({
                    dashBoard: false,
                    ProManagement: false,
                    indevelop: false,
                    comingsoon: false,
                    userManagement: false,
                    staffManagement: false,
                    orderManagement: true,
                  })
                }
                style={{ color: "black" }}
                to={"/Admin/OrderManagement"}
              >
                <div className="alert">
                  <FontAwesomeIcon
                    style={{ cursor: "pointer" }}
                    icon={faBell}
                    className={ordersPending?.length > 0 ? "ic5Noice" : "ic5"}
                  />
                  {ordersPending?.length > 0 && (
                    <div className="Noice">
                      <p>{ordersPending?.length}</p>
                    </div>
                  )}
                  <div className="NoiceDetail">
                    <p>{`${ordersPending?.length} orders waiting for confirmation`}</p>
                  </div>
                </div>
              </NavLink>

              <div className="adminAC d-flex">
                <p className="p9">{user.data.username}</p>
                <div className="adminAvatar">
                  <FontAwesomeIcon icon={faUser} className="ic6" />
                </div>
              </div>
            </div>
          )}

          <div className="contents">
            <ManagerRoutes />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerNav;
