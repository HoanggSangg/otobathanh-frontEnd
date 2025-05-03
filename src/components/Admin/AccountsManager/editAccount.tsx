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
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const Title = styled.h1`
  color: #333;
  font-size: 24px;
  margin: 0;
`;

const PaginationWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
  padding: 20px 0;
`;

const SearchInput = styled.input`
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 300px;
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: #0066cc;
  }
`;

const ActionButton = styled(IconButton)`
  padding: 6px !important;
  margin-left: 8px !important;
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

const SearchControls = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`;

const FilterSelect = styled.select`
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
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

        if (window.confirm('Bạn có chắc chắn muốn xóa tài khoản này?')) {
            try {
                const response = await deleteAccountAPI(accountId);
                console.log(response);
                if (response.status === 'thành công') {
                    setAccounts(prev => prev.filter(a => a._id !== accountId));
                    showToast(response.message, 'success');
                } else {
                    showToast(response.message, 'error');
                }
            } catch (err: any) {
                console.error('Error deleting account:', err);
                showToast('Không thể xóa tài khoản!', 'error');
            }
        }
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
        </Container>
    );
};

export default EditAccount;
