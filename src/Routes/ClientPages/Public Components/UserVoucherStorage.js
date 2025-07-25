import { toast, ToastContainer } from "react-toastify";
import ResfulAPI from "../../RouteAPI/ResfulAPI";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../Context/userContext";
import "./scss/UserVoucherStorage.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHippo, faPlus, faTicket } from "@fortawesome/free-solid-svg-icons";
import ticketBanner from "../../../img/360_F_88666263_Eq0QV4SVRkWHgkNaRJn671g9BNnphQmm.jpg";

const UserVoucherStorage = () => {
  const { user } = useContext(UserContext);
  const [userVoucher, setUserVoucher] = useState([]);
  const [voucher, setVoucher] = useState([]);

  const showToast = (id, message, type, containerId) => {
    toast[type](message, {
      toastId: id,
      containerId,
      autoClose: 5000,
      closeOnClick: true,
    });
  };

  const fetchUserVoucher = async () => {
    try {
      const rs = await ResfulAPI.fetchUserVoucher(user.token);
      if (rs.status === 200) setUserVoucher(rs.data);
      else showToast("error", "Server Error", "error", "UserVoucher");
    } catch {
      showToast("error", "Server Error", "error", "UserVoucher");
    }
  };

  const fetchVoucher = async () => {
    try {
      const rs = await ResfulAPI.fetchVouCher(true);
      if (rs.status === 200) setVoucher(rs.data);
      else showToast("error", "Server Error", "error", "UserVoucher");
    } catch {
      showToast("error", "Server Error", "error", "UserVoucher");
    }
  };

  const addVoucher = async (voucherID) => {
    try {
      const rs = await ResfulAPI.AddUserVoucher(voucherID, user.token);
      if (rs.status === 201) fetchUserVoucher();
      else if (rs.status === 400)
        showToast(
          "collected",
          "You have already added this voucher",
          "error",
          "UserVoucher"
        );
      else showToast("error", "Server Error", "error", "UserVoucher");
    } catch {
      showToast("error", "Server Error", "error", "UserVoucher");
    }
  };

  useEffect(() => {
    if (user.Authen) {
      fetchUserVoucher();
      fetchVoucher();
    }
  }, []);

  const validVouchers =
    voucher?.filter(
      (v) => v.is_valid && !userVoucher.some((uv) => uv.code === v.code)
    ) || [];

  const getDaysLeft = (date) => {
    const days = Math.ceil(
      (new Date(date) - new Date()) / (1000 * 60 * 60 * 24)
    );
    return days < 1 ? "Expired" : `${days} days left`;
  };

  return (
    <div className="UserVoucherStorage">
      <ToastContainer containerId="UserVoucher" />
      <div className="UserVoucher-header"></div>
      <div className="UserVoucher-contents">
        {userVoucher.length === 0 ? (
          <div className="noVoucher">
            <FontAwesomeIcon className="icon" icon={faTicket} />
            <p>
              You don't have any vouchers at the moment, please look for more.
            </p>
          </div>
        ) : (
          <div className="voucher d-flex flex-wrap">
            <div className="title">
              <p>Your voucher</p>
            </div>
            {userVoucher.map((it, id) => (
              <div
                key={id}
                style={{ backgroundImage: `url(${ticketBanner})` }}
                className="itemCard"
              >
                <p className="name">{it.code}</p>
                <p className="discount">-{it.discount_percent}%</p>
                <p
                  className={
                    getDaysLeft(it.expiration_date) === "Expired"
                      ? "exprieOut"
                      : "exprie"
                  }
                >
                  {getDaysLeft(it.expiration_date)}
                </p>
              </div>
            ))}
          </div>
        )}
        <div className="OtherVoucher">
          <div className="title">
            <p>Voucher for you</p>
          </div>
          <div className="voucherforyou d-flex flex-wrap">
            {validVouchers.length > 0 ? (
              validVouchers.map((it, id) => (
                <div key={id} className="discount-data">
                  <div className="item">
                    <FontAwesomeIcon
                      onClick={() => addVoucher(it.id)}
                      className="addNew"
                      icon={faPlus}
                    />
                    <div className="d-flex">
                      <FontAwesomeIcon className="icon" icon={faTicket} />
                      <div className="contents">
                        <div className="top d-flex">
                          <p style={{ fontWeight: "500" }}>CODE: {it.code}</p>
                          <p className="dis">{`${it.discount_percent}%`}</p>
                        </div>
                        <div className="d-flex bot">
                          <p>USER: {it.max_users}</p>
                          <p style={{ fontWeight: "400", color: "orangered" }}>
                            PRICE: {it.minimum_order_value}
                          </p>
                          <p style={{ fontSize: "15px", paddingTop: "2px" }}>
                            {getDaysLeft(it.expiration_date)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div
                className="NoVoucher"
                style={{
                  textAlign: "center",
                  width: "100%",
                  paddingTop: "15px",
                }}
              >
                <FontAwesomeIcon style={{ fontSize: "40px" }} icon={faHippo} />
                <p>It looks like there are no vouchers available for you.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserVoucherStorage;
