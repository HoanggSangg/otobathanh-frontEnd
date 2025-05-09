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
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';

const Container = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

const StyledTableContainer = styled(TableContainer)`
  margin-top: 20px;
  overflow-x: auto;
  
  .MuiTableCell-head {
    font-weight: 600;
    background-color: #f5f5f5;
    
    @media (max-width: 768px) {
      display: none;
    }
  }

  .MuiTableCell-body {
    @media (max-width: 768px) {
      display: block;
      padding: 8px 16px;
      text-align: left;
      border: none;
      
      &:before {
        content: attr(data-label);
        float: left;
        font-weight: bold;
        margin-right: 1rem;
      }
    }
  }

  .MuiTableRow-root {
    @media (max-width: 768px) {
      display: block;
      border: 1px solid #ddd;
      border-radius: 8px;
      margin-bottom: 1rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }
  }
`;

const StyledButton = styled(Button)`
  &.MuiButton-root {
    padding: 8px 20px;
    border-radius: 6px;
    text-transform: none;
    font-weight: 500;
    font-size: 14px;
    transition: all 0.2s ease;
    
    &.MuiButton-contained {
      background-color: ${props => props.color === 'error' ? '#e31837' : '#666'};
      color: white;
      box-shadow: none;
      
      &:hover {
        background-color: ${props => props.color === 'error' ? '#c41730' : '#555'};
        box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.1);
      }
      
      &:active {
        transform: scale(0.98);
      }
    }
    
    &.MuiButton-outlined {
      border: 1px solid #ddd;
      color: #666;
      
      &:hover {
        background-color: #f9f9f9;
        border-color: #ccc;
      }
    }
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
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);

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
    setCategoryToDelete(categoryId);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (categoryToDelete) {
      try {
        const response = await deleteCategoryAPI(categoryToDelete);
        if (response.status === 200) {
          setCategories(prev => prev.filter(a => a._id !== categoryToDelete));
          showToast(response.data.message, 'success');
        } else {
          showToast(response.data.message, 'error');
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
    setDeleteConfirmOpen(false);
    setCategoryToDelete(null);
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

      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          style: {
            backgroundColor: '#fff',
            borderRadius: '12px',
            padding: window.innerWidth <= 768 ? '16px' : '24px',
            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
            margin: window.innerWidth <= 768 ? '16px' : 'auto'
          }
        }}
      >
        <DialogTitle style={{
          fontSize: window.innerWidth <= 768 ? '18px' : '20px',
          fontWeight: '600',
          color: '#333',
          padding: window.innerWidth <= 768 ? '0 0 12px 0' : '0 0 16px 0'
        }}>
          Xác nhận xóa danh mục
        </DialogTitle>
        <DialogContent style={{ 
          padding: window.innerWidth <= 768 ? '8px 0 16px 0' : '8px 0 24px 0' 
        }}>
          <DialogContentText style={{
            fontSize: window.innerWidth <= 768 ? '14px' : '16px',
            color: '#555',
            lineHeight: '1.5'
          }}>
            Bạn có chắc chắn muốn xóa danh mục này? Hành động này không thể hoàn tác.
          </DialogContentText>
        </DialogContent>
        <DialogActions style={{
          padding: '0',
          justifyContent: 'flex-end',
          gap: window.innerWidth <= 768 ? '8px' : '12px',
          flexDirection: window.innerWidth <= 768 ? 'column' : 'row',
          width: window.innerWidth <= 768 ? '100%' : 'auto'
        }}>
          <StyledButton
            variant="outlined"
            onClick={() => setDeleteConfirmOpen(false)}
            fullWidth={window.innerWidth <= 768}
          >
            Hủy
          </StyledButton>
          <StyledButton
            variant="contained"
            color="error"
            onClick={confirmDelete}
            fullWidth={window.innerWidth <= 768}
          >
            Xóa
          </StyledButton>
        </DialogActions>
      </Dialog>

    </Container>
  );
};

export default EditCategory;