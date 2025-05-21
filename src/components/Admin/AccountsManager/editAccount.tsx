import React, { useState, useEffect } from 'react';
import {
    getAllAccountsAPI,
    deleteAccountAPI,
    disableAccountAPI,
    enableAccountAPI,
    countAccountsAPI
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
import { removeRoleFromAccountAPI } from '../../API';
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
import GroupIcon from '@mui/icons-material/Group';

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
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  gap: 20px;
  flex-wrap: wrap;
  
  @media (max-width: 1024px) {
    flex-direction: column;
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

const FilterSelect = styled.select`
  padding: 12px;
  border: 2px solid #eee;
  border-radius: 30px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
  background-color: white;
  min-width: 190px;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  background-size: 1em;

  &:focus {
    outline: none;
    border-color: #e31837;
    box-shadow: 0 4px 15px rgba(227, 24, 55, 0.1);
  }

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 15px rgba(0,0,0,0.15);
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const SearchControls = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    flex-direction: column;
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
    const [statusConfirmOpen, setStatusConfirmOpen] = useState(false);
    const [accountToToggle, setAccountToToggle] = useState<Account | null>(null);
    const [totalAccounts, setTotalAccounts] = useState<number | null>(null);
    const [removeRolesConfirmOpen, setRemoveRolesConfirmOpen] = useState(false);
    const [accountToRemoveRoles, setAccountToRemoveRoles] = useState<Account | null>(null);

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

    const fetchAccountCount = async () => {
        try {
            const response = await countAccountsAPI();
            if (response.totalAccounts !== undefined) {
                setTotalAccounts(response.totalAccounts);
            }
        } catch (error) {
            console.error('Lỗi khi lấy số lượng tài khoản:', error);
        }
    };

    useEffect(() => {
        fetchAccounts();
        fetchAccountCount();

        const checkMasterRole = async () => {
            const isMasterUser = await checkIsMasterRole();
            setIsMaster(isMasterUser);
        };
        checkMasterRole();

        const loadingTimer = setTimeout(() => {
            setIsLoading(false);
        }, 2000);

        return () => clearTimeout(loadingTimer);
    }, []);

    const handleRemoveAllRoles = async (account: Account) => {
        if (!isMaster) {
            showToast('Chỉ Master mới có quyền xóa vai trò', 'error');
            return;
        }

        if (account.roles.some(role => role.name.toLowerCase() === 'master')) {
            showToast('Không thể xóa vai trò của tài khoản Master', 'error');
            return;
        }

        setAccountToRemoveRoles(account);
        setRemoveRolesConfirmOpen(true);
    };

    const confirmRemoveAllRoles = async () => {
        if (accountToRemoveRoles) {
            try {
                const removePromises = accountToRemoveRoles.roles.map(role =>
                    removeRoleFromAccountAPI(accountToRemoveRoles._id, role._id)
                );

                await Promise.all(removePromises);

                showToast('Đã xóa tất cả vai trò thành công', 'success');

                setAccounts(prev =>
                    prev.map(a =>
                        a._id === accountToRemoveRoles._id ? { ...a, roles: [] } : a
                    )
                );

                await fetchAccounts();
            } catch (error) {
                console.error('Error removing all roles:', error);
                showToast('Không thể xóa vai trò!', 'error');
            }
        }
        setRemoveRolesConfirmOpen(false);
        setAccountToRemoveRoles(null);
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

            setAccountToToggle(account);
            setStatusConfirmOpen(true);
        } catch (err: any) {
            console.error('Error toggling account status:', err);
            showToast('Không thể thay đổi trạng thái tài khoản!', 'error');
        }
    };

    const confirmToggleStatus = async () => {
        if (accountToToggle) {
            try {
                const apiCall = accountToToggle.status ? disableAccountAPI : enableAccountAPI;
                const response = await apiCall(accountToToggle._id);
                showToast(response.message, 'success');

                setAccounts(prev =>
                    prev.map(a =>
                        a._id === accountToToggle._id ? { ...a, status: !accountToToggle.status } : a
                    )
                );
            } catch (err: any) {
                console.error('Error toggling account status:', err);
                showToast('Không thể thay đổi trạng thái tài khoản!', 'error');
            }
        }
        setStatusConfirmOpen(false);
        setAccountToToggle(null);
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
            <Header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
                <Title style={{ marginRight: '16px' }}>Quản lý tài khoản</Title>

                {totalAccounts !== null && (
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        background: '#f5f5f5',
                        padding: '6px 12px',
                        borderRadius: '8px',
                        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                    }}>
                        <GroupIcon style={{ color: '#1976d2' }} />
                        <span style={{ fontWeight: 'bold', color: '#333', fontSize: '16px' }}>
                            {totalAccounts} người dùng
                        </span>
                    </div>
                )}

                <SearchControls style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
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
                        placeholder={`Tìm kiếm theo ${searchType === 'fullName'
                            ? 'tên'
                            : searchType === 'email'
                                ? 'email'
                                : 'vai trò'
                            }...`}
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
                            <TableRow
                                sx={{
                                    '& .MuiTableCell-head': {
                                        backgroundColor: '#f1f3f5',
                                        color: '#212529',
                                        fontWeight: 600,
                                        fontSize: '0.9rem',
                                        padding: '14px 18px',
                                        borderBottom: '2px solid #ced4da',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.4px',
                                        fontFamily: `'Roboto', 'Helvetica', 'Arial', sans-serif`,
                                        whiteSpace: 'nowrap',
                                        transition: 'background-color 0.3s ease',
                                        '&:hover': {
                                            backgroundColor: '#e9ecef'
                                        },
                                        '@media (max-width: 768px)': {
                                            display: 'none'
                                        }
                                    }
                                }}
                            >
                                <TableCell>Hình ảnh</TableCell>
                                <TableCell>Họ và tên</TableCell>
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
                                            <StyledButton
                                                onClick={() => handleRemoveAllRoles(account)}
                                                disabled={!isMaster || account.roles.length === 0}
                                                variant="outlined"
                                                size="small"
                                                style={{ marginLeft: '8px' }}
                                            >
                                                Xóa vai trò
                                            </StyledButton>
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
                    Xác nhận xóa tài khoản
                </DialogTitle>
                <DialogContent style={{
                    padding: window.innerWidth <= 768 ? '8px 0 16px 0' : '8px 0 24px 0'
                }}>
                    <DialogContentText style={{
                        fontSize: window.innerWidth <= 768 ? '14px' : '16px',
                        color: '#555',
                        lineHeight: '1.5'
                    }}>
                        Bạn có chắc chắn muốn xóa tài khoản này? Hành động này không thể hoàn tác.
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

            <Dialog
                open={statusConfirmOpen}
                onClose={() => setStatusConfirmOpen(false)}
                PaperProps={{
                    style: {
                        backgroundColor: '#fff',
                        borderRadius: '12px',
                        padding: '24px',
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
                    Xác nhận thay đổi trạng thái
                </DialogTitle>
                <DialogContent style={{
                    padding: window.innerWidth <= 768 ? '8px 0 16px 0' : '8px 0 24px 0'
                }}>
                    <DialogContentText style={{
                        fontSize: window.innerWidth <= 768 ? '14px' : '16px',
                        color: '#555',
                        lineHeight: '1.5'
                    }}>
                        Bạn có chắc chắn muốn {accountToToggle?.status ? 'khóa' : 'mở khóa'} tài khoản này?
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
                        onClick={() => setStatusConfirmOpen(false)}
                        fullWidth={window.innerWidth <= 768}
                    >
                        Hủy
                    </StyledButton>
                    <StyledButton
                        variant="contained"
                        color="error"
                        onClick={confirmToggleStatus}
                        fullWidth={window.innerWidth <= 768}
                    >
                        Xác nhận
                    </StyledButton>
                </DialogActions>
            </Dialog>

            <Dialog
                open={removeRolesConfirmOpen}
                onClose={() => setRemoveRolesConfirmOpen(false)}
                PaperProps={{
                    style: {
                        backgroundColor: '#fff',
                        borderRadius: '12px',
                        padding: '24px',
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
                    Xác nhận xóa tất cả vai trò
                </DialogTitle>
                <DialogContent style={{
                    padding: window.innerWidth <= 768 ? '8px 0 16px 0' : '8px 0 24px 0'
                }}>
                    <DialogContentText style={{
                        fontSize: window.innerWidth <= 768 ? '14px' : '16px',
                        color: '#555',
                        lineHeight: '1.5'
                    }}>
                        Bạn có chắc chắn muốn xóa tất cả vai trò của tài khoản này?
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
                        onClick={() => setRemoveRolesConfirmOpen(false)}
                        fullWidth={window.innerWidth <= 768}
                    >
                        Hủy
                    </StyledButton>
                    <StyledButton
                        variant="contained"
                        color="error"
                        onClick={confirmRemoveAllRoles}
                        fullWidth={window.innerWidth <= 768}
                    >
                        Xác nhận
                    </StyledButton>
                </DialogActions>
            </Dialog>

        </Container>
    );
};

export default EditAccount;
