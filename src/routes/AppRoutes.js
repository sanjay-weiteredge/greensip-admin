import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import DashBoardPage from "../MainScreen/DashBoardPage";
import LoginPage from "../Auth/LoginPage";
import UserProfile from "../components/userProfile";
import UserPage from "../MainScreen/UserPage";
import RestaurantPage from "../MainScreen/RestaurantPage ";
import CouponPage from "../MainScreen/CouponPage";
import BarcodePage from "../MainScreen/barcodePage";
import SupportReq from "../MainScreen/SupportReq";
import CreateCouponPage from "../MainScreen/CreateCouponPage";

export default function AppRoutes() {

  return (
    <Routes>

      <Route path="/login" element={<LoginPage />} />

      <Route
        path="/"
        element={
          <DashBoardPage />
        }
      />

      <Route
        path="/dashboard"
        element={
          <DashBoardPage />
        }
      />

      <Route
        path="/user"
        element={
          <UserPage />
        }
      />

      <Route
        path="/coupon"
        element={
          <CouponPage />
        }
      />

      <Route
        path="/coupon/create"
        element={<CreateCouponPage />}
      />

      <Route
        path="/barcode"
        element={
          <BarcodePage />
        }
      />

      <Route
        path="/support"
        element={
          <SupportReq />
        }
      />

      <Route
        path="/profile"
        element={

          <UserProfile />

        }
      />

      <Route
        path="/business-partner"
        element={
          <RestaurantPage/>
        }
      />

      <Route
        path="*"
        element={<Navigate to={"/login"} replace />}
      />
    </Routes>
  );
}
