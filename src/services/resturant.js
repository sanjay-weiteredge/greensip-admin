import { apiRequest } from './api';

export const restaurantService = {
  
  signup: async (vendorData) => {
    try {
      const response = await apiRequest('/restaurant/signup', {
        method: 'POST',
        body: JSON.stringify(vendorData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw errorData;
      }
      
      return await response.json();
    } catch (error) {
      throw error || { success: false, message: 'Network error occurred' };
    }
  },

  // Get all restaurants
  getAllRestaurants: async () => {
    try {
      const response = await apiRequest('/restaurant/allVendors', {
        method: 'GET'
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw errorData;
      }
      
      return await response.json();
    } catch (error) {
      throw error || { success: false, message: 'Network error occurred' };
    }
  },

  // Delete restaurant
  deleteRestaurant: async (restaurantId) => {
    try {
      const response = await apiRequest(`/restaurant/${restaurantId}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw errorData;
      }
      
      return await response.json();
    } catch (error) {
      throw error || { success: false, message: 'Network error occurred' };
    }
  }

};