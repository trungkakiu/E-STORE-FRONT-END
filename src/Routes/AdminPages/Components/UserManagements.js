import {
  faLock,
  faLockOpen,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../Scss/UserManagement.scss";
import { UserContext } from "../../../Context/userContext";
import { useContext, useEffect, useState } from "react";
import ResfulAPI from "../../RouteAPI/ResfulAPI";
import { toast, ToastContainer } from "react-toastify";
import logo from "../../../img/UserIMG/avatar/boy02.jpg";
import GrantStaff from "../Modal/GrantStaff";
import DeleteUser from "../Modal/DeleteUser";

const UserManagement = () => {
  const { user } = useContext(UserContext);
  const [allUsers, setAllUsers] = useState([]);
  const defaultModal = {
    GrantStaff: false,
    DeleteUSer: false,
  };
  const [modalUp, setModalUp] = useState(defaultModal);
  const [userID, setUserID] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;
  const [searchFilter, setSearchFilter] = useState("");
  const IMGPATH = process.env.REACT_APP_IMG_APP_PATH;

  const fetchUser = async () => {
    try {
      const response = await ResfulAPI.FetchAllUser(user.token, "Customer");
      if (response.status === 200) {
        setAllUsers(response.data.users);
      } else if (response.status === 401) {
        toast.error("You don't have permission!");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const ChangeUserStatus = async (userStatus, userID) => {
    try {
      const response = await ResfulAPI.ChangeUserStatus(
        !userStatus,
        userID,
        user.token
      );
      if (response.status === 200) {
        fetchUser();
        return;
      }
    } catch (error) {
      console.error(error);
      toast.error("Error while lock or unlock user!");
      return;
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const filteredUsers = allUsers.filter(
    (user) =>
      user.full_name?.toLowerCase().includes(searchFilter.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchFilter.toLowerCase()) ||
      user.username?.toLowerCase().includes(searchFilter.toLowerCase())
  );

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const nextPage = () => {
    if (currentPage < Math.ceil(filteredUsers.length / usersPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const openModal = (code, data) => {
    if (code === "GrantStaff") {
      setModalUp((prev) => ({ ...prev, GrantStaff: true }));
      setUserID(data);
      return;
    }
    if (code === "DeleteUser") {
      setModalUp((prev) => ({ ...prev, DeleteUSer: true }));
      setUserID(data);
      return;
    }
  };

  const closeModal = (code) => {
    if (code === "GrantStaff") {
      setModalUp((prev) => ({ ...prev, GrantStaff: false }));
      setUserID();
      fetchUser();
      return;
    }
    if (code === "DeleteUser") {
      setModalUp((prev) => ({ ...prev, DeleteUSer: false }));
      setUserID();
      fetchUser();
      return;
    }
  };
  return (
    <div className="Usermanagement-container">
      <ToastContainer />
      <GrantStaff
        show={modalUp.GrantStaff}
        close={() => closeModal("GrantStaff")}
        data={userID}
      />
      <DeleteUser
        show={modalUp.DeleteUSer}
        close={() => closeModal("DeleteUser")}
        data={userID}
      />
      <div className="Find-header d-flex">
        <div className="d-flex">
          <FontAwesomeIcon
            style={{ fontSize: "25px", paddingRight: "10px" }}
            icon={faSearch}
          />
          <input
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Tìm kiếm..."
          />
        </div>
        <div className="btn">+ Add new User</div>
      </div>
      <div className="Body-data">
        <table className="table table-striped table-bordered">
          <thead style={{ textAlign: "center" }} className="table-dark">
            <tr>
              <th style={{ width: "5%" }}>ID</th>
              <th>Avatar</th>
              <th style={{ width: "25%" }}>User Profile</th>
              <th>User name</th>
              <th>Action</th>
              <th></th>
            </tr>
          </thead>
          <tbody style={{ textAlign: "center" }}>
            {currentUsers.map((item) => (
              <tr key={item.id}>
                <td style={{ width: "7%" }}>{item.id}</td>
                <td style={{ width: "7%" }}>
                  <img
                    style={{ width: "4rem", height: "4rem" }}
                    src={
                      item.avatar_url ? `${IMGPATH}=${item?.avatar_url}` : logo
                    }
                  />
                </td>
                <td style={{ lineHeight: "0.7", paddingTop: "1%" }}>
                  <p style={{ fontWeight: "600" }}>
                    {item.full_name || "username is blank"}
                  </p>
                  <p style={{ fontSize: "14px" }}>{item.email}</p>
                </td>
                <td>{item.username}</td>
                <td>
                  <div
                    style={{
                      textAlign: "center",
                      justifyContent: "center",
                      paddingTop: "3.5%",
                    }}
                    className="d-flex"
                  >
                    {user.data.role === "Admin" ? (
                      <>
                        <div
                          onClick={() => openModal("GrantStaff", item.id)}
                          className="btn edit"
                        >
                          Grant Staff
                        </div>
                        <div
                          onClick={() => openModal("DeleteUser", item)}
                          className="btn remove"
                        >
                          Remove
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="btn btn-disActive">Function locked</div>
                      </>
                    )}
                  </div>
                </td>
                <td>
                  {user.data.role === "Admin" ? (
                    item.is_active ? (
                      <div style={{ marginTop: "15px" }}>
                        <FontAwesomeIcon
                          onClick={() =>
                            ChangeUserStatus(item.is_active, item.id)
                          }
                          style={{ color: "green", cursor: "pointer" }}
                          icon={faLockOpen}
                        />
                      </div>
                    ) : (
                      <div style={{ marginTop: "15px" }}>
                        <FontAwesomeIcon
                          onClick={() =>
                            ChangeUserStatus(item.is_active, item.id)
                          }
                          icon={faLock}
                          color="red"
                          style={{ cursor: "pointer" }}
                        />
                      </div>
                    )
                  ) : (
                    <FontAwesomeIcon
                      style={{ color: "gray", marginTop: "35%" }}
                      icon={faLockOpen}
                    />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div
          style={{ paddingBottom: "10px" }}
          className="pagination d-flex justify-content-center mt-3"
        >
          <button
            className="btn btn-primary mx-2"
            onClick={prevPage}
            disabled={currentPage === 1}
          >
            ⬅ Trang trước
          </button>
          <span className="mx-2">
            Trang {currentPage} /{" "}
            {Math.ceil(filteredUsers.length / usersPerPage)}
          </span>
          <button
            className="btn btn-primary mx-2"
            onClick={nextPage}
            disabled={
              currentPage >= Math.ceil(filteredUsers.length / usersPerPage)
            }
          >
            Trang sau ➡
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
