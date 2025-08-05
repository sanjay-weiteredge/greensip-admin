import { apiRequest } from './api';

export const generateBarcodes = async (barcodeData) => {
  try {
    const response = await apiRequest('/admin/barcodes/generate', {
      method: 'POST',
      body: JSON.stringify(barcodeData),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to generate barcodes');
    }
    
    return await response.json();
  } catch (error) {
    throw new Error(error.message || 'Network error while generating barcodes');
  }
};

export const getAllBarcodes = async () => {
  try {
    const response = await apiRequest('/admin/barcodes', {
      method: 'GET',
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch barcodes');
    }
    
    return await response.json();
  } catch (error) {
    throw new Error(error.message || 'Network error while fetching barcodes');
  }
};