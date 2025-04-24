import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useToast } from '../../Styles/ToastProvider';
import {
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { getAllCategoriesAPI, deleteCategoryAPI } from '../../API';

const Container = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

const StyledTableContainer = styled(TableContainer)`
  margin-top: 20px;
  
  .MuiTableCell-head {
    font-weight: 600;
    background-color: #f5f5f5;
  }
`;

const StyledPaper = styled(Paper)`
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

interface Category {
  _id: string;
  name: string;
}

interface Props {
  onEdit: (category: Category) => void;
}

const EditCategory: React.FC<Props> = ({ onEdit }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const showToast = useToast();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const response = await getAllCategoriesAPI();
      if (Array.isArray(response)) {
        setCategories(response);
      } else {
        showToast('Dữ liệu không hợp lệ!', 'error');
      }
    } catch (err) {
      showToast('Không thể tải danh sách danh mục!', 'error');
      console.error('Error fetching categories:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (category: Category) => {
    onEdit(category);
  };

  const handleDelete = async (categoryId: string) => {
      if (window.confirm('Bạn có chắc chắn muốn xóa danh mục này?')) {
          try {
              const response = await deleteCategoryAPI(categoryId);
              if (response.message) {
                  setCategories(categories.filter(c => c._id !== categoryId));
                  showToast(response.message, 'success');
              }
          } catch (err: any) {
              if (err.response?.status === 404) {
                  showToast(err.response.data.message, 'error'); // Category not found
              } else if (err.response?.status === 500) {
                  showToast(err.response.data.message, 'error'); // Server error
              } else {
                  showToast('Không thể xóa danh mục!', 'error');
              }
              console.error('Error deleting category:', err);
          }
      }
  };

  return (
    <Container>
      <StyledTableContainer>
        <StyledPaper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Tên danh mục</TableCell>
                <TableCell align="right">Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={2} align="center">Đang tải...</TableCell>
                </TableRow>
              ) : categories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={2} align="center">Không có danh mục nào</TableCell>
                </TableRow>
              ) : (
                categories.map((category) => (
                  <TableRow key={category._id}>
                    <TableCell>{category.name}</TableCell>
                    <TableCell align="right">
                      <IconButton onClick={() => handleEdit(category)} color="primary">
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(category._id)} color="error">
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </StyledPaper>
      </StyledTableContainer>
    </Container>
  );
};

export default EditCategory;