import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

// Interface cho response chung
interface ApiResponse<T = any> {
    success: boolean;
    message?: string;
    data: T;
}

// Login
export const loginAPI = async (
    email: string,
    password: string
): Promise<ApiResponse> => {
    const response = await axios.post(`${API_URL}/api/accounts/login`, {
        email,
        password,
    });
    return response.data;
};

// Register
export const registerAPI = async (
    fullName: string,
    email: string,
    password: string,
    image: string
): Promise<ApiResponse> => {
    const response = await axios.post(`${API_URL}/api/accounts/create`, {
        fullName,
        email,
        password,
        image,
    });
    return response.data;
};

// Verify account
export const verifyAccountAPI = async (
    email: string,
    verificationCode: string
): Promise<ApiResponse> => {
    const response = await axios.post(`${API_URL}/api/accounts/verify`, {
        email,
        code: verificationCode,
    });
    return response.data;
};