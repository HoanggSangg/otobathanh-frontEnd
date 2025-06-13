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
  Typography,
  Box,
  Switch,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { getAllProductsAPI, deleteProductAPI, updateFeaturedStatusAPI } from '../../API';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';

const Container = styled.div`
  padding: 24px;
  max-width: 1400px;
  margin: 0 auto;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  
  @media (max-width: 768px) {
    padding: 16px;
    border-radius: 12px;
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
  gap: 16px;
  align-items: center;
  flex-wrap: wrap;
  width: 100%;
  max-width: 800px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 12px;
  }
`;

const SearchInput = styled.input`
  padding: 12px 24px;
  border: 2px solid #eee;
  border-radius: 30px;
  width: 300px;
  font-size: 1rem;
  transition: all 0.3s ease;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);

  &:focus {
    outline: none;
    border-color: #e31837;
    box-shadow: 0 4px 15px rgba(227, 24, 55, 0.1);
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const PriceRangeContainer = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;

  @media (max-width: 768px) {
    width: 100%;
    justify-content: space-between;
  }

  input {
    padding: 12px;
    border: 2px solid #eee;
    border-radius: 30px;
    font-size: 1rem;
    width: 150px;
    transition: all 0.3s ease;
    box-shadow: 0 2px 10px rgba(0,0,0,0.05);

    &:focus {
      outline: none;
      border-color: #e31837;
      box-shadow: 0 4px 15px rgba(227, 24, 55, 0.1);
    }

    @media (max-width: 768px) {
      width: calc(50% - 15px);
    }
  }

  span {
    color: #666;
    font-weight: 500;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
  gap: 24px;

  @media (max-width: 1024px) {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
  }
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
  isFeatured: boolean;
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
  const [selectedSubImages, setSelectedSubImages] = useState<string[] | null>(null);
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
    setIsLoading(true);
    fetchProducts().finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    if (selectedProduct) {
      setFormData({
        name: selectedProduct.name,
        price: selectedProduct.price.toString(),
        quantity: selectedProduct.quantity.toString(),
        category_id: selectedProduct.category_id,
        description: selectedProduct.description
      });
    }
  }, [selectedProduct]);

  const fetchProducts = async () => {
    try {
      const response = await getAllProductsAPI();
      if (Array.isArray(response)) {
        const sortedProducts = response.sort((a: Product, b: Product) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setProducts(sortedProducts);
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
  const handleFeaturedToggle = async (productId: string, currentStatus: boolean) => {
    const newStatus = !currentStatus;

    setProducts(prev =>
      prev.map(p =>
        p._id === productId ? { ...p, isFeatured: newStatus } : p
      )
    );

    try {
      await updateFeaturedStatusAPI(productId, newStatus);
      fetchProducts();

      showToast('Cập nhật trạng thái nổi bật thành công!', 'success');
    } catch (error) {
      setProducts(prev =>
        prev.map(p =>
          p._id === productId ? { ...p, isFeatured: currentStatus } : p
        )
      );
      showToast('Không thể cập nhật trạng thái nổi bật!', 'error');
    }
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

  const handleSubImagesClick = (subImages: string[]) => {
    setSelectedSubImages(subImages);
  };

  const handleCloseSubImagesModal = () => {
    setSelectedSubImages(null);
  };

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
              <TableRow sx={{
                '& .MuiTableCell-head': {
                  backgroundColor: '#f8f9fa',
                  color: '#495057',
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  padding: '16px',
                  borderBottom: '2px solid #dee2e6',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  whiteSpace: 'nowrap',
                  '@media (max-width: 768px)': {
                    display: 'none'
                  }
                }
              }}>
                <TableCell>Hình ảnh</TableCell>
                <TableCell>Tên sản phẩm</TableCell>
                <TableCell>Danh mục</TableCell>
                <TableCell>Mô tả</TableCell>
                <TableCell>Ảnh phụ</TableCell>
                <TableCell>Nổi bật</TableCell>
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
                      {product.subImages && product.subImages.length > 0 ? (
                        <Box sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1
                        }}>
                          <Box sx={{
                            position: 'relative',
                            width: 50,
                            height: 50,
                            cursor: 'pointer'
                          }}
                            onClick={() => handleSubImagesClick(product.subImages)}>
                            <img
                              src={product.subImages[0]}
                              alt="First sub image"
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                borderRadius: '4px'
                              }}
                            />
                            {product.subImages.length > 1 && (
                              <Box sx={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                background: 'rgba(0, 0, 0, 0.5)',
                                color: 'white',
                                borderRadius: '4px',
                                fontSize: '14px',
                                fontWeight: 'bold'
                              }}>
                                +{product.subImages.length - 1}
                              </Box>
                            )}
                          </Box>
                        </Box>
                      ) : (
                        <Typography sx={{ color: '#999' }}>
                          Không có ảnh phụ
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={product.isFeatured}
                        onChange={() => {
                          handleFeaturedToggle(product._id, product.isFeatured);
                        }}
                        color="primary"
                      />
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

      {selectedSubImages && (
        <ImageModal onClick={handleCloseSubImagesModal}>
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            maxWidth: '90vw',
            maxHeight: '90vh',
            overflow: 'auto',
            bgcolor: 'white',
            p: 3,
            borderRadius: 2
          }}>
            <Typography variant="h6" sx={{ color: '#333', mb: 2 }}>
              Ảnh phụ của sản phẩm
            </Typography>
            <Box sx={{
              display: 'flex',
              flexDirection: 'row',
              gap: 2,
              overflowX: 'auto',
              pb: 2
            }}>
              {selectedSubImages.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`Sub image ${index + 1}`}
                  style={{
                    width: '300px',
                    height: '300px',
                    objectFit: 'cover',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    flexShrink: 0
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImageUrl(img);
                    setSelectedSubImages(null);
                  }}
                />
              ))}
            </Box>
          </Box>
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
          Xác nhận xóa sản phẩm
        </DialogTitle>
        <DialogContent style={{
          padding: window.innerWidth <= 768 ? '8px 0 16px 0' : '8px 0 24px 0'
        }}>
          <DialogContentText style={{
            fontSize: window.innerWidth <= 768 ? '14px' : '16px',
            color: '#555',
            lineHeight: '1.5'
          }}>
            Bạn có chắc chắn muốn xóa sản phẩm này? Hành động này không thể hoàn tác.
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

export default EditProduct;
