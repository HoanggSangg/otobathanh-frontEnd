import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { getAccountByIdAPI } from '../../API';
import { getCurrentUser } from '../../Utils/auth';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../Styles/ToastProvider';

const Container = styled.div`
  max-width: 1200px;
  margin: 20px auto;
  padding: 20px;
  background: linear-gradient(145deg, #ffffff, #f5f5f5);
  border-radius: 20px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  color: #1e2124;
  margin-bottom: 40px;
  text-align: center;
  font-size: 2.2rem;
  font-weight: 700;
  position: relative;
  
  &:after {
    content: '';
    position: absolute;
    bottom: -15px;
    left: 50%;
    transform: translateX(-50%);
    width: 120px;
    height: 4px;
    background: linear-gradient(90deg, #e31837, #ff4d6d);
    border-radius: 2px;
  }
`;

const Form = styled.form`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 25px;
  padding: 40px;
  border-radius: 16px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  position: relative;
`;

const Label = styled.label`
  font-weight: 600;
  color: #1e2124;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Input = styled.input`
  padding: 14px 18px;
  border: 2px solid ${props => props.disabled ? '#eee' : '#ddd'};
  border-radius: 12px;
  font-size: 1rem;
  background-color: ${props => props.disabled ? '#f8f9fa' : 'white'};
  color: #333;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #e31837;
    box-shadow: 0 0 0 3px rgba(227, 24, 55, 0.1);
  }
`;

const AvatarContainer = styled(FormGroup)`
  grid-column: 1 / -1;
  align-items: center;
  margin-bottom: 20px;
  
  img {
    width: 180px;
    height: 180px;
    border-radius: 50%;
    object-fit: cover;
    border: 5px solid #fff;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    
    &:hover {
      transform: scale(1.05);
      box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
    }
  }
`;

const Button = styled.button`
  background: linear-gradient(135deg, #e31837, #c41730);
  color: white;
  padding: 16px;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  grid-column: 1 / -1;
  width: 100%;
  max-width: 320px;
  margin: 20px auto 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(227, 24, 55, 0.2);
  }

  &:active {
    transform: translateY(1px);
  }
`;

const Profile = () => {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const [accountData, setAccountData] = useState(() => ({
    fullName: user?.fullName || '',
    email: user?.email || '',
    roles: user?.roles?.[0] || { _id: '', name: '' },
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
  }, []);

  const handleUpdateClick = () => {
    navigate('/account/update');
  };

  return (
    <Container>
      <Title>Thông Tin Tài Khoản</Title>
      <Form>
        {accountData.image && (
          <AvatarContainer>
            <Label>Ảnh đại diện</Label>
            <img 
              src={accountData.image} 
              alt="Avatar" 
            />
          </AvatarContainer>
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
            value={accountData.roles?.name || 'Không có vai trò'}
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

        <Button type="button" onClick={handleUpdateClick}>
          Cập nhật thông tin
        </Button>
      </Form>
    </Container>
  );
};

export default Profile;