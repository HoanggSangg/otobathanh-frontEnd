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
  Switch,
  SelectChangeEvent
} from '@mui/material';
import {
  getAccountByIdAPI,
  updateAccountAPI,
  getAllRolesAPI,
  assignRoleToAccountAPI,
  removeRoleFromAccountAPI
} from '../../API';
import { getCurrentUser } from '../../Utils/auth';

const Container = styled.div`
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
  padding: 10px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const StyledButton = styled(Button)`
  margin-top: 20px !important;
`;

interface Role {
  _id: string;
  name: string;
}

interface Account {
  _id: string;
  fullName: string;
  email: string;
  image: string;
  roles: Role[];
  status: boolean;
}

interface CreateFormData {
  fullName: string;
  email: string;
  password: string;
  image: string;
  roles: Role[];
  status: boolean;
}

interface Props {
  onSuccess: () => void;
  editingAccount?: Account | null;
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
  const [availableRoles, setAvailableRoles] = useState<Role[]>([]);
  const [isMaster, setIsMaster] = useState(false);
  const [editingIsMaster, setEditingIsMaster] = useState(false);
  const [selectedRoleId, setSelectedRoleId] = useState<string>('');
  const showToast = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [rolesData, currentUser] = await Promise.all([
          getAllRolesAPI(),
          getCurrentUser()
        ]);

        if (Array.isArray(rolesData)) {
          setAvailableRoles(rolesData);
        }

        if (currentUser?.id) {
          const userData = await getAccountByIdAPI(currentUser.id);
          const isMasterUser = userData?.account?.roles?.some(
            (role: Role) => role.name.toLowerCase() === 'master'
          ) || false;
          setIsMaster(isMasterUser);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        showToast('Lỗi khi tải dữ liệu', 'error');
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (editingAccount) {
      const hasMasterRole = editingAccount.roles.some(role => role.name.toLowerCase() === 'master');
      setEditingIsMaster(hasMasterRole);
      setSelectedRoleId(editingAccount.roles[0]?._id || '');
    }
  }, [editingAccount]);

  const handleRoleChange = (event: SelectChangeEvent<string>) => {
    const roleId = event.target.value;
    setSelectedRoleId(roleId);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName || !formData.email || (!selectedRoleId && formData.roles.length === 0)) {
      showToast('Vui lòng điền đầy đủ thông tin!', 'error');
      return;
    }

    if (!isMaster) {
      showToast('Chỉ Master mới có quyền thay đổi tài khoản!', 'error');
      return;
    }

    if (editingAccount && editingIsMaster) {
      showToast('Không thể chỉnh sửa tài khoản Master!', 'error');
      return;
    }

    try {
      setIsLoading(true);

      if (editingAccount) {
        // Nếu chọn vai trò khác
        if (selectedRoleId && selectedRoleId !== formData.roles[0]?._id) {
          // Gỡ hết vai trò cũ
          for (const role of formData.roles) {
            await removeRoleFromAccountAPI(editingAccount._id, role._id);
          }
          // Thêm vai trò mới
          await assignRoleToAccountAPI(editingAccount._id, selectedRoleId);
        }

        // Update các thông tin khác
        const accountData = {
          fullName: formData.fullName,
          email: formData.email,
          image: formData.image,
          status: formData.status,
          roles: [] // roles cập nhật riêng ở API assign/remove, nên ở đây để trống
        };

        const response = await updateAccountAPI(editingAccount._id, accountData);

        if (response.status === 'thành công') {
          showToast(response.message, 'success');
          onSuccess();
        } else {
          showToast(response.message, 'error');
        }
      }
    } catch (error) {
      console.error('Error updating account:', error);
      showToast('Có lỗi xảy ra khi cập nhật tài khoản', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <Title>{editingAccount ? 'Chỉnh sửa tài khoản' : 'Tạo tài khoản'}</Title>
      <StyledForm onSubmit={handleUpdate}>
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

        {(!formData.roles.length || formData.roles.every(role => !role._id)) ? (
          <FormControl fullWidth>
            <Select
              value={selectedRoleId}
              onChange={handleRoleChange}
              label="Vai trò"
              disabled={!isMaster || editingIsMaster}
            >
              {availableRoles.map(role => (
                <MenuItem key={role._id} value={role._id}>
                  {role.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        ) : (
          <TextField
            fullWidth
            label="Vai trò hiện tại"
            value={formData.roles.map(role => role.name).join(', ')}
            disabled
          />
        )}

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
              setSelectedRoleId('');
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
