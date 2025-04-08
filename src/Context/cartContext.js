import { createContext, useState, useEffect } from "react";
import ResfulAPI from "../Routes/RouteAPI/ResfulAPI";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const storedCart = localStorage.getItem("cart");
    return storedCart ? JSON.parse(storedCart) : [];
  });


  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const fetchCart = async (token) => {
    if (!token) {
      RemoveCart();
      return;
    }
    try {
      const response = await ResfulAPI.fecthCart(token);
      if (response.status === 200 && response.data) {
        setCart(response?.data || []);
      } else {
        RemoveCart();
      }
    } catch (error) {
      console.error("Lỗi khi lấy giỏ hàng:", error);
      RemoveCart();
    }
  };

  const AddCart = async (ProductID, userID, token) => {
    try {
      const response = await ResfulAPI.AddCart(ProductID, userID, token);
      if (response.status === 201) {
        await fetchCart(token);
        return response;
      }
    } catch (error) {
      console.error("Lỗi khi thêm sản phẩm vào giỏ hàng:", error);
    }
  };

  const RemoveItem = async (cartID, token) => {
    try {
      const response = await ResfulAPI.RemoveItem(cartID, token);
      if (response.status === 200) {
        await fetchCart(token);
      }
      return response;
    } catch (error) {
      console.error("Lỗi khi xóa sản phẩm khỏi giỏ hàng:", error);
    }
  };

  const RemoveCart = () => {
    setCart([]);
    localStorage.removeItem("cart");
  };

  return (
    <CartContext.Provider value={{ cart, AddCart, RemoveItem, fetchCart, RemoveCart }}>
      {children}
    </CartContext.Provider>
  );
};