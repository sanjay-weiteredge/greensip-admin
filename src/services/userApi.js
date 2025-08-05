import axios from 'axios';

const BASE_URL = 'http://localhost:8000';

// Create axios instance with default configuration
const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const getUsers = async (params = {}) => {
  try {
    const response = await apiClient.get('/user/user-list', {
      params: {
        page: params.page || 1,
        limit: params.limit || 10,
        search: params.search || '',
        sortBy: params.sortBy || 'Newest',
      },
    });
    
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

export const deleteUser = async (userId) => {
  try {
    const response = await apiClient.delete(`/user/delete/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};
