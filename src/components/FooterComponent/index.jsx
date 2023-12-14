import React from "react";
import {
  FacebookOutlined,
  InstagramOutlined,
  YoutubeOutlined,
  DoubleRightOutlined,
} from "@ant-design/icons";
import logo from "../../img/khoi.png"; // Importing the logo image
import "./style.scss"; // Assuming you have a separate SCSS file for the footer styles
import { Link } from "react-router-dom";

const FooterComponent = () => {
  return (
    <footer className="footer">
      <div className="footer-section">
        <img
          src={logo} // Using the imported logo image
          alt="Logo"
          style={{ display: "block", height: "100px" }}
        />
        <ul>
          <li>
            <Link to="/gioi-thieu" className="custom-link">
              <DoubleRightOutlined />
              Giới thiệu
            </Link>
          </li>
          <li>
            <Link to="/lien-he" className="custom-link">
              <DoubleRightOutlined />
              Liên hệ
            </Link>
          </li>
          <li>
            <Link to="/tuyen-dung" className="custom-link">
              <DoubleRightOutlined />
              Tuyển dụng
            </Link>
          </li>
          <li>
            <Link to="/tin-tuc" className="custom-link">
              <DoubleRightOutlined />
              Tin tức
            </Link>
          </li>
        </ul>
        <div className="footer-section contact-info">
          <p>Email: info@khoiphanclothes.com</p>
          <p>Hotline: 0905.139.129</p>
        </div>
        <div className="footer-section newsletter">
          <label htmlFor="newsletter-email">
            Đăng ký nhận email khuyến mãi
          </label>
          <input
            type="email"
            id="newsletter-email"
            placeholder="Email của bạn"
          />
          <button type="submit">Đăng ký</button>
        </div>
      </div>
      <div className="footer-section">
        <h3>HỖ TRỢ KHÁCH HÀNG</h3>
        <ul>
          <li>
            <Link to="/dat-hang-truc-tuyen" className="custom-link">
              <DoubleRightOutlined />
              Hướng dẫn đặt hàng
            </Link>
          </li>
          <li>
            <Link to="/huong-dan-chon-size" className="custom-link">
              <DoubleRightOutlined />
              Hướng dẫn chọn size
            </Link>
          </li>
          <li>
            <Link to="/cau-hoi-thuong-gap" className="custom-link">
              <DoubleRightOutlined />
              Câu hỏi thường gặp
            </Link>
          </li>
          <li>
            <Link to="/chinh-sach-khach-vip" className="custom-link">
              <DoubleRightOutlined />
              Chính sách khách VIP
            </Link>
          </li>
          <li>
            <Link to="/chinh-sach-thanh-toan-giao-hang" className="custom-link">
              <DoubleRightOutlined />
              Thanh toán - Giao hàng
            </Link>
          </li>
          <li>
            <Link to="/chinh-sach-doi-hang" className="custom-link">
              <DoubleRightOutlined />
              Chính sách đổi trả
            </Link>
          </li>
          <li>
            <Link to="/chinh-sach-bao-mat" className="custom-link">
              <DoubleRightOutlined />
              Chính sách bảo mật
            </Link>
          </li>
        </ul>
      </div>
      <div className="footer-section">
        <h3>KẾT NỐI VỚI KHOIPHAN</h3>
        <div className="social-links">
          <FacebookOutlined />
          <InstagramOutlined />
          <YoutubeOutlined />
          {/* ... other icons ... */}
        </div>
      </div>
      <div className="footer-info">
        <p>
          Copyright 2023 - Thiết kế và phát triển bởi KHOIPHAN SHOP All rights
          reserved
        </p>
        <p>Chủ quản: ông Phan Trọng Khôi. MST cá nhân: 123456789</p>
        <p>
          Số ĐKKD: 68686868 do UBND Quận Hải Châu - Tp.Đà Nẵng cấp ngày
          18/12/2010
        </p>
        <div className="line">
          <p>
            Nhãn hiệu "Khoi Phan Clothes" đã được đăng kí độc quyền tại Cục sở
            hữu trí tuệ Việt Nam
          </p>
        </div>
      </div>
    </footer>
  );
};

export default FooterComponent;
