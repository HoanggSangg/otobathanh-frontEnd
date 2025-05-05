import React, { useState } from 'react';
import styled from 'styled-components';
import {
  Dialog,
  DialogContent,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import FacebookIcon from '@mui/icons-material/Facebook';
import GoogleIcon from '@mui/icons-material/Google';
import { useNavigate } from 'react-router-dom';
import { registerAPI } from '../../API';
import VerifyAccountForm from './VerifyAccount';
import ForgotPasswordForm from './ForgotPassword';
import { useToast } from '../../Styles/ToastProvider';
import { useGoogleLogin } from '@react-oauth/google';
import { googleLoginAPI } from '../../API';

const StyledDialog = styled(Dialog)`
  .MuiDialog-paper {
    width: 400px;
    background: white;
    border-radius: 12px;
    padding: 24px;
  }
`;

const DialogHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const Title = styled.h1`
  color: #e31837;
  font-size: 24px;
  margin: 0;
`;

const CloseButton = styled(IconButton)`
  color: #666 !important;
  padding: 8px !important;
`;

const InputField = styled.div`
  margin-bottom: 16px;
  position: relative;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  outline: none;
  box-sizing: border-box;
  
  &:focus {
    border-color: #e31837;
  }
  
  &::placeholder {
    color: #666;
  }
`;

const VisibilityToggle = styled(IconButton)`
  position: absolute !important;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  color: #666 !important;
`;

const RegisterButton = styled.button<{ $loading?: boolean }>`
  width: 100%;
  padding: 12px;
  background: #e31837;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: ${props => props.$loading ? 'not-allowed' : 'pointer'};
  margin: 24px 0;
  opacity: ${props => props.$loading ? 0.7 : 1};
  
  &:hover {
    background: ${props => props.$loading ? '#e31837' : '#c41730'};
  }
`;

const SocialSection = styled.div`
  text-align: center;
`;

const SocialText = styled.div`
  color: #666;
  font-size: 14px;
  margin-bottom: 16px;
`;

const SocialButtons = styled.div`
  display: flex;
  gap: 16px;
  justify-content: center;
`;

const SocialButton = styled.button<{ $provider: 'facebook' | 'google' }>`
  flex: 1;
  padding: 8px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: white;
  background: ${props => props.$provider === 'facebook' ? '#1877F2' : '#757575'};

  &:hover {
    background: ${props => props.$provider === 'facebook' ? '#1565C0' : '#616161'};
  }
`;

interface RegisterFormProps {
  open: boolean;
  onClose: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ open, onClose }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showVerifyForm, setShowVerifyForm] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    image: ''
  });
  const [loading, setLoading] = useState(false);
  const showToast = useToast();

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

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      showToast('Mật khẩu xác nhận không khớp!', 'error');
      setLoading(false);
      return;
    }

    try {
      await registerAPI(
        formData.fullName,
        formData.email,
        formData.password,
        formData.image
      );
      // Close registration form
      onClose();

      // Show verification form
      setShowVerifyForm(true);
    } catch (error) {
      showToast('Có lỗi xảy ra khi đăng ký!', 'error');
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

  return (
    <>
      <StyledDialog open={open} onClose={onClose}>
        <DialogHeader>
          <Title>Đăng ký</Title>
          <CloseButton onClick={onClose}>
            <CloseIcon />
          </CloseButton>
        </DialogHeader>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <InputField>
              <Input
                type="text"
                name="fullName"
                placeholder="Họ và tên *"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
            </InputField>

            <InputField>
              <Input
                type="email"
                name="email"
                placeholder="Email *"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </InputField>

            <InputField>
              <Input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Mật khẩu *"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <VisibilityToggle onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
              </VisibilityToggle>
            </InputField>

            <InputField>
              <Input
                type={showPassword ? 'text' : 'password'}
                name="confirmPassword"
                placeholder="Xác nhận mật khẩu *"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </InputField>

            <RegisterButton type="submit" $loading={loading}>
              {loading ? 'Đang xử lý...' : 'Đăng ký'}
            </RegisterButton>
          </form>
          <div style={{ textAlign: 'center', marginBottom: '16px' }}>
            <button
              onClick={() => {
                onClose();
                setShowForgotPassword(true);
              }}
              style={{
                background: 'none',
                border: 'none',
                color: '#e31837',
                textDecoration: 'underline',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Quên mật khẩu?
            </button>
          </div>
          <SocialSection>
            <SocialText>Hoặc đăng ký với</SocialText>
            <SocialButtons>
              <SocialButton
                $provider="facebook"
                onClick={() => handleSocialLogin('facebook')}
              >
                <FacebookIcon />
                <span>Facebook</span>
              </SocialButton>
              <SocialButton
                $provider="google"
                onClick={() => handleSocialLogin('google')}
              >
                <GoogleIcon />
                <span>Google</span>
              </SocialButton>
            </SocialButtons>
          </SocialSection>
        </DialogContent>
      </StyledDialog>

      {showVerifyForm && (
        <VerifyAccountForm
          email={formData.email}
          open={showVerifyForm}
          onClose={() => setShowVerifyForm(false)}
        />
      )}

      {showForgotPassword && (
        <StyledDialog open={showForgotPassword} onClose={() => setShowForgotPassword(false)}>
          <ForgotPasswordForm />
        </StyledDialog>
      )}
    </>
  );
};

export default RegisterForm; 