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

const AccessoryComponent = () => {
  const [accessory, setAccessory] = useState([]);
  const [filteredAccessory, setFilteredAccessory] = useState([]);
  const [title, setTitle] = useState("Quần Nam");

  const location = useLocation();

  useEffect(() => {
    const loadAccessory = async () => {
      try {
        const allProducts = await productApis.getAllProducts();
        const params = new URLSearchParams(location.search);
        const categoryQuery = params.get("category");

        let newTitle = "PHỤ KIỆN"; // Default title
        let filteredProducts = allProducts.filter(
          (product) => product.category === "accessory"
        );

        if (categoryQuery === "belt") {
          newTitle = "THẮT LƯNG";
          filteredProducts = filteredProducts.filter(
            (product) => product.subcategory === "belt"
          );
        } else if (categoryQuery === "wallet") {
          newTitle = "VÍ DA";
          filteredProducts = filteredProducts.filter(
            (product) => product.subcategory === "wallet"
          );
        } else if (categoryQuery === "hat") {
          newTitle = "MŨ NÓN";
          filteredProducts = filteredProducts.filter(
            (product) => product.subcategory === "hat"
          );
        } else if (categoryQuery === "bag") {
          newTitle = "TÚI XÁCH";
          filteredProducts = filteredProducts.filter(
            (product) => product.subcategory === "bag"
          );
        } else if (categoryQuery === "glasses") {
          newTitle = "MẮT KÍNH";
          filteredProducts = filteredProducts.filter(
            (product) => product.subcategory === "glasses"
          );
        }

        setTitle(newTitle);
        setAccessory(filteredProducts);
        setFilteredAccessory(filteredProducts);
      } catch (error) {
        console.error("Failed to fetch products", error);
      }
    };

    loadAccessory();
  }, [location.search]);

  const handleSortChange = (value) => {
    let sortedPant = [...accessory];

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

    setFilteredAccessory(sortedPant);
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
        <ProductSection title="" products={filteredAccessory} />
      </div>
      <div className="sidebar">
        <HotProducts />
      </div>
    </div>
  );
};

export default AccessoryComponent;
