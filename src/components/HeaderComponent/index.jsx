import React, { useRef, useState } from "react";
import { Button, Input, Menu, Modal, message } from "antd";
import {
  ShoppingCartOutlined,
  SearchOutlined,
  UserOutlined,
} from "@ant-design/icons";
import logo from "../../img/khoi.png";
import "./style.scss";
import { Link, useNavigate } from "react-router-dom";
import SubMenu from "antd/es/menu/SubMenu";
import { ROUTES } from "../../constants/routes";
import { userApis } from "../../apis/userAPI";
import emailjs from "emailjs-com";
import { useDispatch, useSelector } from "react-redux";
import {
  setEmail,
  setUserInfo,
  toggleLoginModal,
} from "../../redux/features/auth/authSlice";
import { searchProducts } from "../../redux/features/product/productSlice";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup"; // Import yupResolver
import * as Yup from "yup"; // Import Yup to define your schema

// Define your schema
const emailSchema = Yup.object().shape({
  email: Yup.string()
    .email("Địa chỉ email không hợp lệ")
    .required("Vui lòng nhập email"),
});

const handleLoginSuccess = (userInfo, dispatch) => {
  // Lưu thông tin người dùng vào Redux store
  dispatch(setUserInfo(userInfo));

  // Lưu thông tin người dùng vào localStorage
  localStorage.setItem("userInfo", JSON.stringify(userInfo));
};

const HeaderComponent = () => {
  const navigate = useNavigate();
  const [isOTPChoiceModalVisible, setIsOTPChoiceModalVisible] = useState(false);
  const [isOTPInputModalVisible, setIsOTPInputModalVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [otp, setOtp] = useState(Array(4).fill(""));
  const [selectedMenu, setSelectedMenu] = useState(ROUTES.NEW);
  const [otpExpectedFromServer, setOtpExpectedFromServer] = useState("");
  const [otpError, setOtpError] = useState("");
  const dispatch = useDispatch();
  const email = useSelector((state) => state.auth.email);
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  const searchResults = useSelector((state) => state.products.searchResults);

  const cartItems = useSelector((state) => state.carts.carts);
  const cartItemCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const isLoginModalVisible = useSelector(
    (state) => state.auth.isLoginModalVisible
  );
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(emailSchema),
  });

  const handleDressClick = () => {
    navigate(`${ROUTES.SHIRT}?category=dress-shirt`);
  };

  const onSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (value.trim()) {
      dispatch(searchProducts(value));
    }
  };

  const handleSuggestionClick = (productId) => {
    navigate(`/product/${productId}`);
    setSearchTerm("");
  };

  // Function to show the login modal
  const showLoginModal = () => {
    dispatch(toggleLoginModal());
    setOtp(["", "", "", ""]);
  };

  // Function to handle closing the modal
  const handleCancel = () => {
    dispatch(toggleLoginModal());
    setIsOTPChoiceModalVisible(false);
    setIsOTPInputModalVisible(false);
  };

  const handleFormSubmit = handleSubmit((data) => {
    // Dispatch email vào Redux store
    dispatch(setEmail(data.email));
    showOTPModal(); // Logic to show the OTP Modal after successful validation
  });

  const showOTPModal = () => {
    // Đóng modal email
    dispatch(toggleLoginModal());
    // Mở modal OTP
    setIsOTPChoiceModalVisible(true);
  };

  const handleSendOTP = async () => {
    // Tạo OTP
    const generatedOTP = Math.floor(1000 + Math.random() * 9000).toString();

    // Thay 'YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', và 'YOUR_USER_ID'
    // với các thông tin thực tế từ tài khoản EmailJS của bạn
    const serviceID = "react_conctact_detail";
    const templateID = "React_contact_form";
    const userID = "bgv4tcawn06OS1aI8";

    // Tạo params cho template
    const templateParams = {
      to_email: email, // Make sure the email is taken from the user input
      from_name: "Khoi Phan Clothing", // Your name or your company name
      otp: generatedOTP, // The generated OTP
    };

    try {
      const response = await emailjs.send(
        serviceID,
        templateID,
        templateParams,
        userID
      );
      console.log("Email successfully sent!", response.status, response.text);
      setIsOTPChoiceModalVisible(false);
      setIsOTPInputModalVisible(true);
      // Lưu OTP từ server vào state để kiểm tra sau này
      setOtpExpectedFromServer(generatedOTP);
    } catch (error) {
      console.error("Error sending email:", error);
    }
  };

  const inputsRef = useRef([]);

  const handleOTPInputChange = (e, index) => {
    const newOtp = [...otp];
    newOtp[index] = e.target.value;
    setOtp(newOtp);

    // Xóa thông báo lỗi cũ (nếu có)
    setOtpError("");

    inputsRef.current[index].value = e.target.value;

    if (e.target.value && index < otp.length - 1) {
      inputsRef.current[index + 1].focus();
    }

    if (newOtp.join("").length === 4) {
      if (newOtp.join("") === otpExpectedFromServer) {
        setIsOTPInputModalVisible(false);
        submitEmail();
      } else {
        // Reset OTP và thông báo lỗi
        setOtpError(
          <>
            Bạn đã nhập sai OTP
            <br />
            Vui lòng nhập lại
          </>
        );
        setOtp(Array(4).fill(""));
        message.error("Bạn đã nhập sai OTP.");

        // Đặt lại giá trị của các ô nhập và chuyển con trỏ về ô đầu tiên
        setOtp(["", "", "", ""]);
        inputsRef.current.forEach((input) => (input.value = ""));
        setTimeout(() => inputsRef.current[0].focus(), 100);
      }
    }
  };

  const submitEmail = async () => {
    try {
      const users = await userApis.getUserByEmail(email);

      if (users.length === 0) {
        // Tạo người dùng mới nếu email chưa tồn tại
        const newUser = await userApis.createUserWithEmail(email);

        // Gọi hàm xử lý thành công đăng nhập cho người dùng mới
        handleLoginSuccess(newUser, dispatch);

        // Chuyển hướng đến trang hồ sơ người dùng với thông tin mới
        navigate(`/user/${newUser.id}`, {
          state: {
            email: newUser.email,
            user: { ...newUser, email: newUser.email },
          },
        });
      } else {
        // Nếu người dùng đã tồn tại, chuyển hướng đến trang hồ sơ của họ

        // Gọi hàm xử lý thành công đăng nhập cho người dùng hiện tại
        handleLoginSuccess(users[0], dispatch);
        navigate(`/user/${users[0].id}`, {
          state: { user: users[0] },
        });
      }
    } catch (error) {
      console.error("Error submitting email number:", error);
    }
  };

  const handleClickMenuItem = (key) => {
    setSelectedMenu(key);
    navigate(key);
  };

  const handleLoginClick = () => {
    if (userInfo) {
      navigate(`/user/${userInfo.id}`);
    } else {
      showLoginModal();
    }
  };

  return (
    <>
      <Menu
        className="header"
        mode="horizontal"
        theme="light"
        defaultSelectedKeys={[ROUTES.NEW]}
        selectedKeys={[selectedMenu]}
      >
        <Menu.Item
          style={{ padding: 0 }}
          onClick={() => handleClickMenuItem(ROUTES.HOME)}
          key={ROUTES.HOME}
        >
          <img
            src={logo}
            alt="Logo"
            style={{ display: "block", height: "100px" }}
          />
        </Menu.Item>
        <Menu.Item
          onClick={() => handleClickMenuItem(ROUTES.NEW)}
          key={ROUTES.NEW}
        >
          HÀNG MỚI VỀ
        </Menu.Item>
        <SubMenu
          title="ÁO NAM"
          onTitleClick={() => handleClickMenuItem(ROUTES.SHIRT)}
          key={ROUTES.SHIRT}
        >
          <Menu.Item
            onClick={() => navigate(`${ROUTES.SHIRT}?category=polo-shirt`)}
          >
            Áo polo
          </Menu.Item>
          <Menu.Item onClick={handleDressClick}>Áo sơ mi</Menu.Item>
          <Menu.Item
            onClick={() => navigate(`${ROUTES.SHIRT}?category=t-shirt`)}
          >
            Áo thun
          </Menu.Item>
          <Menu.Item
            onClick={() => navigate(`${ROUTES.SHIRT}?category=jacket-shirt`)}
          >
            Áo khoác
          </Menu.Item>
          <Menu.Item
            onClick={() => navigate(`${ROUTES.SHIRT}?category=sweater-shirt`)}
          >
            Áo len
          </Menu.Item>
          <Menu.Item
            onClick={() => navigate(`${ROUTES.SHIRT}?category=hoodie-shirt`)}
          >
            Áo hoodie
          </Menu.Item>
        </SubMenu>
        <SubMenu
          title="QUẦN NAM"
          onTitleClick={() => handleClickMenuItem(ROUTES.TROUSER)}
          key={ROUTES.TROUSER}
        >
          <Menu.Item
            onClick={() => navigate(`${ROUTES.TROUSER}?category=jean-pant`)}
          >
            Quần jean
          </Menu.Item>
          <Menu.Item
            onClick={() => navigate(`${ROUTES.TROUSER}?category=trouser-pant`)}
          >
            Quần tây
          </Menu.Item>
          <Menu.Item
            onClick={() => navigate(`${ROUTES.TROUSER}?category=box-pant`)}
          >
            Quần box
          </Menu.Item>
          <Menu.Item
            onClick={() => navigate(`${ROUTES.TROUSER}?category=jogger-pant`)}
          >
            Quần jogger
          </Menu.Item>
          <Menu.Item
            onClick={() => navigate(`${ROUTES.TROUSER}?category=sort-pant`)}
          >
            Quần sort
          </Menu.Item>
        </SubMenu>
        <SubMenu
          title="PHỤ KIÊN"
          onTitleClick={() => handleClickMenuItem(ROUTES.ACCESSORY)}
          key={ROUTES.ACCESSORY}
        >
          <Menu.Item
            onClick={() => navigate(`${ROUTES.ACCESSORY}?category=belt`)}
          >
            Thắt lưng
          </Menu.Item>
          <Menu.Item
            onClick={() => navigate(`${ROUTES.ACCESSORY}?category=wallet`)}
          >
            Ví da
          </Menu.Item>
          <Menu.Item
            onClick={() => navigate(`${ROUTES.ACCESSORY}?category=hat`)}
          >
            Mũ nón
          </Menu.Item>
          <Menu.Item
            onClick={() => navigate(`${ROUTES.ACCESSORY}?category=bag`)}
          >
            Túi xách
          </Menu.Item>
          <Menu.Item
            onClick={() => navigate(`${ROUTES.ACCESSORY}?category=glasses`)}
          >
            Mắt kính
          </Menu.Item>
        </SubMenu>
        <SubMenu
          title="GIÀY DÉP"
          onTitleClick={() => handleClickMenuItem(ROUTES.SHOE)}
          key={ROUTES.SHOE}
        >
          <Menu.Item
            onClick={() => navigate(`${ROUTES.SHOE}?category=sneaker`)}
          >
            Sneaker
          </Menu.Item>
          <Menu.Item onClick={() => navigate(`${ROUTES.SHOE}?category=boot`)}>
            Boot
          </Menu.Item>
          <Menu.Item onClick={() => navigate(`${ROUTES.SHOE}?category=sandal`)}>
            Sandal
          </Menu.Item>
          <Menu.Item onClick={() => navigate(`${ROUTES.SHOE}?category=slides`)}>
            Dép nam
          </Menu.Item>
        </SubMenu>

        <Menu.Item
          style={{ color: "red" }}
          onClick={() => handleClickMenuItem(ROUTES.SALE)}
          key={ROUTES.SALE}
        >
          OUTLET SALE
        </Menu.Item>
        <Menu.Item key="search" style={{ position: "relative" }}>
          <Input
            placeholder="Tìm kiếm sản phẩm..."
            value={searchTerm}
            onChange={onSearchChange}
            style={{ verticalAlign: "middle" }}
          />
          <SearchOutlined style={{ cursor: "pointer", marginLeft: "5px" }} />
          {searchTerm && (
            <div className="suggestions-dropdown">
              {searchResults.map((item) => (
                <div
                  className="suggestion-item"
                  key={item.id}
                  onClick={() => handleSuggestionClick(item.id)}
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="suggestion-image"
                  />
                  <div className="suggestion-text">
                    <div className="suggestion-title">{item.title}</div>
                    <div className="suggestion-price">{item.price}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Menu.Item>
        <Menu.Item
          icon={
            <>
              <ShoppingCartOutlined />
              {cartItemCount > 0 && (
                <span className="cart-count">{cartItemCount}</span>
              )}
            </>
          }
          onClick={() => navigate(ROUTES.CART)}
        />
        <Menu.Item icon={<UserOutlined />} onClick={handleLoginClick} />
      </Menu>

      <Modal
        title="Xin chào,"
        visible={isLoginModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <form className="form" onSubmit={handleFormSubmit}>
          <div className="input-span">
            <label htmlFor="email" className="label">
              Nhập số email để Đăng ký / Đăng nhập tài khoản Khoi Phan Clothes.
            </label>
            {/* React Hook Form Controller */}
            <Controller
              control={control}
              name="email"
              render={({ field }) => (
                <Input {...field} placeholder="Vui lòng nhập địa chỉ email" />
              )}
            />
            {errors.email && <p className="error">{errors.email.message}</p>}
          </div>
          <div className="span">
            <Button
              className="submit"
              type="primary"
              onClick={handleFormSubmit}
            >
              Tiếp tục
            </Button>
          </div>
          <div className="span">
            * Khi ấn tiếp tục, bạn xác nhận đã đọc và đồng ý với{" "}
            <Link to="/dieu-khoan">Điều khoản dịch vụ</Link> cùng{" "}
            <Link to="/chinh-sach-bao-mat">Chính sách bảo mật</Link> của
            Clothes.
          </div>
        </form>
      </Modal>
      <Modal
        title="Click để nhận mã xác thực"
        visible={isOTPChoiceModalVisible}
        onCancel={handleCancel}
        footer={null}
        className="otp-choice-modal"
      >
        <Button type="primary" onClick={handleSendOTP}>
          Gửi mã OTP
        </Button>
      </Modal>
      <Modal
        title="Mã xác thực"
        visible={isOTPInputModalVisible}
        onCancel={handleCancel}
        footer={null}
        className="otp-input-modal"
      >
        {otpError && <div className="otp-error-message">{otpError}</div>}
        <div className="input-code">
          {" "}
          {Array.from({ length: 4 }).map((_, index) => (
            <Input
              key={index}
              maxLength={1}
              value={otp[index]}
              autoFocus={index === 0}
              ref={(el) => (inputsRef.current[index] = el)}
              type="text"
              className="otp-input"
              onChange={(e) => handleOTPInputChange(e, index)}
            />
          ))}
        </div>
      </Modal>
    </>
  );
};

export default HeaderComponent;
