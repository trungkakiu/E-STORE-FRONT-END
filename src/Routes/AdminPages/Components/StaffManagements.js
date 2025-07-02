import { toast } from "react-toastify";
import { useContext, useEffect, useState } from "react";
import ResfulAPI from "../../RouteAPI/ResfulAPI";
import { UserContext } from "../../../Context/userContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLock,
  faSearch,
  faSpinner,
  faUnlock,
  faUserLargeSlash,
} from "@fortawesome/free-solid-svg-icons";
import defautlIMG from "../../../img/UserIMG/avatar/boy01.png";
import "../Scss/StaffManagements.scss";

const StaffManagements = () => {
  const IMGPATH = process.env.REACT_APP_IMG_APP_PATH;
  const [isLoad, setIsLoad] = useState(false);
  const [Staff, setStaff] = useState([]);
  const { user } = useContext(UserContext);
  const [filterState, setFilterState] = useState("");

  const FetchStaff = async () => {
    try {
      setIsLoad(true);
      const rs = await ResfulAPI.FetchAllUser(user.token, "Staff");
      if (rs.status === 200) {
        setStaff(rs.data.users);
      } else {
        toast.error("Không thể tải danh sách nhân viên!");
      }
    } catch (error) {
      toast.error("Lỗi khi lấy Staff!");
      console.error(error);
    } finally {
      setIsLoad(false);
    }
  };

  useEffect(() => {
    FetchStaff();
  }, []);

  const lockStaff = async (useStatus, UserID) => {
    try {
      const rs = await ResfulAPI.ChangeUserStatus(
        useStatus,
        UserID,
        user.token
      );
      if (rs.status === 200) {
        FetchStaff();
        return;
      }
    } catch (error) {
      console.error(error);
      return;
    }
  };

  const StaffLoad = Staff?.filter((item) =>
    item.username.toLowerCase().includes(filterState.toLowerCase())
  );

  if (isLoad) {
    return (
      <div className="isLoad">
        <FontAwesomeIcon icon={faSpinner} className="spinner" />
      </div>
    );
  }

  return (
    <div className="Staff-container">
      <div className="Staff-header">
        <div className="Staff-search">
          <FontAwesomeIcon icon={faSearch} className="search-ic" />
          <input
            value={filterState}
            onChange={(e) => setFilterState(e.target.value)}
            placeholder="Find Staff"
          />
        </div>
      </div>
      <div className="Staff-body">
        {!StaffLoad ? (
          <>
            <div className="NoStaff">
              <FontAwesomeIcon
                icon={faUserLargeSlash}
                className="NoStaff-icon"
              />
              <p className="P1Topic">
                Sorry, your system currently has no available staff.
              </p>
              <p className="P2Detail">
                Please add staff if you want to use this function.
              </p>
            </div>
          </>
        ) : (
          <>
            <div className="Staff row">
              {StaffLoad?.map((it, id) => (
                <>
                  <div
                    key={id}
                    className={it.is_active ? "StaffCard" : "StaffCardLock"}
                  >
                    {it.is_active ? (
                      <>
                        <FontAwesomeIcon
                          onClick={() => lockStaff(!it.is_active, it.id)}
                          className="unlock"
                          icon={faUnlock}
                        />
                      </>
                    ) : (
                      <>
                        <FontAwesomeIcon
                          onClick={() => lockStaff(!it.is_active, it.id)}
                          className="lock"
                          icon={faLock}
                        />
                      </>
                    )}

                    <div className="topcard">
                      <img
                        style={{ width: "100%", height: "15.5rem" }}
                        className="StaffIMG"
                        src={
                          it?.avatar_url
                            ? `${IMGPATH}=${it?.avatar_url || "default.jpg"}`
                            : defautlIMG
                        }
                      />
                    </div>
                    <div className="bodycard">
                      <p className="Fullname">
                        {it.full_name ? it.full_name : "No name"}
                      </p>
                      <p className="username">{it.username}</p>
                    </div>
                  </div>
                </>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default StaffManagements;
