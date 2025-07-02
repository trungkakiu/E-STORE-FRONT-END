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
  const [UserVoucher, setUserVoucher] = useState([]);
  const [Voucher, setVoucher] = useState([]);
  const showToast = (id, message, type, containerId) => {
    if (toast.isActive(id)) {
      toast.update(id, {
        render: message,
        type,
        containerId: containerId,
        autoClose: 5000,
        closeOnClick: true,
      });
    } else {
      toast[type](message, {
        toastId: id,
        containerId: containerId,
      });
    }
  };

  const fetchUserVoucher = async () => {
    try {
      const rs = await ResfulAPI.fetchUserVoucher(user.token);
      if (rs.status === 200) {
        setUserVoucher(rs.data.ED);
        return;
      } else {
        showToast("error", "Server Error", "error", "UserVoucher");
        return;
      }
    } catch (error) {
      showToast("error", "Server Error", "error", "UserVoucher");
      console.error(error);
      return;
    }
  };

  const fetchVoucher = async () => {
    try {
      const rs = await ResfulAPI.fetchVouCher(true);
      if (rs.status === 200) {
        setVoucher(rs.data.ED);
        return;
      } else {
        showToast("error", "Server Error", "error", "UserVoucher");
        return;
      }
    } catch (error) {
      showToast("error", "Server Error", "error", "UserVoucher");
      console.error(error);
      return;
    }
  };

  const AddVoucher = async (voucherID) => {
    try {
      const rs = await ResfulAPI.AddUserVoucher(voucherID, user.token);
      if (rs.status === 201) {
        await fetchUserVoucher();
        return;
      } else if (rs.status === 400) {
        showToast(
          "collected",
          "You have already added this voucher",
          "error",
          "UserVoucher"
        );
        return;
      } else {
        showToast("error", "Server Error", "error", "UserVoucher");
        return;
      }
    } catch (error) {
      showToast("error", "Server Error", "error", "UserVoucher");
      console.error(error);
      return;
    }
  };
  useEffect(() => {
    if (user.Authen) {
      fetchUserVoucher();
      fetchVoucher();
    }
  }, []);

  const VocherValid =
    Voucher?.filter(
      (v) =>
        v.is_valid === true && !UserVoucher.some((uv) => uv.code === v.code)
    ) || [];

  console.log(VocherValid);
  return (
    <div className="UserVoucherStorage">
      <ToastContainer containerId={"UserVoucher"} />
      <div className="UserVoucher-header"></div>
      <div className="UserVoucher-contents">
        {UserVoucher.length === 0 ? (
          <>
            <div className="noVoucher">
              <FontAwesomeIcon className="icon" icon={faTicket} />
              <p>
                You don't have any vouchers at the moment, please look for more.
              </p>
            </div>
          </>
        ) : (
          <>
            <div className="voucher d-flex flex-wrap">
              <div className="title">
                <p>Your voucher</p>
              </div>

              {UserVoucher?.map((It, id) => (
                <>
                  <div
                    style={{ backgroundImage: `url(${ticketBanner})` }}
                    className="itemCard"
                  >
                    <p className="name">{It.code}</p>
                    <p className="discount">-{It.discount_percent}%</p>
                    <p
                      className={
                        Math.ceil(
                          (new Date(It.expiration_date) - new Date()) /
                            (1000 * 60 * 60 * 24)
                        ) <= 1
                          ? "exprieOut"
                          : "exprie"
                      }
                    >
                      {Math.ceil(
                        (new Date(It.expiration_date) - new Date()) /
                          (1000 * 60 * 60 * 24)
                      ) < 1
                        ? "Expired"
                        : `${Math.ceil(
                            (new Date(It.expiration_date) - new Date()) /
                              (1000 * 60 * 60 * 24)
                          )} days left`}
                    </p>
                  </div>
                </>
              ))}
            </div>
          </>
        )}
        <div className="OtherVoucher">
          <div className="title">
            <p>Voucher for you</p>
          </div>
          <div className="voucherforyou d-flex flex-wrap">
            {VocherValid.length > 0 ? (
              <>
                {VocherValid?.map((it, id) => (
                  <>
                    <div className="discount-data ">
                      <div key={id} className={"item"}>
                        <FontAwesomeIcon
                          onClick={() => AddVoucher(it.id)}
                          className="addNew"
                          icon={faPlus}
                        />
                        <div className="d-flex">
                          <FontAwesomeIcon className="icon" icon={faTicket} />
                          <div className="contents">
                            <div className="top d-flex">
                              <p style={{ fontWeight: "500" }}>
                                CODE: {it.code}
                              </p>
                              <p className="dis">{`${it.discount_percent}%`}</p>
                            </div>
                            <div className="d-flex bot">
                              <p>USER: {it.max_users}</p>
                              <p
                                style={{
                                  fontWeight: "400",
                                  color: "orangered",
                                }}
                              >
                                PRICE: {it.minimum_order_value}
                              </p>
                              <p
                                style={{ fontSize: "15px", paddingTop: "2px" }}
                              >
                                {Math.ceil(
                                  (new Date(it.expiration_date) - new Date()) /
                                    (1000 * 60 * 60 * 24)
                                ) < 1
                                  ? "Expired"
                                  : `${Math.ceil(
                                      (new Date(it.expiration_date) -
                                        new Date()) /
                                        (1000 * 60 * 60 * 24)
                                    )} days left`}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                ))}
              </>
            ) : (
              <>
                <div
                  className="NoVoucher"
                  style={{
                    textAlign: "center",
                    width: "100%",
                    paddingTop: "15px",
                  }}
                >
                  <div>
                    <FontAwesomeIcon
                      style={{ fontSize: "40px" }}
                      icon={faHippo}
                    />
                    <p>
                      It looks like there are no vouchers available for you.
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserVoucherStorage;
