const BASE_URL = 'http://13.53.50.114:8000';

export const apiRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  
  // Check if the request body is FormData
  const isFormData = options.body instanceof FormData;
  
  const headers = {
    // Only set Content-Type for JSON requests, let browser handle FormData
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers,
  };
  
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });
  return response;
}; 