import { Button, Card, Col, Pagination, Row, Select, message } from "antd";
import React, { useEffect } from "react";
import "./style.scss";
import HotProducts from "../HotProductComponent";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchSaleProducts,
  goToPage,
  setSortedProducts,
} from "../../redux/features/product/productSlice";
import { toggleLoginModal } from "../../redux/features/auth/authSlice";

const { Option } = Select;

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

const SaleProducts = () => {
  const dispatch = useDispatch();
  const { saleProducts, isLoading, error, pagination } = useSelector(
    (state) => state.products
  );

  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  const navigate = useNavigate();

  useEffect(() => {
    dispatch(
      fetchSaleProducts({
        _page: pagination.currentPage,
        _limit: pagination.productsPerPage,
      })
    );
  }, [dispatch, pagination.currentPage, pagination.productsPerPage]);

  const handleSortChange = (value) => {
    dispatch(
      setSortedProducts({
        sortType: value,
        productType: "saleProducts", // Hoặc 'newProducts' tùy thuộc vào context
      })
    );
  };

  const handlePageChange = (page) => {
    dispatch(goToPage(page));
    dispatch(
      fetchSaleProducts({
        _page: page,
        _limit: pagination.productsPerPage,
      })
    );
  };

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

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

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
        <ProductSection
          title=""
          products={saleProducts}
          handleAddToCart={handleAddToCart}
          handleBuyNow={handleBuyNow}
        />
        <Pagination
          current={pagination.currentPage} // current page from state
          total={pagination.totalProducts} // total products from state
          onChange={handlePageChange} // handle page change
          showSizeChanger={false}
        />
      </div>
      <div className="sidebar">
        <HotProducts />
      </div>
    </div>
  );
};

export default SaleProducts;
