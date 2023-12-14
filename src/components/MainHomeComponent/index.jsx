import React, { useEffect, useState } from "react";
import { Carousel, Card, Row, Col, Button } from "antd";
import "./style.scss";
import { productApis } from "../../apis/productsAPI";

import banner1 from "../../img/banner1.jpg";
import banner2 from "../../img/banner2.png";
import banner3 from "../../img/banner3.png";
import { Link } from "react-router-dom";

const banners = [
  {
    id: "BN001",
    title: "POLO",

    imageUrl:
      "https://i.pinimg.com/236x/9a/7a/bd/9a7abd82eaf7493bce9db11fb5d07b4d.jpg", // Replace with your actual image URL
  },
  {
    id: "BN002",
    title: "FALL-WINTER 2023",

    imageUrl:
      "https://www.gentlemansflair.com/content/images/2022/12/Date-Night-Outfits.png", // Replace with your actual image URL
  },
  {
    id: "BN003",
    title: "SWEATER",

    imageUrl:
      "https://i.pinimg.com/236x/bf/2a/0b/bf2a0bb7521bdb779198c0f7bf303f23.jpg", // Replace with your actual image URL
  },
];

const ProductSection = ({ title, products }) => (
  <div
    className={`product-section product-${title
      .toLowerCase()
      .replace(/\s/g, "-")}`}
  >
    <h1>{title}</h1>
    <Row gutter={16}>
      {products.map((product, index) => (
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
                <Button className="add-to-cart-btn">Thêm vào giỏ hàng</Button>
                <Button className="buy-now-btn" type="primary">
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
  const [hotProducts, setHotProducts] = useState([]);
  const [newProducts, setNewProducts] = useState([]);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const allProducts = await productApis.getAllProducts();
        const hot = allProducts
          .filter((product) => product.tags && product.tags.includes("hot"))
          .slice(0, 8); // Giới hạn chỉ lấy 8 sản phẩm "hot"
        const newProd = allProducts
          .filter((product) => product.tags && product.tags.includes("new"))
          .slice(0, 8); // Giới hạn chỉ lấy 8 sản phẩm "new"

        setHotProducts(hot);
        setNewProducts(newProd);
      } catch (error) {
        console.error("Failed to fetch products", error);
      }
    };

    loadProducts();
  }, []);

  return (
    <div>
      <Carousel
        className="carousel"
        autoplay
        autoplaySpeed={5000}
        dotPosition="bottom"
      >
        <div>
          <img src={banner1} alt="Banner 1" />
        </div>
        <div>
          <img src={banner2} alt="Banner 2" />
        </div>
        <div>
          <img src={banner3} alt="Banner 3" />
        </div>
      </Carousel>

      <ProductSection title="Thời trang bán chạy" products={hotProducts} />

      <div className="banner">
        <Row gutter={[10, 15]}>
          {banners.map((banner, index) => {
            let spanSize = "12"; // Cài đặt mặc định cho cột
            if (index === 0 || index === banners.length - 1) {
              spanSize = 6; // Cột đầu và cuối sẽ nhỏ hơn
            } else {
              spanSize = 12; // Cột giữa sẽ lớn hơn
            }

            return (
              <Col span={spanSize} key={banner.id}>
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
      <ProductSection title="Hàng mới về" products={newProducts} />
    </div>
  );
};

export default MainHomeComponent;
