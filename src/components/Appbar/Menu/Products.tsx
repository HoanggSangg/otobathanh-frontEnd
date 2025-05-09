import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import {
  Typography, CardContent, CardMedia, Button, Paper, List, ListItem, ListItemText,
  FormControl, FormControlLabel, Checkbox, Select, MenuItem,
} from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../Styles/ToastProvider';
import {
  getAllProductsAPI, getAllCategoriesAPI,
  likeProductAPI, unlikeProductAPI, countProductLikesAPI, isProductLikedAPI,
  searchProductsAPI
} from '../../API';
import { getCurrentUser } from '../../Utils/auth';
import { SelectChangeEvent } from '@mui/material/Select';
import { useSearchParams } from 'react-router-dom';
import { Pagination } from '@mui/material';

const PageWrapper = styled.div`
    background-color: #fff;
    min-height: 100vh;
    padding-top: 80px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
`;

const MainContainer = styled.div`
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 20px;
    display: flex;
    gap: 24px;
    
    @media (max-width: 900px) {
      flex-direction: column;
    }
  `;

const ProductSection = styled.section`
  padding: 40px 0;
`;

const InfoCard = styled(Paper)`
  height: 100%;
  display: flex;
  flex-direction: column;
  transition: transform 0.3s ease;
  cursor: pointer;
  position: relative;
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  }
`;

const AddToCartButton = styled(Button)`
  background-color: #e31837 !important;
  color: white !important;
  width: 100%;
  overflow: hidden;
  position: relative;
  
  &:hover {
    background-color: #cc1630 !important;
  }

  &:active::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 20px;
    height: 20px;
    background: rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    transform: translate(-50%, -50%);
  }
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  
  @media (max-width: 1200px) {
    grid-template-columns: repeat(3, 1fr);
  }
  
  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const ProductImage = styled(CardMedia)`
  height: 200px;
  transition: transform 0.3s ease;
  background-size: contain !important;
  background-repeat: no-repeat !important;
  background-position: center !important;

  ${InfoCard}:hover & {
    transform: scale(1.04);
  }
`;

const ProductContent = styled(CardContent)`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
`;

const ProductTitle = styled(Typography)`
  font-weight: bold !important;
  margin-bottom: 8px !important;
`;

const ProductPrice = styled(Typography)`
  color: #e31837;
  font-weight: bold !important;
  margin-bottom: 16px !important;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  margin-top: auto;
`;

// Update LikeButton styling
const LikeButton = styled(Button)`
  position: absolute !important;
  top: 5px;
  left: 5px;
  min-width: 40px !important;
  width: 40px;
  height: 40px;
  padding: 0 !important;
  border-radius: 50% !important;
  background-color: white !important;
  box-shadow: 0 2px 5px rgba(0,0,0,0.2) !important;
  
  &:hover {
    background-color: '#f5f5f5'}
  }

  svg {
    color: '#666'}
  }
`;

const Sidebar = styled.div`
    flex: 0 0 280px;
    background-color: #fff;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    padding: 16px;
    border-radius: 8px;
    color: white;
    position: sticky;
    top: 100px;
    height: fit-content;
  
    @media (max-width: 900px) {
      flex: none;
      position: static;
    }
  `;

const HeaderSection = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    background-color: #fff;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    padding: 16px;
    border-radius: 8px;
  `;

interface Product {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  description: string;
  likes?: number;
  category_id: {
    _id: string;
    name: string;
  };
}

interface Category {
  _id: string;
  name: string;
}

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [productLikes, setProductLikes] = useState<Record<string, number>>({});
  const [sortOption, setSortOption] = useState('default');
  const [priceFilters, setPriceFilters] = useState({
    under500: false,
    '500to1000': false,
    '1000to2000': false,
    above2000: false,
  });
  const [likedStatus, setLikedStatus] = useState<Record<string, boolean>>({});

  const navigate = useNavigate();
  const user = getCurrentUser();
  const showToast = useToast();
  const productRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [searchParams] = useSearchParams();
  const [hasLoadedLikes, setHasLoadedLikes] = useState(false);

  const handleSortChange = (event: SelectChangeEvent<string>) => {
    setSortOption(event.target.value);
  };

  // Add missing fetchProducts function
  const fetchProducts = async () => {
    try {
      const searchTerm = searchParams.get('search');
      let data;
      if (searchTerm) {
        data = await searchProductsAPI(searchTerm);
        console.log(data);
        if (data.length === 0) {
          showToast('Không tìm thấy sản phẩm phù hợp', 'info');
        }
      } else {
        data = await getAllProductsAPI();
      }

      setProducts(data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
      showToast('Không thể tải danh sách sản phẩm', 'error');
    }
  };

  // Add this new function to fetch categories
  const fetchCategories = async () => {
    try {
      const data = await getAllCategoriesAPI();
      setCategories(data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      showToast('Không thể tải danh mục sản phẩm', 'error');
    }
  };

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(prev => prev === categoryId ? '' : categoryId);
    setPage(1);
  };

  // Separate useEffect for initial data loading
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [searchParams]);

  useEffect(() => {
    if (user && products.length > 0 && !hasLoadedLikes) {
      fetchLikeData();
      setHasLoadedLikes(true);
    }
  }, [user, products, hasLoadedLikes]);

  const fetchLikeData = async () => {
    if (!user) return;

    try {
      const likeCounts = await Promise.all(
        products.map(async (product) => {
          try {
            const count = await countProductLikesAPI(product._id);
            const isLiked = await isProductLikedAPI(user.id, product._id);
            return {
              id: product._id,
              count: Number(count),
              isLiked
            };
          } catch (error) {
            console.error(`Failed to get likes for product ${product._id}:`, error);
            return { id: product._id, count: 0, isLiked: false };
          }
        })
      );

      const likesMap = likeCounts.reduce((acc, curr) => {
        acc[curr.id] = curr.count;
        return acc;
      }, {} as Record<string, number>);

      const likedStatusMap = likeCounts.reduce((acc, curr) => {
        acc[curr.id] = curr.isLiked;
        return acc;
      }, {} as Record<string, boolean>);

      setProductLikes(likesMap);
      setLikedStatus(likedStatusMap);
    } catch (error) {
      console.error('Failed to fetch like data:', error);
      showToast('Không thể tải dữ liệu yêu thích', 'error');
    }
  };

  // Add missing handleViewDetail function
  const handleViewDetail = (productId: string) => {
    navigate(`/products/${productId}`);
  };

  const handleLike = async (e: React.MouseEvent, productId: string) => {
    e.stopPropagation();

    if (!user) {
      showToast('Đăng nhập để thích sản phẩm', 'warning');
      return;
    }

    try {
      const isCurrentlyLiked = likedStatus[productId];

      if (isCurrentlyLiked) {
        // Unlike
        await unlikeProductAPI({
          accountId: user.id,
          productId: productId
        });

        fetchLikeData();

        setLikedStatus(prev => ({
          ...prev,
          [productId]: false
        }));
        setProductLikes(prev => ({
          ...prev,
          [productId]: Math.max((prev[productId] || 1) - 1, 0)
        }));
        showToast('Bạn đã xóa thích sản phẩm', 'success');
      } else {
        // Like
        await likeProductAPI({
          accountId: user.id,
          productId: productId
        });

        fetchLikeData();

        setLikedStatus(prev => ({
          ...prev,
          [productId]: true
        }));
        setProductLikes(prev => ({
          ...prev,
          [productId]: (prev[productId] || 0) + 1
        }));
        showToast('Bạn đã thích sản phẩm', 'success');
      }
    } catch (error) {
      console.error('Failed to update like:', error);
      showToast('Lỗi khi thích sản phẩm', 'error');
    }
  };

  // Helper function for price filter labels
  const getPriceFilterLabel = (key: string) => {
    switch (key) {
      case 'under500':
        return 'Dưới 500 triệu';
      case '500to1000':
        return '500 triệu - 1 tỷ';
      case '1000to2000':
        return '1 tỷ - 2 tỷ';
      case 'above2000':
        return 'Trên 2 tỷ';
      default:
        return '';
    }
  };

  // Add this with other functions
  const handlePriceFilterChange = (filterKey: string) => {
    setPriceFilters(prev => ({
      ...prev,
      [filterKey]: !prev[filterKey as keyof typeof priceFilters]
    }));
  };

  const [page, setPage] = useState(1);
  const productsPerPage = 8;

  // Add pagination handler
  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getFilteredAndSortedProducts = () => {
    let filtered = [...products];

    if (selectedCategory) {
      filtered = filtered.filter(product => product.category_id._id === selectedCategory);
    }
    // Apply price filters
    const activePriceFilters = Object.entries(priceFilters).filter(([_, isActive]) => isActive);

    if (activePriceFilters.length > 0) {
      filtered = filtered.filter(product => {
        return (
          (priceFilters.under500 && product.price < 500000000) ||
          (priceFilters['500to1000'] && product.price >= 500000000 && product.price < 1000000000) ||
          (priceFilters['1000to2000'] && product.price >= 1000000000 && product.price < 2000000000) ||
          (priceFilters.above2000 && product.price >= 2000000000)
        );
      });
    }

    // Apply sorting
    switch (sortOption) {
      case 'priceAsc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'priceDesc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        filtered.reverse();
        break;
      default:
        break;
    }

    // Apply pagination
    const startIndex = (page - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    return filtered.slice(startIndex, endIndex);
  };

  return (
    <PageWrapper>
      <MainContainer>
        <Sidebar>
          <Typography variant="h6" sx={{ color: '#ff0000', marginBottom: 2 }}>
            Danh Mục
          </Typography>
          <List>
            {categories.map((category) => (
              <ListItem
                key={category._id}
                value={category._id}
                onClick={() => handleCategoryClick(category._id)}
                sx={{
                  color: 'black',
                  cursor: 'pointer',
                  backgroundColor: selectedCategory === category._id ? 'rgba(227, 24, 55, 0.1)' : 'transparent',
                  '&:hover': {
                    backgroundColor: selectedCategory === category._id
                      ? 'rgba(227, 24, 55, 0.1)'
                      : 'rgba(253, 248, 248, 0.1)'
                  },
                  padding: '8px 16px',
                  borderRadius: '4px'
                }}
              >
                {category.name}
                <ListItemText />
              </ListItem>
            ))}
          </List>

          <Typography variant="h6" sx={{ color: '#ff0000', marginTop: 3, marginBottom: 2 }}>
            Bộ Lọc Tìm Kiếm
          </Typography>
          <Typography variant="subtitle1" sx={{ color: 'black', marginBottom: 1 }}>
            Mức Giá
          </Typography>
          <List>
            {Object.keys(priceFilters).map((key) => (
              <ListItem key={key} sx={{ padding: '4px 0' }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={priceFilters[key as keyof typeof priceFilters]}
                      onChange={() => handlePriceFilterChange(key)}
                      sx={{
                        color: '#000',
                        '&.Mui-checked': {
                          color: '#ff0000'
                        }
                      }}
                    />
                  }
                  label={getPriceFilterLabel(key)}
                  sx={{ color: 'black' }}
                />
              </ListItem>
            ))}
          </List>
        </Sidebar>

        <ProductSection>
          <HeaderSection>
            <Typography variant="h4" sx={{
              color: '#ff0000',
              fontSize: { xs: '24px', md: '32px' }
            }}>
              Danh sách sản phẩm
            </Typography>
            <FormControl sx={{ minWidth: { xs: 150, md: 200 } }}>
              <Select
                value={sortOption}
                onChange={handleSortChange}
                sx={{
                  backgroundColor: '#fff',
                  color: 'black',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#333'
                  }
                }}
              >
                <MenuItem value="default">Mặc định</MenuItem>
                <MenuItem value="priceAsc">Giá thấp đến cao</MenuItem>
                <MenuItem value="priceDesc">Giá cao đến thấp</MenuItem>
                <MenuItem value="newest">Xe mới nhất</MenuItem>
              </Select>
            </FormControl>
          </HeaderSection>

          <ProductGrid>
            {getFilteredAndSortedProducts().map((product, index) => (
              <InfoCard
                elevation={2}
                key={product._id}
                data-id={product._id}
                ref={(el: HTMLDivElement | null) => {
                  productRefs.current[index] = el;
                }}
                onClick={() => handleViewDetail(product._id)}
              >
                <ProductImage
                  image={product.image}
                  title={product.name}
                />
                <ProductContent>
                  <ProductTitle variant="h6">
                    {product.name.substring(0, 50)}...
                  </ProductTitle>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {product.description.substring(0, 100)}...
                  </Typography>
                  <ProductPrice variant="h6">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                  </ProductPrice>
                  <Typography variant="body2" color={product.quantity > 0 ? "success.main" : "error.main"}>
                    {product.quantity > 0 ? `Còn ${product.quantity} sản phẩm` : 'Hết hàng'}
                  </Typography>
                  <ButtonGroup>
                    <LikeButton
                      onClick={(e) => handleLike(e, product._id)}
                      title={`${productLikes[product._id] || 0} likes`}
                      sx={{
                        color: likedStatus[product._id] ? '#e31837' : '#666',
                        '&:hover': {
                          backgroundColor: likedStatus[product._id] ? '#fff5f5' : '#f5f5f5'
                        }
                      }}
                    >
                      {likedStatus[product._id]
                        ? <FavoriteIcon sx={{ color: '#e31837' }} />
                        : <FavoriteBorderIcon />
                      }
                    </LikeButton>
                  </ButtonGroup>
                </ProductContent>
              </InfoCard>
            ))}
          </ProductGrid>

          {/* Add pagination */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: '40px',
            marginBottom: '20px'
          }}>
            <Pagination
              count={Math.ceil(products.length / productsPerPage)}
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
          </div>
        </ProductSection>
      </MainContainer>
    </PageWrapper>
  );
};

export default Products;
