import React from "react";
import FooterComponent from "./components/FooterComponent";
import HeaderComponent from "./components/HeaderComponent";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Shop from "./pages/Shop";
import ShopCategory from "./pages/ShopCategory/ShopCategory.jsx";
import Cart from "./components/Cart";
import LoginPage from "./components/Login/index.jsx";
import ForgotPassword from "./components/ForgotPassword/index.jsx";
import About from "./components/About/index.jsx";
import UserProfile from "./components/UserPage/index.jsx";
import NewProducts from "./components/NewProduct/index.jsx";
import SaleProducts from "./components/SaleComponent/index.jsx";
import DetailProduct from "./components/DetailProductComponent/index.jsx";
import { ROUTES } from "./constants/routes.js";
import ShirtComponent from "./components/ShirtComponent/index.jsx";
import PantComponent from "./components/PantsComponent/index.jsx";
import ShoeComponent from "./components/ShoesComponent/index.jsx";
import AccessoryComponent from "./components/AccessoriesComponent/index.jsx";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <HeaderComponent />
        <div
          style={{
            marginTop: 120,
          }}
        >
          <Routes>
            <Route path="/" element={<Shop />} />
            <Route path={ROUTES.NEW} element={<NewProducts />} />
            <Route path={ROUTES.SHIRT} element={<ShirtComponent />} />
            <Route path={ROUTES.TROUSER} element={<PantComponent />} />
            <Route path={ROUTES.ACCESSORY} element={<AccessoryComponent />} />
            <Route path={ROUTES.SHOE} element={<ShoeComponent />} />
            <Route path={ROUTES.SALE} element={<SaleProducts />} />
            <Route
              path="/search"
              element={<ShopCategory category="search" />}
            />
            <Route path="/gio-hang" element={<Cart />} />
            <Route path="/tao-tai-khoan" element={<LoginPage />} />
            <Route path="/lay-lai-mat-khau" element={<ForgotPassword />} />
            <Route path="/gioi-thieu" element={<About />} />
            <Route path={ROUTES.USER} element={<UserProfile />} />
            <Route path="/product/:id" element={<DetailProduct />} />
            <Route path="/user/:id" element={<UserProfile />} />
          </Routes>
        </div>
        <FooterComponent />
      </BrowserRouter>
    </div>
  );
}

export default App;
