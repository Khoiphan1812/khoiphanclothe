import { Card, Col, Row, Spin } from "antd";
import React, { useEffect, useState } from "react";
import "./style.scss";
import { productApis } from "../../apis/productsAPI";
import { Link } from "react-router-dom";

const ProductSection = ({ products }) => (
  <Row gutter={[16, 16]}>
    {products.map((product) => (
      <Col span={24} key={product.id}>
        <Link to={`/product/${product.id}`} style={{ textDecoration: "none" }}>
          <Card hoverable>
            <Row gutter={16}>
              <Col span={6}>
                <img
                  alt={product.title}
                  src={product.image}
                  style={{ width: "100%" }}
                />
              </Col>
              <Col span={18}>
                <Card.Meta title={product.title} />
                <p className="product-price">{product.price}</p>
              </Col>
            </Row>
          </Card>
        </Link>
      </Col>
    ))}
  </Row>
);

const HotProducts = () => {
  const [hotProducts, setHotProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const allProducts = await productApis.getAllProducts();
        const hot = allProducts.filter(
          (product) => product.tags && product.tags.includes("hot")
        );
        setHotProducts(hot);
      } catch (error) {
        console.error("Failed to fetch products", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, []);

  if (isLoading) {
    return <Spin size="large" />;
  }

  if (hotProducts.length === 0) {
    return <p>Không có sản phẩm hot nào hiện tại.</p>;
  }
  return (
    <div className="hot-products-section">
      <h1 className="section-title">SẢN PHẨM HOT</h1>
      <div className="filter-section">{/* Your filter dropdown */}</div>
      <ProductSection title="" products={hotProducts} />
    </div>
  );
};

export default HotProducts;
