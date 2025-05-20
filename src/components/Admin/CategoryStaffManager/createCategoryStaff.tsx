import React, { useState, useEffect } from 'react';
import { useToast } from '../../Styles/ToastProvider';
import styled from 'styled-components';
import {
  Button,
  Box,
  Typography,
  TextField,
} from '@mui/material';
import { createCategoryStaffAPI, updateCategoryStaffAPI } from '../../API';

const FormContainer = styled(Box)`
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

interface Category {
  _id: string;
  name: string;
}

interface CreateCategoryProps {
  selectedCategory: Category | null;
  onSuccess: () => void;
}

const CreateCategory: React.FC<CreateCategoryProps> = ({ selectedCategory, onSuccess }) => {
  const [name, setName] = useState('');
  const showToast = useToast();

  useEffect(() => {
    if (selectedCategory) {
      setName(selectedCategory.name || '');
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
        const categoryData = { name };

        if (selectedCategory) {
            const response = await updateCategoryStaffAPI(selectedCategory._id, categoryData);
            if (response) {
                showToast('Cập nhật chức vụ thành công!', 'success');
                onSuccess();
            }
        } else {
            await createCategoryStaffAPI(categoryData);
            showToast('Thêm chức vụ mới thành công!', 'success');
            onSuccess();
        }
    } catch (err: any) {
        if (err.response?.status === 404) {
            showToast(err.response.data.message, 'error');
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
      <Typography variant="h5" sx={{ mb: 4, color: '#333', fontWeight: 'bold' }}>
        {selectedCategory ? "Chỉnh sửa chức vụ" : "Thêm chức vụ mới"}
      </Typography>

      <form onSubmit={handleSubmit}>
        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            label="Tên chức vụ"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            sx={{ mb: 2 }}
          />
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
          {selectedCategory ? "Cập nhật" : "Thêm mới"}
        </Button>
      </form>
    </FormContainer>
  );
};

export default CreateCategory;