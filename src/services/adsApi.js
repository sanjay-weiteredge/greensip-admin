import { apiRequest } from './api';

export const adsService = {
 
  uploadAd: async (formData) => {
    try {
      const response = await apiRequest('/ads/upload', {
        method: 'POST',
        body: formData 
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

  // Create machine ad
  createMachineAd: async (formData) => {
    try {
      const response = await apiRequest('/machineads/create', {
        method: 'POST',
        body: formData
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

  // Get all machine ads
  getAllMachineAds: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== '') {
          queryParams.append(key, params[key]);
        }
      });

      const response = await apiRequest(`/machineads/all?${queryParams}`, {
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

  // Delete machine ad
  deleteMachineAd: async (adId) => {
    try {
      const response = await apiRequest(`/machineads/${adId}`, {
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
  },

 
  getAllAds: async () => {
    try {
      const response = await apiRequest('/ads/All', {
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


  deleteAd: async (adId) => {
    try {
      const response = await apiRequest(`/ads/${adId}`, {
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
