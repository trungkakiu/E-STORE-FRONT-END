import { createContext, useEffect, useState } from "react";
import ResfulAPI from "../Routes/RouteAPI/ResfulAPI";

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState(() => {
    const storedProducts = localStorage.getItem("products");
    return storedProducts ? JSON.parse(storedProducts) : [];
  });

  const [category, setCategory] = useState([]);

  const fetchProducts = async () => {
    try {
      const response = await ResfulAPI.FetchProducts();
      setProducts(response.data);
      localStorage.setItem("products", JSON.stringify(response.data));
    } catch (error) {
      console.error("Lỗi khi lấy sản phẩm:", error);
    }
  };

  const fecthCategory = async () => {
    try {
      const response = await ResfulAPI.fetchCategory();
      localStorage.setItem("category", JSON.stringify(response.data));
      setCategory(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchProducts();
    fecthCategory();
  }, []);

  const addProduct = (product) => {
    const updatedProducts = [...products, product];
    setProducts(updatedProducts);
    localStorage.setItem("products", JSON.stringify(updatedProducts));
  };

  const removeProduct = (id) => {
    const updatedProducts = products.filter((p) => p.id !== id);
    setProducts(updatedProducts);
    localStorage.setItem("products", JSON.stringify(updatedProducts));
  };

  const updateProduct = (id, newProduct) => {
    const updatedProducts = products.map((p) => (p.id === id ? newProduct : p));
    setProducts(updatedProducts);
    localStorage.setItem("products", JSON.stringify(updatedProducts));
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        category,
        addProduct,
        removeProduct,
        updateProduct,
        fetchProducts,
        fecthCategory,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};
