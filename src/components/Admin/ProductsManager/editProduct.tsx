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
import { getAllProductsAPI, deleteProductAPI } from '../../API';

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

const ImageCell = styled.img`
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 4px;
`;

interface EditFormData {
    name: string;
    price: string;
    quantity: string;
    category_id: {
        _id: string;
        name: string;
    };
    description: string;
}

interface Product {
    _id: string;
    name: string;
    price: number;
    quantity: number;
    category_id: {
        _id: string;
        name: string;
    };
    description: string;
    image: string;
    subImages: string[];
    date: string;
    createdAt: string;
    updatedAt: string;
}

interface Props {
  onEdit: (product: Product) => void;
}

const EditProduct: React.FC<Props> = ({ onEdit }) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const showToast = useToast();
    const [formData, setFormData] = useState<EditFormData>({
        name: '',
        price: '',
        quantity: '',
        category_id: {
            _id: '',
            name: ''
        },
        description: ''
    });

    useEffect(() => {
        fetchProducts();
        if (selectedProduct) {
            setFormData({
                name: selectedProduct.name,
                price: selectedProduct.price.toString(),
                quantity: selectedProduct.quantity.toString(),
                category_id: selectedProduct.category_id,
                description: selectedProduct.description
            });
        }
    }, [selectedProduct]);

    const fetchProducts = async () => {
        try {
            setIsLoading(true);
            const response = await getAllProductsAPI();
            if (Array.isArray(response)) {
                setProducts(response);
            } else {
                showToast('Dữ liệu không hợp lệ!', 'error');
            }
        } catch (err) {
            showToast('Không thể tải danh sách sản phẩm!', 'error');
            console.error('Error fetching products:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    const handleEdit = (product: Product) => {
        onEdit(product);
    };

    const handleDelete = async (productId: string) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
            try {
                const response = await deleteProductAPI(productId);
                if (response.message) {
                    setProducts(products.filter(p => p._id !== productId));
                    showToast(response.message, 'success');
                }
            } catch (err: any) {
                if (err.response?.status === 404) {
                    showToast(err.response.data.message, 'error'); // Product not found
                } else if (err.response?.status === 500) {
                    showToast(err.response.data.message, 'error'); // Server error
                } else {
                    showToast('Không thể xóa sản phẩm!', 'error');
                }
                console.error('Error deleting product:', err);
            }
        }
    };

    // Add these new states after existing useState declarations
    const [priceRange, setPriceRange] = useState({ min: '', max: '' });
    
    // Update the filteredProducts logic
    const filteredProducts = products.filter(product => {
        const nameMatch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
        const categoryMatch = product.category_id.name.toLowerCase().includes(searchTerm.toLowerCase());
        const descriptionMatch = product.description.toLowerCase().includes(searchTerm.toLowerCase());
        
        // Price range filter
        const priceInRange = (!priceRange.min || product.price >= Number(priceRange.min)) &&
                            (!priceRange.max || product.price <= Number(priceRange.max));
    
        return (nameMatch || categoryMatch || descriptionMatch) && priceInRange;
    });
    
    // Add this in the return statement after the existing SearchInput
    return (
        <Container>
            <Header>
                <Title>Quản lý sản phẩm</Title>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <SearchInput
                        type="text"
                        placeholder="Tìm kiếm theo tên, danh mục, mô tả..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <input
                            type="number"
                            placeholder="Giá từ"
                            value={priceRange.min}
                            onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                            style={{ width: '100px', padding: '8px' }}
                        />
                        <span>-</span>
                        <input
                            type="number"
                            placeholder="Giá đến"
                            value={priceRange.max}
                            onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                            style={{ width: '100px', padding: '8px' }}
                        />
                    </div>
                </div>
            </Header>

            <StyledTableContainer>
                <StyledPaper>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Hình ảnh</TableCell>
                                <TableCell>Tên sản phẩm</TableCell>
                                <TableCell>Giá</TableCell>
                                <TableCell>Số lượng</TableCell>
                                <TableCell>Danh mục</TableCell>
                                <TableCell>Mô tả</TableCell>
                                <TableCell>Ngày tạo</TableCell>
                                <TableCell align="right">Thao tác</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={7} align="center">Đang tải...</TableCell>
                                </TableRow>
                            ) : filteredProducts.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} align="center">Không tìm thấy sản phẩm nào</TableCell>
                                </TableRow>
                            ) : (
                                filteredProducts.map((product) => (
                                    <TableRow key={product._id}>
                                        <TableCell>
                                            <ImageCell src={product.image || '/placeholder-image.jpg'} alt={product.name} />
                                        </TableCell>
                                        <TableCell>{product.name}</TableCell>
                                        <TableCell>{formatPrice(product.price)}</TableCell>
                                        <TableCell>{product.quantity}</TableCell>
                                        <TableCell>{product.category_id.name}</TableCell>
                                        <TableCell>
                                            {product.description ? (
                                                <span title={product.description}>
                                                    {product.description.length > 50
                                                        ? `${product.description.substring(0, 50)}...`
                                                        : product.description}
                                                </span>
                                            ) : (
                                                <span style={{ color: '#999' }}>Không có mô tả</span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {new Date(product.createdAt).toLocaleDateString('vi-VN')}
                                        </TableCell>
                                        <TableCell align="right">
                                            <ActionButton onClick={() => handleEdit(product)} color="primary">
                                                <EditIcon />
                                            </ActionButton>
                                            <ActionButton onClick={() => handleDelete(product._id)} color="error">
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

export default EditProduct;
