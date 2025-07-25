import { useState, useEffect, useContext } from "react";
import "./clientNav.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTruck,
  faAward,
  faPersonWalkingArrowLoopLeft,
  faThumbsUp,
  faStar,
  faCartShopping,
  faMagnifyingGlass,
  faUser,
  faPhoneVolume,
} from "@fortawesome/free-solid-svg-icons";
import "bootstrap/dist/css/bootstrap.min.css";
import logo from "../../img/E house store logo.jpg";
import Footer from "../../Routes/ClientPages/Public Components/modal/footer";
import LoginModal from "../../Routes/ClientPages/Public Components/modal/login";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import PublicRoutes from "../../Routes/PublicRoutes";
import { UserContext } from "../../Context/userContext";
import RocketLoad from "../../Utils/RocketLoad";
import Support from "../../Routes/ClientPages/Public Components/modal/Support";
import { CartContext } from "../../Context/cartContext";
import { ToastContainer } from "react-toastify";

const ClientNav = () => {
  const [lastScrollY, setLastScrollY] = useState(0);
  const location = useLocation();
  const [hideHeader, setHideHeader] = useState(false);
  const defaultModal = {
    login: false,
    support: false,
  };
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { cart } = useContext(CartContext);
  const [ModalUp, setModal] = useState(defaultModal);
  const { user, fetchUser } = useContext(UserContext);
  const hiddenRoutes = ["/User/UserProfile"];
  const showNavbar = !hiddenRoutes.includes(location.pathname);
  const [message, setmesage] = useState("");
  const [SearchKeyword, setSearchKeyword] = useState("");
  const openModal = (code, message) => {
    if (code === "login") {
      setModal((prev) => ({ ...prev, login: true }));
      setmesage(message);
    }
    if (code === "support") setModal((prev) => ({ ...prev, support: true }));
  };

  const closeModal = (code) => {
    if (code === "login") setModal((prev) => ({ ...prev, login: false }));
    if (code === "support") setModal((prev) => ({ ...prev, support: false }));
  };

  const SreachDown = () => {
    navigate("/Search", { state: { keyword: SearchKeyword } });
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setHideHeader(window.scrollY > lastScrollY);
      } else {
        setHideHeader(false);
      }
      setLastScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const handleFecthUser = async () => {
    try {
      setIsLoading(true);
      await fetchUser({
        onForceLogout: () => {
          openModal(
            "login",
            "There has been a change in permissions please log in again!"
          );
        },
      });
    } catch (error) {
      console.error(error);
      openModal(
        "login",
        "There has been a change in permissions please log in again!"
      );
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 1500);
    }
  };

  useEffect(() => {
    if (user.Authen) {
      handleFecthUser();
    }
  }, []);

  return (
    <>
      <div className="NavContainer">
        {isLoading ? (
          <>
            <div className="loading-spinner">
              <RocketLoad w={200} h={200} />
            </div>
          </>
        ) : (
          <>
            <div className={`Header ${hideHeader ? "hide-upHeader" : ""}`}>
              <ToastContainer position="top-center" containerId={"ClientNav"} />
              <LoginModal
                show={ModalUp.login}
                close={() => closeModal("login")}
                message={message}
              />
              <Support
                show={ModalUp.support}
                close={() => closeModal("support")}
              />
              {/* Up Header */}
              <div className="upHeader">
                <div className="topic_p">
                  <div className="icon_p">
                    <FontAwesomeIcon
                      icon={faTruck}
                      size="2x"
                      color="#ADFFA2"
                      className="icon_tp"
                    />
                    <div className="text_topic">
                      <span>Free shipping on all orders</span>
                      <span>Limited-time offer</span>
                    </div>
                  </div>
                </div>
                <div className="topic_p">
                  <div className="icon_p ">
                    <FontAwesomeIcon
                      icon={faPersonWalkingArrowLoopLeft}
                      size="2x"
                      color="#ADFFA2"
                      className="icon_tp"
                    />
                    <div className="text_topic">
                      <span>Free returns</span>
                      <span>Up to 90 days*</span>
                    </div>
                  </div>
                </div>
                <div className="topic_p">
                  <div className="icon_p">
                    <FontAwesomeIcon
                      icon={faAward}
                      size="2x"
                      color="#ADFFA2"
                      className="icon_tp"
                    />
                    <div className="text_topic">
                      <span>12-month warranty</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Up 2 Header */}
              <div className="up2Header">
                <div className=" tphd_01 d-flex align-items-center">
                  <a href="/">
                    <img className="lgo me-3" src={logo} alt="Logo" />
                  </a>
                  <div className="content-hd d-flex flex-column flex-md-row align-items-center">
                    <div className="hd d-flex align-items-center me-3">
                      <FontAwesomeIcon
                        icon={faThumbsUp}
                        size="2x"
                        color="white"
                        className="icon-hd-1 me-2"
                      />
                      <p className="ct-hd-1 mb-0">Best sellers</p>
                    </div>
                    <div className="hd d-flex align-items-center me-3">
                      <FontAwesomeIcon
                        icon={faStar}
                        size="2x"
                        color="white"
                        className="icon-hd-2 me-2"
                      />
                      <p className="ct-hd-2 mb-0">5-Star Rated</p>
                    </div>
                    <div className="hd d-flex align-items-center">
                      <FontAwesomeIcon
                        icon={faCartShopping}
                        size="2x"
                        color="white"
                        className="icon-hd-3 me-2"
                      />
                      <p className="ct-hd-3 mb-0">Mega sale</p>
                    </div>
                  </div>
                </div>

                <div className=" tphd_02">
                  <input
                    value={SearchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        SreachDown();
                        return;
                      }
                    }}
                    name="searching-text"
                    className="searching-bar"
                    placeholder="find something"
                  />
                  <FontAwesomeIcon
                    onClick={() => SreachDown()}
                    icon={faMagnifyingGlass}
                    size="2x"
                    color="#ADFFA2"
                    className="searching-icon me-3"
                    style={{ cursor: "pointer" }}
                  />
                </div>

                <div className=" tphd_03">
                  {user.Authen ? (
                    <NavLink
                      to={"/User/UserProfile"}
                      className={"login-part part-hover"}
                      style={{ textDecoration: "none" }}
                    >
                      <FontAwesomeIcon
                        icon={faUser}
                        size="2x"
                        color="white"
                        className="icon-lg-3 me-2"
                      />
                      <div className="user-profile">
                        <span>{user?.data?.username}</span>
                      </div>
                    </NavLink>
                  ) : (
                    <div className="login-part part-hover d-flex align-items-center">
                      <>
                        <FontAwesomeIcon
                          icon={faUser}
                          size="2x"
                          color="white"
                          className="icon-lg-3 me-2"
                        />
                        <div
                          style={{ padding: "2px 0" }}
                          onClick={() => openModal("login")}
                          className="d-flex flex-column"
                        >
                          <p className="login-regis mb-0">Sign in / register</p>
                          <p className="order mb-0">Orders & Account</p>
                        </div>
                      </>
                    </div>
                  )}

                  <div
                    onClick={() => openModal("support")}
                    className="support-part part-hover d-flex align-items-center"
                  >
                    <FontAwesomeIcon
                      icon={faPhoneVolume}
                      size="2x"
                      color="white"
                      className="me-2 support-icon"
                    />
                    <p className="mb-0 text-white support-text">Support</p>
                  </div>

                  <NavLink
                    style={{ textDecoration: "none" }}
                    to="/production/cart"
                    className="cart-part"
                  >
                    <div className="part-hover">
                      <FontAwesomeIcon
                        icon={faCartShopping}
                        size="2x"
                        color="white"
                        className="cart-icon"
                      />
                      {user.Authen &&
                        (cart?.length === 0 ? (
                          <></>
                        ) : (
                          <div className="cartSlots">
                            <p className="cartCount">{cart?.length}</p>
                          </div>
                        ))}
                    </div>
                  </NavLink>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="content">
              <PublicRoutes />
            </div>
            {showNavbar && (
              <footer>
                <Footer />
              </footer>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default ClientNav;
