import "../../Routes/AdminPages/Scss/StaffNav.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClipboard,
  faGear,
  faHome,
  faRightFromBracket,
  faRocket,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import "bootstrap/dist/css/bootstrap.min.css";
import { useContext } from "react";
import { UserContext } from "../../Context/userContext";
import { NavLink } from "react-router-dom";

const StaffNav = ({ isActive, setIsActive }) => {
  const { logout } = useContext(UserContext);

  return (
    <div className="Navbar">
      <NavLink to={"/"}>
        <div className="Header-nav d-flex">
          <FontAwesomeIcon icon={faRocket} className="header-icon" />
          <p>E-STORE STAFF</p>
        </div>
      </NavLink>

      <div className="Navbody">
        <div className="Home">
          <p className="p1">HOME</p>
          <div className="homebar d-flex">
            <FontAwesomeIcon icon={faHome} className="ic1" />
            <p className="p2">Dashboard</p>
          </div>
        </div>
        <div className="product">
          <p className="p3">PRODUCT</p>
          <NavLink
            onClick={() =>
              setIsActive({
                dashBoard: false,
                ProManagement: false,
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
            to={"/Admin/Product/indevelop"}
            className={isActive.indevelop ? "active" : "normal"}
            style={{ textDecoration: "none", color: "black" }}
          >
            <div className="d-flex productbar1">
              <FontAwesomeIcon icon={faClipboard} className="ic2" />
              <p className="p4">In developing</p>
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
            oonClick={() =>
              setIsActive({
                dashBoard: false,
                ProManagement: false,
                indevelop: false,
                comingsoon: true,
                userManagement: true,
                staffManagement: false,
                orderManagement: false,
              })
            }
            to={"Admin/UserManagement"}
            style={{ textDecoration: "none", color: "black" }}
            className={isActive.userManagement ? "active" : "normal"}
          >
            <div className="Acountbar d-flex">
              <FontAwesomeIcon icon={faUsers} className="ic3" />
              <p className="p6">Users Management</p>
            </div>
          </NavLink>
        </div>
        <div className="setting">
          <p className="p7">Setting</p>
          <div className="settingbar d-flex">
            <FontAwesomeIcon icon={faGear} className="ic4" />
            <p className="p8">Setting</p>
          </div>
          <div onClick={() => logout()} className="settingbar d-flex">
            <FontAwesomeIcon icon={faRightFromBracket} className="ic4" />
            <p className="p8">Logout</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffNav;
