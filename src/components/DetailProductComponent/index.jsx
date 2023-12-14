import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button, Select } from "antd";
import "./style.scss";
import { productApis } from "../../apis/productsAPI";

const { Option } = Select;

const DetailProduct = () => {
  const { id } = useParams(); // Lấy ID sản phẩm từ URL
  const [products, setProducts] = useState({
    name: "",
    price: "",
    sizes: [],
    image: "",
  });
  const quantities = [1, 2, 3, 4, 5]; // Chọn số lượng bạn muốn hiển thị

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const data = await productApis.getProductById(id);
        setProducts({
          ...products,
          title: data.title,
          price: data.price,
          sizes: data.sizes,
          image: data.image,
        });
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    };

    fetchProductDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <div className="product-detail">
      <div className="product-image">
        <img src={products.image} alt={products.title} />
      </div>
      <div className="product-info">
        <h1 className="product-title">{products.title}</h1>
        <p className="product-price">{products.price}</p>
        <p className="product-description">{products.description}</p>
        <div className="product-sizes">
          <h4>Chọn size</h4>
          <Select defaultValue={products.sizes[0]} className="size-selector">
            {products.sizes.map((size) => (
              <Option key={size} value={size.toLowerCase()}>
                {size}
              </Option>
            ))}
          </Select>
        </div>
        <div className="product-quantity">
          <h4>Chọn số lượng</h4>
          <Select defaultValue={1} className="quantity-selector">
            {quantities.map((quantity) => (
              <Option key={quantity} value={quantity}>
                {quantity}
              </Option>
            ))}
          </Select>
        </div>
        <div className="product-actions">
          <Button className="add-to-cart-btn">Thêm vào giỏ hàng</Button>
          <Button className="buy-now-btn" type="primary">
            Đăng ký mua
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DetailProduct;
