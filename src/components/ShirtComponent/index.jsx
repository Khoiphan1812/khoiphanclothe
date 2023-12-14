import { Button, Card, Col, Row, Select } from "antd";
import React, { useEffect, useState } from "react";
import "./style.scss";
import HotProducts from "../HotProductComponent";
import { Link, useLocation } from "react-router-dom";
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

const ShirtComponent = () => {
  const [shirts, setShirts] = useState([]);
  const [filteredShirts, setFilteredShirts] = useState([]);
  const [title, setTitle] = useState("Áo Nam");

  const location = useLocation();

  useEffect(() => {
    const loadShirts = async () => {
      try {
        const allProducts = await productApis.getAllProducts();
        const params = new URLSearchParams(location.search);
        const categoryQuery = params.get("category");

        let newTitle = "ÁO NAM"; // Default title
        let filteredProducts = allProducts.filter(
          (product) => product.category === "shirt"
        );

        if (categoryQuery === "polo-shirts") {
          newTitle = "ÁO POLO";
          filteredProducts = filteredProducts.filter(
            (product) => product.subcategory === "polo-shirt"
          );
        } else if (categoryQuery === "dress-shirt") {
          newTitle = "ÁO SƠ MI";
          filteredProducts = filteredProducts.filter(
            (product) => product.subcategory === "dress-shirt"
          );
        } else if (categoryQuery === "t-shirts") {
          newTitle = "ÁO THUN";
          filteredProducts = filteredProducts.filter(
            (product) => product.subcategory === "t-shirt"
          );
        } else if (categoryQuery === "jacket-shirts") {
          newTitle = "ÁO KHOÁC";
          filteredProducts = filteredProducts.filter(
            (product) => product.subcategory === "jacket-shirt"
          );
        } else if (categoryQuery === "sweater-shirts") {
          newTitle = "ÁO LEN";
          filteredProducts = filteredProducts.filter(
            (product) => product.subcategory === "sweater-shirt"
          );
        } else if (categoryQuery === "hoodie-shirts") {
          newTitle = "ÁO HOODIE";
          filteredProducts = filteredProducts.filter(
            (product) => product.subcategory === "hoodie-shirt"
          );
        }

        setTitle(newTitle);
        setShirts(filteredProducts);
        setFilteredShirts(filteredProducts);
      } catch (error) {
        console.error("Failed to fetch products", error);
      }
    };

    loadShirts();
  }, [location.search]);

  const handleSortChange = (value) => {
    let sortedShirts = [...shirts];

    if (value === "priceLowHigh") {
      sortedShirts.sort(
        (a, b) =>
          parseFloat(a.price.replace(/\./g, "")) -
          parseFloat(b.price.replace(/\./g, ""))
      );
    } else if (value === "priceHighLow") {
      sortedShirts.sort(
        (a, b) =>
          parseFloat(b.price.replace(/\./g, "")) -
          parseFloat(a.price.replace(/\./g, ""))
      );
    }

    setFilteredShirts(sortedShirts);
  };

  return (
    <div className="layout">
      <div className="main-content">
        <div className="header-section">
          <h1 className="section-title">{title}</h1>
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
        <ProductSection title="" products={filteredShirts} />
      </div>
      <div className="sidebar">
        <HotProducts />
      </div>
    </div>
  );
};

export default ShirtComponent;
