import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { forgotPasswordAPI, resetPasswordAPI } from '../../API';
import { DialogContent, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useToast } from '../../Styles/ToastProvider';

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

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
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

const SubmitButton = styled.button<{ $loading?: boolean }>`
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

const VisibilityToggle = styled(IconButton)`
  position: absolute !important;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  color: #666 !important;
`;

interface ForgotPasswordFormProps {
    onClose?: () => void;
}

const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({ onClose }) => {
    const [email, setEmail] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const showToast = useToast();
    const [step, setStep] = useState<'email' | 'reset'>('email');

    const handleRequestCode = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await forgotPasswordAPI(email);
            
            if (response.status === "thành công") {
                showToast(response.message, 'success');
                setStep('reset');
            } else {
                showToast(response.message, 'error');
            }
        } catch (err: any) {
            if (err.response?.status === 404) {
                showToast(err.response.data.message, 'error');
            } else {
                showToast(err.response.data.message, 'error');
            }
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            showToast('Mật khẩu xác nhận không khớp!', 'error');
            return;
        }
        setIsLoading(true);
        try {
            const response = await resetPasswordAPI(email, verificationCode, newPassword);
            
            if (response.status === "thành công") {
                showToast(response.message, 'success');
                onClose && onClose(); // Close the dialog after successful password reset
            } else {
                showToast(response.message, 'error');
            }
        } catch (err: any) {
            if (err.response?.status === 404) {
                showToast(err.response.data.message, 'error'); // Account not found
            } else if (err.response?.status === 400) {
                showToast(err.response.data.message, 'error'); // Invalid verification code
            } else {
                showToast(err.response.data.message, 'error'); // Server error
            }
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <DialogHeader>
                <Title>Quên mật khẩu</Title>
                {onClose && (
                    <CloseButton onClick={onClose}>
                        <CloseIcon />
                    </CloseButton>
                )}
            </DialogHeader>
            <DialogContent>
                {step === 'email' ? (
                    <Form onSubmit={handleRequestCode}>
                        <InputField>
                            <Input
                                type="email"
                                placeholder="Nhập email của bạn *"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </InputField>

                        <SubmitButton type="submit" $loading={isLoading}>
                            {isLoading ? 'Đang xử lý...' : 'Gửi mã xác nhận'}
                        </SubmitButton>
                    </Form>
                ) : (
                    <Form onSubmit={handleResetPassword}>
                        <InputField>
                            <Input
                                type="text"
                                placeholder="Nhập mã xác nhận *"
                                value={verificationCode}
                                onChange={(e) => setVerificationCode(e.target.value)}
                                required
                            />
                        </InputField>

                        <InputField>
                            <Input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Mật khẩu mới *"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />
                            <VisibilityToggle onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                            </VisibilityToggle>
                        </InputField>

                        <InputField>
                            <Input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Xác nhận mật khẩu mới *"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </InputField>

                        <SubmitButton type="submit" $loading={isLoading}>
                            {isLoading ? 'Đang xử lý...' : 'Đặt lại mật khẩu'}
                        </SubmitButton>
                    </Form>
                )}
            </DialogContent>
        </>
    );
};

export default ForgotPasswordForm;