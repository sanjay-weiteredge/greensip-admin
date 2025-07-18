import { apiRequest } from './api';

export const getAdminProfile = async () => {
  try {
    const response = await apiRequest('/admin/getProfile', {
      method: 'GET',
    });
    return await response.json();
  } catch (error) {
    return { success: false, message: 'Network error', error };
  }
};

export const updateAdminProfile = async (profileData, imageFile) => {
  try {
    let options;
    let url = 'http://localhost:8000/admin/updateProfile';
    if (imageFile) {
      const formData = new FormData();
      Object.entries(profileData).forEach(([key, value]) => {
        formData.append(key, value);
      });
      formData.append('profileImage', imageFile); 
      options = {
        method: 'PUT',
        body: formData,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      };
    } else {
      options = {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(profileData),
      };
    }
    const response = await fetch(url, options);
    return await response.json();
  } catch (error) {
    return { success: false, message: 'Network error', error };
  }
};
