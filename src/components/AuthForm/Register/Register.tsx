import React, { useState } from 'react';
import styled from 'styled-components';
import {
  Dialog,
  DialogContent,
  IconButton,
  DialogTitle,
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
    width: 90%;
    max-width: 450px;
    border-radius: 16px;
    padding: 0;
    background: linear-gradient(to bottom, #ffffff, #f8f8f8);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    overflow: visible;
  }
`;

const DialogHeader = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 4px 24px 0;
`;

const Title = styled(DialogTitle)`
  color: #e31837;
  font-weight: bold !important;
  padding: 10px !important;
  font-size: 24px !important;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const CloseButton = styled(IconButton)`
  color: #666 !important;
  padding: 12px !important;
`;

const InputField = styled.div`
  margin-bottom: 8px;
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

const StyledDialogContent = styled(DialogContent)`
  padding: 0 24px 24px !important;
`;

const VisibilityToggle = styled(IconButton)`
  position: absolute !important;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  color: #666 !important;
`;

const Logo = styled.img`
  width: min(150px, 40vw);
  height: auto;
`;

const LogoContainer = styled.div`
  text-align: center;
  margin-bottom: 8px;
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
  margin: 12px 0;
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
  margin-bottom: 8px;
`;

const SocialButtons = styled.div`
  display: flex;
  gap: 15px;
  justify-content: center;
  flex-wrap: wrap;
`;

const SocialButton = styled.button<{ $provider: 'facebook' | 'google' }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 24px;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
  background-color: ${props => props.$provider === 'facebook' ? '#1877F2' : '#DB4437'};
  color: white;
  width: min(180px, 45%);
  justify-content: center;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);

  @media (max-width: 400px) {
    width: 100%;
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
          <CloseButton onClick={onClose}>
            <CloseIcon />
          </CloseButton>
        </DialogHeader>
        <StyledDialogContent>
          <LogoContainer>
            <Logo
              src="https://res.cloudinary.com/drbjrsm0s/image/upload/v1745463450/logo_ulbaie.png"
              alt="Bá Thành"
              onClick={() => navigate('/')}
              style={{ cursor: 'pointer' }}
            />
          </LogoContainer>
          <Title>Đăng ký</Title>
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
        </StyledDialogContent>
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