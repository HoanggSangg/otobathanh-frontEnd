import React, { useState, useEffect } from 'react';
import { useToast } from '../../Styles/ToastProvider';
import styled from 'styled-components';
import {
  Button,
  Box,
  Typography,
} from '@mui/material';
import { createBannerAPI, updateBannerAPI } from '../../API';

const FormContainer = styled(Box)`
  background: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

interface CreateBannerProps {
  selectedBanner: any;
  onSuccess: () => void;
}

const CreateBanner: React.FC<CreateBannerProps> = ({ selectedBanner, onSuccess }) => {
  const [image, setImage] = useState<File | null>(null);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const showToast = useToast();

  useEffect(() => {
    if (selectedBanner) {
      setCurrentImage(selectedBanner.image);
    }
  }, [selectedBanner]);

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
        let base64Image = null;
        if (image) {
            base64Image = await convertToBase64(image);
        }

        if (selectedBanner) {
            const response = await updateBannerAPI(selectedBanner._id, base64Image);
            
            if (response) {
                showToast('Cập nhật banner thành công!', 'success');
                onSuccess();
            } else {
                showToast('Không thể cập nhật banner!', 'error');
            }
        } else {
            if (!base64Image) {
                showToast('Vui lòng chọn ảnh banner!', 'error');
                return;
            }
            await createBannerAPI(base64Image);
            showToast('Thêm banner mới thành công!', 'success');
            onSuccess();
        }
    } catch (err: any) {
        if (err.response?.status === 404) {
            showToast('Banner không tìm thấy', 'error');
        } else if (err.response?.status === 400) {
            showToast(err.response.data.message, 'error');
        } else {
            showToast('Có lỗi xảy ra. Vui lòng thử lại!', 'error');
        }
        console.error('Error:', err);
    }
};

  return (
    <FormContainer>
      <Typography variant="h5" sx={{ mb: 4, color: '#e31837', fontWeight: 'bold' }}>
        {selectedBanner ? "Chỉnh sửa banner" : "Thêm banner mới"}
      </Typography>

      <form onSubmit={handleSubmit}>
        <Box sx={{ mb: 3 }}>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={{ marginBottom: '10px' }}
          />
          {(currentImage || image) && (
            <Box sx={{ mt: 2 }}>
              <img
                src={image ? URL.createObjectURL(image) : currentImage || ''}
                alt="Preview"
                style={{ maxWidth: '100%', maxHeight: '300px' }}
              />
            </Box>
          )}
        </Box>

        <Button
          type="submit"
          variant="contained"
          sx={{
            bgcolor: '#e31837',
            '&:hover': { bgcolor: '#c41730' },
            py: 1.5,
            px: 4
          }}
        >
          {selectedBanner ? "Cập nhật" : "Thêm mới"}
        </Button>
      </form>
    </FormContainer>
  );
};

export default CreateBanner;