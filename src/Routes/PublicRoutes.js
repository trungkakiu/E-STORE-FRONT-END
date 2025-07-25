import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "../Routes/ClientPages/Public Components/pulicHomePage";
import CartComponent from "../Routes/ClientPages/Public Components/cartComponent";
import DetailProduct from "../Routes/ClientPages/Public Components/detailProduct";
import { UserContext } from "../Context/userContext";
import { useContext, useEffect, useState } from "react";
import UserProflie from "./ClientPages/Public Components/userProfile";
import CheckOut from "./ClientPages/Public Components/checkOut";
import UserVoucherStorage from "./ClientPages/Public Components/UserVoucherStorage";
import LoginModal from "./ClientPages/Public Components/modal/login";
import SearchPage from "./ClientPages/Public Components/SearchPage";

const PublicRoutes = () => {
  const { user, logout } = useContext(UserContext);
  const [isShow, setisShow] = useState(false);
  useEffect(() => {
    if (user?.data.is_active === false) {
      logout();
      openModal();
    }
  }, [user]);

  const openModal = () => {
    setisShow(true);
  };
  const closeModal = () => {
    setisShow(false);
  };
  return (
    <div>
      <LoginModal show={isShow} close={closeModal} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/Home" element={<HomePage />} />
        <Route path="/production/cart" element={<CartComponent />} />
        <Route path="/production/detail" element={<DetailProduct />} />
        <Route path="/Search" element={<SearchPage />} />

        {user?.Authen && user?.data?.is_active && (
          <>
            <Route path="/cart/checkOut" element={<CheckOut />} />
            <Route path="/user/Voucher" element={<UserVoucherStorage />} />
            <Route path="/User/UserProfile" element={<UserProflie />} />
          </>
        )}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
};

export default PublicRoutes;
