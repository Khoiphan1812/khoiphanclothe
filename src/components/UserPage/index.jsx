import React, { useEffect, useState } from "react";
import "./style.scss";
import axios from "axios";
import { userApis } from "../../apis/userAPI";
import { useLocation, useParams } from "react-router-dom";

const UserProfile = () => {
  const { email } = useParams(); // Use email instead of id
  const location = useLocation();
  const [userDetails, setUserDetails] = useState(
    location.state?.user || {
      email: "",
      gender: "",
      fullName: "",
      phoneNumber: "",
      dob: "",
      province: "",
      district: "",
      ward: "",
      streetAddress: "",
      addressType: "",
    }
  );

  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");

  const handleOpenAddressModal = () => {
    setIsAddressModalOpen(true);
  };

  const handleCloseAddressModal = () => {
    setIsAddressModalOpen(false);
  };

  useEffect(() => {
    const fetchUserDetailsByEmail = async () => {
      if (!email) return;
      try {
        const user = await userApis.getUserByPhone(email);
        setUserDetails(user || {});
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserDetailsByEmail();
  }, [email]);

  useEffect(() => {
    axios
      .get("https://provinces.open-api.vn/api/p/")
      .then((response) => {
        setProvinces(response.data);
      })
      .catch((error) => {
        console.error("Error fetching provinces:", error);
      });
  }, []);

  // Load districts
  useEffect(() => {
    if (selectedProvince) {
      axios
        .get(`https://provinces.open-api.vn/api/p/${selectedProvince}?depth=2`)
        .then((response) => {
          setDistricts(response.data.districts);
        })
        .catch((error) => {
          console.error("Error fetching districts:", error);
        });
    }
  }, [selectedProvince]);

  // Load wards
  useEffect(() => {
    if (selectedDistrict) {
      axios
        .get(`https://provinces.open-api.vn/api/d/${selectedDistrict}?depth=2`)
        .then((response) => {
          setWards(response.data.wards);
        })
        .catch((error) => {
          console.error("Error fetching wards:", error);
        });
    }
  }, [selectedDistrict]);

  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    setUserDetails((prevState) => ({
      ...prevState,
      [name]: type === "radio" ? (checked ? value : prevState[name]) : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      // Gửi toàn bộ thông tin người dùng để cập nhật
      const updatedUser = await userApis.updateUserById(
        userDetails.id,
        userDetails
      );
      console.log("Thông tin đã được cập nhật:", updatedUser);
      setUserDetails(updatedUser); // Cập nhật state với thông tin mới
      handleCloseAddressModal(); // Đóng modal nếu cần
    } catch (error) {
      console.error("Lỗi khi cập nhật thông tin người dùng:", error);
    }
  };

  // Assuming you have a function to handle logout
  const handleLogout = () => {
    console.log("User logged out");
    // Implement logout functionality
  };

  // Handle change for province dropdown
  const handleProvinceChange = (event) => {
    const provinceCode = event.target.value;
    setSelectedProvince(provinceCode);
    setDistricts([]);
    setWards([]);
    // Cập nhật state userDetails
    setUserDetails((prevState) => ({
      ...prevState,
      province: provinceCode,
      district: "",
      ward: "",
    }));
  };

  const handleDistrictChange = async (event) => {
    const districtCode = event.target.value;
    setSelectedDistrict(districtCode);
    // Cập nhật state userDetails
    setUserDetails((prevState) => ({
      ...prevState,
      district: districtCode,
      ward: "",
    }));
    // Fetch wards
    try {
      const response = await axios.get(
        `https://provinces.open-api.vn/api/d/${districtCode}?depth=2`
      );
      setWards(response.data.wards);
    } catch (error) {
      console.error("Error fetching wards:", error);
    }
  };

  return (
    <div className="user-profile-container">
      <aside className="sidebar">
        <div className="user-avatar">
          {userDetails.fullName ? userDetails.fullName.charAt(0) : ""}
        </div>
        <div className="user-details-sidebar">
          <div className="user-name">{userDetails.fullName}</div>
          {/* Other user details */}
        </div>
        <nav className="user-actions">
          {/* Add onClick handlers to these list items as needed */}
          <ul>
            <li>Mã ưu đãi</li>
            <li>Đơn hàng</li>
            <li>Thẻ thành viên</li>
            <li onClick={handleOpenAddressModal}>Sổ địa chỉ</li>
            <li>Yêu thích</li>
            <li>Đã xem gần đây</li>
            <li onClick={handleLogout}>Đăng xuất</li>
          </ul>
        </nav>
      </aside>

      <main className="user-content">
        <h2>Thông tin tài khoản</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="gender">Giới tính</label>
            <div className="radio-group">
              <input
                type="radio"
                name="gender"
                value="male"
                checked={userDetails.gender === "male"}
                onChange={handleInputChange}
              />{" "}
              Nam
              <input
                type="radio"
                name="gender"
                value="female"
                checked={userDetails.gender === "female"}
                onChange={(e) =>
                  setUserDetails({ ...userDetails, gender: e.target.value })
                }
              />{" "}
              Nữ
              <input
                type="radio"
                name="gender"
                value="other"
                checked={userDetails.gender === "other"}
                onChange={(e) =>
                  setUserDetails({ ...userDetails, gender: e.target.value })
                }
              />{" "}
              Khác
            </div>
          </div>

          {/* Repeat similar blocks for full name, phone number, email, and DOB */}
          {/* For example: */}
          <div className="form-group">
            <label htmlFor="fullName">Họ tên</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              placeholder="Nhập họ và tên"
              value={userDetails.fullName}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Số điện thoại</label>
            <input
              type="tel"
              id="phoneNumber"
              name="v"
              value={userDetails.phoneNumber}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Nhập email"
              value={userDetails.email}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="dob">Sinh nhật</label>
            <input
              type="date"
              id="dob"
              name="dob"
              value={userDetails.dob || ""}
              onChange={handleInputChange}
            />
          </div>

          {/* ... additional input fields ... */}

          <button type="submit">Lưu thay đổi</button>
        </form>
      </main>
      {isAddressModalOpen && (
        <div className="modal-backdrop" onClick={handleCloseAddressModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Thêm địa chỉ mới</h2>
              <button
                className="modal-close-btn"
                onClick={handleCloseAddressModal}
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <label htmlFor="fullName">Họ tên</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                placeholder="Nhập họ và tên"
                value={userDetails.fullName} // Sử dụng giá trị từ state
                onChange={handleInputChange} // Cập nhật state khi có thay đổi
              />

              <label htmlFor="phoneNumber">Số điện thoại</label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                placeholder="Nhập số điện thoại"
                value={userDetails.phoneNumber}
                onChange={handleInputChange}
              />

              <label htmlFor="province">Tỉnh / Thành phố</label>
              <select
                id="province"
                name="province"
                value={userDetails.province}
                onChange={(e) => {
                  handleProvinceChange(e);
                  handleInputChange(e);
                }}
              >
                {provinces.map((province) => (
                  <option key={province.code} value={province.code}>
                    {province.name}
                  </option>
                ))}
              </select>

              <label htmlFor="district">Quận / Huyện</label>
              <select
                id="district"
                name="district"
                value={userDetails.district}
                onChange={(e) => {
                  handleDistrictChange(e);
                  handleInputChange(e);
                }}
              >
                {districts.map((district) => (
                  <option key={district.code} value={district.code}>
                    {district.name}
                  </option>
                ))}
              </select>

              <label htmlFor="ward">Phường / Xã</label>
              <select
                id="ward"
                name="ward"
                value={userDetails.ward}
                onChange={handleInputChange}
              >
                {wards.map((ward) => (
                  <option key={ward.code} value={ward.code}>
                    {ward.name}
                  </option>
                ))}
              </select>
              <label htmlFor="streetAddress">Địa chỉ chi tiết</label>
              <input
                type="text"
                id="streetAddress"
                name="streetAddress"
                value={userDetails.streetAddress}
                placeholder="Toà nhà, số nhà, tên đường"
                onChange={handleInputChange}
              />

              <div className="address-type">
                <label>
                  <input
                    type="radio"
                    name="addressType"
                    value="company"
                    checked={userDetails.addressType === "company"}
                    onChange={handleInputChange}
                  />{" "}
                  Công ty
                </label>
                <label>
                  <input
                    type="radio"
                    name="addressType"
                    value="home"
                    checked={userDetails.addressType === "home"}
                    onChange={handleInputChange}
                  />{" "}
                  Nhà riêng
                </label>
              </div>

              <div className="default-address-checkbox">
                <label>
                  <input type="checkbox" name="defaultAddress" /> Đặt làm địa
                  chỉ mặc định
                </label>
              </div>

              <button type="submit">Lưu địa chỉ</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
