import React, { useState } from "react";
import { Form, Input, Button, Select, Radio } from "antd";
import "./style.scss"; // Adjust the path to your style.scss

const { Option } = Select;

const CheckoutForm = () => {
  const [paymentMethod, setPaymentMethod] = useState("cod");

  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Quần bó sát chân thẳng có dây rút",
      quantity: 2,
      price: 1350000,
      image:
        "https://d1flfk77wl2xk4.cloudfront.net/Assets/77/935/XXL_p0202093577.jpg",
      size: "S",
    },
    {
      id: 2,
      name: "Quần bó sát chân thẳng có dây rút",
      quantity: 2,
      price: 1550000,
      image:
        "https://d1flfk77wl2xk4.cloudfront.net/Assets/77/935/XXL_p0202093577.jpg",
      size: "S",
    },
    // ...other items
  ]);

  const calculateTotal = () =>
    cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  const [total, setTotal] = useState(calculateTotal());

  const handleQuantityChange = (quantity, itemId) => {
    if (quantity >= 1) {
      const updatedCartItems = cartItems.map((item) =>
        item.id === itemId ? { ...item, quantity: quantity } : item
      );
      setCartItems(updatedCartItems);
      setTotal(calculateTotal(updatedCartItems));
    }
  };

  const handleApplyDiscount = () => {
    // Placeholder for discount application logic
    console.log("Apply discount code");
  };

  const handleSizeChange = (size, itemId) => {
    const updatedCartItems = cartItems.map((item) =>
      item.id === itemId ? { ...item, size: size } : item
    );
    setCartItems(updatedCartItems);
  };

  const handlePaymentChange = (e) => setPaymentMethod(e.target.value);

  const onFinish = (values) => console.log("Received values of form: ", values);

  return (
    <div className="checkout-page">
      <div className="contact info">
        <h2>Thông tin liên hệ giao hàng</h2>
        <Form onFinish={onFinish} layout="vertical">
          <Form.Item
            name="fullName"
            label="Họ và tên"
            rules={[{ required: true, message: "Vui lòng nhập họ và tên!" }]}
          >
            <Input placeholder="Nhập họ và tên của bạn" />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ type: "email", message: "Email không hợp lệ!" }]}
          >
            <Input placeholder="Nhập email của bạn" />
          </Form.Item>
          <Form.Item
            name="phone"
            label="Số điện thoại"
            rules={[
              { required: true, message: "Vui lòng nhập số điện thoại!" },
            ]}
          >
            <Input placeholder="Nhập số điện thoại của bạn" />
          </Form.Item>
          <Form.Item
            name="deliveryMethod"
            label="Cách thức nhận hàng"
            rules={[
              { required: true, message: "Vui lòng chọn cách thức nhận hàng!" },
            ]}
          >
            <Select placeholder="Chọn cách thức nhận hàng">
              <Option value="deliveryHome">Giao hàng tận nơi</Option>
              <Option value="pickup">Nhận hàng tại shop</Option>
            </Select>
          </Form.Item>
        </Form>
      </div>
      <div className="delivery address">
        <h2>Thông tin liên hệ</h2>
        <Form onFinish={onFinish} layout="vertical">
          <Form.Item
            name="province"
            label="Chọn tỉnh thành"
            rules={[{ required: true, message: "Vui lòng chọn tỉnh thành!" }]}
          >
            <Select placeholder="-- Chọn tỉnh thành --">
              {/* Các Option sẽ được thay thế bằng danh sách tỉnh thành từ API hoặc dữ liệu tĩnh */}
            </Select>
          </Form.Item>
          <Form.Item
            name="district"
            label="Chọn quận huyện"
            rules={[{ required: true, message: "Vui lòng chọn quận huyện!" }]}
          >
            <Select placeholder="Ban chưa chọn tỉnh thành" disabled>
              {/* Các Option sẽ được thay thế bằng danh sách quận huyện dựa trên tỉnh thành được chọn */}
            </Select>
          </Form.Item>
          <Form.Item
            name="ward"
            label="Tên phường/xã"
            rules={[
              { required: true, message: "Vui lòng nhập tên phường/xã!" },
            ]}
          >
            <Input placeholder="Nhập tên phường/xã của bạn" />
          </Form.Item>
          <Form.Item
            name="street"
            label="Số nhà, tên đường"
            rules={[
              { required: true, message: "Vui lòng nhập số nhà, tên đường!" },
            ]}
          >
            <Input placeholder="Nhập số nhà, tên đường của bạn" />
          </Form.Item>
          <Form.Item name="note" label="Ghi chú">
            <Input.TextArea placeholder="Ghi chú cho người giao hàng" />
          </Form.Item>
        </Form>
      </div>
      <div className="cart-summary">
        <h2>Giỏ hàng của bạn</h2>
        {cartItems.map((item) => (
          <div key={item.id} className="cart-item">
            <div className="item-image">
              <img src={item.image} alt="Product" />
            </div>
            <div className="item-details">
              <p>{item.name}</p>
              <Select
                defaultValue={item.size}
                onChange={(value) => handleSizeChange(value, item.id)}
              >
                <Option value="S">S</Option>
                <Option value="M">M</Option>
                <Option value="L">L</Option>
                <Option value="XL">XL</Option>
              </Select>
              <Input
                type="number"
                min={1}
                value={item.quantity}
                onChange={(e) =>
                  handleQuantityChange(Number(e.target.value), item.id)
                }
              />
              <p>Giá: {item.price.toLocaleString()} VND</p>
              <Button onClick={() => console.log("Remove item")}>Xóa</Button>
            </div>
          </div>
        ))}
        <Form.Item>
          <Input placeholder="Mã giảm giá (nếu có)" />
          <Button onClick={handleApplyDiscount}>Áp dụng</Button>
        </Form.Item>
        <div className="total-amount">
          <p>Số tiền mua sản phẩm: {total.toLocaleString()} VND</p>
        </div>
      </div>
      <div className="payment-method">
        <h2>Hình thức thanh toán</h2>
        <Radio.Group onChange={handlePaymentChange} value={paymentMethod}>
          <Radio value="cod">COD - Thanh toán khi nhận hàng</Radio>
          <Radio value="inStore">Thanh toán tại shop</Radio>
        </Radio.Group>
        <Button type="primary" htmlType="submit">
          Thanh Toán {total.toLocaleString()} VND
        </Button>
      </div>
    </div>
  );
};

export default CheckoutForm;
