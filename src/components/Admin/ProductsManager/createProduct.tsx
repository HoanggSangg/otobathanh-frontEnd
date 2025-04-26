import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useToast } from '../../Styles/ToastProvider';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  FormControl, 
  InputLabel
} from '@mui/material';
import { createProductAPI, getAllCategoriesAPI, updateProductAPI } from '../../API';
import { getCommentsByProductIdAPI, deleteCommentAPI } from '../../API';
import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton } from '@mui/material';
import { Select, MenuItem } from '@mui/material';

const PageContainer = styled(Container)`
  padding: 40px 0;
`;

const Title = styled(Typography)`
  margin-bottom: 40px !important;
  color: #e31837;
  font-weight: bold !important;
`;

const StyledSelect = styled(Select)`
  .MuiOutlinedInput-notchedOutline {
    border-radius: 8px;
  }
  
  &:hover .MuiOutlinedInput-notchedOutline {
    border-color: #e31837;
  }
  
  &.Mui-focused .MuiOutlinedInput-notchedOutline {
    border-color: #e31837;
  }
`;

const FormContainer = styled(Box)`
  background: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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

interface Product {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  category_id: {
    _id: string;
    name: string;
  };
  description: string;
  image: string;
  subImages: string[];
  date: string;
  createdAt: string;
  updatedAt: string;
}

interface EditFormData {
  name: string;
  price: string;
  quantity: string;
  category_id: {
    _id: string;
    name: string;
  };
  description: string;
}

interface Props {
  onSuccess: () => void;
  editingProduct: Product | null;
}

// Add to interfaces
interface Comment {
  _id: string;
  comment: string;
  account: {
    fullName: string;
  };
  createdAt: string;
}

interface Category {
  _id: string;
  name: string;
}

const CreateProduct: React.FC<Props> = ({ onSuccess, editingProduct }) => {
  const [formData, setFormData] = useState<EditFormData>({
    name: '',
    price: '',
    quantity: '',
    category_id: { _id: '', name: '' },
    description: ''
  });
  const [image, setImage] = useState<File | null>(null);
  const showToast = useToast();
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);

  // Add new useEffect to fetch comments when editing
  useEffect(() => {
    if (editingProduct) {
      setFormData({
        name: editingProduct.name,
        price: editingProduct.price.toString(),
        quantity: editingProduct.quantity.toString(),
        category_id: editingProduct.category_id,
        description: editingProduct.description || ''
      });
      setCurrentImage(editingProduct.image);
    }

    const fetchComments = async () => {
      if (editingProduct?._id) {
        try {
          const commentsData = await getCommentsByProductIdAPI(editingProduct._id);
          setComments(commentsData);
        } catch (error) {
          console.error('Error fetching comments:', error);
        }
      }
    };
    fetchComments();

    const fetchCategories = async () => {
      try {
        const rolesData = await getAllCategoriesAPI();
        setCategories(rolesData);
      } catch (error) {
        console.error('Error fetching categories:', error);
        showToast('Không thể tải danh mục', 'error');
      }
    };
    fetchCategories();
  }, []);

  // Add function to handle comment deletion
  const handleDeleteComment = async (commentId: string) => {
    try {
        const response = await deleteCommentAPI(commentId);
        if (response.message) {
            setComments(comments.filter(comment => comment._id !== commentId));
            showToast(response.message, 'success');
        }
    } catch (err: any) {
        if (err.response?.status === 404) {
            showToast(err.response.data.message, 'error'); // Comment not found
        } else if (err.response?.status === 403) {
            showToast(err.response.data.message, 'error'); // Permission denied
        } else if (err.response?.status === 500) {
            showToast(err.response.data.message, 'error'); // Server error
        } else {
            showToast('Có lỗi khi xóa bình luận!', 'error');
        }
        console.error('Error deleting comment:', err);
    }
};

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.name || !formData.price || !formData.quantity || !formData.category_id._id) {
      showToast('Vui lòng nhập đầy đủ thông tin!', 'error');
      return;
    }

    try {
      let base64Image = null;
      if (image) {
        base64Image = await convertToBase64(image);
      }

      const newProduct = {
        name: formData.name,
        description: formData.description,
        price: Number(formData.price),
        quantity: Number(formData.quantity),
        category_id: formData.category_id,
        image: base64Image
      };

      await createProductAPI(newProduct);
      showToast('Thêm sản phẩm thành công!', 'success');

      setImage(null);
      setCurrentImage(null);
      onSuccess();
    } catch (error) {
      console.error('Error:', error);
      showToast('Có lỗi khi thêm sản phẩm!', 'error');
    }
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.name || !formData.price || !formData.quantity || !formData.category_id._id) {
      showToast('Vui lòng điền đầy đủ thông tin!', 'error');
      return;
    }

    try {
      let base64Image = null;
      if (image) {
        base64Image = await convertToBase64(image);
      }

      const updatedProduct = {
        name: formData.name,
        description: formData.description,
        price: Number(formData.price),
        quantity: Number(formData.quantity),
        category_id: formData.category_id,
        image: base64Image || currentImage
      };

      if (editingProduct) {
        await updateProductAPI(editingProduct._id, updatedProduct);
        showToast('Cập nhật sản phẩm thành công!', 'success');
      }
      onSuccess();
    } catch (error) {
      console.error('Error:', error);
      showToast('Có lỗi khi cập nhật sản phẩm!', 'error');
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  return (
    <PageContainer maxWidth="lg">
      <Title variant="h4">{editingProduct ? "Chỉnh sửa sản phẩm" : "Thêm Sản Phẩm Mới"}</Title>

      <FormContainer>
        <form onSubmit={editingProduct ? handleUpdate : handleSubmit}>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
            <Box>
              <StyledTextField
                fullWidth
                label="Tên sản phẩm"
                value={formData.name}
                onChange={handleFormChange}
                name="name"
                required
              />
            </Box>

            <Box>
              <FormControl fullWidth>
                <InputLabel id="category-label">Danh mục</InputLabel>
                <StyledSelect
                  labelId="category-label"
                  value={formData.category_id._id}
                  onChange={(e) => {
                    const selectedCategory = categories.find(cat => cat._id === e.target.value);
                    if (selectedCategory) {
                      setFormData(prev => ({
                        ...prev,
                        category_id: {
                          _id: selectedCategory._id,
                          name: selectedCategory.name
                        }
                      }));
                    }
                  }}
                  label="Danh mục"
                  required
                >
                  <MenuItem value="" disabled>
                    Chọn danh mục
                  </MenuItem>
                  {categories.map((category) => (
                    <MenuItem key={category._id} value={category._id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </StyledSelect>
              </FormControl>
            </Box>

            <Box>
              <StyledTextField
                fullWidth
                label="Giá"
                type="number"
                value={formData.price}
                onChange={handleFormChange}
                name="price"
                required
              />
            </Box>

            <Box>
              <StyledTextField
                fullWidth
                label="Số lượng"
                type="number"
                value={formData.quantity}
                onChange={handleFormChange}
                name="quantity"
                required
              />
            </Box>

            <Box sx={{ gridColumn: '1 / -1' }}>
              <StyledTextField
                fullWidth
                label="Mô tả"
                value={formData.description}
                onChange={handleFormChange}
                name="description"
                multiline
                rows={4}
                required
              />
            </Box>

            <Box sx={{ gridColumn: '1 / -1', mb: 3 }}>
              {currentImage && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle1" sx={{ mb: 1 }}>Ảnh hiện tại:</Typography>
                  <img
                    src={currentImage}
                    alt="Current product"
                    style={{
                      maxWidth: '200px',
                      maxHeight: '200px',
                      objectFit: 'cover',
                      borderRadius: '8px'
                    }}
                  />
                </Box>
              )}

              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: 'none' }}
                id="image-upload"
              />
              <label htmlFor="image-upload">
                <Button
                  variant="outlined"
                  component="span"
                  fullWidth
                >
                  {editingProduct ? "Thay đổi ảnh" : "Chọn ảnh sản phẩm"}
                </Button>
              </label>
              {image && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Đã chọn: {image.name}
                </Typography>
              )}
            </Box>
          </Box>

          <Box sx={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
            <Button
              variant="outlined"
              onClick={() => {
                setFormData({
                  name: '',
                  price: '',
                  quantity: '',
                  category_id: { _id: '', name: '' },
                  description: ''
                });
                setImage(null);
                setCurrentImage(null);
              }}
            >
              Làm mới
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
            >
              {editingProduct ? "Cập nhật" : "Thêm mới"}
            </Button>
          </Box>
        </form>
      </FormContainer>

      {/* Add comments section after the form */}
      {editingProduct && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" sx={{ mb: 2, color: '#e31837' }}>
            Bình luận của sản phẩm
          </Typography>
          {comments.length > 0 ? (
            <FormContainer>
              {comments.map((comment) => (
                <Box
                  key={comment._id}
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    p: 2,
                    mb: 2,
                    bgcolor: '#f5f5f5',
                    borderRadius: 1
                  }}
                >
                  <Box>
                    <Typography variant="subtitle2" sx={{ color: '#666' }}>
                      {comment.account.fullName}
                    </Typography>
                    <Typography>{comment.comment}</Typography>
                    <Typography variant="caption" sx={{ color: '#666' }}>
                      {new Date(comment.createdAt).toLocaleDateString('vi-VN')}
                    </Typography>
                  </Box>
                  <IconButton
                    onClick={() => handleDeleteComment(comment._id)}
                    color="error"
                    size="small"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              ))}
            </FormContainer>
          ) : (
            <Typography sx={{ color: '#666' }}>
              Chưa có bình luận nào cho sản phẩm này.
            </Typography>
          )}
        </Box>
      )}
    </PageContainer>
  );
};

export default CreateProduct;
