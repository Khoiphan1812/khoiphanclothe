import React, { useState } from "react";
import { Button, Input, Menu, Modal } from "antd";
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

const HeaderComponent = () => {
  const navigate = useNavigate();
  const [isLoginModalVisible, setIsLoginModalVisible] = useState(false);
  const [isOTPChoiceModalVisible, setIsOTPChoiceModalVisible] = useState(false);
  const [isOTPInputModalVisible, setIsOTPInputModalVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const [selectedMenu, setSelectedMenu] = useState(ROUTES.NEW);

  const handleDressClick = () => {
    navigate(`${ROUTES.SHIRT}?category=dress-shirt`);
  };

  const onSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const onSearch = () => {
    // Thực hiện hành động tìm kiếm ở đây
    console.log("Tìm kiếm:", searchTerm);
    // Bạn có thể lọc hoặc gọi API tìm kiếm dựa trên `searchTerm`
  };

  // Function to show the login modal
  const showLoginModal = () => {
    setIsLoginModalVisible(true);
  };

  // Function to handle closing the modal
  const handleCancel = () => {
    setIsLoginModalVisible(false);
    setIsOTPChoiceModalVisible(false);
    setIsOTPInputModalVisible(false);
  };

  const handleEmailInputChange = (e) => {
    setEmail(e.target.value);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setIsLoginModalVisible(false);
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
      setOtp(generatedOTP); // Store the OTP for verification later
    } catch (error) {
      console.error("Error sending email:", error);
    }
  };

  const handleOTPInputChange = async (e) => {
    const inputOTP = e.target.value;
    if (inputOTP.length === 4 && inputOTP === otp.toString()) {
      // Đóng Modal nhập OTP
      setIsOTPInputModalVisible(false);
      // Gọi hàm để xử lý đăng nhập hoặc tạo mới người dùng
      await submitEmail();
    }
  };

  const submitEmail = async () => {
    try {
      const users = await userApis.getUserByEmail(email);
      if (users.length === 0) {
        // Create a new user if the email number does not exist
        const newUser = await userApis.createUserWithEmail(email);
        // Navigate to the user profile page with the new user's email number and initial state
        navigate(`/user/${newUser.id}`, {
          state: {
            email: newUser.email,
            user: { ...newUser, email: newUser.email },
          },
        });
      } else {
        // If the user already exists, navigate to their profile page with the user's data as state
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
            onClick={() => navigate(`${ROUTES.SHIRT}?category=polo-shirts`)}
          >
            Áo polo
          </Menu.Item>
          <Menu.Item onClick={handleDressClick}>Áo sơ mi</Menu.Item>
          <Menu.Item
            onClick={() => navigate(`${ROUTES.SHIRT}?category=t-shirts`)}
          >
            Áo thun
          </Menu.Item>
          <Menu.Item
            onClick={() => navigate(`${ROUTES.SHIRT}?category=jacket-shirts`)}
          >
            Áo khoác
          </Menu.Item>
          <Menu.Item
            onClick={() => navigate(`${ROUTES.SHIRT}?category=sweater-shirts`)}
          >
            Áo len
          </Menu.Item>
          <Menu.Item
            onClick={() => navigate(`${ROUTES.SHIRT}?category=hoodie-shirts`)}
          >
            Áo hoodie
          </Menu.Item>
        </SubMenu>
        <SubMenu title="QUẦN NAM" onTitleClick={() => navigate(ROUTES.TROUSER)}>
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
          title="PHỤ KIỆN"
          onTitleClick={() => navigate(ROUTES.ACCESSORY)}
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
        <SubMenu title="GIÀY DÉP" onTitleClick={() => navigate(ROUTES.SHOE)}>
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
          onClick={() => navigate(ROUTES.SALE)}
        >
          OUTLET SALE
        </Menu.Item>
        <Menu.Item key="search">
          <Input
            placeholder="Tìm kiếm"
            value={searchTerm}
            onChange={onSearchChange}
            onPressEnter={onSearch}
            style={{ verticalAlign: "middle" }}
          />
          <SearchOutlined
            onClick={onSearch}
            style={{ cursor: "pointer", marginLeft: "5px" }}
          />
        </Menu.Item>
        <Menu.Item
          icon={<ShoppingCartOutlined />}
          onClick={() => navigate(ROUTES.CART)}
        />
        <Menu.Item icon={<UserOutlined />} onClick={showLoginModal} />
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
            <Input
              type="email"
              name="email"
              id="email"
              placeholder="Vui lòng nhập địa chỉ email"
              value={email}
              onChange={handleEmailInputChange}
            />
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
        {/* ...nút chọn Zalo... */}
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
        <Input
          type="text"
          maxLength="4"
          placeholder="Nhập mã xác thực"
          onChange={handleOTPInputChange}
          className="otp-input"
        />
      </Modal>
    </>
  );
};

export default HeaderComponent;
