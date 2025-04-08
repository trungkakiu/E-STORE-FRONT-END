import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import "../scss/ProductSlider.scss"; 
import anh from '../../../img/E house store logo.jpg'

const products = [
  { id: 1, name: "Giày thể thao", price: "₫182.082", oldPrice: "₫245.448", sold: "3.7K+", img: anh, stock: 9 },
  { id: 2, name: "Balo nữ", price: "₫157.010", oldPrice: "₫240.676", sold: "3K+", img: anh, stock: 2 },
  { id: 3, name: "Chổi quét nhà", price: "₫107.008", oldPrice: "₫170.934", sold: "4.2K+", img: anh, stock: 1 },
  { id: 4, name: "Áo sơ mi nam", price: "₫203.124", oldPrice: "₫262.152", sold: "16K+", img: anh, stock: 6 },
  { id: 5, name: "Áo thun nam", price: "₫110.714", oldPrice: "₫131.812", sold: "45K+", img: anh, stock: 2 },
  { id: 6, name: "Sản phẩm 6", price: "₫200.000", oldPrice: "₫250.000", sold: "10K+", img: anh, stock: 5 },
];

const slideshowproducts = () => {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    nextArrow: <button className="next-arrow">➡</button>,
    prevArrow: <button className="prev-arrow">⬅</button>,
  };

  return (
    <div className="product-slider">
      <Slider {...settings}>
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <img src={product.img} alt={product.name} />
            {product.stock <= 2 ? (
              <span className="badge low-stock">Almost sold out</span>
            ) : (
              <span className="badge in-stock">Only {product.stock} left</span>
            )}
            <h3>{product.name}</h3>
            <p className="price">
              <span className="new-price">{product.price}</span>
              <span className="old-price">{product.oldPrice}</span>
            </p>
            <p className="sold">{product.sold} sold</p>
            <p className="discount">-25% limited time</p>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default slideshowproducts;
