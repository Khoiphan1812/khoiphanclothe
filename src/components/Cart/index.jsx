import React, { useCallback, useEffect, useState } from "react";
import { Form, Input, Button, Select, Radio, message, Checkbox } from "antd";
import "./style.scss"; // Adjust the path to your style.scss
import { useDispatch, useSelector } from "react-redux";
import {
  actDeleteProductInCarts,
  actUpdateQuantityOfProduct,
  actUpdateSizeOfProduct,
  clearCart,
} from "../../redux/features/cart/cartSlice";
import axios from "axios";
import { actAddOrder } from "../../redux/features/order/orderSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import emailjs from "emailjs-com";

const { Option } = Select;

// This could be in the same file or imported from a separate utility file
function formatOrderDetails(items) {
  // Assuming items is an array of item objects
  return items
    .map(
      (item) =>
        `${item.title} - Size: ${item.size} - Số lượng: ${item.quantity} - Giá tiền: ${item.price}`
    )
    .join(", ");
}

function formatAddress(buyer) {
  // Assuming buyer is an object with address components
  return `${buyer.streetAddress}, ${buyer.ward}, ${buyer.district}, ${buyer.province}, Vietnam`;
}

const CheckoutForm = () => {
  const [paymentMethod, setPaymentMethod] = useState("cod"); // already exist
  const [deliveryOption, setDeliveryOption] = useState(""); // new state for delivery option

  const dispatch = useDispatch();
  const userInfo =
    useSelector((state) => state.auth.userInfo) ||
    JSON.parse(localStorage.getItem("userInfo")) ||
    {}; // Giá trị mặc định là một object rỗng
  // eslint-disable-next-line
  const [localUserInfo, setLocalUserInfo] = useState(userInfo);
  const [form] = Form.useForm();
  const [provinceName, setProvinceName] = useState("");
  const [districtName, setDistrictName] = useState("");
  // eslint-disable-next-line
  const [wardName, setWardName] = useState("");
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  const [newAddress, setNewAddress] = useState({
    province: localUserInfo.province || "",
    district: localUserInfo.district || "",
    ward: localUserInfo.ward || "",
    streetAddress: localUserInfo.streetAddress || "",
  });

  const cartItems = useSelector((state) => state.carts?.carts || []);
  const [selectedItems, setSelectedItems] = useState([]);

  const sendConfirmationEmail = async (orders) => {
    const serviceID = "react_conctact_detail";
    const templateID = "React_contact_form 1";
    const userID = "bgv4tcawn06OS1aI8";

    const templateParams = {
      to_name: orders.buyer.fullName,
      to_email: orders.buyer.email,
      from_name: "Khoi Phan Clothing",
      order_id: orders.id, // or any unique identifier for the order
      date_of_bill: new Date(orders.dateOfBill).toLocaleDateString("vi-VN"), // format date for Vietnamese locale
      order_details: formatOrderDetails(orders.items), // a function to format the order details into a readable string
      payment_method: orders.paymentMethod,
      delivery_option: orders.deliveryOption,
      buyer_address: formatAddress(orders.buyer), // a function to format the buyer's address into a readable string
    };

    try {
      const response = await emailjs.send(
        serviceID,
        templateID,
        templateParams,
        userID
      );
      console.log("SUCCESS!", response.status, response.text);
      // Bạn có thể thêm hành động sau khi gửi mail thành công ở đây
    } catch (error) {
      console.error("FAILED...", error);
      // Xử lý lỗi ở đây
    }
  };
  // useEffect để tải dữ liệu ban đầu cho tỉnh/thành phố, quận/huyện, và phường/xã dựa vào thông tin người dùng
  useEffect(() => {
    // Load the initial province, district, and ward names based on the user's info
    const fetchInitialLocationData = async () => {
      // Fetch province name if it exists
      if (localUserInfo.province) {
        try {
          const provinceResponse = await axios.get(
            `https://provinces.open-api.vn/api/p/${localUserInfo.province}`
          );
          setProvinceName(provinceResponse.data.name);
          setNewAddress((prev) => ({
            ...prev,
            province: provinceResponse.data.name,
          }));
        } catch (error) {
          console.error("Failed to fetch province name:", error);
          message.error("Không thể tải tên tỉnh thành!");
        }
      }

      // Fetch district name if it exists
      if (localUserInfo.district) {
        try {
          const districtResponse = await axios.get(
            `https://provinces.open-api.vn/api/d/${localUserInfo.district}`
          );
          setDistrictName(districtResponse.data.name);
          setNewAddress((prev) => ({
            ...prev,
            district: districtResponse.data.name,
          }));
          // Load wards after district is set
          setWards(districtResponse.data.wards);
        } catch (error) {
          console.error("Failed to fetch district name:", error);
          message.error("Không thể tải tên quận huyện!");
        }
      }

      // Fetch ward name if it exists
      if (localUserInfo.ward) {
        try {
          const wardResponse = await axios.get(
            `https://provinces.open-api.vn/api/w/${localUserInfo.ward}`
          );
          setWardName(wardResponse.data.name);
          setNewAddress((prev) => ({
            ...prev,
            ward: wardResponse.data.name,
          }));
        } catch (error) {
          console.error("Failed to fetch ward name:", error);
          message.error("Không thể tải tên phường/xã!");
        }
      }
    };

    fetchInitialLocationData();
  }, [localUserInfo.province, localUserInfo.district, localUserInfo.ward]);

  useEffect(() => {
    const fetchProvincesData = async () => {
      try {
        const response = await axios.get(
          `https://provinces.open-api.vn/api/p/`
        );
        if (response.data && response.data.length > 0) {
          setProvinces(response.data);
          // Set the user's province if available
          if (localUserInfo.province) {
            const userProvince = response.data.find(
              (p) => p.code === localUserInfo.province
            );
            setNewAddress((prev) => ({
              ...prev,
              province: userProvince ? userProvince.name : prev.province,
            }));
          }
        } else {
          message.error("Không thể tải dữ liệu tỉnh thành!");
        }
      } catch (error) {
        console.error("Failed to fetch provinces:", error);
        message.error("Không thể tải dữ liệu tỉnh thành!");
      }
    };

    fetchProvincesData();
  }, [localUserInfo.province]);

  useEffect(() => {
    if (provinceName) {
      const fetchDistrictsData = async () => {
        try {
          const response = await axios.get(
            `https://provinces.open-api.vn/api/p/${localUserInfo.province}?depth=2`
          );
          if (response.data.districts && response.data.districts.length > 0) {
            setDistricts(response.data.districts);
            // Set the user's district if available
            if (localUserInfo.district) {
              const userDistrict = response.data.districts.find(
                (d) => d.code === localUserInfo.district
              );
              setNewAddress((prev) => ({
                ...prev,
                district: userDistrict ? userDistrict.name : prev.district,
              }));
            }
          } else {
            message.error("Không thể tải dữ liệu quận/huyện!");
          }
        } catch (error) {
          console.error("Failed to fetch districts:", error);
          message.error("Không thể tải dữ liệu quận/huyện!");
        }
      };

      fetchDistrictsData();
    }
  }, [provinceName, localUserInfo.province, localUserInfo.district]);

  useEffect(() => {
    if (districtName) {
      const fetchWardsData = async () => {
        try {
          const response = await axios.get(
            `https://provinces.open-api.vn/api/d/${localUserInfo.district}?depth=2`
          );
          if (response.data.wards && response.data.wards.length > 0) {
            setWards(response.data.wards);
            // Set the user's ward if available
            if (localUserInfo.ward) {
              const userWard = response.data.wards.find(
                (w) => w.code === localUserInfo.ward
              );
              setNewAddress((prev) => ({
                ...prev,
                ward: userWard ? userWard.name : prev.ward,
              }));
            }
          } else {
            message.error("Không thể tải dữ liệu phường/xã!");
          }
        } catch (error) {
          console.error("Failed to fetch wards:", error);
          message.error("Không thể tải dữ liệu phường/xã!");
        }
      };

      fetchWardsData();
    }
  }, [districtName, localUserInfo.district, localUserInfo.ward]);

  // Khi tỉnh thành thay đổi, cập nhật quận/huyện
  const handleProvinceChange = async (value, option) => {
    setProvinceName(option.children);
    setNewAddress((prev) => ({
      ...prev,
      province: option.children,
      district: "",
      ward: "",
    }));
    setDistricts([]);
    setWards([]);

    try {
      const response = await axios.get(
        `https://provinces.open-api.vn/api/p/${value}?depth=2`
      );
      if (response.data && response.data.districts) {
        setDistricts(response.data.districts);
      }
    } catch (error) {
      console.error("Failed to fetch districts: ", error);
      message.error("Không thể tải dữ liệu quận/huyện!");
    }
  };

  // This function is called when a new district is selected.
  const handleDistrictChange = async (value, option) => {
    setDistrictName(option.children);
    setNewAddress((prev) => ({
      ...prev,
      district: option.children,
      ward: "",
    }));
    setWards([]);

    try {
      const response = await axios.get(
        `https://provinces.open-api.vn/api/d/${value}?depth=2`
      );
      if (response.data && response.data.wards) {
        setWards(response.data.wards);
      }
    } catch (error) {
      console.error("Failed to fetch wards: ", error);
      message.error("Không thể tải dữ liệu phường/xã!");
    }
  };

  const handleWardChange = (value, option) => {
    setWardName(option.children);
    setNewAddress((prev) => ({
      ...prev,
      ward: option.children,
    }));
  };

  const calculateTotal = useCallback(
    () =>
      cartItems.reduce((total, item) => total + item.price * item.quantity, 0),
    [cartItems]
  );

  const [total, setTotal] = useState(calculateTotal());

  useEffect(() => {
    setTotal(calculateTotal());
  }, [cartItems, calculateTotal]);

  const handleApplyDiscount = () => {
    // Placeholder for discount application logic
    console.log("Apply discount code");
  };

  const handlePaymentChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  const handleDeliveryChange = (value) => {
    setDeliveryOption(value);
  };

  const handlePayment = async () => {
    const productsToBuy = cartItems.filter((item) =>
      selectedItems.includes(item.id)
    );
    if (productsToBuy.length === 0) {
      message.error("Vui lòng chọn ít nhất một sản phẩm để thanh toán!");
      return;
    }
    if (cartItems.length === 0) {
      message.error("Bạn không có hàng để thanh toán!");
      return; // Stop the function from proceeding further
    }

    if (!deliveryOption) {
      message.error("Vui lòng chọn cách thức nhận hàng trước khi thanh toán!");
      return;
    }

    const userInformation = userInfo; // Retrieved user info
    const products = cartItems; // Retrieved cart items
    const dateOfBill = new Date().toISOString();

    const orders = {
      buyer: userInformation,
      items: products,
      dateOfBill: dateOfBill,
      paymentMethod: paymentMethod,
      deliveryOption: deliveryOption,
    };

    try {
      const resultAction = await dispatch(actAddOrder(orders));
      // eslint-disable-next-line
      const orderResponse = unwrapResult(resultAction);
      // Clear the cart in Redux and localStorage
      dispatch(clearCart());
      localStorage.removeItem("key_carts_list"); // Ensure this key is correct!
      await sendConfirmationEmail(orders);
      message.success(
        "Đơn hàng của bạn đã được đặt thành công! Xin hãy kiểm tra email."
      );
    } catch (error) {
      console.error("Error placing order: ", error);
      message.error("Có lỗi xảy ra khi đặt hàng!");
    }
  };

  const handleSelectItem = (checked, item) => {
    if (checked) {
      // Thêm sản phẩm vào danh sách đã chọn
      setSelectedItems([...selectedItems, item.id]);
    } else {
      // Loại bỏ sản phẩm khỏi danh sách đã chọn
      setSelectedItems(selectedItems.filter((id) => id !== item.id));
    }
  };

  const handleAddressChange = (value, field) => {
    setNewAddress((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  useEffect(() => {
    if (deliveryOption === "deliveryHome") {
      setPaymentMethod("cod");
    } else if (deliveryOption === "pickup") {
      setPaymentMethod("inStore");
    }
  }, [deliveryOption]);

  const onFinish = (values) => console.log("Received values of form: ", values);

  // Hàm để định dạng giá tiền
  const formatPrice = (price) => {
    const numberPrice = typeof price === "string" ? parseInt(price, 10) : price;
    return numberPrice.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  };

  const handleRemoveItem = (itemId, itemSize) => {
    // Dispatch action để xóa sản phẩm khỏi giỏ hàng trong Redux
    dispatch(actDeleteProductInCarts({ id: itemId, size: itemSize }));
  };

  useEffect(() => {
    // Cập nhật form với thông tin người dùng
    if (localUserInfo) {
      form.setFieldsValue({
        fullName: localUserInfo.fullName || "",
        email: localUserInfo.email || "",
        phone: localUserInfo.phoneNumber || "",
        streetAddress: localUserInfo.streetAddress || "",

        // Thêm các trường khác tương tự nếu có
      });
    }
  }, [localUserInfo, form]);

  const handleQuantityChange = (id, newQuantity) => {
    if (newQuantity < 1) {
      return; // Ngăn không cho số lượng nhỏ hơn 1
    }
    dispatch(actUpdateQuantityOfProduct({ id, quantity: newQuantity }));
    // Redux store sẽ cập nhật và UI sẽ phản ánh thông qua useSelector
  };

  const handleSizeChange = (id, newSize) => {
    dispatch(actUpdateSizeOfProduct({ id, size: newSize }));
  };

  return (
    <div className="checkout-page">
      <div className="left-section">
        <div className="contact info">
          <h2>Thông tin liên hệ giao hàng</h2>
          <Form form={form} onFinish={onFinish} layout="vertical">
            <Form.Item label="Họ và tên">
              <span>{localUserInfo.fullName}</span>
            </Form.Item>
            <Form.Item label="Email">
              <span>{localUserInfo.email}</span>
            </Form.Item>
            <Form.Item label="Số điện thoại">
              <span>{localUserInfo.phoneNumber}</span>
            </Form.Item>
            <Form.Item
              name="deliveryMethod"
              label="Cách thức nhận hàng"
              rules={[
                {
                  required: true,
                  message: "Vui lòng chọn cách thức nhận hàng!",
                },
              ]}
            >
              <Select
                onChange={handleDeliveryChange}
                placeholder="Chọn cách thức nhận hàng"
                value={deliveryOption}
              >
                <Option value="deliveryHome">Giao hàng tận nơi</Option>
                <Option value="pickup">Nhận hàng tại shop</Option>
              </Select>
            </Form.Item>
          </Form>
        </div>
        <div className="delivery address">
          <h2>Địa chỉ giao hàng</h2>
          <Form onFinish={onFinish} layout="vertical">
            <Form.Item label="Tỉnh / Thành phố">
              <Select
                showSearch
                value={newAddress.province}
                onChange={handleProvinceChange}
                placeholder="Chọn tỉnh / thành phố"
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
              >
                {provinces.map((province) => (
                  <Option key={province.code} value={province.code}>
                    {province.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item label="Quận / Huyện">
              <Select
                showSearch
                value={newAddress.district}
                onChange={handleDistrictChange}
                placeholder="Chọn quận / huyện"
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
              >
                {districts.map((district) => (
                  <Option key={district.code} value={district.code}>
                    {district.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item label="Phường / Xã">
              <Select
                showSearch
                value={newAddress.ward}
                onChange={handleWardChange}
                placeholder="Chọn phường / xã"
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
              >
                {wards.map((ward) => (
                  <Option key={ward.code} value={ward.code}>
                    {ward.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item label="Số nhà, tên đường">
              <Input
                value={newAddress.streetAddress}
                onChange={(e) =>
                  handleAddressChange(e.target.value, "streetAddress")
                }
                placeholder="Nhập số nhà, tên đường"
              />
            </Form.Item>
            <Form.Item name="note" label="Ghi chú">
              <Input.TextArea placeholder="Ghi chú cho người giao hàng" />
            </Form.Item>
          </Form>
        </div>
      </div>
      <div className="cart-summary">
        <h2>Giỏ hàng của bạn</h2>
        {cartItems.length === 0 ? (
          <p>Giỏ hàng của bạn chưa có sản phẩm nào!!!</p>
        ) : (
          cartItems.map((item, index) => (
            <div key={index} className="cart-item">
              <Checkbox
                checked={selectedItems.includes(item.id)}
                onChange={(e) => handleSelectItem(e.target.checked, item)}
              />
              <img src={item.image} alt={item.title} />
              <div className="item-details">
                <h3>{item.title}</h3>
                <div>
                  Size:
                  <Select
                    value={item.size}
                    onChange={(newSize) => handleSizeChange(item.id, newSize)}
                  >
                    {item.availableSizes?.map((size) => (
                      <Option key={size} value={size}>
                        {size}
                      </Option>
                    ))}
                  </Select>
                </div>
                <div>
                  Số lượng:
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) =>
                      handleQuantityChange(item.id, parseInt(e.target.value))
                    }
                    min="1"
                  />
                </div>
                <p>Giá: {formatPrice(item.price)}</p>
                <Button onClick={() => handleRemoveItem(item.id, item.size)}>
                  Xóa
                </Button>
              </div>
            </div>
          ))
        )}
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
        <Radio.Group
          onChange={handlePaymentChange}
          value={paymentMethod}
          disabled
        >
          <Radio value="cod">COD - Thanh toán khi nhận hàng</Radio>
          <Radio value="inStore">Thanh toán tại shop</Radio>
        </Radio.Group>

        <Button type="primary" htmlType="submit" onClick={handlePayment}>
          Thanh Toán {total.toLocaleString()} VND
        </Button>
      </div>
    </div>
  );
};

export default CheckoutForm;
