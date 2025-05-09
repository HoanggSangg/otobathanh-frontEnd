import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { forgotPasswordAPI, resetPasswordAPI } from '../../API';
import { DialogContent, IconButton, DialogTitle } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useToast } from '../../Styles/ToastProvider';

const DialogHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled(DialogTitle)`
  color: #e31837;
  font-weight: bold !important;
  padding: 20px !important;
  font-size: 24px !important;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const CloseButton = styled(IconButton)`
  color: #666 !important;
  padding: 12px !important;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const InputField = styled.div`
  margin-bottom: 4px;
  position: relative;
`;

const Input = styled.input`
  width: 100%;
  padding: 14px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  outline: none;
  box-sizing: border-box;
  transition: border-color 0.3s ease;

  &:focus {
    border-color: #e31837;
    box-shadow: 0 0 4px rgba(227, 24, 55, 0.5); /* Thêm hiệu ứng khi focus */
  }

  &::placeholder {
    color: #999; /* Làm placeholder dễ nhìn hơn */
  }
`;

const SubmitButton = styled.button<{ $loading?: boolean }>`
  width: 100%;
  padding: 14px;
  background: #e31837;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600; /* Làm chữ đậm hơn */
  cursor: ${props => props.$loading ? 'not-allowed' : 'pointer'};
  margin: 24px 0;
  opacity: ${props => props.$loading ? 0.7 : 1};
  transition: background 0.3s ease;

  &:hover {
    background: ${props => props.$loading ? '#e31837' : '#c41730'};
    box-shadow: ${props => props.$loading ? 'none' : '0 4px 8px rgba(0, 0, 0, 0.2)'};
  }
`;

const VisibilityToggle = styled(IconButton)`
  position: absolute !important;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  color: #666 !important;
`;

const ErrorMessage = styled.div`
  color: #e31837;
  font-size: 14px;
  margin-top: 8px;
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
    const [verificationCodeError, setVerificationCodeError] = useState('');
    const [newPasswordError, setNewPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');

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
        let hasError = false;

        if (!verificationCode) {
            setVerificationCodeError('Mã xác nhận là bắt buộc!');
            hasError = true;
        } else {
            setVerificationCodeError('');
        }

        if (!newPassword) {
            setNewPasswordError('Mật khẩu mới là bắt buộc!');
            hasError = true;
        } else {
            setNewPasswordError('');
        }

        if (newPassword !== confirmPassword) {
            setConfirmPasswordError('Mật khẩu xác nhận không khớp!');
            hasError = true;
        } else {
            setConfirmPasswordError('');
        }

        if (hasError) return;

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
                            {verificationCodeError && <ErrorMessage>{verificationCodeError}</ErrorMessage>}
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
                            {newPasswordError && <ErrorMessage>{newPasswordError}</ErrorMessage>}
                        </InputField>

                        <InputField>
                            <Input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Xác nhận mật khẩu mới *"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                            {confirmPasswordError && <ErrorMessage>{confirmPasswordError}</ErrorMessage>}
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