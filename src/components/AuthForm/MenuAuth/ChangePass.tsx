import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { getAccountByIdAPI, loginAPI } from '../../API';
import { forgotPasswordAPI, resetPasswordAPI } from '../../API';
import { getCurrentUser } from '../../Utils/auth';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../Styles/ToastProvider';

const Container = styled.div`
  max-width: 1000px;
  margin: 40px auto;
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
  display: flex;
  flex-direction: column;
  gap: 25px;
  background: white;
  padding: 40px;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
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
  border: 2px solid #ddd;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background-color: ${props => props.disabled ? '#f8f9fa' : 'white'};

  &:focus {
    outline: none;
    border-color: #e31837;
    box-shadow: 0 0 0 3px rgba(227, 24, 55, 0.1);
  }

  &::placeholder {
    color: #adb5bd;
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
  margin-top: 10px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(227, 24, 55, 0.2);
  }

  &:active {
    transform: translateY(1px);
  }

  &:disabled {
    background: linear-gradient(135deg, #ced4da, #adb5bd);
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const StepIndicator = styled.div`
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-bottom: 30px;
`;

const Step = styled.div<{ active: boolean; completed: boolean }>`
  width: 35px;
  height: 35px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  background: ${props => 
    props.completed 
      ? 'linear-gradient(135deg, #e31837, #c41730)'
      : props.active 
        ? '#fff' 
        : '#f8f9fa'};
  color: ${props => 
    props.completed 
      ? '#fff'
      : props.active 
        ? '#e31837' 
        : '#adb5bd'};
  border: 2px solid ${props => 
    props.completed 
      ? '#e31837'
      : props.active 
        ? '#e31837' 
        : '#dee2e6'};
  transition: all 0.3s ease;
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
      <StepIndicator>
        <Step active={step === 1} completed={step > 1}>1</Step>
        <Step active={step === 2} completed={step > 2}>2</Step>
        <Step active={step === 3} completed={step > 3}>3</Step>
      </StepIndicator>
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