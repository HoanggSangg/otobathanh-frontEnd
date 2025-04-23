import { jwtDecode } from 'jwt-decode';

export const getCurrentUser = () => {

    try {
        const userStr = localStorage.getItem('user');
        const token = localStorage.getItem('token');

        // Nếu không có token hoặc user thì trả về null
        if (!userStr || !token) {
            return null;
        }

        // Giải mã token
        const decodedToken = jwtDecode(token);

        const currentTime = Date.now() / 1000; // Thời gian hiện tại tính bằng giây

        // Kiểm tra xem token đã hết hạn chưa
        if (decodedToken.exp < currentTime) {
            // Nếu hết hạn, xóa token và user khỏi localStorage
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            return null; // Token hết hạn, không trả về user
        }

        // Nếu chưa hết hạn, trả về user
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

// Hàm tạo headers
export const getAuthHeaders = () => {
    const token = getToken(); // Lấy token
    return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };
};
