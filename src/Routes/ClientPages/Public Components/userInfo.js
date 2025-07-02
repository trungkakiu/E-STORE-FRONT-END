import "./scss/userInfo.scss";
import { useContext, useState, useEffect, useRef } from "react";
import defaultAVT from "../../../img/UserIMG/avatar/boy01.png";
import { UserContext } from "../../../Context/userContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faEnvelope,
  faPenToSquare,
  faUserClock,
} from "@fortawesome/free-solid-svg-icons";
import ResfullAPI from "../../RouteAPI/ResfulAPI";
import { toast, ToastContainer } from "react-toastify";
import ChangeEmail from "./modal/ChangeEmail";

const UserInfo = () => {
  const IMGPATH = process.env.REACT_APP_IMG_APP_PATH;
  const { user, login } = useContext(UserContext);
  const [isEdit, setisEdit] = useState(false);
  const [userData, setUserData] = useState(user.data);
  const [isDataChanged, setIsDataChanged] = useState(false);
  const [AvatarIMG, setAvataImg] = useState();
  const fileInputRef = useRef(null);
  const isLoad = {
    username: false,
    userData: false,
  };
  const [APIload, setAPIload] = useState(isLoad);
  const [userNameEdit, setUserNameEdit] = useState(false);
  useEffect(() => {
    const isnotChanged = JSON.stringify(userData) !== JSON.stringify(user.data);
    setIsDataChanged(isnotChanged);
  }, [userData, user.data]);

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

  const changeInfo = async () => {
    try {
      if (!isDataChanged) {
        showToast(
          "warning",
          "Please change or edit your information before saving !",
          "warning",
          "userInfo-container"
        );
        return;
      }
      setAPIload((prev) => ({ ...prev, userData: true }));
      const response = await ResfullAPI.ChangeUserInfo(userData, user.token);
      if (response.status === 200) {
        const updatedUser = await ResfullAPI.Getprofile(user.token);
        await login(updatedUser.data, user.token);
        setAPIload((prev) => ({ ...prev, userData: false }));
        showToast(
          "success",
          "change infomation conplete !",
          "success",
          "userInfo-container"
        );
        return;
      }
      if (response.status === 401) {
        showToast("error", "Forbidden !", "error", "userInfo-container");
        return;
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật thông tin:", error);
      showToast(
        "error",
        "Error while update infomation !",
        "error",
        "userInfo-container"
      );
      return;
    }
  };

  const handleClick = () => {
    fileInputRef.current.click();
    return;
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setAvataImg(file);
      await handleAvatarUpload(file);
    }
  };

  const handleUserNameUpdate = async () => {
    try {
      if (!userData.username) {
        showToast(
          "warning",
          "User name can't empty!",
          "warning",
          "userInfo-container"
        );
        return;
      }
      setAPIload((prev) => ({ ...prev, username: true }));
      const rs = await ResfullAPI.UserNameUpdate(userData.username, user.token);
      if (rs.status === 200) {
        const updatedUser = await ResfullAPI.Getprofile(user.token);
        await login(updatedUser.data, user.token);
        setAPIload((prev) => ({ ...prev, username: false }));
        showToast(
          "success",
          "username change successful ✅ !",
          "success",
          "userInfo-container"
        );
        return;
      }
      if (rs.status === 400) {
        setAPIload((prev) => ({ ...prev, username: false }));
        showToast(
          "error",
          "Username already exists 😾!",
          "error",
          "userInfo-container"
        );
        return;
      }
    } catch (error) {
      showToast("error", "Error 😾!", "error", "userInfo-container");
      console.error(error);
      return;
    }
  };

  const handleAvatarUpload = async (file) => {
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append("avatar", file);

      const response = await ResfullAPI.UploadUserAvatar(formData, user.token);

      if (response.status === 200) {
        showToast(
          "success",
          "Update avatar complete 🎉!",
          "success",
          "userInfo-container"
        );
        const updatedUser = await ResfullAPI.Getprofile(user.token);
        await login(updatedUser.data, user.token);
      } else {
        showToast(
          "error",
          "Update avatar failed!",
          "error",
          "userInfo-container"
        );
        return;
      }
    } catch (error) {
      console.error("Lỗi khi upload avatar:", error);
      showToast(
        "error",
        "Error while update avatar 😡!",
        "error",
        "userInfo-container"
      );
      return;
    }
  };

  const modaldefault = {
    changeEmail: false,
  };
  const [modalState, setModalState] = useState(modaldefault);

  const OpenModal = (code) => {
    if (code === "1") {
      setModalState((prev) => ({ ...prev, changeEmail: true }));
    }
  };

  const CloseModal = async (code) => {
    if (code === "1") {
      setModalState((prev) => ({ ...prev, changeEmail: false }));
      const updatedUser = await ResfullAPI.Getprofile(user.token);
      await login(updatedUser.data, user.token);
      return;
    }
  };
  return (
    <div className="userInfo-container">
      {user.data && user.Authen ? (
        <>
          <ToastContainer containerId={"userInfo-container"} />
          <ChangeEmail
            show={modalState.changeEmail}
            close={() => CloseModal("1")}
          />
          <div style={{ userSelect: "none" }} className="topcard d-flex">
            <div className="ttcn d-flex">
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
              <div className="avatar" onClick={handleClick}>
                <img
                  src={
                    AvatarIMG
                      ? URL.createObjectURL(AvatarIMG)
                      : user.data.avatar_url
                      ? `${IMGPATH}=${user.data.avatar_url}`
                      : defaultAVT
                  }
                  alt="Avatar"
                />
                <div>
                  <FontAwesomeIcon icon={faPenToSquare} className="icYtts" />
                </div>
              </div>
              <div className="name">
                <div className="d-flex">
                  <input
                    className={userNameEdit ? "usernameEdit" : "username"}
                    value={userData.username}
                    onChange={(e) =>
                      setUserData((prev) => ({
                        ...prev,
                        username: e.target.value,
                      }))
                    }
                    maxLength={20}
                    readOnly={!userNameEdit}
                  />
                  <div>
                    <FontAwesomeIcon
                      onClick={() => setUserNameEdit(!userNameEdit)}
                      style={{ fontSize: "20px", cursor: "pointer" }}
                      icon={faEdit}
                    />
                  </div>
                  {userNameEdit === true && (
                    <>
                      <button
                        onClick={handleUserNameUpdate}
                        className="btn btn-saveUsername"
                        disabled={APIload.username}
                      >
                        {APIload.username ? "Saving" : "Save"}
                      </button>
                    </>
                  )}
                </div>
                <p
                  style={{ textAlign: "center", marginLeft: "-20px" }}
                  className="email"
                >
                  {user.data.email}
                </p>
              </div>
            </div>
            <button
              style={{ paddingBottom: "2%" }}
              onClick={() => {
                console.log("Save button clicked!");
                changeInfo();
              }}
              className={
                APIload.userData
                  ? "changeinfoLoad btn"
                  : "changeinfo btn btn-success"
              }
              disabled={APIload.userData}
            >
              {APIload.userData ? "Saving..." : "Save"}
            </button>
            <div
              onClick={() => setisEdit(!isEdit)}
              className="btn051 btn btn-primary"
            >
              {isEdit ? "🔒  Lock" : "🖋️  Edit"}
            </div>
          </div>
          <div className="bodycard d-flex">
            <div className="left">
              <div className="tager d-flex flex-column">
                <label>Full name</label>
                <input
                  value={userData.full_name || ""}
                  onChange={(e) =>
                    setUserData({ ...userData, full_name: e.target.value })
                  }
                  disabled={!isEdit}
                  readOnly={!isEdit}
                />
              </div>
              <div className="tager d-flex flex-column">
                <label>Gender</label>
                <select
                  value={userData.gender || ""}
                  onChange={(e) =>
                    setUserData({ ...userData, gender: e.target.value })
                  }
                  disabled={!isEdit}
                  readOnly={!isEdit}
                >
                  <option value="">Select gender...</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="EmailAdd">
                <div className="d-flex">
                  <div className="emailicon">
                    <FontAwesomeIcon icon={faEnvelope} className="ic012" />
                  </div>
                  <p className="p9921">{user.data.email}</p>
                </div>
                <div
                  onClick={() => OpenModal("1")}
                  className="btn-0921 btn btn-primary"
                >
                  Change Email
                </div>
              </div>
            </div>
            <div className="right">
              <div className="tager d-flex flex-column">
                <label>Your birthdate</label>
                <input
                  type="date"
                  value={userData.date_of_birth || ""}
                  onChange={(e) =>
                    setUserData({ ...userData, date_of_birth: e.target.value })
                  }
                  disabled={!isEdit}
                  readOnly={!isEdit}
                />
              </div>
              <div className="tager d-flex flex-column">
                <label>Phone Number</label>
                <input
                  type="number"
                  value={userData.phone_number || ""}
                  onChange={(e) =>
                    setUserData({ ...userData, phone_number: e.target.value })
                  }
                  disabled={!isEdit}
                  readOnly={!isEdit}
                />
              </div>
            </div>
          </div>
        </>
      ) : (
        <div>
          <FontAwesomeIcon icon={faUserClock} />
          <p>Loading</p>
        </div>
      )}
    </div>
  );
};

export default UserInfo;
