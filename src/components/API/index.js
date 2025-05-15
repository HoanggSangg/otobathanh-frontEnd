import axios from 'axios';
import { getAuthHeaders } from '../Utils/auth';

const API_URL = 'https://otobathanhh.onrender.com';

// Account APIs
export const loginAPI = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/api/accounts/login`, {
      email,
      password
    });
    const { token } = response.data;

    if (!token) {
      throw new Error('Không có token, đăng nhập thất bại');
    }

    localStorage.setItem('token', token);

    // Set default authorization header for all future requests
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    return response.data;
  } catch (err) {
    console.error('❌ Lỗi trong loginAPI:', err.response?.data || err.message);
    throw err;
  }
};


export const registerAPI = async (fullName, email, password, image) => {
  const response = await axios.post(`${API_URL}/api/accounts/create`, {
    fullName,
    email,
    password,
    image
  });
  return response.data;
}

export const verifyAccountAPI = async (email, verificationCode) => {
  const response = await axios.post(`${API_URL}/api/accounts/verify`, {
    email,
    code: verificationCode
  });
  return response.data;
}

export const createProductAPI = async (formData) => {
  const response = await axios.post(`${API_URL}/api/products/create`, formData,
    { headers: getAuthHeaders() }
  );
  return response.data;
};

export const forgotPasswordAPI = async (email) => {
  const response = await axios.post(`${API_URL}/api/accounts/forgot-password`, {
    email
  });
  return response.data;
};

export const resetPasswordAPI = async (email, verificationCode, newPassword) => {
  const response = await axios.post(`${API_URL}/api/accounts/reset-password`, {
    email,
    verificationCode,
    newPassword
  });
  return response.data;
};

// Product APIs
export const getAllProductsAPI = async () => {
  const response = await axios.get(`${API_URL}/api/products`);
  return response.data;
};

export const deleteProductAPI = async (productId) => {
  try {
    const response = await axios.delete(`${API_URL}/api/products/${productId}`,
      { headers: getAuthHeaders() }
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const updateProductAPI = async (productId, formData) => {
  try {
    const response = await axios.put(`${API_URL}/api/products/${productId}`, formData,
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getProductByIdAPI = async (productId) => {
  try {
    const response = await axios.get(`${API_URL}/api/products/${productId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getFeaturedProductsAPI = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/products/featured`);
    return response.data;
  } catch (error) {
    console.error('Error getting featured products:', error);
    throw error;
  }
};
export const updateFeaturedStatusAPI = async (productId, isFeatured) => {
  try {
    const response = await axios.put(
      `${API_URL}/api/products/${productId}/featured`,
      { isFeatured },
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error('Error updating featured status:', error);
    throw error;
  }
};
export const getFeaturedProductByIdAPI = async (productId) => {
  try {
    const response = await axios.get(`${API_URL}/api/products/featured/${productId}`);
    return response.data;
  } catch (error) {
    console.error('Error getting featured product by ID:', error);
    throw error;
  }
};
export const countAccountsAPI = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/accounts/count`, {
      headers: getAuthHeaders(), // Nếu không cần token, có thể bỏ dòng này
    });
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy số lượng tài khoản:', error);
    throw error;
  }
};

// Manager Account APIs
export const getAllAccountsAPI = async () => {
  try {
    const response = await fetch(`${API_URL}/api/accounts`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include'
    });
    if (!response.ok) {
      throw new Error('Failed to fetch accounts');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching accounts:', error);
    throw error;
  }
};

export const createAccountAPI = async (accountData) => {
  try {
    const response = await fetch(`${API_URL}/api/accounts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(accountData)
    });
    if (!response.ok) {
      throw new Error('Failed to create account');
    }
    return await response.json();
  } catch (error) {
    console.error('Error creating account:', error);
    throw error;
  }
};

export const updateAccountAPI = async (accountId, accountData) => {
  try {
    const response = await fetch(`${API_URL}/api/accounts/${accountId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(accountData)

    });
    if (!response.ok) {
      throw new Error('Failed to update account');
    }
    return await response.json();
  } catch (error) {
    console.error('Error updating account:', error);
    throw error;
  }
};

export const deleteAccountAPI = async (accountId) => {
  try {
    const response = await axios.delete(`${API_URL}/api/accounts/${accountId}`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting account:', error);
    throw error;
  }
};

export const getAccountByIdAPI = async (accountId) => {
  try {
    const response = await fetch(`${API_URL}/api/accounts/${accountId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include'
    });
    if (!response.ok) {
      throw new Error('Failed to fetch account');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching account:', error);
    throw error;
  }
};

// News APIs
export const getAllNewsAPI = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/news`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getNewsByIdAPI = async (newsId) => {
  try {
    const response = await axios.get(`${API_URL}/api/news/${newsId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createNewsAPI = async (newsData) => {
  try {
    const response = await axios.post(`${API_URL}/api/news/create`, newsData,
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateNewsAPI = async (newsId, newsData) => {
  try {
    const response = await axios.put(`${API_URL}/api/news/${newsId}`, newsData,
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteNewsAPI = async (newsId) => {
  try {
    const response = await axios.delete(`${API_URL}/api/news/${newsId}`,
      { headers: getAuthHeaders() }
    );
    return response;
  } catch (error) {
    throw error;
  }
};

// Update the comment API functions
export const createCommentAPI = async (commentData) => {
  try {
    const response = await axios.post(`${API_URL}/api/comments/create`, {
      comment: commentData.comment,
      accountId: commentData.accountId,
      productId: commentData.productId
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error creating comment:', error);
    throw error;
  }
};

export const getCommentsByProductIdAPI = async (productId) => {
  try {
    const response = await axios.get(`${API_URL}/api/comments/product/${productId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching comments:', error);
    throw error;
  }
};

export const deleteCommentAPI = async (commentId, accountId) => {
  try {
    const response = await axios.delete(`${API_URL}/api/comments/${commentId}`, {
      data: { accountId },
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting comment:', error);
    throw error;
  }
};

// Cart APIs
export const addToCartAPI = async (cartData) => {
  try {
    const response = await axios.post(`${API_URL}/api/cart`, {
      quantity: cartData.quantity,
      product_id: cartData.product_id,
      account_id: cartData.account_id
    });
    return response.data;
  } catch (error) {
    console.error('Error adding to cart:', error);
    throw error;
  }
};

export const getCartItemsAPI = async (accountId) => {
  try {
    const response = await axios.get(`${API_URL}/api/cart/${accountId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching cart items:', error);
    throw error;
  }
};

export const updateCartItemAPI = async (cartItemId, quantity) => {
  try {
    const response = await axios.put(`${API_URL}/api/cart/${cartItemId}`, {
      quantity: quantity
    });
    return response.data;
  } catch (error) {
    console.error('Error updating cart item:', error);
    throw error;
  }
};

export const removeFromCartAPI = async (cartItemId) => {
  try {
    const response = await axios.delete(`${API_URL}/api/cart/${cartItemId}`);
    return response.data;
  } catch (error) {
    console.error('Error removing from cart:', error);
    throw error;
  }
};

// Order APIs
export const createOrderAPI = async (orderData) => {
  try {
    const response = await axios.post(`${API_URL}/api/orders/create`, {
      account_id: orderData.account_id,
      phone: orderData.phone,
      name: orderData.name,
      email: orderData.email,
      payment_method: orderData.payment_method,
      note: orderData.note
    });
    return response.data;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

export const getOrdersByAccountAPI = async (accountId) => {
  try {
    const response = await axios.get(`${API_URL}/api/orders/account/${accountId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};

export const updateOrderStatusAPI = async (orderId, status) => {
  try {
    const response = await axios.put(`${API_URL}/api/orders/${orderId}`, {
      status: status
    }, { headers: getAuthHeaders() });
    return response.data;
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
};

export const deleteOrderAPI = async (orderId) => {
  try {
    const response = await axios.delete(`${API_URL}/api/orders/${orderId}`);
    return response;
  } catch (error) {
    console.error('Error deleting order:', error);
    throw error;
  }
};

export const getOrderDetailsAPI = async (orderId) => {
  try {
    const response = await axios.get(`${API_URL}/api/orders/detail/${orderId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching order details:', error);
    throw error;
  }
};

export const addOrderDetailAPI = async (orderDetailData) => {
  try {
    const response = await axios.post(`${API_URL}/api/orders/detail`, {
      order_id: orderDetailData.order_id,
      product_id: orderDetailData.product_id,
      quantity: orderDetailData.quantity,
      price: orderDetailData.price
    });
    return response.data;
  } catch (error) {
    console.error('Error adding order detail:', error);
    throw error;
  }
};

export const deleteOrderDetailAPI = async (detailId) => {
  try {
    const response = await axios.delete(`${API_URL}/api/orders/detail/${detailId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting order detail:', error);
    throw error;
  }
};

// Role APIs
export const getAllRolesAPI = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/roles`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching roles:', error);
    throw error;
  }
};

export const getRoleByIdAPI = async (roleId) => {
  try {
    const response = await axios.get(`${API_URL}/api/roles/${roleId}`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching role:', error);
    throw error;
  }
};

export const createRoleAPI = async (roleData) => {
  try {
    const response = await axios.post(`${API_URL}/api/roles/create`, roleData, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('Error creating role:', error);
    throw error;
  }
};

export const updateRoleAPI = async (roleId, roleData) => {
  try {
    const response = await axios.put(`${API_URL}/api/roles/${roleId}`, roleData, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('Error updating role:', error);
    throw error;
  }
};

export const deleteRoleAPI = async (roleId) => {
  try {
    const response = await axios.delete(`${API_URL}/api/roles/${roleId}`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting role:', error);
    throw error;
  }
};

export const assignRoleToAccountAPI = async (accountId, roleId) => {
  try {
    const response = await axios.post(`${API_URL}/api/roles/assign`, {
      accountId,
      roleId
    }, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('Error assigning role:', error);
    throw error;
  }
};

export const removeRoleFromAccountAPI = async (accountId, roleId) => {
  try {
    const response = await axios.post(`${API_URL}/api/roles/remove`,
      {
        accountId,
        roleId
      },
      {
        headers: getAuthHeaders()
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error removing role:', error);
    throw error;
  }
};

export const getAccountRolesAPI = async (accountId) => {
  try {
    const response = await axios.get(`${API_URL}/api/roles/account/${accountId}`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching account roles:', error);
    throw error;
  }
};

// Category APIs
export const getAllCategoriesAPI = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/categories`);
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

export const getCategoryByIdAPI = async (categoryId) => {
  try {
    const response = await axios.get(`${API_URL}/api/categories/${categoryId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching category:', error);
    throw error;
  }
};

export const createCategoryAPI = async (categoryData) => {
  try {
    const response = await axios.post(`${API_URL}/api/categories/create`, categoryData,
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error('Error creating category:', error);
    throw error;
  }
};

export const updateCategoryAPI = async (categoryId, categoryData) => {
  try {
    const response = await axios.put(`${API_URL}/api/categories/${categoryId}`, categoryData,
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error('Error updating category:', error);
    throw error;
  }
};

export const deleteCategoryAPI = async (categoryId) => {
  try {
    const response = await axios.delete(`${API_URL}/api/categories/${categoryId}`,
      { headers: getAuthHeaders() }
    );
    return response;
  } catch (error) {
    console.error('Error deleting category:', error);
    throw error;
  }
};

// Favorite APIs
export const likeProductAPI = async ({ accountId, productId }) => {
  try {
    const response = await axios.post(`${API_URL}/api/favorites/like`, {
      accountId,
      productId
    });
    return response.data;
  } catch (error) {
    console.error('Error liking product:', error);
    throw error;
  }
};

export const unlikeProductAPI = async ({ accountId, productId }) => {
  try {
    const response = await axios.delete(`${API_URL}/api/favorites/unlike/${accountId}/${productId}`);
    return response.data;
  } catch (error) {
    console.error('Error unliking product:', error);
    throw error;
  }
};

export const getFavoriteProductsAPI = async (accountId) => {
  try {
    const response = await axios.get(`${API_URL}/api/favorites/account/${accountId}/products`);
    return response.data;
  } catch (error) {
    console.error('Error fetching favorite products:', error);
    throw error;
  }
};

export const countProductLikesAPI = async (productId) => {
  try {
    const response = await axios.get(`${API_URL}/api/favorites/product/${productId}/likes/count`);
    return response.data;
  } catch (error) {
    console.error('Error counting product likes:', error);
    throw error;
  }
};

export const isProductLikedAPI = async (accountId, productId) => {
  try {
    const response = await axios.get(`${API_URL}/api/favorites/account/${accountId}/product/${productId}/liked`);
    return response.data;
  } catch (error) {
    console.error('Error checking if product is liked:', error);
    throw error;
  }
};

// Banner APIs
export const getAllBannersAPI = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/banners`);
    return response.data;
  } catch (error) {
    console.error('Error fetching banners:', error);
    throw error;
  }
};

export const createBannerAPI = async (imageData) => {
  try {
    const response = await axios.post(`${API_URL}/api/banners/create`,
      { image: imageData },
      {
        headers: getAuthHeaders()
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error creating banner:', error);
    throw error;
  }
};

export const updateBannerAPI = async (bannerId, imageData) => {
  try {
    const response = await axios.put(`${API_URL}/api/banners/${bannerId}`,
      { image: imageData },
      {
        headers: getAuthHeaders()
      });
    return response.data;
  } catch (error) {
    console.error('Error updating banner:', error);
    throw error;
  }
};

export const deleteBannerAPI = async (bannerId) => {
  try {

    const response = await axios.delete(`${API_URL}/api/banners/${bannerId}`,
      {
        headers: getAuthHeaders()
      }
    );

    return response;
  } catch (error) {
    console.error('Error deleting banner:', error);
    throw error;
  }
};

// Order APIs
export const getAllOrdersAPI = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/orders`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching all orders:', error);
    throw error;
  }
};

export const createContactAPI = async (contactData) => {
  try {
    const response = await axios.post(`${API_URL}/api/contacts/create`, {
      fullName: contactData.fullName,
      date: contactData.date,
      timeSlot: contactData.timeSlot,
      numberPhone: contactData.numberPhone,
      description: contactData.description,
      images: contactData.images, // Ensure images is an array of base64 strings
    });
    console.log('Response data:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating contact:', error);
    throw error;
  }
};

export const getAllContactsAPI = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/contacts`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching contacts:', error);
    throw error;
  }
};

export const getContactByIdAPI = async (contactId) => {
  try {
    const response = await axios.get(`${API_URL}/api/contacts/${contactId}`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching contact:', error);
    throw error;
  }
};

export const updateContactAPI = async (contactId, contactData) => {
  try {
    const response = await axios.put(`${API_URL}/api/contacts/${contactId}`, contactData, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('Error updating contact:', error);
    throw error;
  }
};

export const deleteContactAPI = async (contactId) => {
  try {
    const response = await axios.delete(`${API_URL}/api/contacts/${contactId}`, {
      headers: getAuthHeaders()
    });
    return response;
  } catch (error) {
    console.error('Error deleting contact:', error);
    throw error;
  }
};

export const updateContactStatusAPI = async (contactId, status) => {
  try {
    const response = await axios.put(`${API_URL}/api/contacts/${contactId}/status`,
      { status },
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error('Error updating contact status:', error);
    throw error;
  }
};

export const getContactsByTimeSlotAPI = async (timeSlot) => {
  try {
    const response = await axios.get(`${API_URL}/api/contacts/by-timeslot`, {
      params: { timeSlot }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching contacts by time slot:', error);
    throw error;
  }
};

export const getContactsByDateAPI = async (date) => {
  try {
    const response = await axios.get(`${API_URL}/api/contacts/by-date`, {
      params: { date }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching contacts by date:', error);
    throw error;
  }
};

// Search Products API
export const searchProductsAPI = async (searchName) => {
  try {
    const response = await axios.get(`${API_URL}/api/products/search`, {
      params: { name: searchName }
    });
    return response.data;
  } catch (error) {
    console.error('Error searching products:', error);
    throw error;
  }
};

export const enableAccountAPI = async (accountId) => {
  try {
    const response = await axios.put(`${API_URL}/api/roles/enable`, { accountId }, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('Error enabling account:', error);
    throw error;
  }
};

export const disableAccountAPI = async (accountId) => {
  try {
    console.log(accountId);
    const response = await axios.put(
      `${API_URL}/api/roles/disable`, // URL
      { accountId },                     // BODY
      { headers: getAuthHeaders() }       // HEADERS
    );
    return response.data;
  } catch (error) {
    console.error('Error disabling account:', error);
    throw error;
  }
};

export const googleLoginAPI = async (access_token) => {  // Đổi tên tham số thành access_token
  try {
    const response = await axios.post(`${API_URL}/api/accounts/google-login`, {
      access_token  // Gửi đúng tên trường như trong Postman
    });
    return response.data;
  } catch (error) {
    console.error('Error in Google login:', error);
    throw error;
  }
};

export const getMonthlyContactCountAPI = async (month, year) => {
  try {
    const response = await axios.get(`${API_URL}/api/contacts/monthly-count`, {
      params: { month, year },
      headers: getAuthHeaders()
    });
    return response;
  } catch (error) {
    console.error('Error getting monthly contact count:', error);
    throw error;
  }
};



