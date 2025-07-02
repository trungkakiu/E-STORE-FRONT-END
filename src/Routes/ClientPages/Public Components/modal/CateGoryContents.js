import { motion, AnimatePresence } from "framer-motion";
import '../scss/CategoryProduct.scss'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartArrowDown, faCheckToSlot, faPlus, faSpinner, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Img from '../../../../img/ProductIMG/AnotherIMG/3f6a467ad4837306c7a531f16e41e968.webp'

const bounceVariant = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: [1.2, 0.95, 1.05, 1],
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    transition: { duration: 0.2 }
  }
};

const CategoryContents = ({ show, close, data, addCart }) => {

    const [Product, setProduct] = useState(data);
    const [imageLoaded, setImageLoaded] = useState({});
    const IMGPATH = process.env.REACT_APP_IMG_APP_PATH; 


    const CacuSlot = (slot) => {
      if(slot < 1000 && slot > 0){
        return (slot.toLocaleString('vi-VN'))
      }
      if(slot >= 1000){
        return `${(slot / 1000).toLocaleString('vi-VN')}K`
      }
    }

    const handleImageLoad = (id) => {
      setImageLoaded(prev => ({ ...prev, [id]: true }));
    };

    useEffect(() =>{

      if(data){
        setProduct(data);
      }
    },[data])


  return (
    <AnimatePresence>
      {show && (
        <motion.div
          variants={bounceVariant}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <div className="CategoryProduct">
            <div className="header-title d-flex">
                <div className="d-flex">
                  <p className="cateTopic">Category</p>
                  <p className="cate">{Product?.Cate?.name}</p>
                </div>
                  
                <div onClick={close} className="iconPr">
                    <FontAwesomeIcon className="icon" icon={faXmark}/>
                </div>

            </div>
            <div className="contents-body">
             
              {Product?.ProductFiler?.length > 0 ? (
                <>
                 <div className="contents d-flex flex-wrap">
                    {Product?.ProductFiler?.map((item, id) => {
                        const defaultImage = item.images?.find(img => img.is_default) || item.images?.[0];
                        return(
                          <div className="cardItem ">
                              {!imageLoaded[item.id] && (
                                  <div className="image-placeholder" style={{ width: "100%", height: "15rem" }}>
                                    <div className="loading-spinner">
                                        <FontAwesomeIcon icon={faSpinner} className="ic8s" />
                                    </div>
                                  </div>
                              )}
                                <Link to="/production/detail" className="linktodetail" state={{ data: item }}>
                                  <img
                                        onLoad={() => handleImageLoad(item.id)}
                                        onError={() => handleImageLoad(item.id)}
                                        style={{ width: "100%", height: "15rem" }}
                                        src={`${IMGPATH}=${defaultImage?.url || "default.jpg"}`}
                                        className="card-img-top"
                                        alt="..."
                                    />
                                </Link>
                                <div className="Info ">
                                    <p className="price">{(item.price).toLocaleString("vi-VN")}đ</p>
                                    <div className="bot d-flex">
                                      <div className="d-flex">
                                        <FontAwesomeIcon className="Stock" icon={faCheckToSlot}/>
                                        <p className="stockValue">{CacuSlot(item.stock)}</p>
                                      </div>
                                      <div onClick={()=>addCart(item.id)} className="btn">
                                        <FontAwesomeIcon className="AddCart" icon={faCartArrowDown}/>
                                      </div>
                                    </div>
                                    
                                </div>
                          </div>
                          
                        )
                    })}
                </div>
                </>
              ) : (<>
                <div>
                  <p>It looks like this category has no available products.</p>
                </div>
              </>)}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CategoryContents;
