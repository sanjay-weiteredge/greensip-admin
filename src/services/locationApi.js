import axios from 'axios';

const BASE_URL = 'http://localhost:8000';


const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});


api.interceptors.request.use(
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


export const createLocation = async (locationData) => {
  try {
    const response = await api.post('/machine/signup', locationData);
    return response.data;
  } catch (error) {
    if (error.response) {
     
      throw new Error(error.response.data.message || 'Failed to create machine');
    } else if (error.request) {
     
      throw new Error('Network error. Please check your connection.');
    } else {

      throw new Error('Failed to create machine');
    }
  }
};


export const getAllLocations = async (params = {}) => {
  try {
    const {
      page = 1,
      limit = 20,
      search = '',
      isActive = 'all',
      sortBy = 'createdAt',
      sortOrder = 'DESC'
    } = params;

    const queryParams = {
      page: page.toString(),
      limit: limit.toString(),
      search,
      isActive,
      sortBy,
      sortOrder
    };

    const response = await api.get('/admin/locations', { params: queryParams });
    return response.data;
  } catch (error) {
    if (error.response) {
      // Server responded with error status
      throw new Error(error.response.data.message || 'Failed to fetch locations');
    } else if (error.request) {
      // Request was made but no response received
      throw new Error('Network error. Please check your connection.');
    } else {
      // Something else happened
      throw new Error('Failed to fetch locations');
    }
  }
};


export const deleteLocation = async (locationId) => {
  try {
    const response = await api.delete(`/admin/locations/${locationId}`);
    return response.data;
  } catch (error) {
    if (error.response) {
     
      throw new Error(error.response.data.message || 'Failed to delete location');
    } else if (error.request) {
     
      throw new Error('Network error. Please check your connection.');
    } else {

      throw new Error('Failed to delete location');
    }
  }
};
