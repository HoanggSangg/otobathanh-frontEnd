import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { getOrdersByAccountAPI, deleteOrderAPI } from '../../API';
import { getCurrentUser } from '../../Utils/auth';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../Styles/ToastProvider';

const Container = styled.div`
  max-width: 1200px;
  margin: 30px auto 40px;
  padding: 20px;
`;

const Title = styled.h2`
  color: #1e2124;
  margin-bottom: 30px;
  text-align: center;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const Th = styled.th`
  background-color: #1e2124;
  color: white;
  padding: 12px;
  text-align: left;
`;

const Td = styled.td`
  padding: 12px;
  border-bottom: 1px solid #ddd;
`;

const Button = styled.button<{ $variant?: string }>`
  background-color: ${props =>
    props.$variant === 'delete' ? '#e31837' :
      props.$variant === 'view' ? '#007bff' :
        props.$variant === 'shop' ? '#28a745' : '#e31837'
  };
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin: 0 5px;

  &:hover {
    opacity: 0.9;
  }
`;

const ActionContainer = styled.div`
  display: flex;
  gap: 10px;
`;

const EmptyMessage = styled.div`
  text-align: center;
  padding: 40px;
  color: #666;
`;

const HistoryOrder = () => {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const showToast = useToast();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        if (user?.id) { // Change from user.id to user._id
          setLoading(true);
          const response = await getOrdersByAccountAPI(user.id);
          setOrders(response || []); // Remove .orders since the API returns the array directly
        }
      } catch (err) {
        console.error('Error fetching orders:', err);
        showToast('Không thể tải lịch sử đơn hàng!', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleDelete = async (orderId: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa đơn hàng này?')) {
        try {
            const response = await deleteOrderAPI(orderId);
            if (response.data.message) {
                setOrders(orders.filter((order: any) => order._id !== orderId));
                showToast(response.data.message, 'success');
            }
        } catch (err: any) {
            if (err.response?.status === 404) {
                showToast(err.response.data.message, 'error'); // Order not found
            } else if (err.response?.status === 500) {
                showToast(err.response.data.message, 'error'); // Server error
            } else {
                showToast('Không thể xóa đơn hàng!', 'error');
            }
            console.error('Error deleting order:', err);
        }
    }
};

  if (loading) {
    return <Container>Đang tải...</Container>;
  }

  return (
    <Container>
      <Title>Lịch Sử Đơn Hàng</Title>

      {orders.length > 0 ? (
        <Table>
          <thead>
            <tr>
              <Th>Mã đơn hàng</Th>
              <Th>Ngày đặt</Th>
              <Th>Tổng tiền</Th>
              <Th>Trạng thái</Th>
              <Th>Thao tác</Th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order: any) => (
              <tr key={order._id}>
                <Td>{order._id}</Td>
                <Td>
                  {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                </Td>
                <Td>
                  {new Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND'
                  }).format(order.total)}
                </Td>
                <Td>{order.status}</Td>
                <Td>
                  <ActionContainer>
                    <Button
                      $variant="view"
                      onClick={() => navigate(`/order/orderDetail/${order._id}`)}
                    >
                      Xem chi tiết
                    </Button>
                    <Button
                      $variant="delete"
                      onClick={() => handleDelete(order._id)}
                    >
                      Xóa
                    </Button>
                  </ActionContainer>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <EmptyMessage>Chưa có đơn hàng nào</EmptyMessage>
      )}
      
    </Container>
  );
};

export default HistoryOrder;