import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from '../Routes/ClientPages/Public Components/pulicHomePage';
import CartComponent from '../Routes/ClientPages/Public Components/cartComponent';
import DetailProduct from '../Routes/ClientPages/Public Components/detailProduct'
import { UserContext } from '../Context/userContext';
import { React, useContext, useEffect, useState } from "react";
import UserProflie from './ClientPages/Public Components/userProfile';
import CheckOut from './ClientPages/Public Components/checkOut';

const PublicRoutes = () => {
  const { user, login, logout } = useContext(UserContext);

  return (

    <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/Home" element={<HomePage />} />
        <Route path="/production/cart" element={<CartComponent />} />
        <Route path="/production/detail" element={<DetailProduct />} />
        
        {user.Authen && (
            <>
                <Route path="/cart/checkOut" element={<CheckOut />} />
                <Route path="/User/UserProfile" element={<UserProflie />} />
            </>
        )}
        <Route path="*" element={<Navigate to="/" />} />
    </Routes>

  );
};

export default PublicRoutes;
