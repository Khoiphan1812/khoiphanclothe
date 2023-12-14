import { Button, Card, Col, Row, Select } from "antd";
import React, { useEffect, useState } from "react";
import "./style.scss";
import HotProducts from "../HotProductComponent";
import { Link } from "react-router-dom";
import { productApis } from "../../apis/productsAPI";

const { Option } = Select;

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

const SaleProducts = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const allProducts = await productApis.getAllProducts();
        const saleProducts = allProducts.filter(
          (product) => product.tags && product.tags.includes("sale")
        );
        setProducts(saleProducts);
        setFilteredProducts(saleProducts);
      } catch (error) {
        console.error("Failed to fetch products", error);
      }
    };

    loadProducts();
  }, []);

  const handleSortChange = (value) => {
    let sortedProducts = [...products];

    if (value === "priceLowHigh") {
      sortedProducts.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    } else if (value === "priceHighLow") {
      sortedProducts.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
    }

    setFilteredProducts(sortedProducts);
  };

  return (
    <div className="layout">
      <div className="main-content">
        <div className="header-section">
          <h1 className="section-title">THỜI TRANG KHUYẾN MÃI</h1>
          <div className="filter-section">
            <Select
              defaultValue="default"
              style={{ width: 120 }}
              onChange={handleSortChange}
            >
              <Option value="default">Mặc định</Option>
              <Option value="priceLowHigh">Giá tăng dần</Option>
              <Option value="priceHighLow">Giá giảm dần</Option>
              <Option value="newest">Mới nhất</Option>
              <Option value="bestSeller">Mua nhiều</Option>
              <Option value="mostViewed">Xem nhiều</Option>
            </Select>
          </div>
        </div>
        <ProductSection title="" products={filteredProducts} />
      </div>
      <div className="sidebar">
        <HotProducts />
      </div>
    </div>
  );
};

export default SaleProducts;
