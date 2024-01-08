import React, { useEffect, useState } from "react";
import { Carousel, Card, Row, Col, Button, message } from "antd";
import "./style.scss";

import banner1 from "../../img/banner1.jpg";
import banner2 from "../../img/banner2.png";
import banner3 from "../../img/banner3.png";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchHotProducts,
  fetchNewProducts,
} from "../../redux/features/product/productSlice";
import { ROUTES } from "../../constants/routes";
import { toggleLoginModal } from "../../redux/features/auth/authSlice";

const banners = [
  {
    id: "BN001",
    title: "POLO",

    imageUrl:
      "https://i.pinimg.com/236x/9a/7a/bd/9a7abd82eaf7493bce9db11fb5d07b4d.jpg", // Replace with your actual image URL
    path: "/ao-nam?category=polo-shirt",
  },
  {
    id: "BN002",
    title: "FALL-WINTER 2023",

    imageUrl:
      "https://www.gentlemansflair.com/content/images/2022/12/Date-Night-Outfits.png", // Replace with your actual image URL
    path: "/ao-nam?category=jacket-shirt",
  },
  {
    id: "BN003",
    title: "SWEATER",

    imageUrl:
      "https://i.pinimg.com/236x/bf/2a/0b/bf2a0bb7521bdb779198c0f7bf303f23.jpg", // Replace with your actual image URL
    path: "/ao-nam?category=sweater-shirt",
  },
];

const ProductSection = ({
  title,
  products = [],
  handleAddToCart,
  handleBuyNow,
}) => (
  <div
    className={`product-section product-${title
      .toLowerCase()
      .replace(/\s/g, "-")}`}
  >
    <h1>{title}</h1>
    <Row gutter={16}>
      {products &&
        products.length > 0 &&
        products?.map((product, index) => (
          <Col span={6} key={product.id + index}>
            <Link
              to={`/product/${product.id}`}
              style={{ textDecoration: "none" }}
            >
              <Card
                hoverable
                cover={<img alt={product.title} src={product.image} />}
              >
                <Card.Meta title={product.title} />
                <p className="product-price">{product.price}</p>
                <div className="product-actions">
                  <Button
                    className="add-to-cart-btn"
                    onClick={() => handleAddToCart(product)}
                  >
                    Thêm giỏ hàng
                  </Button>
                  <Button
                    className="buy-now-btn"
                    type="primary"
                    onClick={() => handleBuyNow(product)}
                  >
                    Mua ngay
                  </Button>
                </div>
              </Card>
            </Link>
          </Col>
        ))}
    </Row>
  </div>
);

const MainHomeComponent = () => {
  const dispatch = useDispatch();
  const { hotProducts, newProducts, isLoading, error } = useSelector(
    (state) => state.products
  );
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  const navigate = useNavigate();

  const onBannerClick = (path) => {
    navigate(path);
  };

  // Tạo state local để chứa 8 sản phẩm để hiển thị
  const [displayHotProducts, setDisplayHotProducts] = useState([]);
  const [displayNewProducts, setDisplayNewProducts] = useState([]);

  const handleAddToCart = () => {
    if (!isLoggedIn) {
      message.warning("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!");
      dispatch(toggleLoginModal());
    } else {
      navigate("/gio-hang");
      message.info(
        "Vui lòng chọn size và số lượng sản phẩm trước khi thêm vào giỏ hàng!"
      );
    }
  };

  const handleBuyNow = () => {
    if (!isLoggedIn) {
      message.warning("Vui lòng đăng nhập để mua sản phẩm!");
      dispatch(toggleLoginModal());
    } else {
      navigate("/gio-hang");
      message.info("Vui lòng chọn size và số lượng sản phẩm trước khi mua!");
    }
  };

  useEffect(() => {
    dispatch(fetchHotProducts());
    dispatch(fetchNewProducts());
  }, [dispatch]);

  useEffect(() => {
    // Assuming hotProducts and newProducts are arrays and have been populated
    // after the fetch actions dispatched above have completed.
    // This useEffect will run when hotProducts or newProducts have changed.

    setDisplayHotProducts(hotProducts.slice(0, 8));
    setDisplayNewProducts(newProducts.slice(0, 8));
  }, [hotProducts, newProducts]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }
  return (
    <div>
      <Carousel
        className="carousel"
        autoplay
        autoplaySpeed={5000}
        dotPosition="bottom"
      >
        <div onClick={() => onBannerClick(ROUTES.NEW)}>
          <img src={banner1} alt="Banner 1" />
        </div>
        <div onClick={() => onBannerClick(ROUTES.NEW)}>
          <img src={banner2} alt="Banner 2" />
        </div>
        <div onClick={() => onBannerClick(ROUTES.SALE)}>
          <img src={banner3} alt="Banner 3" />
        </div>
      </Carousel>

      <ProductSection
        title="Thời trang bán chạy"
        products={displayHotProducts}
        handleAddToCart={handleAddToCart}
        handleBuyNow={handleBuyNow}
      />

      <div className="banner">
        <Row gutter={[10, 15]}>
          {banners.map((banner, index) => {
            let spanSize = index === 0 || index === banners.length - 1 ? 6 : 12;

            return (
              <Col
                span={spanSize}
                key={banner.id}
                onClick={() => onBannerClick(banner.path)}
              >
                <div
                  className="banner-item"
                  style={{ backgroundImage: `url(${banner.imageUrl})` }}
                >
                  <h2>{banner.title}</h2>
                  <p>{banner.subTitle}</p>
                </div>
              </Col>
            );
          })}
        </Row>
      </div>
      <ProductSection
        title="Hàng mới về"
        products={displayNewProducts}
        handleAddToCart={handleAddToCart}
        handleBuyNow={handleBuyNow}
      />
    </div>
  );
};

export default MainHomeComponent;
