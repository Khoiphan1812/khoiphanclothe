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

const PantComponent = () => {
  const [pants, setPants] = useState([]);
  const [filteredPants, setFilteredPants] = useState([]);
  const [title, setTitle] = useState("QUẦN NAM");

  const location = useLocation();

  useEffect(() => {
    const loadPants = async () => {
      try {
        const allProducts = await productApis.getAllProducts();
        const params = new URLSearchParams(location.search);
        const categoryQuery = params.get("category");

        let newTitle = "QUẦN NAM"; // Default title
        let filteredProducts = allProducts.filter(
          (product) => product.category === "pant"
        );

        if (categoryQuery === "jean-pant") {
          newTitle = "QUẦN JEAN";
          filteredProducts = filteredProducts.filter(
            (product) => product.subcategory === "jean-pant"
          );
        } else if (categoryQuery === "trouser-pant") {
          newTitle = "QUẦN TÂY";
          filteredProducts = filteredProducts.filter(
            (product) => product.subcategory === "trouser-pant"
          );
        } else if (categoryQuery === "box-pant") {
          newTitle = "QUẦN BOX";
          filteredProducts = filteredProducts.filter(
            (product) => product.subcategory === "box-pant"
          );
        } else if (categoryQuery === "jogger-pant") {
          newTitle = "QUẦN JOGGER";
          filteredProducts = filteredProducts.filter(
            (product) => product.subcategory === "jogger-pant"
          );
        } else if (categoryQuery === "sort-pant") {
          newTitle = "QUẦN SORT";
          filteredProducts = filteredProducts.filter(
            (product) => product.subcategory === "sort-pant"
          );
        }

        setTitle(newTitle);
        setPants(filteredProducts);
        setFilteredPants(filteredProducts);
      } catch (error) {
        console.error("Failed to fetch products", error);
      }
    };

    loadPants();
  }, [location.search]);

  const handleSortChange = (value) => {
    let sortedPant = [...pants];

    if (value === "priceLowHigh") {
      sortedPant.sort(
        (a, b) =>
          parseFloat(a.price.replace(/\./g, "")) -
          parseFloat(b.price.replace(/\./g, ""))
      );
    } else if (value === "priceHighLow") {
      sortedPant.sort(
        (a, b) =>
          parseFloat(b.price.replace(/\./g, "")) -
          parseFloat(a.price.replace(/\./g, ""))
      );
    }

    setFilteredPants(sortedPant);
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
        <ProductSection title="" products={filteredPants} />
      </div>
      <div className="sidebar">
        <HotProducts />
      </div>
    </div>
  );
};

export default PantComponent;
