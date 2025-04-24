import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { getAccountByIdAPI } from '../../API';
import { getCurrentUser } from '../../Utils/auth';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../Styles/ToastProvider';

const Container = styled.div`
  max-width: 800px;
  margin: 120px auto 40px;
  padding: 20px;
`;

const Title = styled.h2`
  color: #1e2124;
  margin-bottom: 30px;
  text-align: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-weight: 500;
  color: #1e2124;
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;

  &:focus {
    outline: none;
    border-color: #e31837;
  }
`;

const Button = styled.button`
  background-color: #e31837;
  color: white;
  padding: 12px;
  border: none;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #c41730;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.p`
  color: #e31837;
  margin-top: 5px;
  font-size: 14px;
`;

const Profile = () => {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const [accountData, setAccountData] = useState(() => ({
    fullName: user?.fullName || '',
    email: user?.email || '',
    roles: user?.roles?.[0] || { _id: '', name: '' }, // Initialize roles as object
    status: user?.status || false,
    image: user?.image || '',
    createdAt: '',
  }));
  const [isLoading, setIsLoading] = useState(true);
  const showToast = useToast();

  useEffect(() => {
    const fetchAccountData = async () => {
      try {
        if (user?.id) {
          const response = await getAccountByIdAPI(user.id);

          if (response.status === "thành công" && response.account) {
            const acc = response.account;
            setAccountData({
              fullName: acc.fullName || user?.fullName || '',
              email: acc.email || user?.email || '',
              roles: acc.roles?.[0] || user?.roles?.[0] || { _id: '', name: '' },
              status: acc.status ?? user?.status ?? false,
              image: acc.image || user?.image || '',
              createdAt: acc.createdAt
                ? new Date(acc.createdAt).toLocaleDateString('vi-VN')
                : '',
            });
          }
        }
      } catch (err: any) {
        if (err.response) {
          switch (err.response.status) {
            case 404:
              showToast('Tài khoản không tồn tại.', 'error');
              break;
            case 500:
              showToast('Đã xảy ra lỗi khi lấy thông tin tài khoản.', 'error');
              break;
            default:
              if (err.response.data.status === "thất bại") {
                showToast(err.response.data.message, 'error');
              } else {
                showToast('Không thể tải thông tin tài khoản!', 'error');
              }
          }
        } else {
          showToast('Lỗi kết nối đến máy chủ', 'error');
        }
        console.error('Error fetching account data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAccountData();
  }, [user]);

  const handleUpdateClick = () => {
    navigate('/account/update');
  };

  if (isLoading) {
    return (
      <Container>
        <Title>Đang tải thông tin...</Title>
      </Container>
    );
  }

  return (
    <Container>
      <Title>Thông Tin Tài Khoản</Title>
      <Form>
        {accountData.image && (
          <FormGroup>
            <Label>Ảnh đại diện</Label>
            <img 
              src={accountData.image} 
              alt="Avatar" 
              style={{ 
                width: '100px', 
                height: '100px', 
                borderRadius: '50%',
                objectFit: 'cover'
              }} 
            />
          </FormGroup>
        )}

        <FormGroup>
          <Label>Họ và tên</Label>
          <Input
            type="text"
            value={accountData.fullName}
            disabled
          />
        </FormGroup>

        <FormGroup>
          <Label>Email</Label>
          <Input
            type="email"
            value={accountData.email}
            disabled
          />
        </FormGroup>

        <FormGroup>
          <Label>Vai trò</Label>
          <Input
            type="text"
            value={accountData.roles?.name}
            disabled
          />
        </FormGroup>

        <FormGroup>
          <Label>Trạng thái</Label>
          <Input
            type="text"
            value={accountData.status ? 'Hoạt động' : 'Không hoạt động'}
            disabled
          />
        </FormGroup>

        <FormGroup>
          <Label>Ngày tạo tài khoản</Label>
          <Input
            type="text"
            value={accountData.createdAt}
            disabled
          />
        </FormGroup>

        <Button type="button" onClick={handleUpdateClick}>
          Cập nhật thông tin
        </Button>
      </Form>
    </Container>
  );
};

export default Profile;