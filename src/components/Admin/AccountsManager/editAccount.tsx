import React, { useState, useEffect } from 'react';
import {
    getAllAccountsAPI,
    deleteAccountAPI,
    disableAccountAPI,
    enableAccountAPI,
} from '../../API';
import { useToast } from '../../Styles/ToastProvider';
import styled from 'styled-components';
import { getCurrentUser } from '../../Utils/auth';
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
    Switch,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { checkIsMasterRole } from '../../Styles/roleUtils';

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

const SearchControls = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  
  @media (max-width: 768px) {
    flex-direction: column;
    width: 100%;
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

const FilterSelect = styled.select`
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
      padding: 8px;
      font-size: 14px;
    }
  }

  .MuiTableCell-body {
    @media (max-width: 768px) {
      padding: 8px;
      font-size: 13px;
    }
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

const Title = styled.h1`
  color: #333;
  font-size: 24px;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 20px;
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

interface Account {
    _id: string;
    fullName: string;
    email: string;
    password: string;
    image: string;
    roles: {
        _id: string;
        name: string;
    }[];
    status: boolean;
    createdAt: string;
    updatedAt: string;
}

interface Props {
    onEdit: (account: Account) => void;
    onSuccess?: () => void;
}

const EditAccount: React.FC<Props> = ({ onEdit, onSuccess }) => {
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [searchType, setSearchType] = useState('fullName');
    const [sortBy, setSortBy] = useState<'name' | 'date'>('date');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const showToast = useToast();
    const [isMaster, setIsMaster] = useState(false);
    const [page, setPage] = useState(1);
    const itemsPerPage = 10;
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [accountToDelete, setAccountToDelete] = useState<string | null>(null);

    useEffect(() => {
        fetchAccounts();
        const checkMasterRole = async () => {
            const isMasterUser = await checkIsMasterRole();
            setIsMaster(isMasterUser);
        };
        checkMasterRole();

        const loadingTimer = setTimeout(() => {
            setIsLoading(false);
        }, 2000);

        // Cleanup timer
        return () => clearTimeout(loadingTimer);
    }, []);

    const fetchAccounts = async () => {
        try {
            const response = await getAllAccountsAPI();
            if (Array.isArray(response)) {
                setAccounts(response);
            } else {
                showToast(response.message || 'Dữ liệu không hợp lệ!', 'error');
            }
        } catch (err: any) {
            console.error('Error fetching accounts:', err);
            showToast('Không thể tải danh sách tài khoản!', 'error');
        }
    };

    const handleEdit = (account: Account) => {
        if (!isMaster && account.roles.some(role => role.name.toLowerCase() === 'master')) {
            showToast('Chỉ Master mới có quyền chỉnh sửa tài khoản Master', 'error');
            return;
        }
        onEdit(account);
        if (onSuccess) {
            onSuccess();
        }
    };

    const paginatedAccounts = () => {
        const filteredAccounts = getFilteredAndSortedAccounts();
        const startIndex = (page - 1) * itemsPerPage;
        return filteredAccounts.slice(startIndex, startIndex + itemsPerPage);
    };

    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };

    const handleDelete = async (accountId: string) => {
        if (!isMaster) {
            showToast('Chỉ Master mới có quyền xóa tài khoản', 'error');
            return;
        }

        const currentUser = getCurrentUser();
        if (currentUser?.id === accountId) {
            showToast('Không thể khóa tài khoản của chính mình', 'error');
            return;
        }

        setAccountToDelete(accountId);
        setDeleteConfirmOpen(true);
    };

    const confirmDelete = async () => {
        if (accountToDelete) {
            try {
                const response = await deleteAccountAPI(accountToDelete);
                if (response.status === 'thành công') {
                    setAccounts(prev => prev.filter(a => a._id !== accountToDelete));
                    showToast(response.message, 'success');
                } else {
                    showToast(response.message, 'error');
                }
            } catch (err: any) {
                console.error('Error deleting account:', err);
                showToast('Không thể xóa tài khoản!', 'error');
            }
        }
        setDeleteConfirmOpen(false);
        setAccountToDelete(null);
    };

    const handleToggleStatus = async (account: Account) => {
        try {
            if (!isMaster) {
                showToast('Chỉ Master mới có quyền khóa/mở tài khoản', 'error');
                return;
            }

            const currentUser = getCurrentUser();
            if (currentUser?.id === account._id) {
                showToast('Không thể khóa tài khoản của chính mình', 'error');
                return;
            }

            if (account.roles.some(role => role.name.toLowerCase() === 'master')) {
                showToast('Không thể khóa tài khoản Master khác', 'error');
                return;
            }

            const apiCall = account.status ? disableAccountAPI : enableAccountAPI;
            const response = await apiCall(account._id);
            showToast(response.message, 'success');

            setAccounts(prev =>
                prev.map(a =>
                    a._id === account._id ? { ...a, status: !account.status } : a
                )
            );
        } catch (err: any) {
            console.error('Error toggling account status:', err);
            showToast('Không thể thay đổi trạng thái tài khoản!', 'error');
        }
    };


    const getFilteredAndSortedAccounts = () => {
        return accounts
            .filter(account => {
                const searchLower = searchTerm.toLowerCase();
                switch (searchType) {
                    case 'fullName':
                        return account.fullName.toLowerCase().includes(searchLower);
                    case 'email':
                        return account.email.toLowerCase().includes(searchLower);
                    case 'role':
                        return account.roles.some(role => role.name.toLowerCase().includes(searchLower));
                    default:
                        return true;
                }
            })
            .sort((a, b) => {
                if (sortBy === 'name') {
                    return sortOrder === 'asc'
                        ? a.fullName.localeCompare(b.fullName)
                        : b.fullName.localeCompare(a.fullName);
                } else {
                    return sortOrder === 'asc'
                        ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
                        : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                }
            });
    };

    return (
        <Container>
            <Header>
                <Title>Quản lý tài khoản</Title>
                <SearchControls>
                    <FilterSelect
                        value={searchType}
                        onChange={(e) => setSearchType(e.target.value)}
                    >
                        <option value="fullName">Tìm theo tên</option>
                        <option value="email">Tìm theo email</option>
                        <option value="role">Tìm theo vai trò</option>
                    </FilterSelect>
                    <SearchInput
                        type="text"
                        placeholder={`Tìm kiếm theo ${searchType === 'fullName' ? 'tên' : searchType === 'email' ? 'email' : 'vai trò'}...`}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <FilterSelect
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as 'name' | 'date')}
                    >
                        <option value="date">Sắp xếp theo ngày</option>
                        <option value="name">Sắp xếp theo tên</option>
                    </FilterSelect>
                    <FilterSelect
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
                    >
                        <option value="desc">Giảm dần</option>
                        <option value="asc">Tăng dần</option>
                    </FilterSelect>
                </SearchControls>
            </Header>

            <StyledTableContainer>
                <StyledPaper>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Tên đăng nhập</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Vai trò</TableCell>
                                <TableCell>Trạng thái</TableCell>
                                <TableCell>Ngày tạo</TableCell>
                                <TableCell align="right">Thao tác</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={6} align="center">
                                        <LoadingSpinner />
                                    </TableCell>
                                </TableRow>
                            ) : getFilteredAndSortedAccounts().length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} align="center">Không tìm thấy tài khoản nào</TableCell>
                                </TableRow>
                            ) : (
                                paginatedAccounts().map((account) => (
                                    <TableRow key={account._id}>
                                        <TableCell>
                                            {account.image ? (
                                                <ImageCell
                                                    src={account.image}
                                                    alt={account.fullName}
                                                />
                                            ) : (
                                                <AvatarContainer>
                                                    <PersonIcon />
                                                </AvatarContainer>
                                            )}
                                        </TableCell>
                                        <TableCell>{account.fullName}</TableCell>
                                        <TableCell>{account.email}</TableCell>
                                        <TableCell>{account.roles.map(role => role.name).join(', ')}</TableCell>
                                        <TableCell>
                                            <Switch
                                                checked={account.status}
                                                onChange={() => handleToggleStatus(account)}
                                                color="primary"
                                                disabled={!isMaster}
                                            />
                                        </TableCell>
                                        <TableCell>{new Date(account.createdAt).toLocaleDateString('vi-VN')}</TableCell>
                                        <TableCell align="right">
                                            <ActionButton
                                                onClick={() => handleEdit(account)}
                                                disabled={!isMaster && account.roles.some(role => role.name.toLowerCase() === 'master')}
                                            >
                                                <EditIcon />
                                            </ActionButton>
                                            <ActionButton
                                                onClick={() => handleDelete(account._id)}
                                                disabled={!isMaster}
                                            >
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
            {!isLoading && getFilteredAndSortedAccounts().length > 0 && (
                <PaginationWrapper>
                    <Pagination
                        count={Math.ceil(getFilteredAndSortedAccounts().length / itemsPerPage)}
                        page={page}
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
                    Xác nhận xóa tài khoản
                </DialogTitle>
                <DialogContent style={{ padding: '8px 0 24px 0' }}>
                    <DialogContentText style={{
                        fontSize: '16px',
                        color: '#555',
                        lineHeight: '1.5'
                    }}>
                        Bạn có chắc chắn muốn xóa tài khoản này? Hành động này không thể hoàn tác.
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

export default EditAccount;
