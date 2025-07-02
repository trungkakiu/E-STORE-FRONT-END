import "../Scss/DetailProduct.scss";
import {
  faEdit,
  faPlus,
  faSearch,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, {
  useState,
  useRef,
  useContext,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { ProductContext } from "../../../Context/productContext";
import { toast, ToastContainer } from "react-toastify";
import ResfulAPI from "../../RouteAPI/ResfulAPI";
import { UserContext } from "../../../Context/userContext";
import { useNavigate, useLocation } from "react-router-dom";
import EditOtherIMG from "../Modal/EditOtherPicture";
import DeleteProduct from "../Modal/deleteProduct";
import ProductReviews from "../Modal/ProductReviews";

const ProductImageUploader = ({
  defaultImage,
  topicImg,
  otherImages,
  onUploadClick,
  IMGPATH,
}) => {
  return (
    <div className="uploadImg d-flex">
      <div
        onClick={() => onUploadClick("topic")}
        style={{ cursor: "pointer" }}
        className="Upload9sa"
      >
        <img
          src={
            topicImg
              ? URL.createObjectURL(topicImg)
              : `${IMGPATH}=${defaultImage?.url || "default.jpg"}`
          }
          style={{
            width: "100%",
            height: "100%",
            borderRadius: "10px",
            objectFit: "scale-down",
          }}
          alt="Product main"
        />
      </div>
      <div className="UploadO9ss">
        <div
          onClick={() => onUploadClick("another")}
          className="addAnother"
          style={{ cursor: "pointer" }}
        >
          <FontAwesomeIcon icon={faPlus} className="ic9jjs" />
        </div>
        <div className="AnotherIMG">
          {otherImages.defaultImages.map((img, id) => (
            <img
              key={`def-${id}`}
              src={`${IMGPATH}=${img?.url || "default.jpg"}`}
              className="card"
              alt={`Product ${id}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const CategorySelector = ({
  categories,
  selectedId,
  filter,
  onFilterChange,
  onSelect,
}) => {
  return (
    <div className="drdiv90as">
      <div className="d-flex">
        <p className="pdr9ns">Category</p>
        <div className="d-flex divMlas">
          <FontAwesomeIcon icon={faSearch} className="ico99s" />
          <input
            value={filter}
            onChange={onFilterChange}
            placeholder="find tag#"
            aria-label="Search categories"
          />
        </div>
      </div>
      <label>Product Category</label>
      <div className="drdiv55s flex-wrap" style={{ marginBottom: "10px" }}>
        {categories.map((item, index) => (
          <div
            key={item.id}
            onClick={() => onSelect(item.id)}
            className={selectedId === item?.id ? "cardItemActive" : "cardItem"}
          >
            <p className="item">{item.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const DetailProduct = () => {
  const { user } = useContext(UserContext);
  const IMGPATH = process.env.REACT_APP_IMG_APP_PATH;
  const navigate = useNavigate();
  const location = useLocation();
  const { category } = useContext(ProductContext);
  const [topicImg, setTopicImg] = useState();
  const { data } = location.state || {};
  const [CateFilter, setCateFilter] = useState("");
  const [ProductData, setProductData] = useState(data);
  const [isLoading, setIsLoading] = useState(false);
  const [OtherPicture, setOtherPicture] = useState([]);
  const fileInputRef = useRef(null);
  const fileInputRefTopic = useRef(null);
  const [modalState, setModalState] = useState({
    editOtherIMG: false,
    deleteProduct: false,
    ProductReviews: false,
  });

  useEffect(() => {
    if (!data) {
      navigate("/", { replace: true });
    }
  }, [data, navigate]);
  const otherImages = useMemo(
    () => ({
      defaultImages: ProductData?.images?.filter((it) => !it.is_default) || [],
      newImages: OtherPicture,
    }),
    [ProductData?.images, OtherPicture]
  );

  const filterProduct = useMemo(
    () =>
      category.filter((item) =>
        item.name.toLowerCase().includes(CateFilter.toLowerCase())
      ),
    [category, CateFilter]
  );

  const defaultImage = useMemo(
    () =>
      ProductData?.images?.find((img) => img.is_default) ||
      ProductData?.images?.[0],
    [ProductData?.images]
  );

  useEffect(() => {
    FectExProduct();
    setOtherPicture([]);
  }, []);

  const FectExProduct = useCallback(async () => {
    try {
      const rs = await ResfulAPI.FetchProduct(data.id, user.token);
      console.log(rs.status);
      if (rs.status === 200) {
        setProductData(rs.data);
        const otherImages = rs.data.images.filter((i) => !i.is_default);
        setOtherPicture(otherImages);
        return;
      }
      if (rs.status === 404) {
        toast.error("Product not found!");
        return;
      }
    } catch (error) {
      console.error("Failed to fetch product:", error);
      toast.error("Error loading product data!");
    }
  }, [data?.id, user.token]);

  const handleClick = useCallback((code) => {
    if (code === "topic") {
      fileInputRefTopic.current.click();
    }
    if (code === "another") {
      fileInputRef.current.click();
    }
  }, []);

  const handleFileChange = useCallback(
    async (code, event) => {
      try {
        const files = Array.from(event.target.files);
        if (files.length === 0) return;

        const validFiles = files.filter((file) => {
          const isValidType = file.type.startsWith("image/");
          const isValidSize = file.size <= 5 * 1024 * 1024;

          if (!isValidType) {
            toast.error(`${file.name} không phải là file hình ảnh!`, {
              containerId: "edit",
            });
          }
          if (!isValidSize) {
            toast.error(`${file.name} quá lớn (tối đa 5MB)!`, {
              containerId: "edit",
            });
          }

          return isValidType && isValidSize;
        });

        if (validFiles.length === 0) return;

        if (code === "topic") {
          setTopicImg(validFiles[0]);
        }

        if (code === "another") {
          setOtherPicture((prev) => [...prev, ...validFiles]);
        }

        const toastId = toast.loading(`Đang tải: 0/${validFiles.length} ảnh`, {
          containerId: "edit",
        });
        let completedUploads = 0;
        let failedUploads = 0;

        const controller = new AbortController();
        const signal = controller.signal;

        const uploadPromises = validFiles.map(async (file) => {
          const formData = new FormData();
          formData.append("image", file);
          formData.append("is_default", code === "topic");

          try {
            const rs = await ResfulAPI.UpLoadIMG(
              ProductData.id,
              formData,
              user.token,
              signal
            );
            completedUploads++;

            toast.update(toastId, {
              render: `Đang tải: ${completedUploads + failedUploads}/${
                validFiles.length
              } ảnh (${failedUploads} lỗi)`,
              containerId: "edit",
            });

            if (rs.status === 401) {
              toast.error("Bạn không có quyền thực hiện thao tác này!");
              controller.abort();
            } else if (rs.status === 404) {
              toast.error("Sản phẩm không tồn tại!");
              controller.abort();
            }
          } catch (error) {
            if (signal.aborted) return;

            console.error("Upload error:", error);
            failedUploads++;
            toast.error(`Lỗi khi tải lên ${file.name}!`);
          }
        });

        await Promise.all(uploadPromises);

        if (signal.aborted) {
          toast.update(toastId, {
            render: `Đã hủy tải ảnh!`,
            type: "error",
            isLoading: false,
            autoClose: 3000,
            containerId: "edit",
          });
          return;
        }

        toast.update(toastId, {
          render:
            failedUploads > 0
              ? `Đã tải xong: ${completedUploads}/${validFiles.length} ảnh (${failedUploads} lỗi)`
              : `Đã tải xong: ${completedUploads}/${validFiles.length} ảnh`,
          type: failedUploads > 0 ? "warning" : "success",
          isLoading: false,
          autoClose: 3000,
          containerId: "edit",
        });

        await FectExProduct();
      } catch (error) {
        console.error("Error in file upload process:", error);
        toast.error("Lỗi trong quá trình tải ảnh!");
      }
    },
    [ProductData?.id, user.token, FectExProduct]
  );

  const validateProduct = (product) => {
    const errors = [];
    if (!product.name) errors.push("Tên sản phẩm");
    if (!product.price) errors.push("Giá sản phẩm");
    if (!product.category_id) errors.push("Danh mục");
    if (!product.stock) errors.push("Số lượng tồn kho");
    if (!product.brand) errors.push("Thương hiệu");
    if (!product.material) errors.push("Chất liệu");

    return errors;
  };

  const handleEditProduct = useCallback(async () => {
    const errors = validateProduct(ProductData);

    if (errors.length > 0) {
      toast.error(`Vui lòng nhập đầy đủ thông tin: ${errors.join(", ")}!`);
      return;
    }

    setIsLoading(true);
    toast.warn("Đang lưu thông tin sản phẩm...");

    try {
      const response = await ResfulAPI.handleEditProduct(
        ProductData,
        user.token
      );

      if (response.status === 200) {
        toast.success("Cập nhật thông tin sản phẩm thành công!", {
          containerId: "edit",
        });
        return;
      } else if (response.status === 401) {
        toast.error("Bạn không có quyền thực hiện thao tác này! 🕵️", {
          containerId: "edit",
        });
        return;
      } else if (response.status === 404) {
        toast.error("Sản phẩm không tồn tại! 🤓", { containerId: "edit" });
        return;
      } else {
        toast.error("Có lỗi xảy ra khi cập nhật sản phẩm!", {
          containerId: "edit",
        });
        return;
      }
    } catch (error) {
      console.error("Edit product error:", error);
      toast.error("Lỗi khi cập nhật thông tin sản phẩm!", {
        containerId: "edit",
      });
    } finally {
      setIsLoading(false);
    }
  }, [ProductData, user.token]);

  const openModal = useCallback((code) => {
    if (code === "1") {
      setModalState((prev) => ({ ...prev, editOtherIMG: true }));
    }
    if (code === "2") {
      setModalState((prev) => ({ ...prev, deleteProduct: true }));
    }
    if (code === "3") {
      setModalState((prev) => ({ ...prev, ProductReviews: true }));
    }
  }, []);

  const closeModal = useCallback(
    async (code) => {
      if (code === "1") {
        setModalState((prev) => ({ ...prev, editOtherIMG: false }));
        await FectExProduct();
      }
      if (code === "2") {
        setModalState((prev) => ({ ...prev, deleteProduct: false }));
        return;
      }
      if (code === "3") {
        setModalState((prev) => ({ ...prev, ProductReviews: false }));
        return;
      }
    },
    [FectExProduct]
  );

  const updateField = (field, value) => {
    setProductData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="Detailcontainer d-flex">
      <ToastContainer containerId="edit" />
      <EditOtherIMG
        show={modalState.editOtherIMG}
        close={() => closeModal("1")}
        data={OtherPicture}
        ID={ProductData.id}
      />
      <DeleteProduct
        show={modalState.deleteProduct}
        close={() => closeModal("2")}
        data={ProductData.id}
      />
      <ProductReviews
        show={modalState.ProductReviews}
        close={() => closeModal("3")}
        data={ProductData}
      />
      <input
        type="file"
        accept="image/*"
        ref={fileInputRefTopic}
        style={{ display: "none" }}
        onChange={(event) => handleFileChange("topic", event)}
      />
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        multiple
        style={{ display: "none" }}
        onChange={(event) => handleFileChange("another", event)}
      />

      <div className="left">
        <div className="upleft">
          <div className="d-flex">
            <p className="ptp0992">General Information</p>
            <button onClick={() => openModal("3")} className="btn seeRv">
              Product reviews
            </button>
            {user.data.role === "Admin" && (
              <FontAwesomeIcon
                onClick={() => openModal("2")}
                className="icon"
                icon={faTrash}
              />
            )}
          </div>

          <label className="lb776s" htmlFor="product-name">
            Name Product
          </label>
          <input
            id="product-name"
            className="ipn77s"
            value={ProductData.name || ""}
            onChange={(e) => updateField("name", e.target.value)}
            aria-label="Product name"
          />
          <p className="pty765">Description Product</p>
          <textarea
            value={ProductData.description || ""}
            onChange={(e) => updateField("description", e.target.value)}
            className="txa8837j"
            aria-label="Product description"
          ></textarea>
          <div className="d-flex div99as">
            <div className="divLas78">
              <p className="pmt882">Material</p>
              <p className="pmtT76s">Description your material</p>
              <input
                value={ProductData.material || ""}
                onChange={(e) => updateField("material", e.target.value)}
                className="intbr772"
                aria-label="Product material"
              />
            </div>
            <div className="divI77a">
              <p className="pbrO8as">Brand</p>
              <p className="pbrU761">Write your product brand</p>
              <input
                value={ProductData.brand || ""}
                onChange={(e) => updateField("brand", e.target.value)}
                className="inp8sww"
                aria-label="Product brand"
              />
            </div>
          </div>
        </div>
        <div className="downleft">
          <div className="divU88s">
            <p className="p98ss">Pricing and Stock</p>
            <div className="d-flex divY67">
              <div className="p882s">
                <div className="Po99s">
                  <label htmlFor="product-price">Base Pricing</label>
                  <input
                    id="product-price"
                    type="number"
                    value={ProductData.price || ""}
                    onChange={(e) => updateField("price", e.target.value)}
                    aria-label="Product price"
                  />
                </div>
                <div className="p6NS8">
                  <label htmlFor="product-discount">Discount</label>
                  <input
                    id="product-discount"
                    type="number"
                    value={ProductData.discount || 0}
                    onChange={(e) => updateField("discount", e.target.value)}
                    aria-label="Product discount"
                  />
                </div>
              </div>
              <div className="p9snn">
                <div className="pt5as">
                  <label htmlFor="product-stock">Stock</label>
                  <input
                    id="product-stock"
                    type="number"
                    value={ProductData.stock || ""}
                    onChange={(e) => updateField("stock", e.target.value)}
                    aria-label="Product stock"
                  />
                </div>
                <div className="pM9si">
                  <label htmlFor="product-origin">Origin</label>
                  <input
                    id="product-origin"
                    value={ProductData.origin || ""}
                    onChange={(e) => updateField("origin", e.target.value)}
                    aria-label="Product origin"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="right">
        <div className="upright">
          <div className="d-flex">
            <p className="pK982s">Product Image</p>
            {otherImages.length !== 0 ? (
              <FontAwesomeIcon
                onClick={() => openModal("1")}
                style={{
                  marginLeft: "53%",
                  fontSize: "30px",
                  color:
                    ProductData.images?.some((img) => !img.is_default) ||
                    otherImages.length > 0
                      ? "black"
                      : "gray",
                }}
                className="coas"
                icon={faEdit}
                aria-label="Edit other images"
              />
            ) : (
              <></>
            )}
          </div>

          <ProductImageUploader
            defaultImage={defaultImage}
            topicImg={topicImg}
            otherImages={otherImages}
            onUploadClick={handleClick}
            IMGPATH={IMGPATH}
          />
        </div>

        <div className="downright">
          <CategorySelector
            categories={filterProduct}
            selectedId={ProductData.category_id}
            filter={CateFilter}
            onFilterChange={(e) => setCateFilter(e.target.value)}
            onSelect={(id) => updateField("category_id", id)}
          />

          <button
            onClick={handleEditProduct}
            className="uploadPr btn btn-success"
            style={{
              pointerEvents: isLoading ? "none" : "auto",
              opacity: isLoading ? 0.5 : 1,
              marginLeft: "10px",
            }}
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(DetailProduct);
