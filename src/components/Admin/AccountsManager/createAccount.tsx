import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useToast } from '../../Styles/ToastProvider';
import {
    TextField,
    Button,
    Box,
    FormControl,
    Select,
    MenuItem,
    FormControlLabel,
    Switch
} from '@mui/material';
import { getAllAccountsAPI, updateAccountAPI } from '../../API';

const Container = styled.div`
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
`;

const Title = styled.h1`
  color: #333;
  font-size: 24px;
  margin-bottom: 20px;
`;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const StyledButton = styled(Button)`
  margin-top: 20px !important;
`;

interface CreateFormData {
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

interface Props {
    onSuccess: () => void;
    editingAccount?: {
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
    } | null;
}

const CreateAccount: React.FC<Props> = ({ onSuccess, editingAccount }) => {
    const [formData, setFormData] = useState<CreateFormData>({
        fullName: editingAccount?.fullName || '',
        email: editingAccount?.email || '',
        password: '',
        image: editingAccount?.image || '',
        roles: editingAccount?.roles || [],
        status: editingAccount?.status ?? true
    });
    const [isLoading, setIsLoading] = useState(false);
    const [availableRoles, setAvailableRoles] = useState<{ _id: string; name: string; }[]>([]);
    const showToast = useToast();

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const response = await getAllAccountsAPI();
                if (response && response.length > 0 && response[0].roles) {
                    setAvailableRoles(response[0].roles);
                }
            } catch (err: any) {
                if (err.response?.status === 500) {
                    showToast(err.response.data.message, 'error');
                }
                console.error('Error fetching roles:', err);
            }
        };
        fetchRoles();
    }, []);

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleRoleChange = (e: any) => {
        const selectedRole = availableRoles.find(role => role._id === e.target.value);
        if (selectedRole) {
            setFormData(prev => ({
                ...prev,
                roles: [selectedRole]
            }));
        }
    };

    const handleStatusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            status: e.target.checked
        }));
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.fullName || !formData.email || !formData.roles) {
            showToast('Vui lòng điền đầy đủ thông tin!', 'error');
            return;
        }

        try {
            setIsLoading(true);
            if (editingAccount) {
                const accountData = {
                    ...formData,
                    status: formData.status,
                    _id: editingAccount._id
                };
                const response = await updateAccountAPI(editingAccount._id, accountData);
                
                if (response.status === "thành công") {
                    showToast(response.message, 'success');
                    onSuccess();
                } else {
                    showToast(response.message, 'error');
                }
            }
        } catch (err: any) {
            if (err.response?.status === 404) {
                showToast(err.response.data.message, 'error'); // Account not found
            } else if (err.response?.status === 500) {
                showToast(err.response.data.message, 'error'); // Server error or image upload error
            } else {
                showToast('Không thể cập nhật tài khoản. Vui lòng thử lại!', 'error');
            }
            console.error('Error updating account:', err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Container>
            <Title>{'Chỉnh sửa tài khoản'}</Title>
            <StyledForm onSubmit= {handleUpdate}>
                <TextField
                    fullWidth
                    label="Tên đăng nhập"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleFormChange}
                    required
                />
                <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleFormChange}
                    required
                />
                <FormControl fullWidth>
                    <Select
                        value={formData.roles[0]?._id || ''}
                        onChange={handleRoleChange}
                        label="Vai trò"
                    >
                        {availableRoles.map(role => (
                            <MenuItem key={role._id} value={role._id}>
                                {role.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControlLabel
                    control={
                        <Switch
                            checked={formData.status}
                            onChange={handleStatusChange}
                            name="status"
                            color="primary"
                        />
                    }
                    label={formData.status ? "Đã kích hoạt" : "Chưa kích hoạt"}
                />

                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                    <StyledButton
                        variant="outlined"
                        onClick={() => {
                            setFormData({
                                fullName: '',
                                email: '',
                                password: '',
                                image: '',
                                roles: [],
                                status: false
                            });
                        }}
                    >
                        Làm mới
                    </StyledButton>
                    <StyledButton
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Đang xử lý...' : 'Cập nhật'}
                    </StyledButton>
                </Box>
            </StyledForm>
        </Container>
    );
};

export default CreateAccount;
