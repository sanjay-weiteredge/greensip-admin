import axios from "axios";

const BASE_URL = 'http://13.53.50.114:8000';

const getSupportRequests = async (params = {}) => {
    const { page = 1, limit = 10, status } = params;
    
  
    const queryParams = new URLSearchParams();
    queryParams.append('page', page);
    queryParams.append('limit', limit);
    if (status) {
        queryParams.append('status', status);
    }
    
    const token = localStorage.getItem('token');
    const headers = {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
    
    try {
        const response = await axios.get(`${BASE_URL}/admin/support-requests?${queryParams.toString()}`, {
            headers
        });
        
        return response.data;
    } catch (error) {
        console.error('Support API Error:', error);
        
       
        let errorMessage = 'Failed to fetch support requests';
        
        if (error.response) {
          
            const { status, data } = error.response;
            console.error('Server Error Status:', status);
            console.error('Server Error Data:', data);
            
            if (data && data.message) {
                errorMessage = data.message;
            } else if (status === 500) {
                errorMessage = 'Server error (500) - Please check server logs';
            } else if (status === 401) {
                errorMessage = 'Unauthorized - Please login again';
            } else if (status === 403) {
                errorMessage = 'Forbidden - You do not have permission';
            } else if (status === 404) {
                errorMessage = 'API endpoint not found';
            } else {
                errorMessage = `Server error (${status})`;
            }
        } else if (error.request) {
          
            errorMessage = 'No response from server - Please check your connection';
        } else {
            
            errorMessage = error.message || 'Network error';
        }
        
        throw new Error(errorMessage);
    }
};

const updateSupportRequestStatus = async (requestId, status, response = null) => {
    const token = localStorage.getItem('token');
    const headers = {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
    
    const requestData = { status };
    if (response) {
        requestData.response = response;
    }
    
    try {
        const response = await axios.put(`${BASE_URL}/admin/support-requests/${requestId}/status`, requestData, {
            headers
        });
        
        return response.data;
    } catch (error) {
        console.error('Update Support Status Error:', error);
        
        let errorMessage = 'Failed to update support request status';
        
        if (error.response) {
            const { status, data } = error.response;
            console.error('Server Error Status:', status);
            console.error('Server Error Data:', data);
            
            if (data && data.message) {
                errorMessage = data.message;
            } else if (status === 400) {
                errorMessage = 'Invalid status value provided';
            } else if (status === 404) {
                errorMessage = 'Support request not found';
            } else if (status === 401) {
                errorMessage = 'Unauthorized - Please login again';
            } else if (status === 403) {
                errorMessage = 'Forbidden - You do not have permission';
            } else if (status === 500) {
                errorMessage = 'Server error (500) - Please check server logs';
            } else {
                errorMessage = `Server error (${status})`;
            }
        } else if (error.request) {
            errorMessage = 'No response from server - Please check your connection';
        } else {
            errorMessage = error.message || 'Network error';
        }
        
        throw new Error(errorMessage);
    }
};

export { getSupportRequests, updateSupportRequestStatus };  