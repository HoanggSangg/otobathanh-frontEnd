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
import { getAllBannersAPI, deleteBannerAPI } from '../../API';
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

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  flex-wrap: wrap;
  padding: 0 0 16px 0;
  border-bottom: 2px solid #f5f5f5;
  margin-bottom: 24px;
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

const BannerImage = styled.img`
  width: 200px;
  height: auto;
  object-fit: cover;

  @media (max-width: 768px) {
    width: 120px;
  }

  @media (max-width: 480px) {
    width: 100px;
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

const StyledPaper = styled(Paper)`
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

interface Banner {
  _id: string;
  image: string;
  createdAt: string;
}

interface Props {
  onEdit: (banner: Banner) => void;
}

const EditBanner: React.FC<Props> = ({ onEdit }) => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const showToast = useToast();
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [bannerToDelete, setBannerToDelete] = useState<string | null>(null);

  useEffect(() => {
    fetchBanners();

    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(loadingTimer);
  }, []);

  const fetchBanners = async () => {
    try {
      const response = await getAllBannersAPI();
      if (Array.isArray(response)) {
        setBanners(response);
      } else {
        showToast('Dữ liệu không hợp lệ!', 'error');
      }
    } catch (err) {
      showToast('Không thể tải danh sách banner!', 'error');
      console.error('Error fetching banners:', err);
    }
  };

  const handleEdit = (banner: Banner) => {
    onEdit(banner);
  };

  const handleDelete = async (bannerId: string) => {
    setBannerToDelete(bannerId);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (bannerToDelete) {
      try {
        const response = await deleteBannerAPI(bannerToDelete);
        if (response.status === 200) {
          setBanners(prev => prev.filter(a => a._id !== bannerToDelete));
          showToast(response.data.message, 'success');
        } else {
          showToast(response.data.message, 'error');
        }
      } catch (err: any) {
        console.error('Error deleting account:', err);
        showToast('Không thể xóa tài khoản!', 'error');
      }
    }
    setDeleteConfirmOpen(false);
    setBannerToDelete(null);
  };

  const handleImageClick = (imageUrl: string) => {
    setSelectedImageUrl(imageUrl);
  };

  const handleCloseModal = () => {
    setSelectedImageUrl(null);
  };

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
  };

  const getCurrentPageItems = () => {
    const sortedBanners = [...banners].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return sortedBanners.slice(startIndex, endIndex);
  };

  return (
    <Container>
      <Header>
        <h1 style={{
          margin: 0,
          fontWeight: 700,
          fontSize: '2rem',
          color: '#e31837',
          letterSpacing: '1px'
        }}>
          Quản lý banner
        </h1>
        <span style={{
          fontWeight: 500,
          color: '#333',
          fontSize: '1.1rem'
        }}>
          Tổng số: {banners.length}
        </span>
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
                <TableCell>Ngày tạo</TableCell>
                <TableCell align="right">Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    <LoadingSpinner />
                  </TableCell>
                </TableRow>
              ) : banners.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} align="center">Không có banner nào</TableCell>
                </TableRow>
              ) : (
                getCurrentPageItems().map((banner) => (
                  <TableRow key={banner._id}>
                    <TableCell>
                      <BannerImage
                        src={banner.image}
                        alt="Banner"
                        onClick={() => handleImageClick(banner.image)}
                        style={{ cursor: 'pointer' }}
                      />
                    </TableCell>
                    <TableCell>
                      {new Date(banner.createdAt).toLocaleDateString('vi-VN')}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton onClick={() => handleEdit(banner)} color="primary">
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(banner._id)} color="error">
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
      {selectedImageUrl && (
        <ImageModal onClick={handleCloseModal}>
          <ModalImage src={selectedImageUrl} alt="Enlarged view" />
        </ImageModal>
      )}

      {!isLoading && banners.length > 0 && (
        <PaginationWrapper>
          <Pagination
            count={Math.ceil(banners.length / itemsPerPage)}
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
            padding: window.innerWidth <= 768 ? '16px' : '24px',
            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
            minWidth: window.innerWidth <= 768 ? '90%' : '600px',
            margin: window.innerWidth <= 768 ? '16px' : 'auto'
          }
        }}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle style={{
          fontSize: window.innerWidth <= 768 ? '18px' : '20px',
          fontWeight: '600',
          color: '#333',
          padding: window.innerWidth <= 768 ? '0 0 12px 0' : '0 0 16px 0'
        }}>
          Xác nhận xóa banner
        </DialogTitle>
        <DialogContent style={{
          padding: window.innerWidth <= 768 ? '8px 0 16px 0' : '8px 0 24px 0'
        }}>
          <DialogContentText style={{
            fontSize: window.innerWidth <= 768 ? '14px' : '16px',
            color: '#555',
            lineHeight: '1.5'
          }}>
            Bạn có chắc chắn muốn xóa banner này? Hành động này không thể hoàn tác.
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

export default EditBanner;