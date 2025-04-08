import { createContext, useState, useEffect, useContext } from "react";
import ResfulAPI from "../Routes/RouteAPI/ResfulAPI";


export const UserContext = createContext();
const defaultUserStatus = {
    Authen: false, 
    token: "",
    data: []
};

export const UserProvider = ({ children }) => {

  const getInitialUser = () => {
      const userFromStorage = localStorage.getItem("user");
      try {
        const parsedUser = userFromStorage ? JSON.parse(userFromStorage) : defaultUserStatus;
        return parsedUser;
      } catch (error) {
        return defaultUserStatus;
      }
  };
  const [user, setUser] = useState(() => getInitialUser()); 
  const fetchUser = async() =>{
    try {
        const respone = await ResfulAPI.FetchAllUser(user.token);
    } catch (error) {
      console.error(error);
      return;
    }
  }

  useEffect(() => {
    if (user.Authen) {
      localStorage.setItem("user", JSON.stringify(user)); 
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  const login = async(userData, token) => {
    console.log("Data moi: ",userData)
      const newUser = {
        Authen: true,
        token: token,
        data: userData
      };
      setUser(newUser); 
      setTimeout(() => {
        localStorage.setItem("user", JSON.stringify(newUser));
      }, 100); 
  };
  const logout = async() => {
    await ResfulAPI.Logout(user.token);
    setUser(defaultUserStatus); 
    localStorage.removeItem("user");

    return;
  };

  return (
    <UserContext.Provider value={{ user, login, logout, fetchUser }}>
      {children}
    </UserContext.Provider>
  );
};
