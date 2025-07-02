import "../../Routes/AdminPages/Scss/AdminNav.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClipboard,
  faClipboardUser,
  faGear,
  faHome,
  faRightFromBracket,
  faRocket,
  faTicket,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { useContext } from "react";
import { UserContext } from "../../Context/userContext";
import { NavLink } from "react-router-dom";

const AdminNav = ({ isActive, setIsActive }) => {
  const { logout } = useContext(UserContext);

  return (
    <div className="Navbar">
      <NavLink
        to={"/"}
        onClick={() =>
          setIsActive({
            dashBoard: true,
            ProManagement: false,
            indevelop: false,
            comingsoon: false,
            userManagement: false,
            staffManagement: false,
            orderManagement: false,
          })
        }
      >
        <div className="Header-nav d-flex">
          <FontAwesomeIcon icon={faRocket} className="header-icon" />
          <p>E-STORE ADMIN</p>
        </div>
      </NavLink>

      <div className="Navbody">
        <div className="Home">
          <p className="p1">HOME</p>
          <NavLink
            to={"/"}
            onClick={() =>
              setIsActive({
                dashBoard: true,
                ProManagement: false,
                indevelop: false,
                comingsoon: false,
                userManagement: false,
                staffManagement: false,
                orderManagement: false,
              })
            }
            className={isActive.dashBoard ? "active" : "normal"}
            style={{ textDecoration: "none", color: "black" }}
          >
            <div className="homebar d-flex">
              <FontAwesomeIcon icon={faHome} className="ic1" />
              <p className="p2">Dashboard</p>
            </div>
          </NavLink>
        </div>

        <div className="product">
          <p className="p3">PRODUCT</p>
          <NavLink
            onClick={() =>
              setIsActive({
                dashBoard: false,
                ProManagement: true,
                indevelop: false,
                comingsoon: false,
                userManagement: false,
                staffManagement: false,
                orderManagement: false,
              })
            }
            to={"/Admin/Product/ProductManagements"}
            className={isActive.ProManagement ? "active" : "normal"}
            style={{ textDecoration: "none", color: "black" }}
          >
            <div className="d-flex productbar1">
              <FontAwesomeIcon icon={faClipboard} className="ic2" />
              <p className="p4">Product Management</p>
            </div>
          </NavLink>

          <NavLink
            onClick={() =>
              setIsActive({
                dashBoard: false,
                ProManagement: false,
                indevelop: true,
                comingsoon: false,
                userManagement: false,
                staffManagement: false,
                orderManagement: false,
              })
            }
            to={"/Admin/Product/Voucher"}
            className={isActive.indevelop ? "active" : "normal"}
            style={{ textDecoration: "none", color: "black" }}
          >
            <div style={{ paddingLeft: "9%" }} className="d-flex productbar1">
              <FontAwesomeIcon
                style={{ paddingRight: "8%" }}
                icon={faTicket}
                className="ic2"
              />
              <p className="p4">Voucher Management</p>
            </div>
          </NavLink>

          <NavLink
            onClick={() =>
              setIsActive({
                dashBoard: false,
                ProManagement: false,
                indevelop: false,
                comingsoon: true,
                userManagement: false,
                staffManagement: false,
                orderManagement: false,
              })
            }
            to={"/Admin/Product/comingsoon"}
            className={isActive.comingsoon ? "active" : "normal"}
            style={{ textDecoration: "none", color: "black" }}
          >
            <div className="d-flex productbar1">
              <FontAwesomeIcon icon={faClipboard} className="ic2" />
              <p className="p4">Coming soon</p>
            </div>
          </NavLink>
        </div>

        <div className="Order">
          <p className="p7n">ORDER</p>
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
            to={"/Admin/OrderManagement"}
            style={{ textDecoration: "none", color: "black" }}
            className={isActive.orderManagement ? "active" : "normal"}
          >
            <div className="orderbar d-flex">
              <FontAwesomeIcon icon={faClipboard} className="ic4n" />
              <p className="p8n">Order Management</p>
            </div>
          </NavLink>
        </div>

        <div className="Acounts">
          <p className="p5">USERS</p>
          <NavLink
            onClick={() =>
              setIsActive({
                dashBoard: false,
                ProManagement: false,
                indevelop: false,
                comingsoon: false,
                userManagement: true,
                staffManagement: false,
                orderManagement: false,
              })
            }
            to={"/Admin/UserManagement"}
            className={isActive.userManagement ? "active" : "normal"}
            style={{ textDecoration: "none", color: "black" }}
          >
            <div className="Acountbar d-flex">
              <FontAwesomeIcon icon={faUsers} className="ic3" />
              <p className="p6">Users Management</p>
            </div>
          </NavLink>

          <NavLink
            onClick={() =>
              setIsActive({
                dashBoard: false,
                ProManagement: false,
                indevelop: false,
                comingsoon: false,
                userManagement: false,
                staffManagement: true,
                orderManagement: false,
              })
            }
            to={"/Admin/StaffManagement"}
            className={isActive.staffManagement ? "active" : "normal"}
            style={{ textDecoration: "none", color: "black" }}
          >
            <div className="Acountbar d-flex">
              <FontAwesomeIcon icon={faClipboardUser} className="ic3" />
              <p className="p6">Staff Management</p>
            </div>
          </NavLink>
        </div>

        <div className="setting">
          <p className="p7">Setting</p>
          <div className="settingbar d-flex">
            <FontAwesomeIcon icon={faGear} className="ic4" />
            <p className="p8">Setting</p>
          </div>
          <div onClick={logout} className="settingbar d-flex">
            <FontAwesomeIcon icon={faRightFromBracket} className="ic4" />
            <p className="p8">Logout</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminNav;
