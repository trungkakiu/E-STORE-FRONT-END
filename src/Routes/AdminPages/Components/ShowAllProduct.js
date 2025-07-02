import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useEffect, useState } from "react";
import {
  faChartBar,
  faLayerGroup,
  faPlus,
  faSearch,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { ProductContext } from "../../../Context/productContext";
import AddCategory from "../Modal/AddCategories";
import DeleteCate from "../Modal/DeleteCategory";
import UpdateCategory from "../Modal/UpdateCategory";
import "../Scss/ShowAllProducts.scss";
import { Link } from "react-router-dom";

const ShowAllProducts = () => {
  const IMGPATH = process.env.REACT_APP_IMG_APP_PATH;
  const { products, category, fetchProducts, fecthCategory } =
    useContext(ProductContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState(category ? category : []);
  const [deleteID, setDeleteID] = useState(null);
  const [updateData, setUpdateData] = useState(null);
  const [searchProduct, setSearhProduct] = useState("");
  const [catedFilter, setcateFilter] = useState("");
  const [isOpen, setIsOpen] = useState({
    Addcate: false,
    Dellcate: false,
    UpdateCate: false,
  });
  useEffect(() => {
    fetchProducts();
  }, []);
  useEffect(() => {
    if (category && Array.isArray(category)) {
      setCategories(category);
    }
  }, [category]);

  const filteredCategories = categories.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filterProduct = Array.isArray(products)
    ? products.filter(
        (item) =>
          item.name?.toLowerCase().includes(searchProduct.toLowerCase()) &&
          (catedFilter === "" || String(item.category_id) === catedFilter)
      )
    : [];

  const openModal = (code, data = null) => {
    setIsOpen((prev) => ({ ...prev, [code]: true }));
    if (code === "Dellcate") {
      if (!data) return;
      setDeleteID(data);
    } else if (code === "UpdateCate") {
      if (!data) return;
      setUpdateData(data);
    }
  };

  const closeModal = (code) => {
    setIsOpen((prev) => ({ ...prev, [code]: false }));
    fecthCategory();
    fetchProducts();
  };

  return (
    <div className="cart-container">
      <AddCategory
        show={isOpen.Addcate}
        close={() => closeModal("Addcate")}
        data={categories || {}}
      />
      <DeleteCate
        show={isOpen.Dellcate}
        close={() => closeModal("Dellcate")}
        data={deleteID || {}}
      />
      <UpdateCategory
        show={isOpen.UpdateCate}
        close={() => closeModal("UpdateCate")}
        data={updateData || {}}
        data2={categories}
      />

      <div className="productbycategory">
        <div className="cl992">
          <div className="div9982 d-flex">
            <div className="cl766 d-flex">
              <FontAwesomeIcon icon={faLayerGroup} className="ic98as" />
              <p className="op9as">Categories:</p>
            </div>
            <div
              onClick={() => openModal("Addcate")}
              style={{ width: "50px" }}
              className="cate991 d-flex"
            >
              <FontAwesomeIcon icon={faPlus} className="ic8889" />
            </div>
            <div style={{ width: "48.5px" }} className="cateT762 d-flex">
              <FontAwesomeIcon icon={faSearch} className="ic0882" />
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="ctg8812 d-flex">
            {filteredCategories.length > 0 ? (
              filteredCategories.map((item, index) => (
                <div key={index} className="cate">
                  <FontAwesomeIcon
                    onClick={() => openModal("Dellcate", item.id)}
                    icon={faXmark}
                    className="xmark"
                  />
                  <div onClick={() => openModal("UpdateCate", item)}>
                    <p className="pc7162">{item.name}</p>
                  </div>
                </div>
              ))
            ) : (
              <p>No categories available</p>
            )}
          </div>
        </div>
        <div className="product-show">
          {products.length > 0 ? (
            <div className="product">
              <div className="find d-flex">
                <div className="div8872 f-flex">
                  <FontAwesomeIcon className="ic992" icon={faSearch} />
                  <input
                    onChange={(e) => setSearhProduct(e.target.value)}
                    placeholder="Find product here"
                  />
                </div>
                <div>
                  <select
                    onChange={(e) => setcateFilter(e.target.value)}
                    className="sl0092"
                  >
                    <option value="">Select category...</option>
                    {categories.map((item, index) => (
                      <>
                        <option value={item.id}>{item.name}</option>
                      </>
                    ))}
                  </select>
                </div>
              </div>
              <div className="show row">
                {filterProduct.map((item, index) => {
                  const defaultImage =
                    item.images?.find((img) => img.is_default) ||
                    item.images?.[0];
                  return (
                    <div key={index} className="card">
                      <Link
                        state={{ data: item }}
                        style={{
                          textDecoration: "none",
                          color: "black",
                          cursor: "pointer",
                        }}
                        to={"/Admin/Detail-Product"}
                      >
                        <div className="topcard">
                          <img
                            className="Primg"
                            src={`${IMGPATH}=${
                              defaultImage?.url || "default.jpg"
                            }`}
                          />
                        </div>
                        <div className="bodycard">
                          <p
                            style={{
                              maxWidth: "200px",
                              width: "100%",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {item.name}
                          </p>
                          <p>{`đ${item.price.toLocaleString("vi-VN")}`}</p>
                        </div>
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="noProduct d-flex">
              <div className="ic1192">
                <FontAwesomeIcon icon={faChartBar} />
              </div>
              <div className="div7762">
                <p className="p0992">no products available</p>
                <p className="p4423">Add new product now</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShowAllProducts;
