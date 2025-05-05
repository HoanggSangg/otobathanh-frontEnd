import React, { useState } from 'react';
import { useToast } from '../../Styles/ToastProvider';
import styled from 'styled-components';
import { googleLoginAPI } from '../../API';
import { useGoogleLogin } from '@react-oauth/google';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  IconButton,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import FacebookIcon from '@mui/icons-material/Facebook';
import GoogleIcon from '@mui/icons-material/Google';
import { useNavigate } from 'react-router-dom';
import { loginAPI } from '../../API';
import ForgotPasswordForm from '../Register/ForgotPassword';

const StyledDialog = styled(Dialog)`
  .MuiDialog-paper {
    width: 400px;
    border-radius: 12px;
    padding: 20px;
  }
`;

const DialogHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const Title = styled(DialogTitle)`
  color: #e31837;
  font-weight: bold !important;
  padding: 0 !important;
`;

const CloseButton = styled(IconButton)`
  color: #666 !important;
`;

const StyledTextField = styled(TextField)`
  margin-bottom: 20px !important;
  
  .MuiOutlinedInput-root {
    border-radius: 8px;
    
    &:hover .MuiOutlinedInput-notchedOutline {
      border-color: #e31837;
    }
    
    &.Mui-focused .MuiOutlinedInput-notchedOutline {
      border-color: #e31837;
    }
  }
  
  .MuiInputLabel-root.Mui-focused {
    color: #e31837;
  }
`;

const LoginButton = styled(Button)`
  background-color: #e31837 !important;
  color: white !important;
  padding: 12px 24px !important;
  border-radius: 8px !important;
  font-weight: bold !important;
  width: 100%;
  margin-top: 20px !important;
  
  &:hover {
    background-color: #c41730 !important;
  }
`;

const ForgotPassword = styled(Typography)`
  text-align: right;
  color: #666;
  font-size: 14px;
  margin-top: 10px;
  cursor: pointer;
  
  &:hover {
    color: #e31837;
  }
`;

const PasswordWrapper = styled.div`
  position: relative;
`;

const VisibilityButton = styled(IconButton)`
  position: absolute !important;
  right: 10px;
  top: 50%;
  transform: translateY(-75%);
  color: #666 !important;
`;

const SocialLoginContainer = styled.div`
  margin-top: 0;
`;

const SocialDivider = styled.div`
  display: flex;
  align-items: center;
  margin: 15px 0;
  color: white;
  
  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: rgba(255, 255, 255, 0.3);
  }
  
  span {
    padding: 0 15px;
    font-size: 14px;
    color: rgba(0, 0, 0, 0.8);
  }
`;

const SocialButtons = styled.div`
  display: flex;
  gap: 15px;
  justify-content: center;
`;

const SocialButton = styled.button<{ $provider: 'facebook' | 'google' }>`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 20px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
  background-color: ${props => props.$provider === 'facebook' ? '#1877F2' : '#999'};
  color: white;
  width: 160px;
  justify-content: center;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    background-color: ${props => props.$provider === 'facebook' ? '#1565C0' : '#616161'};
  }

  .MuiSvgIcon-root {
    font-size: 20px;
  }
`;

const SocialButtonText = styled.span`
  font-size: 14px;
`;

interface LoginFormProps {
  open: boolean;
  onClose: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ open, onClose }) => {
  const navigate = useNavigate();
  const showToast = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await loginAPI(formData.email, formData.password);
      if (response.status === "thành công") {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify({
          id: response.id,
          fullName: response.fullName,
          email: response.email,
          image: response.image,
          roles: response.roles
        }));
        showToast(response.message, 'success');
        onClose();
        window.location.reload();
      }
    } catch (err: any) {
      if (err.response?.status === 401) {
        showToast(err.response.data.message, 'error'); // Invalid credentials or unverified account
      } else if (err.response?.status === 403) {
        showToast(err.response.data.message, 'error'); // Account locked
      } else if (err.response?.status === 500) {
        showToast('Lỗi máy chủ', 'error'); // Server error
      } else {
        showToast('Có lỗi khi đăng nhập!', 'error');
      }
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  const saveUserToLocalStorage = (token: string, user: any) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify({
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      image: user.image,
      roles: user.roles
    }));
  };
  
  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (response) => {
      try {
        const result = await googleLoginAPI(response.access_token);
  
        if (result.token) {
          saveUserToLocalStorage(result.token, result.user);
          showToast('Đăng nhập Google thành công!', 'success');
          onClose();
          window.location.reload();
        }
      } catch (error) {
        console.error('Google login error:', error);
        showToast('Đăng nhập Google thất bại', 'error');
      }
    },
    onError: () => {
      showToast('Đăng nhập Google thất bại', 'error');
    },
    flow: 'implicit'
  });
  
  const handleSocialLogin = async (provider: 'facebook' | 'google') => {
    if (provider === 'facebook') {
      if (!window.FB) {
        showToast('Không thể khởi tạo Facebook SDK', 'error');
        return;
      }
  
      window.FB.login(function (response: any) {
        if (response.authResponse) {
          const accessToken = response.authResponse.accessToken;
  
          fetch('http://localhost:3000/api/accounts/facebook-login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ access_token: accessToken })
          })
            .then(res => res.json())
            .then(data => {
              if (data.token) {
                saveUserToLocalStorage(data.token, data.user);
                showToast(data.message || 'Đăng nhập thành công!', 'success');
                onClose();
                navigate('/');
              } else {
                showToast(data.message || 'Lỗi đăng nhập Facebook', 'error');
              }
            })
            .catch(err => {
              console.error('Facebook login error:', err);
              showToast('Không thể đăng nhập bằng Facebook', 'error');
            });
        } else {
          showToast('Bạn đã hủy đăng nhập Facebook', 'info');
        }
      }, { scope: 'email,public_profile' });
  
    } else if (provider === 'google') {
      try {
        handleGoogleLogin();
      } catch (error) {
        console.error('Google login error:', error);
        showToast('Đăng nhập Google thất bại', 'error');
      }
    }
  };

  const handleForgotPassword = () => {
    setShowForgotPassword(true);
    onClose(); // Close the login dialog
  };

  return (
    <>
      <StyledDialog open={open} onClose={onClose}>
        <DialogHeader>
          <Title>Đăng nhập</Title>
          <CloseButton onClick={onClose}>
            <CloseIcon />
          </CloseButton>
        </DialogHeader>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <StyledTextField
              fullWidth
              label="Email hoặc Tên tài khoản"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <PasswordWrapper>
              <StyledTextField
                fullWidth
                label="Mật khẩu"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                required
              />
              <VisibilityButton onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
              </VisibilityButton>
            </PasswordWrapper>
            <ForgotPassword onClick={handleForgotPassword}>
              Quên mật khẩu?
            </ForgotPassword>
            <LoginButton
              type="submit"
              disabled={loading}
            >
              {loading ? 'Đang xử lý...' : 'Đăng nhập'}
            </LoginButton>
          </form>

          <SocialLoginContainer>
            <SocialDivider>
              <span>Hoặc đăng nhập với</span>
            </SocialDivider>
            <SocialButtons>
              <SocialButton
                $provider="facebook"
                onClick={() => handleSocialLogin('facebook')}
              >
                <FacebookIcon />
                <SocialButtonText>Facebook</SocialButtonText>
              </SocialButton>
              <SocialButton
                $provider="google"
                onClick={() => handleSocialLogin('google')}
              >
                <GoogleIcon />
                <SocialButtonText>Google</SocialButtonText>
              </SocialButton>
            </SocialButtons>
          </SocialLoginContainer>
        </DialogContent>
      </StyledDialog>

      <StyledDialog open={showForgotPassword} onClose={() => setShowForgotPassword(false)}>
        <ForgotPasswordForm onClose={() => setShowForgotPassword(false)} />
      </StyledDialog>
    </>
  );
};

export default LoginForm;