import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../Utils/auth';
import { getCartItemsAPI, createOrderAPI } from '../API';
import { useToast } from '../Styles/ToastProvider';

const OrderContainer = styled.div`
  max-width: 1200px;
  margin: 120px auto 40px;
  padding: 0 20px;
`;

const OrderTitle = styled.h1`
  font-size: 28px;
  color: #1e2124;
  margin-bottom: 24px;
  padding-bottom: 12px;
  border-bottom: 2px solid #e31837;
`;

const OrderForm = styled.form`
  background: white;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  
  &:focus {
    outline: none;
    border-color: #e31837;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  min-height: 100px;
  
  &:focus {
    outline: none;
    border-color: #e31837;
  }
`;

const OrderSummary = styled.div`
  margin-top: 24px;
  padding: 20px;
  background: #f5f5f5;
  border-radius: 8px;
`;

const SummaryItem = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid #ddd;
  
  &:last-child {
    border-bottom: none;
    font-weight: bold;
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

// Update CartItem interface
interface CartItem {
  _id: string;
  product_id: {
    _id: string;  // Add _id field
    name: string;
    price: number;
  };
  quantity: number;
}

const Order = () => {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const showToast = useToast();
  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    note: ''
  });

  useEffect(() => {
    const fetchCartItems = async () => {
      if (user?.id) {
        try {
          setIsLoading(true);
          const items = await getCartItemsAPI(user.id);
          setCartItems(items);
          const total = items.reduce((sum: number, item: CartItem) => {
            const itemPrice = Number(item.product_id.price) || 0;
            const itemQuantity = Number(item.quantity) || 0;
            return sum + (itemPrice * itemQuantity);
          }, 0);
          setTotalAmount(Math.round(total));
        } catch (error) {
          showToast('Không tải được giỏ hàng. Vui lòng thử lại!', 'error');
          console.error('Error fetching cart items:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };
  
    fetchCartItems();
  }, [showToast, user?.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;

    try {
      setIsLoading(true);

      if (cartItems.length === 0) {
        showToast('Giỏ hàng đang trống!', 'error');
        return;
      }

      const orderData = {
        account_id: user.id,
        phone: formData.phone,
        name: formData.fullName,
        email: formData.email,
        address: formData.address, // Add address
        payment_method: 'COD',
        note: formData.note
      };

      await createOrderAPI(orderData);

    } catch (error) {
      showToast('Đặt hàng không thành công. Vui lòng thử lại sau!', 'error');
      console.error('Error creating order:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <OrderContainer>
      <OrderTitle>Thông tin đặt hàng</OrderTitle>
      <OrderForm onSubmit={handleSubmit}>
        <FormGroup>
          <Label>Họ và tên</Label>
          <Input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label>Email</Label>
          <Input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label>Số điện thoại</Label>
          <Input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label>Địa chỉ giao hàng</Label>
          <Input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label>Ghi chú</Label>
          <TextArea
            name="note"
            value={formData.note}
            onChange={handleInputChange}
          />
        </FormGroup>

        <OrderSummary>
          <h3>Tổng quan đơn hàng</h3>
          {cartItems.map((item) => (
            <SummaryItem key={item._id}>
              <span>{item.product_id.name} x {item.quantity}</span>
              <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.product_id.price * item.quantity)}</span>
            </SummaryItem>
          ))}
          <SummaryItem>
            <span>Tổng cộng</span>
            <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalAmount)}</span>
          </SummaryItem>
        </OrderSummary>

        <ButtonGroup>
          <ActionButton type="button" onClick={() => navigate('/cart/cartDetail')} disabled={isLoading}>
            Quay lại
          </ActionButton>
          <ActionButton type="submit" $primary disabled={isLoading}>
            {isLoading ? 'Đang xử lý...' : 'Xác nhận đặt hàng'}
          </ActionButton>
        </ButtonGroup>
      </OrderForm>
    </OrderContainer>
  );
};

// Add this export statement
export default Order;