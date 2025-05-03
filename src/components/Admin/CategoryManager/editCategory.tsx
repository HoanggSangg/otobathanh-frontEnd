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
  Pagination,
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

const LoadingSpinner = styled.div`
  width: 50px;
  height: 50px;
  border: 5px solid #f3f3f3;
  border-radius: 50%;
  border-top: 5px solid #e31837;
  animation: spin 1s linear infinite;
  margin: 20px auto;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
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

const PaginationWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
  padding: 20px 0;
`;

const EditCategory: React.FC<Props> = ({ onEdit }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const showToast = useToast();

  useEffect(() => {
    fetchCategories();

    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
  }, 2000);

  // Cleanup timer
  return () => clearTimeout(loadingTimer);
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await getAllCategoriesAPI();
      if (Array.isArray(response)) {
        setCategories(response);
      } else {
        showToast('Dữ liệu không hợp lệ!', 'error');
      }
    } catch (err) {
      showToast('Không thể tải danh sách danh mục!', 'error');
      console.error('Error fetching categories:', err);
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

  // Add pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Add pagination handler
  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
  };

  // Add function to get current page items
  const getCurrentPageItems = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return categories.slice(startIndex, endIndex);
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
                  <TableCell colSpan={2} align="center">
                    <LoadingSpinner />
                  </TableCell>
                </TableRow>
              ) : categories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={2} align="center">Không có danh mục nào</TableCell>
                </TableRow>
              ) : (
                getCurrentPageItems().map((category) => (
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

      {/* Add pagination controls */}
      {!isLoading && categories.length > 0 && (
        <PaginationWrapper>
          <Pagination
            count={Math.ceil(categories.length / itemsPerPage)}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
            size="large"
            sx={{
              '& .MuiPaginationItem-root': {
                color: '#666',
              },
              '& .Mui-selected': {
                backgroundColor: '#e31837 !important',
                color: 'white !important',
              },
            }}
          />
        </PaginationWrapper>
      )}
    </Container>
  );
};

export default EditCategory;