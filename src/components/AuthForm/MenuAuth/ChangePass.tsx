import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { getAccountByIdAPI, loginAPI } from '../../API';
import { forgotPasswordAPI, resetPasswordAPI } from '../../API';
import { getCurrentUser } from '../../Utils/auth';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../Styles/ToastProvider';

const Container = styled.div`
  max-width: 600px;
  margin: 30px auto 40px;
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

const ChangePass = () => {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const [userData, setUserData] = useState<any>(null);
  const [formData, setFormData] = useState({
    oldPassword: '',
    verificationCode: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [step, setStep] = useState(1);
  const showToast = useToast();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (user?.id) {
          const response = await getAccountByIdAPI(user.id);
          if (response && response.account) {
            setUserData(response.account);
            if (response.account.type === 'google' || response.account.type === 'facebook') {
              showToast(`Tài khoản ${response.account.type} không thể đổi mật khẩu trực tiếp!`, 'warning');
              navigate('/');
            }
          }
        }
      } catch (err) {
        showToast('Không thể tải thông tin người dùng!', 'error');
      }
    };

    fetchUserData();
  }, []);

  const handleVerifyOldPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userData?.email || !formData.oldPassword) {
      showToast('Vui lòng nhập mật khẩu hiện tại!', 'error');
      return;
    }

    try {
      // Verify old password
      await loginAPI(userData.email, formData.oldPassword);

      // Send verification code
      await forgotPasswordAPI(userData.email);

      setStep(2);
      showToast('Mã xác nhận đã được gửi đến email của bạn!', 'success');
    } catch (err) {
      showToast('Mật khẩu hiện tại không chính xác!', 'error');
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.verificationCode) {
      showToast('Vui lòng nhập mã xác nhận!', 'error');
      return;
    }

    setStep(3);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      showToast('Mật khẩu mới không khớp!', 'error');
      return;
    }

    try {
      await resetPasswordAPI(
        userData.email,
        formData.verificationCode,
        formData.newPassword
      );

      showToast('Đổi mật khẩu thành công!', 'success');
      setTimeout(() => {
        navigate('/account/profile');
      }, 2000);
    } catch (err) {
      showToast('Không thể đổi mật khẩu!', 'error');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const renderForm = () => {
    switch (step) {
      case 1:
        return (
          <>
            <FormGroup>
              <Label>Email</Label>
              <Input
                type="email"
                value={userData?.email || ''}
                disabled
              />
            </FormGroup>
            <FormGroup>
              <Label>Mật khẩu hiện tại</Label>
              <Input
                type="password"
                name="oldPassword"
                value={formData.oldPassword}
                onChange={handleInputChange}
                placeholder="Nhập mật khẩu hiện tại"
              />
            </FormGroup>
          </>
        );
      case 2:
        return (
          <FormGroup>
            <Label>Mã xác nhận</Label>
            <Input
              type="text"
              name="verificationCode"
              value={formData.verificationCode}
              onChange={handleInputChange}
              placeholder="Nhập mã xác nhận từ email"
            />
          </FormGroup>
        );
      case 3:
        return (
          <>
            <FormGroup>
              <Label>Mật khẩu mới</Label>
              <Input
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleInputChange}
                placeholder="Nhập mật khẩu mới"
              />
            </FormGroup>
            <FormGroup>
              <Label>Xác nhận mật khẩu mới</Label>
              <Input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Nhập lại mật khẩu mới"
              />
            </FormGroup>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Container>
      <Title>Đổi Mật Khẩu</Title>
      <Form onSubmit={
        step === 1 ? handleVerifyOldPassword :
          step === 2 ? handleVerifyCode :
            handleChangePassword
      }>
        {renderForm()}
        <Button type="submit">
          {step === 1 ? 'Xác thực' :
            step === 2 ? 'Tiếp tục' :
              'Đổi mật khẩu'}
        </Button>
      </Form>
    </Container>
  );
};

export default ChangePass;