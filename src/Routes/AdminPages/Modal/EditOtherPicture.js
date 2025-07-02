import { useContext, useEffect, useState, useCallback } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../Scss/EditOtherIMG.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRemove, faSpinner } from "@fortawesome/free-solid-svg-icons";
import ResfulAPI from "../../RouteAPI/ResfulAPI";
import { UserContext } from "../../../Context/userContext";

const EditOtherIMG = ({ show, close, data, ID, onImageDeleted }) => {
  const { user } = useContext(UserContext);
  const IMGPATH = process.env.REACT_APP_IMG_APP_PATH;
  const [isVisible, setIsVisible] = useState(false);
  const [otherImages, setOtherImages] = useState(data);
  const [ProductId, setProductID] = useState(ID);
  const [imageLoaded, setImageLoaded] = useState({});

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      setOtherImages(data);
    } else {
      setIsVisible(false);
    }
  }, [show, data]);

  const fetchProductImages = useCallback(async () => {
    try {
      const rs = await ResfulAPI.FetchProduct(ProductId, user.token);
      if (rs.status === 200) {
        const updatedImages = rs.data.images.filter((i) => !i.is_default);
        setOtherImages(updatedImages);
        if (onImageDeleted) onImageDeleted();
        return;
      }
      if (rs.status === 404) {
        toast.error("Sản phẩm không tồn tại!");
        return;
      }
    } catch (error) {
      console.error("Lỗi khi fetch dữ liệu sản phẩm:", error);
      toast.error("Lỗi khi tải dữ liệu ảnh!");
    }
  }, [data, user.token, onImageDeleted]);

  const deleteIMG = async (IMGid) => {
    const toastId = toast.loading("Deleting image...");
    try {
      if (!IMGid) {
        toast.update(toastId, {
          render: "Invalid photo ID !",
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
        return;
      }

      const rs = await ResfulAPI.DeleteIMG(IMGid, user.token);
      if (rs.status === 200) {
        toast.update(toastId, {
          render: "Delete image successfully !",
          type: "success",
          isLoading: false,
          autoClose: 3000,
        });
        await fetchProductImages();
        return;
      }
      if (rs.status === 401) {
        toast.update(toastId, {
          render: "You do not have permission to delete this image.",
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });

        return;
      }
      if (rs.status === 404) {
        toast.update(toastId, {
          render: "This image does not exist.",
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
        return;
      }
    } catch (error) {
      toast.update(toastId, {
        render: "product deletion failed !",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
      console.error("Lỗi khi xóa ảnh:", error);
      toast.error("Lỗi khi xóa ảnh!");
    }
  };

  const setDefaultIMG = async (imgID) => {
    const toastId = toast.loading("seting default image...");
    try {
      const rs = await ResfulAPI.setDefaultIMG(imgID, user.token);
      if (rs.status === 200) {
        toast.update(toastId, {
          render: "This image has become the default image !",
          type: "success",
          isLoading: false,
          autoClose: 3000,
        });
        await fetchProductImages();
        return;
      }
      if (rs.status === 404) {
        toast.update(toastId, {
          render: "This image does not exist.",
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
        return;
      }
    } catch (error) {
      toast.update(toastId, {
        render: "product deletion failed !",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
      console.error("Lỗi khi xóa ảnh:", error);
      return;
    }
  };

  const handleImageLoad = (id) => {
    setImageLoaded((prev) => ({ ...prev, [id]: true }));
  };

  if (!show && !isVisible) return null;

  return (
    <div className={`custom-modal ${isVisible ? "fade-in" : "fade-out"}`}>
      <ToastContainer />
      <div className="custom-modal-backdrop" onClick={close}></div>
      <div className="custom-modal-content">
        <button className="close-btn" onClick={close}>
          ×
        </button>

        <div className="EditPT-container d-flex flex-wrap">
          {otherImages.length > 0 ? (
            otherImages.map((img, index) => (
              <div key={index} className="position-relative">
                {!imageLoaded[img.id] && (
                  <div className="image-placeholder">
                    <div className="loading-spinner">
                      <FontAwesomeIcon icon={faSpinner} className="ic8s" />
                    </div>
                  </div>
                )}
                <img
                  onLoad={() => handleImageLoad(img.id)}
                  onError={() => handleImageLoad(img.id)}
                  src={`${IMGPATH}=${img?.url || "default.jpg"}`}
                  alt={`Other ${index}`}
                  style={{ display: imageLoaded[img.id] ? "block" : "none" }}
                  className="other-img"
                />
                <FontAwesomeIcon
                  className="ic"
                  style={{ display: imageLoaded[img.id] ? "block" : "none" }}
                  icon={faRemove}
                  onClick={() => deleteIMG(img.id)}
                />
                <div
                  className="setdf"
                  style={{ display: imageLoaded[img.id] ? "block" : "none" }}
                  onClick={() => setDefaultIMG(img.id)}
                >
                  <p>set default</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-muted">Chưa có ảnh phụ</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditOtherIMG;
