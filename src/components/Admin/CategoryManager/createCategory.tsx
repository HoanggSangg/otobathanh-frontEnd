import React, { useState, useEffect } from 'react';
import { useToast } from '../../Styles/ToastProvider';
import styled from 'styled-components';
import {
  Button,
  Box,
  Typography,
  TextField,
} from '@mui/material';
import { createCategoryAPI, updateCategoryAPI } from '../../API';

const FormContainer = styled(Box)`
  background: white;
  padding: 40px;
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
            const response = await updateCategoryAPI(selectedCategory._id, categoryData);
            if (response) {
                showToast('Cập nhật danh mục thành công!', 'success');
                onSuccess();
            }
        } else {
            await createCategoryAPI(categoryData);
            showToast('Thêm danh mục mới thành công!', 'success');
            onSuccess();
        }
    } catch (err: any) {
        if (err.response?.status === 404) {
            showToast(err.response.data.message, 'error'); // Category not found
        } else if (err.response?.status === 400) {
            showToast(err.response.data.message, 'error'); // Validation error
        } else {
            showToast('Có lỗi xảy ra. Vui lòng thử lại!', 'error');
        }
        console.error('Error:', err);
    }
};

  return (
    <FormContainer>
      <Typography variant="h5" sx={{ mb: 4, color: '#e31837', fontWeight: 'bold' }}>
        {selectedCategory ? "Chỉnh sửa danh mục" : "Thêm danh mục mới"}
      </Typography>

      <form onSubmit={handleSubmit}>
        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            label="Tên danh mục"
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