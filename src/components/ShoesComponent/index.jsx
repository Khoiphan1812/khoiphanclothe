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

const ShoeComponent = () => {
  const [shoes, setShoes] = useState([]);
  const [filteredShoes, setFilteredShoes] = useState([]);
  const [title, setTitle] = useState("Giày Dép");

  const location = useLocation();

  useEffect(() => {
    const loadShoes = async () => {
      try {
        const allProducts = await productApis.getAllProducts();
        const params = new URLSearchParams(location.search);
        const categoryQuery = params.get("category");

        let newTitle = "GIÀY DÉP"; // Default title
        let filteredProducts = allProducts.filter(
          (product) => product.category === "shoe"
        );

        if (categoryQuery === "sneaker") {
          newTitle = "GIÀY SNEAKER";
          filteredProducts = filteredProducts.filter(
            (product) => product.subcategory === "sneaker-shoe"
          );
        } else if (categoryQuery === "boot") {
          newTitle = "GIÀY BOOT";
          filteredProducts = filteredProducts.filter(
            (product) => product.subcategory === "boot-shoe"
          );
        } else if (categoryQuery === "sandal") {
          newTitle = "GIÀY SANDAL";
          filteredProducts = filteredProducts.filter(
            (product) => product.subcategory === "sandal-shoe"
          );
        } else if (categoryQuery === "slides") {
          newTitle = "DÉP NAM";
          filteredProducts = filteredProducts.filter(
            (product) => product.subcategory === "slides-shoe"
          );
        }

        setTitle(newTitle);
        setShoes(filteredProducts);
        setFilteredShoes(filteredProducts);
      } catch (error) {
        console.error("Failed to fetch products", error);
      }
    };

    loadShoes();
  }, [location.search]);

  const handleSortChange = (value) => {
    let sortedShoe = [...shoes];

    if (value === "priceLowHigh") {
      sortedShoe.sort(
        (a, b) =>
          parseFloat(a.price.replace(/\./g, "")) -
          parseFloat(b.price.replace(/\./g, ""))
      );
    } else if (value === "priceHighLow") {
      sortedShoe.sort(
        (a, b) =>
          parseFloat(b.price.replace(/\./g, "")) -
          parseFloat(a.price.replace(/\./g, ""))
      );
    }

    setFilteredShoes(sortedShoe);
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
        <ProductSection title="" products={filteredShoes} />
      </div>
      <div className="sidebar">
        <HotProducts />
      </div>
    </div>
  );
};

export default ShoeComponent;
