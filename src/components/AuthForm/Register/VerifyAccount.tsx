import React, { useState } from 'react';
import styled from 'styled-components';
import {
  Dialog,
  DialogContent,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import { verifyAccountAPI } from '../../API';
import { useToast } from '../../Styles/ToastProvider';

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

const VerifyButton = styled.button<{ $loading?: boolean }>`
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

const ErrorMessage = styled.div`
  color: #e31837;
  font-size: 14px;
  margin-top: 4px;
  text-align: left;
`;

const Message = styled.p`
  color: #666;
  font-size: 14px;
  text-align: center;
  margin: 16px 0;
`;

interface VerifyAccountFormProps {
  open: boolean;
  onClose: () => void;
  email: string;
}

const VerificationInputContainer = styled.div`
  display: flex;
  gap: 8px;
  justify-content: center;
  margin: 20px 0;
`;

const DigitInput = styled.input`
  width: 45px;
  height: 45px;
  border: 1px solid #ddd;
  border-radius: 8px;
  text-align: center;
  font-size: 20px;
  font-weight: 500;
  outline: none;
  
  &:focus {
    border-color: #e31837;
  }

  @media (max-width: 480px) {
    width: 40px;
    height: 40px;
  }
`;

const VerifyAccountForm: React.FC<VerifyAccountFormProps> = ({ open, onClose, email }) => {
  const navigate = useNavigate();
  const [verificationDigits, setVerificationDigits] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const showToast = useToast();
  const inputRefs = Array(6).fill(0).map(() => React.createRef<HTMLInputElement>());

  const handleDigitChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return; // Only allow digits

    const newDigits = [...verificationDigits];
    newDigits[index] = value;
    setVerificationDigits(newDigits);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !verificationDigits[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    const digits = pastedData.split('').filter(char => /^\d$/.test(char));
    
    const newDigits = [...verificationDigits];
    digits.forEach((digit, index) => {
      if (index < 6) newDigits[index] = digit;
    });
    setVerificationDigits(newDigits);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const verificationCode = verificationDigits.join('');
    
    if (verificationCode.length !== 6) {
      showToast('Vui lòng nhập đủ 6 số!', 'error');
      return;
    }

    setLoading(true);

    try {
      const response = await verifyAccountAPI(email, verificationCode);

      if (response.status === "thành công") {
        showToast(response.message, 'success');
        onClose();
        navigate('/');
      }
    } catch (error: any) {
      if (error.response?.data?.message) {
        showToast(error.response.data.message, 'error');
      } else {
        showToast('Có lỗi xảy ra khi xác thực tài khoản!', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <StyledDialog open={open} onClose={onClose}>
      <DialogContent>
        <DialogHeader>
          <Title>Xác Thực Tài Khoản</Title>
          <CloseButton onClick={onClose}>
            <CloseIcon />
          </CloseButton>
        </DialogHeader>

        <Message>
          Vui lòng nhập mã xác thực 6 số đã được gửi đến email của bạn
        </Message>

        <form onSubmit={handleSubmit}>
          <VerificationInputContainer>
            {verificationDigits.map((digit, index) => (
              <DigitInput
                key={index}
                ref={inputRefs[index]}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleDigitChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                autoFocus={index === 0}
              />
            ))}
          </VerificationInputContainer>

          <VerifyButton type="submit" $loading={loading}>
            {loading ? 'ĐANG XỬ LÝ...' : 'XÁC THỰC'}
          </VerifyButton>
        </form>
      </DialogContent>
    </StyledDialog>
  );
};

export default VerifyAccountForm;