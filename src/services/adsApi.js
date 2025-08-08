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
