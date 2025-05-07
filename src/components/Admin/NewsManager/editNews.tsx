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
import { getAllNewsAPI, deleteNewsAPI } from '../../API';
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
    align-items: stretch;
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

const Title = styled.h1`
  color: #333;
  font-size: 24px;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 20px;
    text-align: center;
  }
`;

const SearchControls = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;

  @media (max-width: 768px) {
    flex-direction: column;
    width: 100%;
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
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
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

const SearchSelect = styled.select`
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;

  @media (max-width: 768px) {
    width: 100%;
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

const NewsImage = styled.img`
  width: 50px;
  height: 50px;
  object-fit: cover;

  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
  }
`;

interface News {
  _id: string;
  title: string;
  content: string;
  image: string;
  createdAt: string;
  updatedAt: string;
}

interface Props {
  onEdit: (news: News) => void;
}

const EditNews: React.FC<Props> = ({ onEdit }) => {
  const [news, setNews] = useState<News[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const showToast = useToast();
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [newsToDelete, setNewsToDelete] = useState<string | null>(null);

  useEffect(() => {
    fetchNews();

    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    // Cleanup timer
    return () => clearTimeout(loadingTimer);
  }, []);

  const fetchNews = async () => {
    try {
      const response = await getAllNewsAPI();
      if (Array.isArray(response)) {
        setNews(response);
      } else {
        showToast('Dữ liệu không hợp lệ!', 'error');
      }
    } catch (err) {
      showToast('Không thể tải danh sách tin tức!', 'error');
      console.error('Error fetching news:', err);
    }
  };

  const handleImageClick = (imageUrl: string) => {
    setSelectedImageUrl(imageUrl);
  };

  // Add this handler to close the modal
  const handleCloseModal = () => {
    setSelectedImageUrl(null);
  };

  const handleEdit = (newsItem: News) => {
    onEdit(newsItem);
  };

  const handleDelete = async (newsId: string) => {
    setNewsToDelete(newsId);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (newsToDelete) {
      try {
        const response = await deleteNewsAPI(newsToDelete);
        if (response.status === 200) {
          setNews(prev => prev.filter(a => a._id !== newsToDelete));
          showToast(response.data.message, 'success');
        } else {
          showToast(response.data.message, 'error');
        }
      } catch (err: any) {
        if (err.response?.status === 404) {
          showToast(err.response.data.message, 'error'); // News not found
        } else if (err.response?.status === 500) {
          showToast(err.response.data.message, 'error'); // Server error
        } else {
          showToast('Không thể xóa tin tức!', 'error');
        }
        console.error('Error deleting news:', err);
      }
    }
    setDeleteConfirmOpen(false);
    setNewsToDelete(null);
  };

  // Add these new states after existing useState declarations
  const [searchType, setSearchType] = useState('title'); // 'title' or 'content'
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Add pagination handler
  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
  };

  // Modify the filtered news logic to include pagination
  const getPaginatedNews = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedNews.slice(startIndex, startIndex + itemsPerPage);
  };

  // Update the filteredNews logic
  const filteredAndSortedNews = news
    .filter(item => {
      const searchValue = searchTerm.toLowerCase();
      switch (searchType) {
        case 'title':
          return item.title.toLowerCase().includes(searchValue);
        case 'content':
          return item.content.toLowerCase().includes(searchValue);
        default:
          return true;
      }
    })
    .sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });

  // Update the Header section in the return statement
  return (
    <Container>
      <Header>
        <Title>Quản lý tin tức</Title>
        <SearchControls>
          <SearchSelect
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
          >
            <option value="title">Tìm theo tiêu đề</option>
            <option value="content">Tìm theo nội dung</option>
          </SearchSelect>
          <SearchInput
            type="text"
            placeholder={`Tìm kiếm theo ${searchType === 'title' ? 'tiêu đề' : 'nội dung'}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <SearchSelect
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
          >
            <option value="desc">Mới nhất</option>
            <option value="asc">Cũ nhất</option>
          </SearchSelect>
        </SearchControls>
      </Header>

      <StyledTableContainer>
        <StyledPaper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Tiêu đề</TableCell>
                <TableCell>Hình ảnh</TableCell>
                <TableCell>Nội dung</TableCell>
                <TableCell>Ngày tạo</TableCell>
                <TableCell align="right">Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <LoadingSpinner />
                  </TableCell>
                </TableRow>
              ) : filteredAndSortedNews.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">Không tìm thấy tin tức nào</TableCell>
                </TableRow>
              ) : (
                getPaginatedNews().map((item) => (
                  <TableRow key={item._id}>
                    <TableCell>{item.title.substring(0, 30)} ...</TableCell>
                    <TableCell>
                      <NewsImage
                        src={item.image}
                        alt={item.title}
                        onClick={() => handleImageClick(item.image)}
                        style={{ cursor: 'pointer' }}
                      />
                    </TableCell>
                    <TableCell>{item.content.substring(0, 100)}...</TableCell>
                    <TableCell>
                      {new Date(item.createdAt).toLocaleDateString('vi-VN')}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton onClick={() => handleEdit(item)} color="primary">
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(item._id)} color="error">
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
      {!isLoading && filteredAndSortedNews.length > 0 && (
        <PaginationWrapper>
          <Pagination
            count={Math.ceil(filteredAndSortedNews.length / itemsPerPage)}
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
          Xác nhận xóa tin tức
        </DialogTitle>
        <DialogContent style={{ padding: '8px 0 24px 0' }}>
          <DialogContentText style={{
            fontSize: '16px',
            color: '#555',
            lineHeight: '1.5'
          }}>
            Bạn có chắc chắn muốn xóa tin tức này? Hành động này không thể hoàn tác.
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

export default EditNews;
