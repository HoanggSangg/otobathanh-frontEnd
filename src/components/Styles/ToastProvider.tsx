import React, { createContext, useCallback, useState, useContext } from 'react';
import { Alert, Snackbar } from '@mui/material';
import styled, { keyframes } from 'styled-components';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastContextProps {
  showToast: (message: string, severity?: ToastType) => void;
}

const slideIn = keyframes`
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const ToastContext = createContext<ToastContextProps | undefined>(undefined);

const StyledAlert = styled(Alert)`
  border-radius: 10px !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
  font-size: 15px !important;
  padding: 8px 20px !important;
  border-left: 3px solid transparent !important;
  animation: ${slideIn} 0.3s ease-out !important;
  
  &.MuiAlert-standardSuccess {
    background-color: #e8f5e9 !important;
    color: #1b5e20 !important;
    border-left-color: #2e7d32 !important;
  }
  
  &.MuiAlert-standardError {
    background-color: #ffebee !important;
    color: #c62828 !important;
    border-left-color: #d32f2f !important;
  }
  
  &.MuiAlert-standardWarning {
    background-color: #fff3e0 !important;
    color: #e65100 !important;
    border-left-color: #ed6c02 !important;
  }
  
  &.MuiAlert-standardInfo {
    background-color: #e3f2fd !important;
    color: #0d47a1 !important;
    border-left-color: #0288d1 !important;
  }

  .MuiAlert-icon {
    font-size: 20px !important;
    margin-right: 12px !important;
  }

  .MuiAlert-action {
    padding-left: 16px !important;
  }
`;

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toast, setToast] = useState<{ message: string; severity: ToastType; open: boolean }>({
    message: '',
    severity: 'success',
    open: false,
  });

  const showToast = useCallback((message: string, severity: ToastType = 'info') => {
    setToast({ message, severity, open: true });
  }, []);

  const handleClose = () => {
    setToast((prev) => ({ ...prev, open: false }));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        style={{ top: '110px' }}
      >
        <StyledAlert
          onClose={handleClose}
          severity={toast.severity}
          elevation={6}
          variant="standard"
        >
          {toast.message}
        </StyledAlert>
      </Snackbar>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context.showToast;
};