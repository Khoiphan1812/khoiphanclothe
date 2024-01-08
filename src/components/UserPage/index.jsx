import React, { useCallback, useEffect, useState } from "react";
import "./style.scss";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUserDetails,
  updateUserDetailsAsync,
} from "../../redux/features/user/userSlice";
import {
  resetUserInfo,
  setUserInfo,
} from "../../redux/features/auth/authSlice";
import { orderApis } from "../../apis/orderAPI";

const UserProfile = () => {
  const { email } = useParams();
  const dispatch = useDispatch();
  const userDetails = useSelector((state) => state.user.userDetails);
  const userInfo =
    useSelector((state) => state.auth.userInfo) ||
    JSON.parse(localStorage.getItem("userInfo"));

  const navigate = useNavigate();

  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  // eslint-disable-next-line no-unused-vars
  const [selectedWard, setSelectedWard] = useState("");
  const [localUserInfo, setLocalUserInfo] = useState(userInfo);

  const handleOpenAddressModal = () => {
    setIsAddressModalOpen(true);
  };

  const handleCloseAddressModal = () => {
    setIsAddressModalOpen(false);
  };

  const handleOpenOrderModal = () => {
    setIsOrderModalOpen(true);
  };

  const handleCloseOrderModal = () => {
    setIsOrderModalOpen(false);
  };

  const [orderItems, setOrderItems] = useState([]);
  useEffect(() => {
    const fetchAndFilterOrders = async () => {
      if (userInfo?.id) {
        try {
          // Fetch all orders
          const allOrders = await orderApis.getAllOrders();

          // Filter orders where buyerId matches the logged-in user's ID
          const userOrders = allOrders.filter(
            (order) => order.buyer.id === userInfo.id
          );

          // Extract items from the user's orders
          let allItems = [];
          userOrders.forEach((order) => {
            if (order.items && Array.isArray(order.items)) {
              // Lấy tất cả items và thêm dateOfBill từ đơn hàng
              let itemsWithDate = order.items.map((item) => ({
                ...item,
                dateOfBill: order.dateOfBill,
              }));
              allItems = [...allItems, ...itemsWithDate];
            }
          });

          // Update state with the filtered items
          setOrderItems(allItems);
        } catch (error) {
          console.error(
            `Failed to fetch and filter orders for user ${userInfo.id}`,
            error
          );
          setOrderItems([]); // Reset order items in case of error
        }
      }
    };

    fetchAndFilterOrders();
  }, [userInfo.id]); // Dependency array to re-run effect when userInfo.id changes

  useEffect(() => {
    if (!userInfo && email) {
      // Nếu không có userInfo trong store nhưng có email, fetch thông tin người dùng
      dispatch(fetchUserDetails(email));
    } else if (!userInfo) {
      // Nếu không có userInfo trong store và không có email, lấy từ localStorage
      const userInfoLocal = JSON.parse(localStorage.getItem("userInfo"));
      if (userInfoLocal) {
        dispatch(setUserInfo(userInfoLocal));
      }
    }
  }, [email, dispatch, userInfo]);

  useEffect(() => {
    console.log("User:", userInfo);
  }, [userInfo]);

  useEffect(() => {
    if (!!userInfo.province) {
      setSelectedProvince(userInfo.province);
    }
    if (!!userInfo.district) {
      setSelectedDistrict(userInfo.district);
    }
    if (!!userInfo.ward) {
      setSelectedWard(userInfo.ward);
    }
  }, [userInfo.province, userInfo.district, userInfo.ward]);

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
          setWards([]);
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

  // Hàm để cập nhật districts và wards
  const updateDistrictsAndWards = useCallback(async () => {
    if (selectedProvince) {
      try {
        const response = await axios.get(
          `https://provinces.open-api.vn/api/p/${selectedProvince}?depth=2`
        );
        setDistricts(response.data.districts);

        if (selectedDistrict) {
          const districtResponse = await axios.get(
            `https://provinces.open-api.vn/api/d/${selectedDistrict}?depth=2`
          );
          setWards(districtResponse.data.wards);
        } else {
          setWards([]);
        }
      } catch (error) {
        console.error("Error fetching districts or wards:", error);
      }
    }
  }, [selectedProvince, selectedDistrict]);

  useEffect(() => {
    if (isAddressModalOpen || selectedProvince || selectedDistrict) {
      updateDistrictsAndWards();
    }
  }, [
    isAddressModalOpen,
    selectedProvince,
    selectedDistrict,
    updateDistrictsAndWards,
  ]);

  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;

    // Tạo một bản sao mới của userInfo với thông tin cập nhật
    const updatedUserInfo = {
      ...userInfo,
      [name]: type === "checkbox" ? checked : value,
    };
    // Cập nhật state cục bộ
    setLocalUserInfo(updatedUserInfo);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      console.log(localUserInfo, "localUserInfo");
      await dispatch(updateUserDetailsAsync(localUserInfo)).unwrap();
      handleCloseAddressModal();
    } catch (error) {
      // handle error
      console.error("Update failed:", error);
    }
  };

  // Assuming you have a function to handle logout
  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    localStorage.removeItem("key_carts_list");
    dispatch(resetUserInfo());
    navigate("/");
  };

  // Handle change for province dropdown
  const handleProvinceChange = (event) => {
    const provinceCode = event.target.value;
    setSelectedProvince(provinceCode);
    setSelectedDistrict("");
    setWards([]);

    // Cập nhật local state
    setLocalUserInfo({
      ...localUserInfo,
      province: provinceCode,
      district: "",
      ward: "",
    });

    // Cập nhật userInfo trong Redux store và đồng bộ với backend
    dispatch(
      updateUserDetailsAsync({
        ...userInfo,
        province: provinceCode,
        district: "",
        ward: "",
      })
    );
  };

  const handleDistrictChange = (event) => {
    const districtCode = event.target.value;
    setSelectedDistrict(districtCode);
    setWards([]);

    // Cập nhật local state
    setLocalUserInfo({
      ...localUserInfo,
      district: districtCode,
      ward: "",
    });

    // Cập nhật userInfo trong Redux store và đồng bộ với backend
    dispatch(
      updateUserDetailsAsync({
        ...userInfo,
        district: districtCode,
        ward: "",
      })
    );
  };

  // Đảm bảo hàm này cũng được gọi khi chọn xã/phường
  // Cập nhật trong handleWardChange
  const handleWardChange = (event) => {
    const wardCode = event.target.value;
    setSelectedWard(wardCode);

    // Cập nhật local state
    setLocalUserInfo({
      ...localUserInfo,
      ward: wardCode,
    });

    // Cập nhật userInfo trong Redux store và đồng bộ với backend
    dispatch(
      updateUserDetailsAsync({
        ...userInfo,
        ward: wardCode,
      })
    );
  };

  useEffect(() => {
    // Hàm này sẽ được gọi mỗi khi selectedProvince hoặc selectedDistrict thay đổi
    updateDistrictsAndWards();
  }, [selectedProvince, selectedDistrict, updateDistrictsAndWards]);

  if (!userDetails || !userInfo) {
    // Render một thông báo loading hoặc trả về null
    return <div>Loading...</div>;
  }

  return (
    <div className="user-profile-container">
      <aside className="sidebar">
        <div className="user-avatar">
          {userInfo.fullName ? userInfo.fullName.charAt(0) : ""}
        </div>
        <div className="user-details-sidebar">
          <div className="user-name">{userInfo.fullName}</div>
          {/* Other user details */}
        </div>
        <nav className="user-actions">
          {/* Add onClick handlers to these list items as needed */}
          <ul>
            <li>Mã ưu đãi</li>
            <li onClick={handleOpenOrderModal}>Đơn hàng</li>
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
                checked={localUserInfo.gender === "male"}
                onChange={handleInputChange}
              />
              Nam
              <input
                type="radio"
                name="gender"
                value="female"
                checked={localUserInfo.gender === "female"}
                onChange={handleInputChange}
              />{" "}
              Nữ
              <input
                type="radio"
                name="gender"
                value="other"
                checked={localUserInfo.gender === "other"}
                onChange={handleInputChange}
              />{" "}
              Khác
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="fullName">Họ tên</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              placeholder="Nhập họ và tên"
              value={localUserInfo.fullName}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Số điện thoại</label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={localUserInfo.phoneNumber}
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
              value={localUserInfo.email}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="dob">Sinh nhật</label>
            <input
              type="date"
              id="dob"
              name="dob"
              value={localUserInfo.dob || ""}
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
                value={localUserInfo.fullName} // Sử dụng giá trị từ state
                onChange={handleInputChange} // Cập nhật state khi có thay đổi
              />

              <label htmlFor="phoneNumber">Số điện thoại</label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                placeholder="Nhập số điện thoại"
                value={localUserInfo.phoneNumber}
                onChange={handleInputChange}
              />

              <label htmlFor="province">Tỉnh / Thành phố</label>
              <select
                id="province"
                name="province"
                value={localUserInfo.province}
                onChange={handleProvinceChange}
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
                value={localUserInfo.district}
                onChange={handleDistrictChange}
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
                value={localUserInfo.ward}
                onChange={handleWardChange}
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
                value={localUserInfo.streetAddress}
                placeholder="Toà nhà, số nhà, tên đường"
                onChange={handleInputChange}
              />

              <div className="address-type">
                <label>
                  <input
                    type="radio"
                    name="addressType"
                    value="company"
                    checked={localUserInfo.addressType === "company"}
                    onChange={handleInputChange}
                  />{" "}
                  Công ty
                </label>
                <label>
                  <input
                    type="radio"
                    name="addressType"
                    value="home"
                    checked={localUserInfo.addressType === "home"}
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
      {isOrderModalOpen && (
        <div className="order-modal">
          <div className="modal-backdrop" onClick={handleCloseOrderModal}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <h2>Đơn hàng của bạn</h2>
              <div className="order-items">
                {orderItems.map((items, index) => (
                  <div key={items.id || index} className="order-item">
                    <div className="item-image">
                      <img src={items.image} alt={items.title} />
                    </div>
                    <div className="item-details">
                      <p>{items.title}</p>
                      <p>Giá: {items.price}</p>
                      <p>Size: {items.size}</p>
                      <p>Số lượng: {items.quantity}</p>
                      <p>Ngày mua: {items.dateOfBill}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button onClick={handleCloseOrderModal}>Đóng</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
