import React, { useState, useEffect } from 'react';
import { useToast } from '../../Styles/ToastProvider';
import styled from 'styled-components';
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
import { getAllAccountsAPI, deleteAccountAPI } from '../../API';

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

interface EditFormData {
    fullName: string;
    email: string;
    password: string;
    image: string;
    roles: {
        _id: string;
        name: string;
    }[];
    status: boolean;
}

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
}

const EditAccount: React.FC<Props> = ({ onEdit }) => {
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [searchType, setSearchType] = useState('fullName');
    const [sortBy, setSortBy] = useState<'name' | 'date'>('date');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const showToast = useToast();
    const [formData, setFormData] = useState<EditFormData>({
        fullName: '',
        email: '',
        password: '',
        image: '',
        roles: [],
        status: true
    });

    useEffect(() => {
        if (selectedAccount) {
            setFormData({
                fullName: selectedAccount.fullName,
                email: selectedAccount.email,
                password: '',
                image: selectedAccount.image,
                roles: selectedAccount.roles,
                status: selectedAccount.status
            });
        }

        fetchAccounts();
    }, [selectedAccount]);

    const fetchAccounts = async () => {
        try {
            setIsLoading(true);
            const response = await getAllAccountsAPI();
            
            if (Array.isArray(response)) {
                setAccounts(response);
            } else if (response.status === "thất bại") {
                showToast(response.message, 'error');
            } else {
                showToast('Dữ liệu không hợp lệ!', 'error');
            }
        } catch (err: any) {
            if (err.response?.status === 500) {
                showToast(err.response.data.message, 'error');
            } else {
                showToast('Không thể tải danh sách tài khoản!', 'error');
            }
            console.error('Error fetching accounts:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleEdit = (account: Account) => {
        onEdit(account);
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
                        return account.roles.some(role =>
                            role.name.toLowerCase().includes(searchLower)
                        );
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

    const handleDelete = async (accountId: string) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa tài khoản này?')) {
            try {
                const response = await deleteAccountAPI(accountId);
                
                if (response.status === "thành công") {
                    setAccounts(accounts.filter(a => a._id !== accountId));
                    showToast(response.message, 'success');
                } else {
                    showToast(response.message, 'error');
                }
            } catch (err: any) {
                if (err.response?.status === 404) {
                    showToast(err.response.data.message, 'error'); // Account not found
                } else if (err.response?.status === 500) {
                    showToast(err.response.data.message, 'error'); // Server error
                } else {
                    showToast('Không thể xóa tài khoản!', 'error');
                }
                console.error('Error deleting account:', err);
            }
        }
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
                        placeholder={`Tìm kiếm theo ${searchType === 'fullName' ? 'tên' :
                                searchType === 'email' ? 'email' : 'vai trò'
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
                                    <TableCell colSpan={6} align="center">Đang tải...</TableCell>
                                </TableRow>
                            ) : getFilteredAndSortedAccounts().length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} align="center">Không tìm thấy tài khoản nào</TableCell>
                                </TableRow>
                            ) : (
                                getFilteredAndSortedAccounts().map((account) => (
                                    <TableRow key={account._id}>
                                        <TableCell>{account.fullName}</TableCell>
                                        <TableCell>{account.email}</TableCell>
                                        <TableCell>{account.roles.map(role => role.name).join(', ')}</TableCell>
                                        <TableCell>{account.status ? 'Kích hoạt' : 'Không kích hoạt'}</TableCell>
                                        <TableCell>
                                            {new Date(account.createdAt).toLocaleDateString('vi-VN')}
                                        </TableCell>
                                        <TableCell align="right">
                                            <ActionButton onClick={() => handleEdit(account)} color="primary">
                                                <EditIcon />
                                            </ActionButton>
                                            <ActionButton onClick={() => handleDelete(account._id)} color="error">
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
        </Container>
    );
};

export default EditAccount;
