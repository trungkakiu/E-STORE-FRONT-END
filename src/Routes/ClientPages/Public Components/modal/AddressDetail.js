import React, { useState, useRef, useEffect, useContext } from "react";
import { Modal } from "react-bootstrap";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import '../scss/AddressDetail.scss';
import administrativeData from './administrativeData';
import { useNavigate } from "react-router-dom";
import ResfulAPI from "../../../RouteAPI/ResfulAPI";
import { UserContext } from "../../../../Context/userContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.2 } },
    exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } },
};

const AddressDetail = ({ show, close, data }) => {
    const showDefault = { selectBox: false, selectT: true, selectH: false, selectX: false };
    const { user } = useContext(UserContext);
    const [DataState, setDataState] = useState({
        city: "",
        district: "",
        street_address: "",
        country: "",
        full_name: "",
        is_default: false,
        phone_number: "",
        postal_code: "",
        state: "",
        id: ""
    });
    const [IsShow, setIsShow] = useState(showDefault);
    const inputRef = useRef(null);
    const botRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        console.log(data);
        if (data && data.AddressData) {
            setDataState((prev) => {
                const newData = {
                    city: data.AddressData.city || "",
                    district: data.AddressData.district || "",
                    street_address: data.AddressData.street_address || "",
                    country: data.AddressData.country || "",
                    full_name: data.AddressData.full_name || "",
                    is_default: data.onlyDefault ? true : (data.AddressData.is_default || false),
                    phone_number: data.AddressData.phone_number || "",
                    postal_code: data.AddressData.postal_code || "",
                    state: data.AddressData.state || "",
                    id: data.AddressData.id || ""
                };
                if (JSON.stringify(prev) !== JSON.stringify(newData)) {
                    return newData;
                }
                return prev;
            });
            console.log(data)
        } else if (!data) {
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

    const handleSaveAddress = async () => {
        try {
            if (!DataState.street_address || !DataState.country || 
                !DataState.district || !DataState.city ||
                !DataState.postal_code || !DataState.state || 
                !DataState.full_name || !DataState.phone_number) {
                showToast("InvalidValue", "Please enter complete information", "error");
                return;
            }


            const rs = await ResfulAPI.UpdateAddress(DataState, user.token); 
            if (rs.status === 200) {
                showToast("UpdateSuccess", "Address updated successfully", "success");
                close();
            } 
            else if (rs.status === 404) {
                showToast("Forbidden", "Add not exists", "error");
            }
        } catch (error) {
            showToast("ServerError", "Server error occurred", "error");
            console.error(error);
        }
    };

    const handleRemoveAddress = async () => {
        try {
            if(!DataState.id){
                showToast("InvalidValue", "Please reload page !", "error");
                return;
            }
            const rs = await ResfulAPI.RemoveAddress(DataState.id ,user.token);
            if (rs.status === 200) {
                showToast("UpdateSuccess", "Address updated successfully", "success");
                setTimeout(()=>{
                    close();
                }, 1000)
                
            } 
            else if (rs.status === 401) {
                showToast("Forbidden", "Forbidden", "error");
                return;
            }else{
                showToast("Missing", "Address not exists", "error");
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

    const handleSelectProvince = (city) => {
        setDataState((prev) => ({ ...prev, city, district: "", street_address: "" }));
    };

    const handleSelectDistrict = (district) => {
        setDataState((prev) => ({ ...prev, district, street_address: "" }));
    };

    const handleSelectCommune = (street_address) => {
        setDataState((prev) => ({ ...prev, street_address }));
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
                    <div className="AddressDetail">
                        <div className="d-flex headerTitle">
                            <p className="title">Address Detail</p>
                            <FontAwesomeIcon onClick={handleRemoveAddress} className="icon" icon={faTrash}/>
                        </div>
                        
                        <div className="d-flex top">
                            <input
                                value={DataState.full_name || ""}
                                onChange={(e) => setDataState((prev) => ({ ...prev, full_name: e.target.value }))}
                                placeholder="Full name"
                            />
                            <input
                                value={DataState.phone_number || ""}
                                onChange={(e) => setDataState((prev) => ({ ...prev, phone_number: e.target.value }))}
                                placeholder="Phone number"
                            />
                        </div>
                        <div className="bot" ref={botRef}>
                            <input
                                ref={inputRef}
                                value={
                                    DataState.city && DataState.district && DataState.street_address
                                        ? `${DataState.city} / ${DataState.district} / ${DataState.street_address}`
                                        : DataState.city && DataState.district
                                        ? `${DataState.city} / ${DataState.district} / Phường/Xã`
                                        : DataState.city
                                        ? `${DataState.city} / Quận - Huyện / Phường - Xã`
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
                                            {Object.keys(administrativeData).map((city) => (
                                                <p
                                                    key={city}
                                                    onClick={() => handleSelectProvince(city)}
                                                    style={{ cursor: "pointer" }}
                                                >
                                                    {city}
                                                </p>
                                            ))}
                                        </div>
                                    )}
                                    {IsShow.selectH && DataState.city && (
                                        <div className="district">
                                            {Object.keys(administrativeData[DataState.city]).map((district) => (
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
                                    {IsShow.selectX && DataState.city && DataState.district && (
                                        <div className="commune">
                                            {Object.keys(administrativeData[DataState.city][DataState.district]).map(
                                                (street_address) => (
                                                    <p
                                                        key={street_address}
                                                        onClick={() => handleSelectCommune(street_address)}
                                                        style={{ cursor: "pointer" }}
                                                    >
                                                        {street_address}
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
                                            value={DataState.country || ""}
                                            onChange={(e) =>
                                                setDataState((prev) => ({ ...prev, country: e.target.value }))
                                            }
                                            className="country"
                                        >
                                            <option value="">Choose country</option>
                                            <option value="VN">VIET NAM</option>

                                        </select>
                                        <label className="zipcodeLabel">Zip code</label>
                                        <input
                                            className="zipcodeInput"
                                            value={DataState.postal_code || ""}
                                            onChange={(e) =>
                                                setDataState((prev) => ({ ...prev, postal_code: e.target.value }))
                                            }
                                        />
                                    </div>
                                    <textarea
                                        value={DataState.state || ""}
                                        onChange={(e) =>
                                            setDataState((prev) => ({ ...prev, state: e.target.value }))
                                        }
                                        placeholder="Địa chỉ cụ thể (Đường, hẻm - thôn, xóm - số nhà ...)"
                                    />
                                    <div className="d-flex default">
                                        {data?.onlyDefault ? (
                                            <>
                                                <input
                                                    className="isDefault"
                                                    type="checkbox"
                                                    checked={true}
                                                    readOnly={true}
                                                />
                                                <label>This is your unique address it will be set as default!</label>
                                            </>
                                        ) : (
                                            <>
                                                <input
                                                    className="isDefaultNotSet"
                                                    type="checkbox"
                                                    checked={DataState.is_default || false}
                                                    onChange={(e) =>
                                                        setDataState((prev) => ({
                                                            ...prev,
                                                            is_default: e.target.checked
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
                                        <button onClick={handleSaveAddress} className="btn btn-success">
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

export default AddressDetail;