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
import { getAllBannersAPI, deleteBannerAPI } from '../../API';

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
  const [isLoading, setIsLoading] = useState(false);
  const showToast = useToast();

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      setIsLoading(true);
      const response = await getAllBannersAPI();
      if (Array.isArray(response)) {
        setBanners(response);
      } else {
        showToast('Dữ liệu không hợp lệ!', 'error');
      }
    } catch (err) {
      showToast('Không thể tải danh sách banner!', 'error');
      console.error('Error fetching banners:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (banner: Banner) => {
    onEdit(banner);
  };

  const handleDelete = async (bannerId: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa banner này?')) {
        try {
            const response = await deleteBannerAPI(bannerId);
            if (response.message) {
                setBanners(banners.filter(b => b._id !== bannerId));
                showToast(response.message, 'success');
            }
        } catch (err: any) {
            if (err.response?.status === 404) {
                showToast(err.response.data.message, 'error'); // Banner not found
            } else if (err.response?.status === 500) {
                showToast(err.response.data.message, 'error'); // Server error
            } else {
                showToast('Không thể xóa banner!', 'error');
            }
            console.error('Error deleting banner:', err);
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
                <TableCell>Hình ảnh</TableCell>
                <TableCell>Ngày tạo</TableCell>
                <TableCell align="right">Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={3} align="center">Đang tải...</TableCell>
                </TableRow>
              ) : banners.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} align="center">Không có banner nào</TableCell>
                </TableRow>
              ) : (
                banners.map((banner) => (
                  <TableRow key={banner._id}>
                    <TableCell>
                      <img
                        src={banner.image}
                        alt="Banner"
                        style={{ width: '200px', height: 'auto', objectFit: 'cover' }}
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
    </Container>
  );
};

export default EditBanner;