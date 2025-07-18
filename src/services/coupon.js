import axios from "axios";

const BASE_URL = "http://localhost:8000/admin";

export const createCoupon = async ({ code, description, pointRequired, expiry }) => {
  const token = localStorage.getItem("token");
  const body = {
    code,
    description,
    pointsRequired: pointRequired,
    expiryDate: expiry,
  };
  return axios.post(
    `${BASE_URL}/coupons`,
    body,
    {
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    }
  );
};

export const getAllCoupons = async () => {
  const token = localStorage.getItem("token");
  return axios.get(`${BASE_URL}/coupons`, {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
};

export const deleteCoupon = async (id) => {
  const token = localStorage.getItem("token");
  return axios.delete(`${BASE_URL}/coupons/${id}`, {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
};
