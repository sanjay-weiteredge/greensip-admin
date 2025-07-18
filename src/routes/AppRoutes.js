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
import PrivateRoute from "./privateRoute";

export default function AppRoutes() {

  return (
    <Routes>

      <Route path="/login" element={<LoginPage />} />

      <Route
        path="/"
        element={
          <PrivateRoute>
            <DashBoardPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <DashBoardPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/user"
        element={
          <PrivateRoute>
            <UserPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/coupon"
        element={
          <PrivateRoute>
            <CouponPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/coupon/create"
        element={
          <PrivateRoute>
            <CreateCouponPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/barcode"
        element={
          <PrivateRoute>
            <BarcodePage />
          </PrivateRoute>
        }
      />

      <Route
        path="/support"
        element={
          <PrivateRoute>
            <SupportReq />
          </PrivateRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <UserProfile />
          </PrivateRoute>
        }
      />

      <Route
        path="/business-partner"
        element={
          <PrivateRoute>
            <RestaurantPage/>
          </PrivateRoute>
        }
      />

      <Route
        path="*"
        element={<Navigate to={"/login"} replace />}
      />
    </Routes>
  );
}
