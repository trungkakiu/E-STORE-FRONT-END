import React, { useState, useRef, useEffect, useContext } from "react";
import { Modal } from "react-bootstrap";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import '../scss/AddnewAddress.scss';
import administrativeData from './administrativeData';
import { useNavigate } from "react-router-dom";
import ResfulAPI from "../../../RouteAPI/ResfulAPI";
import { UserContext } from "../../../../Context/userContext";

const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.2 } },
    exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } },
};

const AddnewAddress = ({ show, close, data }) => {
    const showDefault = { selectBox: false, selectT: true, selectH: false, selectX: false };
    const userAddDataDefault = {
        fullname: "",
        phonenumber: "",
        province: "",
        district: "",
        commune: "",
        addressdetail: "",
        isDefault: false,
        zipcode: "",
        country: ""
    };
    const { user } = useContext(UserContext);
    const [DataState, setDataState] = useState({});
    const [IsShow, setIsShow] = useState(showDefault);
    const [userData, setUserData] = useState(userAddDataDefault);
    const inputRef = useRef(null);
    const botRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (data) {
            setDataState(data);
            if (!data?.AddressData?.length) {
                setUserData((prev) => ({ ...prev, isDefault: true }));
            }
        } else {
            navigate("/User/UserProfile", { replace: true });
        }
    }, [data, show, navigate]);

    const showToast = (id, message, type) => {
        if (toast.isActive(id)) {
            toast.update(id, {
                render: message,
                type,
                containerId: "AddAdd",
                autoClose: 5000,
                closeOnClick: true
            });
        } else {
            toast[type](message, {
                toastId: id,
                containerId: "AddAdd"
            });
        }
    };

    const handleAddAddress = async () => {
        try {
            if (!userData.commune || !userData.country || 
                !userData.district || !userData.province ||
                !userData.zipcode || !userData.addressdetail || 
                !userData.fullname || !userData.phonenumber) {
                showToast("InvalidValue", "Please enter complete information", "error");
                return;
            }
            const rs = await ResfulAPI.AddnewAddress(userData, user.token);
            if (rs.status === 201) {
                showToast("AddSuccess", "Address added successfully", "success");
                close(); 
                return;
            }
            if (rs.status === 400) {
                showToast("InvalidValue", "Invalid values", "error");
                return;
            }
            if (rs.status === 401) {
                showToast("forbidden", "Forbidden", "error");
                return;
            }
        } catch (error) {
            showToast("ServerError", "Server error occurred", "error");
            console.error(error);
        }
    };

    const chooseActive = (code, state) => {
        setIsShow((prev) => {
            const updatedState = { ...prev };
            Object.keys(prev).forEach((key) => {
                if (key !== "selectBox") updatedState[key] = key === code ? state : false;
            });
            return updatedState;
        });
    };

    const handleFocus = () => setIsShow((prev) => ({ ...prev, selectBox: true }));

    const handleClickOutside = (e) => {
        if (botRef.current && !botRef.current.contains(e.target)) {
            setIsShow((prev) => ({ ...prev, selectBox: false }));
        }
    };

    const handleSelectProvince = (province) => {
        setUserData((prev) => ({ ...prev, province, district: "", commune: "" }));
    };

    const handleSelectDistrict = (district) => {
        setUserData((prev) => ({ ...prev, district, commune: "" }));
    };

    const handleSelectCommune = (commune) => {
        setUserData((prev) => ({ ...prev, commune }));
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <Modal show={show} onHide={close} animation={false}>
            <motion.div variants={modalVariants} initial="hidden" animate={show ? "visible" : "hidden"} exit="exit">
                <Modal.Body style={{ width: "100%", height: "500px" }}>
                    <ToastContainer containerId={"AddAdd"} />
                    <div className="AddnewAddress">
                        <p className="title">Add new address</p>
                        <div className="d-flex top">
                            <input
                                value={userData.fullname}
                                onChange={(e) => setUserData((prev) => ({ ...prev, fullname: e.target.value }))}
                                placeholder="Full name"
                            />
                            <input
                                value={userData.phonenumber}
                                onChange={(e) => setUserData((prev) => ({ ...prev, phonenumber: e.target.value }))}
                                placeholder="Phone number"
                            />
                        </div>
                        <div className="bot" ref={botRef}>
                            <input
                                ref={inputRef}
                                value={
                                    userData.province && userData.district && userData.commune
                                        ? `${userData.province} / ${userData.district} / ${userData.commune}`
                                        : userData.province && userData.district
                                        ? `${userData.province} / ${userData.district} / Phường/Xã`
                                        : userData.province
                                        ? `${userData.province} / Quận - Huyện / Phường - Xã`
                                        : ""
                                }
                                onFocus={handleFocus}
                                placeholder="Tỉnh/Thành phố - Quận/Huyện - Phường/Xã"
                            />
                            {IsShow.selectBox && (
                                <div className="selectBox">
                                    <div className="d-flex choose">
                                        <div
                                            className={IsShow.selectT ? "HeaderActive" : "Header"}
                                            onClick={() => chooseActive("selectT", true)}
                                        >
                                            Tỉnh/Thành phố
                                        </div>
                                        <div
                                            className={IsShow.selectH ? "HeaderActive" : "Header"}
                                            onClick={() => chooseActive("selectH", true)}
                                        >
                                            Quận/Huyện
                                        </div>
                                        <div
                                            className={IsShow.selectX ? "HeaderActive" : "Header"}
                                            onClick={() => chooseActive("selectX", true)}
                                        >
                                            Phường/Xã
                                        </div>
                                    </div>
                                    {IsShow.selectT && (
                                        <div className="province">
                                            {Object.keys(administrativeData).map((province) => (
                                                <p
                                                    key={province}
                                                    onClick={() => handleSelectProvince(province)}
                                                    style={{ cursor: "pointer" }}
                                                >
                                                    {province}
                                                </p>
                                            ))}
                                        </div>
                                    )}
                                    {IsShow.selectH && userData.province && (
                                        <div className="district">
                                            {Object.keys(administrativeData[userData.province]).map((district) => (
                                                <p
                                                    key={district}
                                                    onClick={() => handleSelectDistrict(district)}
                                                    style={{ cursor: "pointer" }}
                                                >
                                                    {district}
                                                </p>
                                            ))}
                                        </div>
                                    )}
                                    {IsShow.selectX && userData.province && userData.district && (
                                        <div className="commune">
                                            {Object.keys(administrativeData[userData.province][userData.district]).map(
                                                (commune) => (
                                                    <p
                                                        key={commune}
                                                        onClick={() => handleSelectCommune(commune)}
                                                        style={{ cursor: "pointer" }}
                                                    >
                                                        {commune}
                                                    </p>
                                                )
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                            {!IsShow.selectBox && (
                                <>
                                    <div className="d-flex ip897">
                                        <select
                                            value={userData.country}
                                            onChange={(e) =>
                                                setUserData((prev) => ({ ...prev, country: e.target.value }))
                                            }
                                            className="country"
                                        >
                                            <option value="">Choose country</option>
                                            <option value="VN">VIET NAM</option>
                                            {/* <option value="CN">CHINA</option>
                                            <option value="US">AMERICAN</option> */}
                                        </select>
                                        <label className="zipcodeLabel">Zip code</label>
                                        <input
                                            className="zipcodeInput"
                                            value={userData.zipcode}
                                            onChange={(e) =>
                                                setUserData((prev) => ({ ...prev, zipcode: e.target.value }))
                                            }
                                        />
                                    </div>
                                    <textarea
                                        value={userData.addressdetail}
                                        onChange={(e) =>
                                            setUserData((prev) => ({ ...prev, addressdetail: e.target.value }))
                                        }
                                        placeholder="Địa chỉ cụ thể (Đường, hẻm - thôn, xóm - số nhà ...)"
                                    />
                                    <div className="d-flex default">
                                        {DataState?.AddressData?.length === 0 ? (
                                            <>
                                                <input
                                                    className="isDefault"
                                                    type="checkbox"
                                                    checked={true}
                                                    readOnly={true}
                                                />
                                                <label>If this is your first address it will be set as default!.</label>
                                            </>
                                        ) : (
                                            <>
                                                <input
                                                    className="isDefaultNotSet"
                                                    type="checkbox"
                                                    checked={userData.isDefault}
                                                    onChange={(e) =>
                                                        setUserData((prev) => ({
                                                            ...prev,
                                                            isDefault: e.target.checked
                                                        }))
                                                    }
                                                />
                                                <label>Set default address?</label>
                                            </>
                                        )}
                                    </div>
                                    <div
                                        className="d-flex"
                                        style={{ marginTop: "20px", gap: "10px", paddingLeft: "74.5%" }}
                                    >
                                        <button onClick={close} className="btn btn-danger">
                                            Exit
                                        </button>
                                        <button onClick={handleAddAddress} className="btn btn-success">
                                            Save
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </Modal.Body>
            </motion.div>
        </Modal>
    );
};

export default AddnewAddress;