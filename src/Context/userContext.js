import { createContext, useState, useEffect } from "react";
import ResfulAPI from "../Routes/RouteAPI/ResfulAPI";
import { toast } from "react-toastify";

export const UserContext = createContext();
const defaultUserStatus = {
  Authen: false,
  token: "",
  data: [],
};

export const UserProvider = ({ children }) => {
  const getInitialUser = () => {
    const userFromStorage = localStorage.getItem("user");
    try {
      const parsedUser = userFromStorage
        ? JSON.parse(userFromStorage)
        : defaultUserStatus;
      return parsedUser;
    } catch (error) {
      return defaultUserStatus;
    }
  };
  const [user, setUser] = useState(() => getInitialUser());
  const fetchUser = async () => {
    try {
      const response = await ResfulAPI.Getprofile(user.token);
      if (response.status === 200) {
        const userData = response.data;
        if (userData.role !== user.data.role) {
          console.log(userData.role, user.data.role);
          toast.error("Your account has been locked_1!");
          await logout();
          return;
        }

        if (!userData.is_active) {
          toast.error("Your account has been locked!");
          await logout();
          return;
        }
        setUser((prev) => ({
          ...prev,
          data: userData,
        }));
      }
    } catch (error) {
      console.error("fetchUser error:", error);
    }
  };

  const login = async (userData, token) => {
    const newUser = {
      Authen: true,
      token: token,
      data: userData,
    };
    setUser(newUser);
    setTimeout(() => {
      localStorage.setItem("user", JSON.stringify(newUser));
    }, 100);
  };

  const logout = async () => {
    try {
      await ResfulAPI.Logout(user.token);
    } catch (error) {
      console.error("Logout error:", error);
    }
    setUser(defaultUserStatus);
    localStorage.removeItem("user");
    localStorage.removeItem("cart");
    localStorage.removeItem("order");
  };

  return (
    <UserContext.Provider value={{ user, login, logout, fetchUser }}>
      {children}
    </UserContext.Provider>
  );
};
