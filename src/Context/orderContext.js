import { createContext, useState, useEffect, useRef } from "react";
import ResfulAPI from "../Routes/RouteAPI/ResfulAPI";
import { toast } from "react-toastify";

export const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState(() => {
    const storedCart = localStorage.getItem("order");
    return storedCart ? JSON.parse(storedCart) : [];
  });
  const prevOrdersRef = useRef([]);

  useEffect(() => {
    localStorage.setItem("order", JSON.stringify(order));
  }, [order]);

  const fetchOrder = async (token) => {
    if (!token) return;
    setLoading(true);
    try {
      const response = await ResfulAPI.FecthOrder(token);
      if (response.status === 200 && response.data) {
        const newOrders = response.data;
        compareOrders(prevOrdersRef.current, newOrders);
        setOrder(newOrders);
        prevOrdersRef.current = newOrders;
      }
    } catch (error) {
      console.error("Lỗi khi lấy đơn hàng:", error);
      toast.error("Không thể tải danh sách đơn hàng!", {
        position: "top-right",
        autoClose: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  const compareOrders = (oldOrders, newOrders) => {
    if (oldOrders.length === 0) return;
    const oldOrderIds = oldOrders.map((order) => order.id);
    const addedOrders = newOrders.filter(
      (order) => !oldOrderIds.includes(order.id)
    );
    if (addedOrders.length > 0) {
      addedOrders.forEach((order) => {
        toast.info(
          `Đơn hàng mới #${order.id} - ${order.total_price.toLocaleString(
            "vi-VN"
          )}đ`,
          {
            position: "top-right",
            autoClose: 20000,
            containerId: "ShowNoice",
          }
        );
      });
    }
  };

  const refreshOrder = () => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser?.token) {
      fetchOrder(storedUser.token);
    }
  };

  return (
    <OrderContext.Provider value={{ order, fetchOrder, refreshOrder, loading }}>
      {children}
    </OrderContext.Provider>
  );
};
