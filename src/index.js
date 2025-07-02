import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "react-toastify/dist/ReactToastify.css";
import { CartProvider } from "./Context/cartContext";
import { UserProvider } from "./Context/userContext";
import { ProductProvider } from "./Context/productContext";
import { OrderProvider } from "./Context/orderContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <UserProvider>
    <ProductProvider>
      <OrderProvider>
        <CartProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </CartProvider>
      </OrderProvider>
    </ProductProvider>
  </UserProvider>
);
