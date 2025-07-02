import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../Scss/VoucherManagement.scss";
import {
  faSearch,
  faSpinner,
  faTicket,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../Context/userContext";
import { toast, ToastContainer } from "react-toastify";
import ResfulAPI from "../../RouteAPI/ResfulAPI";

const VoucherManagement = () => {
  const { user } = useContext(UserContext);
  const [VoucherData, setVoucherData] = useState([]);
  const [isLoad, setIsLoad] = useState(false);
  const today = new Date();
  const voucherDataDefault = {
    code: "",
    discount: "",
    exprDate: "",
    maxuser: 0,
    minprice: 0,
  };
  const searchDefault = {
    Filter: "",
    disCstart: "",
    disCend: "",
    valid: false,
    expired: false,
  };
  const [searchFilterm, setSearchFilter] = useState(searchDefault);
  const [VoucherValue, setVoucherValues] = useState(voucherDataDefault);

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

  const fetchVouCher = async () => {
    try {
      setIsLoad(true);
      const rs = await ResfulAPI.fetchVouCher(false);
      if (rs.status === 200) {
        setVoucherData(rs.data.ED);
        setIsLoad(false);
      } else {
        showToast("error", "Error", "error", "voucher");
      }
    } catch (error) {
      showToast("error", "Server Error", "error", "voucher");
      console.error(error);
      return;
    }
  };

  const AddnewVoucher = async () => {
    try {
      if (
        !VoucherValue.code ||
        !VoucherValue.exprDate ||
        !VoucherValue.discount ||
        !VoucherValue.maxuser ||
        !VoucherValue.minprice
      ) {
        showToast(
          "warning",
          "Please enter full voucher information",
          "warning",
          "voucher"
        );
        return;
      }
      const rs = await ResfulAPI.AddnewVoucher(VoucherValue, user.token);
      if (rs.status === 201) {
        showToast("success", "Add voucher complete", "success", "voucher");
        fetchVouCher();
        return;
      } else if (rs.status === 400) {
        showToast("error", "voucher code already exists", "error", "voucher");
        return;
      } else {
        showToast("error", "Server Error", "error", "voucher");
        return;
      }
    } catch (error) {
      showToast("error", "Server Error", "error", "voucher");
      console.error(error);
      return;
    }
  };

  const removeVc = async (VcID) => {
    try {
      if (!VcID) {
        showToast("error", "please reload this page!", "error", "voucher");
        return;
      }
      const rs = await ResfulAPI.RemoveVC(VcID, user.token);
      if (rs.status === 200) {
        fetchVouCher();
        return;
      } else if (rs.status === 404) {
        showToast("error", "please reload this page!", "error", "voucher");
        return;
      } else {
        showToast("error", "Server Error", "error", "voucher");
        return;
      }
    } catch (error) {
      showToast("error", "Server Error", "error", "voucher");
      console.error(error);
      return;
    }
  };

  useEffect(() => {
    if (user.Authen) {
      fetchVouCher();
    }
  }, []);

  const dataState = VoucherData.filter((v) => {
    // Lọc theo code (nếu có)
    if (searchFilterm.Filter) {
      return v.code.toLowerCase().includes(searchFilterm.Filter.toLowerCase());
    }
    return true;
  })
    .filter((v) => {
      const expireDate = new Date(v.expiration_date);

      if (searchFilterm.valid && !searchFilterm.expired) {
        return expireDate >= today;
      }

      if (!searchFilterm.valid && searchFilterm.expired) {
        return expireDate < today;
      }

      return true;
    })
    .filter((v) => {
      const discount = v.discount_percent ?? 0;

      const start = Number(searchFilterm.disCstart) || 0;
      const end =
        searchFilterm.disCend !== "" ? Number(searchFilterm.disCend) : Infinity;

      return discount >= start && discount <= end;
    });

  return (
    <div className="VoucherManagement-container">
      <ToastContainer containerId={"voucher"} />
      <div className="Header-topic d-flex">
        <div className="left">
          <div className="search d-flex">
            <FontAwesomeIcon className="icon" icon={faSearch} />
            <input
              placeholder="find by code"
              value={searchFilterm.Filter}
              onChange={(e) =>
                setSearchFilter((prev) => ({ ...prev, Filter: e.target.value }))
              }
            />
          </div>
          <div className="d-flex">
            <div className="findbyState">
              <div className="a">
                <label>Valid</label>
                <input
                  checked={searchFilterm.valid}
                  onChange={(e) =>
                    setSearchFilter((prev) => ({
                      ...prev,
                      valid: e.target.checked,
                    }))
                  }
                  type="checkbox"
                />
              </div>
              <div className="b">
                <label>expired</label>
                <input
                  checked={searchFilterm.expired}
                  onChange={(e) =>
                    setSearchFilter((prev) => ({
                      ...prev,
                      expired: e.target.checked,
                    }))
                  }
                  type="checkbox"
                />
              </div>
            </div>
            <div className="filerByDiscount">
              <label>Discound</label>
              <div className="d-flex c">
                <label>start</label>
                <input
                  value={searchFilterm.disCstart}
                  type="number"
                  onChange={(e) =>
                    setSearchFilter((prev) => ({
                      ...prev,
                      disCstart: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="d-flex d">
                <label>end</label>
                <input
                  value={searchFilterm.disCend}
                  type="number"
                  onChange={(e) =>
                    setSearchFilter((prev) => ({
                      ...prev,
                      disCend: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
          </div>
          <div></div>
        </div>
        <div className="right">
          <div className="p98s1">
            <label>Add new</label>
            <input
              data={VoucherValue.code}
              onChange={(e) =>
                setVoucherValues((prev) => ({ ...prev, code: e.target.value }))
              }
              placeholder="Voucher code"
            />
          </div>
          <div className="p9812 d-flex">
            <input
              onChange={(e) =>
                setVoucherValues((prev) => ({
                  ...prev,
                  discount: e.target.value,
                }))
              }
              data={VoucherValue.discount}
              placeholder="Discount percent"
              type="number"
            />
            <label>Expiration date</label>
            <input
              onChange={(e) =>
                setVoucherValues((prev) => ({
                  ...prev,
                  exprDate: e.target.value,
                }))
              }
              data={VoucherValue.exprDate}
              type="date"
            />
          </div>
          <div className="p9813 d-flex">
            <input
              onChange={(e) =>
                setVoucherValues((prev) => ({
                  ...prev,
                  maxuser: e.target.value,
                }))
              }
              data={VoucherValue.maxuser}
              type="number"
              placeholder="Max user"
            />
            <input
              onChange={(e) =>
                setVoucherValues((prev) => ({
                  ...prev,
                  minprice: e.target.value,
                }))
              }
              type="number"
              data={VoucherValue.minprice}
              placeholder="Minimun order price"
            />
            <button onClick={() => AddnewVoucher()} className="btn btn-success">
              Add
            </button>
          </div>
        </div>
      </div>
      <div className="Body-contents">
        {isLoad ? (
          <>
            <div className="loading">
              <FontAwesomeIcon className="icon" icon={faSpinner} />
            </div>
          </>
        ) : (
          <>
            {dataState.length === 0 ? (
              <>
                <div className="noData">
                  <FontAwesomeIcon className="icon" icon={faTicket} />
                  <p>There are no vouchers available in the system.</p>
                </div>
              </>
            ) : (
              <>
                <div className="discount-data d-flex flex-wrap">
                  {dataState?.map((it, id) => (
                    <>
                      <div
                        key={id}
                        className={
                          Math.ceil(
                            (new Date(it.expiration_date) - new Date()) /
                              (1000 * 60 * 60 * 24)
                          ) <= 0
                            ? "itemExprice"
                            : "item"
                        }
                      >
                        <div className="d-flex">
                          <FontAwesomeIcon
                            onClick={() => removeVc(it.id)}
                            className="remove"
                            icon={faTrash}
                          />
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
                                ) > 0
                                  ? `${Math.ceil(
                                      (new Date(it.expiration_date) -
                                        new Date()) /
                                        (1000 * 60 * 60 * 24)
                                    )} days left`
                                  : "Expired"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default VoucherManagement;
