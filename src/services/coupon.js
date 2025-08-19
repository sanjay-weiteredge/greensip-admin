import axios from "axios";

const BASE_URL = "https://greensip.hrgroupsolution.com/admin";

export const createCoupon = async (couponData, imageFile) => {
  try {
    const formData = new FormData();
    Object.entries(couponData).forEach(([key, value]) => {
      formData.append(key, value);
    });
    if (imageFile) {
      formData.append('couponImage', imageFile);
    }
    const response = await fetch('https://greensip.hrgroupsolution.com/admin/coupons', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: formData,
    });
    return await response.json();
  } catch (error) {
    return { success: false, message: 'Network error', error };
  }
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
