import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { React, useContext, useEffect, useState } from "react";
import Productmanagements from '../Components/Productmanament';
import { UserContext } from '../../../Context/userContext';
import Comingsoon from '../Components/Comingsoon';
import ShowAllProducts from '../Components/ShowAllProduct';
import Addnewproduct from '../Components/AddNewProduct';
import UserManagement from '../Components/UserManagements';
import StaffManagements from '../Components/StaffManagements';
import DetailProduct from '../Components/DetailProduct';

const AdminRoutes = () => {
  const { user, login, logout } = useContext(UserContext);

  return (

    <Routes>
        {/* Public Routes */}
        <>
          <Route path="/Admin/Product/ProductManagements" element={<Productmanagements />} />
          <Route path="/Admin/Product/indevelop" element={<Comingsoon />} />
          <Route path="/Admin/Product/comingsoon" element={<Comingsoon />} />
          <Route path="/Admin/UserManagement" element={<UserManagement />} />
          <Route path="/Admin/Product/allProducts" element={<ShowAllProducts />} />
          <Route path="/Admin/Product/AddProduct" element={<Addnewproduct />} />
          <Route path="/Admin/Detail-Product" element={<DetailProduct />} />
          <Route path="*" element={<Navigate to="/" />} />
        </>
        {/*Only Admin Routes*/}
        {user.Authen && user.data.role === "Admin" ? (
            <>
                <Route path="/Admin/StaffManagement" element={<StaffManagements />} />
            </>
        ) : (
          <>
            {/*Only Staff Routes*/}
          </>
        )}
    </Routes>

  );
};

export default AdminRoutes;
