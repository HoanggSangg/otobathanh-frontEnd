import { jwtDecode } from 'jwt-decode';

export const getCurrentUser = () => {

    try {
        const userStr = localStorage.getItem('user');
        const token = localStorage.getItem('token');

        if (!userStr || !token) {
            return null;
        }

        const decodedToken = jwtDecode(token);

        const currentTime = Date.now() / 1000;

        if (decodedToken.exp < currentTime) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            return null;
        }

        return JSON.parse(userStr);
    } catch (err) {
        console.error('Lỗi đọc user:', err);
        return null;
    }
};

export const getToken = () => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('Không có token, vui lòng đăng nhập');
    }
    return token;
};

export const getAuthHeaders = () => {
    const token = getToken();
    return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };
};
