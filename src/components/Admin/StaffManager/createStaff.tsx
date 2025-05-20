import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { createStaffAPI, updateStaffAPI, getAllCategoryStaffsAPI } from '../../API';
import { useToast } from '../../Styles/ToastProvider';

const StyledForm = styled('form')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3),
  width: '100%',
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
    '&:hover fieldset': {
      borderColor: theme.palette.primary.main,
    },
  },
}));

const ImageUploadBox = styled(Box)(({ theme }) => ({
  border: '1px dashed #ccc',
  padding: theme.spacing(2),
  borderRadius: theme.spacing(1),
  marginTop: theme.spacing(2),
}));

const StyledButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
  padding: '10px 24px',
}));

const ImagePreview = styled('img')({
  maxWidth: '200px',
  maxHeight: '200px',
  objectFit: 'cover',
  marginTop: '1rem',
  borderRadius: '4px',
});

const Container = styled(Paper)(({ theme }) => ({
  maxWidth: 800,
  margin: '0 auto',
  padding: theme.spacing(3),
  borderRadius: theme.spacing(1),
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
}));

const Title = styled('h1')(({ theme }) => ({
  color: theme.palette.text.primary,
  fontSize: '1.5rem',
  fontWeight: 600,
  marginBottom: theme.spacing(3),
  padding: theme.spacing(1, 0),
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

interface Staff {
  _id: string;
  name: string;
  phone: string;
  position: string;
  image: string;
  catestaff_id: {
    _id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

// Update the interface
interface CreateStaffProps {
  onSuccess: () => void;
  editingStaff: Staff | null;  // Make editingStaff required but nullable
}

// Update the FormData interface
interface FormData {
  name: string;
  phone: string;
  position: string;
  image: string;
  catestaff_id: string;
}

const CreateStaff: React.FC<CreateStaffProps> = ({ onSuccess, editingStaff }) => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    phone: '',
    position: '',
    image: '',
    catestaff_id: '',
  });

  useEffect(() => {
    fetchCategoryStaffs();
    if (editingStaff) {
      setFormData({
        name: editingStaff.name,
        phone: editingStaff.phone,
        position: editingStaff.position,
        image: editingStaff.image,
        catestaff_id: editingStaff.catestaff_id._id,
      });
    } else {
      setFormData({
        name: '',
        phone: '',
        position: '',
        image: '',
        catestaff_id: '',
      });
    }
  }, [editingStaff]);

  const [categoryStaffs, setCategoryStaffs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const showToast = useToast();

  const fetchCategoryStaffs = async () => {
    try {
      const response = await getAllCategoryStaffsAPI();
      setCategoryStaffs(response);
    } catch (error) {
      showToast('Không thể tải danh mục nhân viên', 'error');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!formData.name || !formData.phone || !formData.position || !formData.catestaff_id) {
        showToast('Vui lòng điền đầy đủ thông tin!', 'error');
        return;
      }

      const response = editingStaff
        ? await updateStaffAPI(editingStaff._id, formData)
        : await createStaffAPI(formData);

      if (response) {
        showToast(
          editingStaff
            ? 'Cập nhật nhân viên thành công!'
            : 'Thêm nhân viên thành công!',
          'success'
        );
        // Only reset form if not editing
        if (!editingStaff) {
          setFormData({
            name: '',
            phone: '',
            position: '',
            image: '',
            catestaff_id: '',
          });
        }
        onSuccess();
      }
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Có lỗi xảy ra!', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        if (file.size > 5000000) {
          showToast('Kích thước ảnh không được vượt quá 5MB', 'error');
          return;
        }
  
        const reader = new FileReader();
        reader.onloadend = () => {
          setFormData(prev => ({ ...prev, image: reader.result as string }));
        };
        reader.readAsDataURL(file);
      }
    };

  return (
    <Container>
      <Title>{editingStaff ? 'Chỉnh sửa nhân viên' : 'Thêm nhân viên mới'}</Title>
      <StyledForm onSubmit={handleSubmit}>
        <StyledTextField
          fullWidth
          label="Tên nhân viên"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          error={formData.name.length > 0 && formData.name.length < 2}
          helperText={formData.name.length > 0 && formData.name.length < 2 ? "Tên phải có ít nhất 2 ký tự" : ""}
        />
        <StyledTextField
          fullWidth
          label="Số điện thoại"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          required
          error={formData.phone.length > 0 && !/^[0-9]{10}$/.test(formData.phone)}
          helperText={formData.phone.length > 0 && !/^[0-9]{10}$/.test(formData.phone) ? "Số điện thoại phải có 10 chữ số" : ""}
        />
        <StyledTextField
          fullWidth
          label="Chức vụ"
          value={formData.position}
          onChange={(e) => setFormData({ ...formData, position: e.target.value })}
          required
        />
        <FormControl fullWidth required error={!formData.catestaff_id}>
          <InputLabel>Danh mục</InputLabel>
          <Select
            value={formData.catestaff_id}
            onChange={(e) => setFormData({ ...formData, catestaff_id: e.target.value })}
          >
            {categoryStaffs.map((category) => (
              <MenuItem key={category._id} value={category._id}>
                {category.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <ImageUploadBox>
          <input
            accept="image/*"
            type="file"
            onChange={handleImageChange}
            style={{ marginBottom: '1rem' }}
          />
          {formData.image && (
            <ImagePreview
              src={formData.image}
              alt="Preview"
            />
          )}
        </ImageUploadBox>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          <StyledButton
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
          >
            {loading ? 'Đang xử lý...' : (editingStaff ? 'Cập nhật' : 'Thêm mới')}
          </StyledButton>
        </Box>
      </StyledForm>
    </Container>
  );
};

export default CreateStaff;