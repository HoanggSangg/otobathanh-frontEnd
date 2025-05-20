import React, { useEffect, useState } from 'react';
import {
    getAllStaffAPI,
    deleteStaffAPI,
} from '../../API';
import { useToast } from '../../Styles/ToastProvider';
import styled from 'styled-components';
import { Pagination } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
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
import GroupIcon from '@mui/icons-material/Group';

const Container = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  
  @media (max-width: 768px) {
    padding: 10px;
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

const AvatarContainer = styled.div`
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
  border-radius: 4px;
  color: #666;

  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
  }
`;

const SearchControls = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;
  background: #f8f9fa;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  
  @media (max-width: 1024px) {
    flex-direction: column;
    width: 100%;
    gap: 16px;
  }
`;

const SearchInput = styled.input`
  padding: 12px 20px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  width: 300px;
  font-size: 14px;
  transition: all 0.2s ease;
  background: white;

  &:focus {
    outline: none;
    border-color: #1976d2;
    box-shadow: 0 0 0 2px rgba(25, 118, 210, 0.1);
  }

  @media (max-width: 1024px) {
    width: 100%;
  }
`;

const FilterSelect = styled.select`
  padding: 12px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  min-width: 160px;
  background-color: white;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 8px center;
  background-size: 16px;
  padding-right: 32px;

  &:focus {
    outline: none;
    border-color: #1976d2;
    box-shadow: 0 0 0 2px rgba(25, 118, 210, 0.1);
  }

  @media (max-width: 1024px) {
    width: 100%;
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
    gap: 20px;
  }
`;
const Title = styled.h1`
  color: #1a1a1a;
  font-size: 24px;
  margin: 0;
  padding: 8px 0;
  font-weight: 600;

  @media (max-width: 768px) {
    font-size: 20px;
  }
`;

const StyledTableContainer = styled(TableContainer)`
  margin-top: 20px;
  overflow-x: auto;
  
  .MuiTableCell-head {
    font-weight: 600;
    background-color: #f5f5f5;
  }
`;

const ActionButton = styled(IconButton)`
  padding: 6px !important;
  margin-left: 8px !important;

  @media (max-width: 768px) {
    padding: 4px !important;
    margin-left: 4px !important;
  }
`;

const PaginationWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
  padding: 20px 0;
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

interface Props {
    onEdit: (staff: Staff) => void;
    onSuccess?: () => void;
}

const EditStaff: React.FC<Props> = ({ onEdit, onSuccess }) => {
    const [staffList, setStaffList] = useState<Staff[]>([]);
    const [searchType, setSearchType] = useState('name');
    const [sortBy, setSortBy] = useState<'name' | 'date'>('date');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const showToast = useToast();
    const [page, setPage] = useState(1);
    const itemsPerPage = 10;
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [staffToDelete, setStaffToDelete] = useState<string | null>(null);

    const fetchStaff = async () => {
        try {
            const response = await getAllStaffAPI();
            if (Array.isArray(response)) {
                setStaffList(response);
            } else {
                showToast('Dữ liệu không hợp lệ!', 'error');
            }
            setIsLoading(false);
        } catch (err) {
            console.error('Error fetching staff:', err);
            showToast('Không thể tải danh sách nhân viên!', 'error');
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchStaff();
    }, []);

    const handleEdit = (staff: Staff) => {
        onEdit(staff);
        if (onSuccess) {
            onSuccess();
        }
    };

    const getFilteredAndSortedStaff = () => {
        let filtered = [...staffList];

        if (searchTerm) {
            filtered = filtered.filter(staff => {
                if (searchType === 'name') {
                    return staff.name.toLowerCase().includes(searchTerm.toLowerCase());
                } else if (searchType === 'phone') {
                    return staff.phone.includes(searchTerm);
                } else if (searchType === 'position') {
                    return staff.position.toLowerCase().includes(searchTerm.toLowerCase());
                }
                return true;
            });
        }

        filtered.sort((a, b) => {
            if (sortBy === 'name') {
                return sortOrder === 'asc' 
                    ? a.name.localeCompare(b.name)
                    : b.name.localeCompare(a.name);
            } else {
                return sortOrder === 'asc'
                    ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
                    : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            }
        });

        return filtered;
    };

    const paginatedStaffs = () => {
        const filteredStaffs = getFilteredAndSortedStaff();
        const startIndex = (page - 1) * itemsPerPage;
        return filteredStaffs.slice(startIndex, startIndex + itemsPerPage);
    };

    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };

    const handleDelete = async (staffId: string) => {
        setStaffToDelete(staffId);
        setDeleteConfirmOpen(true);
    };

    const confirmDelete = async () => {
        if (staffToDelete) {
            try {
                const response = await deleteStaffAPI(staffToDelete);
                if (response.status === 'success') {
                    setStaffList(prev => prev.filter(staff => staff._id !== staffToDelete));
                    showToast('Xóa nhân viên thành công!', 'success');
                } else {
                    showToast(response.message || 'Xóa nhân viên thất bại!', 'error');
                }
            } catch (err) {
                console.error('Error deleting staff:', err);
                showToast('Không thể xóa nhân viên!', 'error');
            }
        }
        setDeleteConfirmOpen(false);
        setStaffToDelete(null);
    };

    return (
        <Container>
            <Header>
                <Title>Quản lý nhân viên</Title>
                <SearchControls>
                    <FilterSelect
                        value={searchType}
                        onChange={(e) => setSearchType(e.target.value)}
                    >
                        <option value="name">Tìm theo tên</option>
                        <option value="phone">Tìm theo SĐT</option>
                        <option value="position">Tìm theo chức vụ</option>
                    </FilterSelect>

                    <SearchInput
                        type="text"
                        placeholder={`Tìm kiếm theo ${
                            searchType === 'name' ? 'tên' :
                            searchType === 'phone' ? 'số điện thoại' : 'chức vụ'
                        }...`}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </SearchControls>
            </Header>

            <StyledTableContainer>
                <StyledPaper>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Hình ảnh</TableCell>
                                <TableCell>Họ và tên</TableCell>
                                <TableCell>Số điện thoại</TableCell>
                                <TableCell>Chức vụ</TableCell>
                                <TableCell>Danh mục</TableCell>
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
                            ) : getFilteredAndSortedStaff().length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} align="center">Không tìm thấy nhân viên nào</TableCell>
                                </TableRow>
                            ) : (
                                paginatedStaffs().map((staff) => (
                                    <TableRow key={staff._id}>
                                        <TableCell>
                                            {staff.image ? (
                                                <ImageCell
                                                    src={staff.image}
                                                    alt={staff.name}
                                                />
                                            ) : (
                                                <AvatarContainer>
                                                    <PersonIcon />
                                                </AvatarContainer>
                                            )}
                                        </TableCell>
                                        <TableCell>{staff.name}</TableCell>
                                        <TableCell>{staff.phone}</TableCell>
                                        <TableCell>{staff.position}</TableCell>
                                        <TableCell>{staff.catestaff_id.name}</TableCell>
                                        <TableCell>{new Date(staff.createdAt).toLocaleDateString('vi-VN')}</TableCell>
                                        <TableCell align="right">
                                            <ActionButton onClick={() => handleEdit(staff)}>
                                                <EditIcon />
                                            </ActionButton>
                                            <ActionButton onClick={() => handleDelete(staff._id)}>
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

            {!isLoading && getFilteredAndSortedStaff().length > 0 && (
                <PaginationWrapper>
                    <Pagination
                        count={Math.ceil(getFilteredAndSortedStaff().length / itemsPerPage)}
                        page={page}
                        onChange={handlePageChange}
                        color="primary"
                        size="large"
                    />
                </PaginationWrapper>
            )}

            <Dialog
                open={deleteConfirmOpen}
                onClose={() => setDeleteConfirmOpen(false)}
            >
                <DialogTitle>Xác nhận xóa nhân viên</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Bạn có chắc chắn muốn xóa nhân viên này? Hành động này không thể hoàn tác.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <StyledButton onClick={() => setDeleteConfirmOpen(false)}>
                        Hủy
                    </StyledButton>
                    <StyledButton onClick={confirmDelete} color="error" variant="contained">
                        Xóa
                    </StyledButton>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default EditStaff;