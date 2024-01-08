import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Rate, Select, message } from "antd";
import Slider from "react-slick";
import "./style.scss";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProductDetails,
  fetchRelatedProducts,
  setSelectedSize,
  setSelectedImage,
} from "../../redux/features/product/productSlice";
import { actAddProductToCarts } from "../../redux/features/cart/cartSlice";
import CommentSection from "../Comment";
import { toggleLoginModal } from "../../redux/features/auth/authSlice";

const { Option } = Select;

function NextArrow(props) {
  const { className, onClick } = props;
  return (
    <div className={`${className} custom-arrow next-arrow`} onClick={onClick} />
  );
}

function PrevArrow(props) {
  const { className, onClick } = props;
  return (
    <div className={`${className} custom-arrow prev-arrow`} onClick={onClick} />
  );
}

const DetailProduct = () => {
  const { id } = useParams();
  const { id: productId } = useParams();

  const dispatch = useDispatch();
  const { productDetails, relatedProducts, isLoading, error } = useSelector(
    (state) => state.products
  );
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const selectedSize = useSelector((state) => state.products.selectedSize);
  const selectedImage = useSelector((state) => state.products.selectedImage);

  const navigate = useNavigate();
  const averageRating = useSelector(
    (state) => state.products.averageRatings[productId] || 0
  );

  const goToProductDetail = (productId) => {
    navigate(`/product/${productId}`);
  };

  const [displayedAverageRating, setDisplayedAverageRating] =
    useState(averageRating);

  useEffect(() => {
    // Làm tròn giá trị đánh giá trung bình
    const roundedAverageRating = Math.round(averageRating * 2) / 2;
    // Khi giá trị đánh giá trung bình thay đổi, cập nhật giá trị hiển thị
    setDisplayedAverageRating(roundedAverageRating);
  }, [averageRating]);

  useEffect(() => {
    dispatch(fetchProductDetails(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (productDetails?.subcategory) {
      dispatch(fetchRelatedProducts(productDetails.subcategory));
    }
  }, [dispatch, productDetails]);

  useEffect(() => {
    if (productDetails) {
      if (productDetails.sizes && productDetails.sizes.length > 0) {
        dispatch(setSelectedSize(productDetails.sizes[0]));
      }
      if (productDetails.image) {
        dispatch(setSelectedImage(productDetails.image));
      }
    }
  }, [dispatch, productDetails]);

  const handleImageChange = (imageUrl) => {
    dispatch(setSelectedImage(imageUrl));
  };

  const handleSizeChange = (newSize) => {
    // Dispatch action để cập nhật size trong Redux store
    dispatch(setSelectedSize(newSize));
  };

  const handleAddToCart = () => {
    if (!isLoggedIn) {
      message.warning("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!");
      dispatch(toggleLoginModal());

      return;
    }
    if (!productDetails || !productDetails.id) {
      // Kiểm tra tính hợp lệ của sản phẩm
      console.error("Sản phẩm không hợp lệ.");
      return;
    }

    const productToAdd = {
      id: productDetails.id,
      title: productDetails.title,
      price: productDetails.price,
      image: selectedImage,
      size: selectedSize,
      availableSizes: productDetails.sizes,
      quantity: 1,
    };

    // Thêm sản phẩm vào giỏ hàng
    dispatch(actAddProductToCarts(productToAdd));
  };

  const handleBuyNow = () => {
    if (!isLoggedIn) {
      message.warning("Vui lòng đăng nhập để mua sản phẩm!");
      dispatch(toggleLoginModal());
      return;
    }
    const productToAdd = {
      id: productDetails.id,
      title: productDetails.title,
      price: productDetails.price,
      image: selectedImage,
      size: selectedSize,
      availableSizes: productDetails.sizes,
      quantity: 1, // Hoặc lấy số lượng từ state/props nếu bạn muốn
    };

    // Thêm sản phẩm vào giỏ hàng
    dispatch(actAddProductToCarts(productToAdd));

    // Chuyển hướng đến trang giỏ hàng
    navigate("/gio-hang");
  };

  // Xử lý trạng thái loading và lỗi
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  // Hàm để định dạng giá tiền
  const formatPrice = (price) => {
    const numberPrice = typeof price === "string" ? parseInt(price, 10) : price;
    return numberPrice.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  };
  const productPrice = productDetails?.price
    ? formatPrice(productDetails.price)
    : "Đang cập nhật";

  // Cấu hình cho react-slick
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    arrows: false,
    slidesToShow: 4, // Đã thay đổi giá trị này
    slidesToScroll: 4, // Đã thay đổi giá trị này
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <>
      <div className="product-detail">
        <div className="product-image">
          <img
            src={selectedImage || productDetails?.image}
            alt={productDetails?.title}
          />
        </div>
        <div className="product-info">
          <h1 className="product-title">{productDetails?.title}</h1>
          <p className="product-price">
            Giá bán: <span className="price-value">{productPrice} VNĐ</span>
          </p>
          <div className="average-rating">
            Đánh giá trung bình:
            <Rate
              allowHalf
              value={parseFloat(displayedAverageRating)}
              disabled
            />
            <span className="average-rating-value">
              {displayedAverageRating} /5.0
            </span>
          </div>
          <div className="product-images-colors">
            <h4>Chọn màu:</h4>
            {productDetails?.colors?.map((colorImage, index) => (
              <img
                key={index}
                src={colorImage}
                alt={`Màu ${index}`}
                onClick={() => handleImageChange(colorImage)}
                className={selectedImage === colorImage ? "selected" : ""}
              />
            ))}
          </div>
          <div className="product-sizes">
            <h4>Chọn size</h4>
            <Select
              value={selectedSize.toUpperCase()}
              className="size-selector"
              onChange={handleSizeChange}
            >
              {productDetails?.sizes?.map((size) => (
                <Option key={size} value={size.toUpperCase()}>
                  {size}
                </Option>
              ))}
            </Select>
          </div>
          <div className="product-quantity">
            <h4>Chọn số lượng</h4>
            <Select defaultValue={1} className="quantity-selector">
              {[1, 2, 3, 4, 5].map((quantity) => (
                <Option key={quantity} value={quantity}>
                  {quantity}
                </Option>
              ))}
            </Select>
          </div>
          <div className="product-actions">
            <Button className="add-to-cart-btn" onClick={handleAddToCart}>
              Thêm vào giỏ hàng
            </Button>
            <Button
              className="buy-now-btn"
              type="primary"
              onClick={handleBuyNow}
            >
              Đăng ký mua
            </Button>
          </div>
        </div>
      </div>
      <CommentSection productId={id} />
      <div className="related-products">
        <h2>SẢN PHẨM CÙNG DANH MỤC</h2>
        <Slider {...settings}>
          {relatedProducts.map((product) => (
            <div
              key={product.id}
              className="related-product-item"
              onClick={() => goToProductDetail(product.id)}
            >
              <img src={product.image} alt={product.name} />
              <div className="product-info">
                <div className="product-name">{product.title}</div>
                <div className="product-price">
                  {formatPrice(product.price)}
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </>
  );
};

export default DetailProduct;
