import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../Utils/auth';
import { getCartItemsAPI, updateCartItemAPI, removeFromCartAPI } from '../API';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import { useToast } from '../Styles/ToastProvider';

const CartContainer = styled.div`
  max-width: 1200px;
  margin: 120px auto 40px;
  padding: 0 20px;
`;

const CartTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
`;

const TableHeader = styled.th`
  padding: 16px;
  text-align: left;
  background-color: #f5f5f5;
  border-bottom: 2px solid #e0e0e0;
`;

const TableCell = styled.td`
  padding: 16px;
  border-bottom: 1px solid #e0e0e0;
  vertical-align: middle;
`;

const ProductImage = styled.img`
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
`;

const QuantityControl = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const QuantityButton = styled.button`
  padding: 4px 8px;
  border: 1px solid #ddd;
  background: white;
  cursor: pointer;
  border-radius: 4px;
  
  &:hover {
    background: #f5f5f5;
  }
`;

const DeleteButton = styled.button`
  padding: 8px;
  border: none;
  background: none;
  color: #e31837;
  cursor: pointer;
  
  &:hover {
    color: #b31329;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 24px;
  justify-content: flex-end;
`;

const ActionButton = styled.button<{ $primary?: boolean }>`
  padding: 12px 24px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  font-weight: 500;
  background-color: ${props => props.$primary ? '#e31837' : '#666'};
  color: white;
  
  &:hover {
    background-color: ${props => props.$primary ? '#cc1630' : '#555'};
  }
`;

const EmptyCart = styled.div`
  text-align: center;
  padding: 40px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
`;

const CartTitle = styled.h3`
    font-size: 28px;
    color: #1e2124;
    margin-bottom: 24px;
    padding-bottom: 12px;
    border-bottom: 2px solid #e31837;
  `;

const TotalPrice = styled.div`
  text-align: right;
  margin-top: 16px;
  font-size: 1.2em;
  font-weight: 500;
`;

interface CartItem {
  _id: string;
  quantity: number;
  product_id: {
    _id: string;
    name: string;
    price: number;
    image: string;
    quantity: number;
  };
}

const CartDetail = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const navigate = useNavigate();
  const user = getCurrentUser();
  const showToast = useToast();

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        if (user?.id) {
          const items = await getCartItemsAPI(user.id);
          setCartItems(items);
        }
      } catch (error) {
        console.error('Error fetching cart items:', error);
      }
    };

    fetchCartItems();
  }, [user]);

  const handleQuantityChange = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    try {

      const item = cartItems.find(item => item._id === itemId);
      if (!item) return;

      if (newQuantity > item.product_id.quantity) {
        showToast(`Không thể thêm vào giỏ hàng. Chỉ còn ${item.product_id.quantity} sản phẩm trong kho!`, 'info');
        return;
      }

      await updateCartItemAPI(itemId, newQuantity);
      setCartItems(prevItems =>
        prevItems.map(item =>
          item._id === itemId ? { ...item, quantity: newQuantity } : item
        )
      );
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    try {
      const response = await removeFromCartAPI(itemId);
      setCartItems(prevItems => prevItems.filter(item => item._id !== itemId));
      showToast(response.message, 'success');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message;
      showToast(errorMessage, 'error');
      console.error('Error removing item:', error);
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) =>
      total + (item.product_id.price * item.quantity), 0
    );
  };

  if (!user) {
    return (
      <CartContainer>
        <EmptyCart>
          <h2>Vui lòng đăng nhập để xem giỏ hàng</h2>
        </EmptyCart>
      </CartContainer>
    );
  }
  // Update the CartContainer section
  return (
    <CartContainer>
      <CartTitle>Chi tiết giỏ hàng</CartTitle>
      {cartItems.length === 0 ? (
        <EmptyCart>
          <h1>Giỏ hàng trống</h1>
          <ActionButton onClick={() => navigate('/products')}>
            Quay lại mua sắm
          </ActionButton>
        </EmptyCart>
      ) : (
        <>
          <CartTable>
            <thead>
              <tr>
                <TableHeader>Sản phẩm</TableHeader>
                <TableHeader>Tên</TableHeader>
                <TableHeader>Giá</TableHeader>
                <TableHeader>Số lượng</TableHeader>
                <TableHeader>Tổng</TableHeader>
                <TableHeader></TableHeader>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr key={item._id}>
                  <TableCell>
                    <ProductImage
                      src={item.product_id.image}
                      alt={item.product_id.name}
                    />
                  </TableCell>
                  <TableCell>{item.product_id.name}</TableCell>
                  <TableCell>
                    {new Intl.NumberFormat('vi-VN', {
                      style: 'currency',
                      currency: 'VND'
                    }).format(item.product_id.price)}
                  </TableCell>
                  <TableCell>
                    <QuantityControl>
                      <QuantityButton
                        onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                      >
                        <RemoveIcon />
                      </QuantityButton>
                      <span>{item.quantity}</span>
                      <QuantityButton
                        onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                      >
                        <AddIcon />
                      </QuantityButton>
                    </QuantityControl>
                  </TableCell>
                  <TableCell>
                    {new Intl.NumberFormat('vi-VN', {
                      style: 'currency',
                      currency: 'VND'
                    }).format(item.product_id.price * item.quantity)}
                  </TableCell>
                  <TableCell>
                    <DeleteButton onClick={() => handleRemoveItem(item._id)}>
                      <DeleteIcon />
                    </DeleteButton>
                  </TableCell>
                </tr>
              ))}
            </tbody>
          </CartTable>

          <TotalPrice>
            Tổng tiền: {new Intl.NumberFormat('vi-VN', {
              style: 'currency',
              currency: 'VND'
            }).format(calculateTotal())}
          </TotalPrice>

          <ButtonGroup>
            <ActionButton onClick={() => navigate('/products')}>
              Tiếp tục mua sắm
            </ActionButton>
            <ActionButton onClick={() => navigate('/order/checkout')}>
              Đặt hàng
            </ActionButton>
          </ButtonGroup>
        </>
      )}
    </CartContainer>
  );
};

export default CartDetail;