import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { updateAccountAPI, getAccountByIdAPI } from '../../API';
import { getCurrentUser } from '../../Utils/auth';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../Styles/ToastProvider';

const Container = styled.div`
  max-width: 800px;
  margin: 30px auto 40px;
  padding: 20px;
`;

const Title = styled.h2`
  color: #1e2124;
  margin-bottom: 30px;
  text-align: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-weight: 500;
  color: #1e2124;
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;

  &:focus {
    outline: none;
    border-color: #e31837;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 20px;
`;

const Button = styled.button`
  flex: 1;
  background-color: #e31837;
  color: white;
  padding: 12px;
  border: none;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #c41730;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const CancelButton = styled(Button)`
  background-color: #6c757d;
  
  &:hover {
    background-color: #5a6268;
  }
`;

// Add new styled components
const ImagePreview = styled.img`
  width: 150px;
  height: 150px;
  object-fit: cover;
  border-radius: 50%;
  margin: 10px 0;
`;

const ImageUploadLabel = styled(Label)`
  cursor: pointer;
  color: #e31837;
  &:hover {
    text-decoration: underline;
  }
`;

const UpdateAccount = () => {
    const navigate = useNavigate();
    const user = getCurrentUser();
    const showToast = useToast();
    // Add new state for image
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>('');

    // Update formData state
    const [formData, setFormData] = useState(() => ({
        fullName: user?.fullName || '',
        email: user?.email || '',
        roles: user?.roles?.[0]?.name || '',
        createdAt: '',
        image: '',
    }));
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchAccountData = async () => {
            try {
                if (user?.id) {
                    const response = await getAccountByIdAPI(user.id);
                    if (response && response.account) {
                        const acc = response.account;
                        setFormData({
                            fullName: acc.fullName || '',
                            email: acc.email || '',
                            roles: Array.isArray(acc.roles) || '',
                            createdAt: acc.createdAt
                                ? new Date(acc.createdAt).toLocaleDateString('vi-VN')
                                : '',
                            image: acc.image || '',
                        });
                        if (acc.image) {
                            setImagePreview(acc.image);
                        }
                    }
                }
            } catch (err) {
                showToast('Không thể tải thông tin tài khoản!', 'error');
            }
        };
        fetchAccountData();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const convertToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
        });
    };

    // Add image handling function
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImage(file);
            // Create preview URL
            const previewUrl = URL.createObjectURL(file);
            setImagePreview(previewUrl);
        }
    };

    // Update handleSubmit to include image
    // Update handleSubmit function
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {

            let base64Image = null;
            if (image) {
                base64Image = await convertToBase64(image);
            }
            const submitData = {
                fullName: formData.fullName,
                email: formData.email,
                roles: formData.roles,
                image: base64Image
            };

            const response = await updateAccountAPI(user.id, submitData);

            if (response.status === "thành công") {
                showToast('Cập nhật thông tin thành công', 'success');
                navigate('/account/profile');
            } else {
                showToast(response.message, 'error');
            }
            window.location.reload();
        } catch (err: any) {
            const errorMessage = err.response?.data?.message;
            showToast(errorMessage || 'Cập nhật thất bại', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        navigate('/account/profile');
    };

    return (
        <Container>
            <Title>Cập Nhật Thông Tin Tài Khoản</Title>
            <Form onSubmit={handleSubmit}>
                <FormGroup style={{ alignItems: 'center' }}>
                    {(imagePreview || formData.image) && (
                        <ImagePreview
                            src={imagePreview || `${process.env.REACT_APP_API_URL}/${formData.image}`}
                            alt="Avatar Preview"
                        />
                    )}
                    <input
                        type="file"
                        id="image-upload"
                        accept="image/*"
                        onChange={handleImageChange}
                        style={{ display: 'none' }}
                    />
                    <ImageUploadLabel htmlFor="image-upload">
                        {imagePreview ? 'Thay đổi ảnh' : 'Tải lên ảnh đại diện'}
                    </ImageUploadLabel>
                </FormGroup>

                <FormGroup>
                    <Label>Họ và tên</Label>
                    <Input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                    />
                </FormGroup>

                <FormGroup>
                    <Label>Email</Label>
                    <Input
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </FormGroup>

                <FormGroup>
                    <Label>Ngày tạo tài khoản</Label>
                    <Input
                        type="text"
                        value={formData.createdAt}
                        onChange={handleChange}
                    />
                </FormGroup>

                <ButtonGroup>
                    <CancelButton type="button" onClick={handleCancel}>
                        Hủy
                    </CancelButton>
                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? 'Đang cập nhật...' : 'Cập nhật'}
                    </Button>
                </ButtonGroup>
            </Form>
        </Container>
    );
};

export default UpdateAccount;