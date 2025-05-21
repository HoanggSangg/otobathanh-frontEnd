import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { updateAccountAPI, getAccountByIdAPI } from '../../API';
import { getCurrentUser } from '../../Utils/auth';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../Styles/ToastProvider';

const Container = styled.div`
  max-width: 1200px;
  margin: 40px auto;
  padding: 40px;
  background: linear-gradient(145deg, #ffffff, #f5f5f5);
  border-radius: 20px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  color: #1e2124;
  margin-bottom: 40px;
  text-align: center;
  font-size: 2.2rem;
  font-weight: 700;
  position: relative;
  
  &:after {
    content: '';
    position: absolute;
    bottom: -15px;
    left: 50%;
    transform: translateX(-50%);
    width: 120px;
    height: 4px;
    background: linear-gradient(90deg, #e31837, #ff4d6d);
    border-radius: 2px;
  }
`;

const Form = styled.form`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 25px;
  padding: 40px;
  border-radius: 16px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  
  &[data-fullwidth="true"] {
    grid-column: 1 / -1;
    align-items: center;
  }
`;

const Label = styled.label`
  font-weight: 600;
  color: #1e2124;
  font-size: 1rem;
`;

const Input = styled.input`
  padding: 14px 18px;
  border: 2px solid #ddd;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #e31837;
    box-shadow: 0 0 0 3px rgba(227, 24, 55, 0.1);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 15px;
  grid-column: 1 / -1;
  margin-top: 10px;
`;

const Button = styled.button`
  flex: 1;
  background: linear-gradient(135deg, #e31837, #c41730);
  color: white;
  padding: 16px;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(227, 24, 55, 0.2);
  }

  &:disabled {
    background: #ccc;
    transform: none;
    box-shadow: none;
  }
`;

const CancelButton = styled(Button)`
  background: linear-gradient(135deg, #6c757d, #495057);
  
  &:hover {
    background: linear-gradient(135deg, #5a6268, #343a40);
  }
`;

const ImagePreview = styled.img`
  width: 180px;
  height: 180px;
  object-fit: cover;
  border-radius: 50%;
  border: 5px solid #fff;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  
  &:hover {
    transform: scale(1.05);
  }
`;

const ImageUploadLabel = styled(Label)`
  cursor: pointer;
  color: #e31837;
  padding: 10px 20px;
  border: 2px solid #e31837;
  border-radius: 8px;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(227, 24, 55, 0.1);
    transform: translateY(-2px);
  }
`;

const UpdateAccount = () => {
    const navigate = useNavigate();
    const user = getCurrentUser();
    const showToast = useToast();
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>('');

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


    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImage(file);

            const previewUrl = URL.createObjectURL(file);
            setImagePreview(previewUrl);
        }
    };

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
                <FormGroup data-fullwidth="true">
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