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
import { getAllProductsAPI, deleteProductAPI } from '../../API';
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

  @media (max-width: 768px) {
    padding: 10px;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  @media (max-width: 1024px) {
    flex-direction: column;
    gap: 15px;
  }
`;

const Title = styled.h1`
  color: #333;
  font-size: 24px;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 20px;
    text-align: center;
  }
`;

const SearchInput = styled.input`
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 300px;
  font-size: 14px;
  
  @media (max-width: 768px) {
    width: 100%;
  }
  
  &:focus {
    outline: none;
    border-color: #0066cc;
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

const SearchContainer = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;

  @media (max-width: 768px) {
    flex-direction: column;
    width: 100%;
  }
`;

const PriceRangeContainer = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;

  @media (max-width: 768px) {
    width: 100%;
    justify-content: space-between;
  }

  input {
    @media (max-width: 768px) {
      width: calc(50% - 15px) !important;
    }
  }
`;

const StyledTableContainer = styled(TableContainer)`
  margin-top: 20px;
  overflow-x: auto;
  
  .MuiTableCell-head {
    font-weight: 600;
    background-color: #f5f5f5;
    
    @media (max-width: 768px) {
      padding: 8px;
      font-size: 14px;
      white-space: nowrap;
    }
  }

  .MuiTableCell-body {
    @media (max-width: 768px) {
      padding: 8px;
      font-size: 13px;
      white-space: nowrap;
    }
  }
`;

const ImageCell = styled.img`
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 4px;

  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
  }
`;

const PaginationWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
  padding: 20px 0;

  @media (max-width: 768px) {
    padding: 10px 0;
    
    .MuiPagination-ul {
      .MuiPaginationItem-root {
        min-width: 28px;
        height: 28px;
        font-size: 13px;
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

const ActionButton = styled(IconButton)`
  padding: 6px !important;
  margin-left: 8px !important;
`;

const StyledPaper = styled(Paper)`
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const ImageModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
  cursor: pointer;
`;

const ModalImage = styled.img`
  max-width: 90%;
  max-height: 90vh;
  object-fit: contain;
`;

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

interface Props {
  onEdit: (product: Product) => void;
}

const EditProduct: React.FC<Props> = ({ onEdit }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const showToast = useToast();
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Add pagination handler
  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
  };

  const handleImageClick = (imageUrl: string) => {
    setSelectedImageUrl(imageUrl);
  };

  const handleCloseModal = () => {
    setSelectedImageUrl(null);
  };

  const getPaginatedProducts = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(startIndex, startIndex + itemsPerPage);
  };

  const [formData, setFormData] = useState<EditFormData>({
    name: '',
    price: '',
    quantity: '',
    category_id: {
      _id: '',
      name: ''
    },
    description: ''
  });

  useEffect(() => {
    fetchProducts();
    if (selectedProduct) {
      setFormData({
        name: selectedProduct.name,
        price: selectedProduct.price.toString(),
        quantity: selectedProduct.quantity.toString(),
        category_id: selectedProduct.category_id,
        description: selectedProduct.description
      });
    }

    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    // Cleanup timer
    return () => clearTimeout(loadingTimer);
  }, [selectedProduct]);

  const fetchProducts = async () => {
    try {
      const response = await getAllProductsAPI();
      if (Array.isArray(response)) {
        setProducts(response);
      } else {
        showToast('Dữ liệu không hợp lệ!', 'error');
      }
    } catch (err) {
      showToast('Không thể tải danh sách sản phẩm!', 'error');
      console.error('Error fetching products:', err);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const handleEdit = (product: Product) => {
    onEdit(product);
  };

  const handleDelete = async (productId: string) => {
    setProductToDelete(productId);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (productToDelete) {
      try {
        const response = await deleteProductAPI(productToDelete);
        if (response.status === 200) {
          setProducts(prev => prev.filter(a => a._id !== productToDelete));
          showToast(response.data.message, 'success');
        } else {
          showToast(response.data.message, 'error');
        }
      } catch (err: any) {
        if (err.response?.status === 404) {
          showToast(err.response.data.message, 'error'); // Product not found
        } else if (err.response?.status === 500) {
          showToast(err.response.data.message, 'error'); // Server error
        } else {
          showToast('Không thể xóa sản phẩm!', 'error');
        }
        console.error('Error deleting product:', err);
      }
    }
    setDeleteConfirmOpen(false);
    setProductToDelete(null);
  };

  // Add these new states after existing useState declarations
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });

  // Update the filteredProducts logic
  const filteredProducts = products.filter(product => {
    const nameMatch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const categoryMatch = product.category_id.name.toLowerCase().includes(searchTerm.toLowerCase());
    const descriptionMatch = product.description.toLowerCase().includes(searchTerm.toLowerCase());

    // Price range filter
    const priceInRange = (!priceRange.min || product.price >= Number(priceRange.min)) &&
      (!priceRange.max || product.price <= Number(priceRange.max));

    return (nameMatch || categoryMatch || descriptionMatch) && priceInRange;
  });

  // Update the search section in the return statement
  return (
    <Container>
      <Header>
        <Title>Quản lý sản phẩm</Title>
        <SearchContainer>
          <SearchInput
            type="text"
            placeholder="Tìm kiếm theo tên, danh mục, mô tả..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <PriceRangeContainer>
            <input
              type="number"
              placeholder="Giá từ"
              value={priceRange.min}
              onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
              style={{ padding: '8px' }}
            />
            <span>-</span>
            <input
              type="number"
              placeholder="Giá đến"
              value={priceRange.max}
              onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
              style={{ padding: '8px' }}
            />
          </PriceRangeContainer>
        </SearchContainer>
      </Header>

      <StyledTableContainer>
        <StyledPaper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Hình ảnh</TableCell>
                <TableCell>Tên sản phẩm</TableCell>
                <TableCell>Giá</TableCell>
                <TableCell>Số lượng</TableCell>
                <TableCell>Danh mục</TableCell>
                <TableCell>Mô tả</TableCell>
                <TableCell>Ngày tạo</TableCell>
                <TableCell align="right">Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <LoadingSpinner />
                  </TableCell>
                </TableRow>
              ) : filteredProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">Không tìm thấy sản phẩm nào</TableCell>
                </TableRow>
              ) : (
                getPaginatedProducts().map((product) => (
                  <TableRow key={product._id}>
                    <TableCell>
                      <ImageCell
                        src={product.image || '/placeholder-image.jpg'}
                        alt={product.name}
                        onClick={() => handleImageClick(product.image)}
                        style={{ cursor: 'pointer' }}
                      />
                    </TableCell>
                    <TableCell>
                      {product.name ? (
                        <span title={product.name}>
                          {product.name.length > 10
                            ? `${product.name.substring(0, 10)}...`
                            : product.name}
                        </span>
                      ) : (
                        <span style={{ color: '#999' }}>Không có mô tả</span>
                      )}
                    </TableCell>
                    <TableCell>{formatPrice(product.price)}</TableCell>
                    <TableCell>{product.quantity}</TableCell>
                    <TableCell>{product.category_id.name}</TableCell>
                    <TableCell>
                      {product.description ? (
                        <span title={product.description}>
                          {product.description.length > 20
                            ? `${product.description.substring(0, 20)}...`
                            : product.description}
                        </span>
                      ) : (
                        <span style={{ color: '#999' }}>Không có mô tả</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {new Date(product.createdAt).toLocaleDateString('vi-VN')}
                    </TableCell>
                    <TableCell align="right">
                      <ActionButton onClick={() => handleEdit(product)} color="primary">
                        <EditIcon />
                      </ActionButton>
                      <ActionButton onClick={() => handleDelete(product._id)} color="error">
                        <DeleteIcon />
                      </ActionButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </StyledPaper>
      </StyledTableContainer>
      {selectedImageUrl && (
        <ImageModal onClick={handleCloseModal}>
          <ModalImage src={selectedImageUrl} alt="Enlarged view" />
        </ImageModal>
      )}

      {!isLoading && filteredProducts.length > 0 && (
        <PaginationWrapper>
          <Pagination
            count={Math.ceil(filteredProducts.length / itemsPerPage)}
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
        PaperProps={{
          style: {
            backgroundColor: '#fff',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
            minWidth: '600px'
          }
        }}
      >
        <DialogTitle style={{
          fontSize: '20px',
          fontWeight: '600',
          color: '#333',
          padding: '0 0 16px 0'
        }}>
          Xác nhận xóa sản phẩm
        </DialogTitle>
        <DialogContent style={{ padding: '8px 0 24px 0' }}>
          <DialogContentText style={{
            fontSize: '16px',
            color: '#555',
            lineHeight: '1.5'
          }}>
            Bạn có chắc chắn muốn xóa sản phẩm này? Hành động này không thể hoàn tác.
          </DialogContentText>
        </DialogContent>
        <DialogActions style={{
          padding: '0',
          justifyContent: 'flex-end',
          gap: '12px'
        }}>
          <StyledButton
            variant="outlined"
            onClick={() => setDeleteConfirmOpen(false)}
          >
            Hủy
          </StyledButton>
          <StyledButton
            variant="contained"
            color="error"
            onClick={confirmDelete}
          >
            Xóa
          </StyledButton>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default EditProduct;
