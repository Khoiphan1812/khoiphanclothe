import { Card, Col, Row, Spin } from "antd";
import React, { useEffect } from "react";
import "./style.scss";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchHotProducts } from "../../redux/features/product/productSlice";

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
  const dispatch = useDispatch();
  const { hotProducts, isLoading, error } = useSelector(
    (state) => state.products
  );

  useEffect(() => {
    if (hotProducts.length === 0 && !error) {
      dispatch(fetchHotProducts());
    }
  }, [dispatch, hotProducts.length, error]);

  if (isLoading) {
    return <Spin size="large" />;
  }

  if (error) {
    return <div>Error: {error}</div>;
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
