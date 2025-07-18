import { apiRequest } from './api';

export const login = async (email, password) => {
  try {
    const response = await apiRequest('/admin/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (data.success && data.token) {
      localStorage.setItem('token', data.token);
    }
    return data;
  } catch (error) {
    return { success: false, message: 'Network error', error };
  }
};


