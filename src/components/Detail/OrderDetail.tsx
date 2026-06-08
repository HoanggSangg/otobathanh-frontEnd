import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
import { getOrderDetailsAPI } from '../API';

const Container = styled.div`
  max-width: 1200px;
  margin: 120px auto 40px;
  padding: 20px;
`;

const Title = styled.h2`
  color: #1e2124;
  margin-bottom: 30px;
  text-align: center;
`;

const OrderInfo = styled.div`
  background: white;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid #eee;
  
  &:last-child {
    border-bottom: none;
  }
`;

const Label = styled.span`
  font-weight: 500;
  color: #666;
`;

const Value = styled.span`
  color: #1e2124;
`;

const Button = styled.button`
  background-color: #666;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 20px;

  &:hover {
    background-color: #555;
  }
`;

interface OrderDetailType {
  _id: string;
  order_id: string;
  product_id: {
    _id: string;
    name: string;
    price: number;
  };
  quantity: number;
  price: number;
  createdAt: string;
}

const OrderDetail = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [orderDetails, setOrderDetails] = useState<OrderDetailType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        const response = await getOrderDetailsAPI(orderId);
        setOrderDetails(response);
      } catch (err) {
        console.error('Error fetching order details:', err);
        setError('Không thể tải thông tin chi tiết đơn hàng');
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId]);

  if (loading) return <Container>Đang tải...</Container>;
  if (error) return <Container>{error}</Container>;
  if (!orderDetails.length) return <Container>Không tìm thấy chi tiết đơn hàng</Container>;

  const totalAmount = orderDetails.reduce((sum, detail) => 
    sum + (detail.price * detail.quantity), 0
  );

  return (
    <Container>
      <Title>Chi Tiết Đơn Hàng #{orderId}</Title>
      <OrderInfo>
        {orderDetails.map((detail) => (
          <InfoRow key={detail._id}>
            <Label>{detail.product_id.name}</Label>
            <Value>
              {detail.quantity} x {new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND'
              }).format(detail.price)} = {new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND'
              }).format(detail.price * detail.quantity)}
            </Value>
          </InfoRow>
        ))}
        <InfoRow>
          <Label>Tổng tiền:</Label>
          <Value>
            {new Intl.NumberFormat('vi-VN', {
              style: 'currency',
              currency: 'VND'
            }).format(totalAmount)}
          </Value>
        </InfoRow>
        <InfoRow>
          <Label>Ngày đặt:</Label>
          <Value>
            {new Date(orderDetails[0].createdAt).toLocaleDateString('vi-VN')}
          </Value>
        </InfoRow>
      </OrderInfo>

      <Button onClick={() => navigate('/account/historyOrder')}>
        Quay lại danh sách đơn hàng
      </Button>
    </Container>
  );
};

export default OrderDetail;