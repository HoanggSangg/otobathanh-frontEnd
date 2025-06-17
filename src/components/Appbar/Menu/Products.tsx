import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import {
  Typography, CardContent, CardMedia, Button, Paper, List, ListItem, ListItemText,
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
import { useSearchParams } from 'react-router-dom';
import { Pagination } from '@mui/material';

const PageWrapper = styled.div`
    background-color: #fff;
    min-height: 100vh;
    padding: 30px 0;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
`;

const MainContainer = styled.div`
    max-width: 1300px;
    margin: 0 auto;
    padding: 20px;
    display: flex;
    gap: 16px;
    
    @media (max-width: 900px) {
      flex-direction: column;
      padding: 16px;
      gap: 24px;
    }
`;

const ProductSection = styled.section`
  padding: 0;
`;

const InfoCard = styled(Paper)`
  height: 100%;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  }
`;

const ProductImage = styled(CardMedia)`
  height: 200px;
  transition: transform 0.4s ease;
  background-size: cover !important;
  background-repeat: no-repeat !important;
  background-position: center !important;

  ${InfoCard}:hover & {
    transform: scale(1.05);
  }
`;

const SortButton = styled.button<{ $active?: boolean }>`
  padding: 12px 24px;
  border: none;
  border-radius: 30px;
  background: ${props => props.$active ? '#e31837' : '#fff'};
  color: ${props => props.$active ? '#fff' : '#333'};
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(0,0,0,0.15);
  }
`;

const HeaderSection = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    background-color: #fff;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
    padding: 12px;
    border-radius: 12px;
    
    @media (max-width: 600px) {
      flex-direction: column;
      gap: 16px;
      padding: 16px;
    }
`;

const Sidebar = styled.div`
    flex: 0 0 300px;
    background-color: #fff;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
    padding: 24px;
    border-radius: 12px;
    position: sticky;
    top: 120px;
    height: fit-content;
  
    @media (max-width: 900px) {
      flex: none;
      position: static;
      padding: 16px;
    }
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  padding: 16px;
  
  @media (max-width: 1200px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
  }
  
  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }
  
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    padding: 8px;
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
  font-size: 1rem !important;
  text-transform: lowercase;
  &::first-letter {
    text-transform: uppercase;
  }
`;

const ProductDescription = styled(Typography)`
  font-size: 0.6rem !important;
  color: #666 !important;
  margin-top: 4px !important;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  margin-top: auto;
`;

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
  const [likedStatus, setLikedStatus] = useState<Record<string, boolean>>({});

  const navigate = useNavigate();
  const user = getCurrentUser();
  const showToast = useToast();
  const productRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [searchParams] = useSearchParams();
  const [hasLoadedLikes, setHasLoadedLikes] = useState(false);

  const fetchProducts = async () => {
    try {
      const searchTerm = searchParams.get('search');
      let data;
      if (searchTerm) {
        data = await searchProductsAPI(searchTerm);
        console.log(data);
        if (data.length === 0) {
          showToast('Không tìm thấy dịch vụ phù hợp', 'info');
        }
      } else {
        data = await getAllProductsAPI();
      }

      setProducts(data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
      showToast('Không thể tải danh sách dịch vụ', 'error');
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await getAllCategoriesAPI();
      setCategories(data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      showToast('Không thể tải danh mục dịch vụ', 'error');
    }
  };

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(prev => prev === categoryId ? '' : categoryId);
    setPage(1);
  };

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

  const handleViewDetail = (productId: string) => {
    navigate(`/san-pham/${productId}`);
  };

  const handleLike = async (e: React.MouseEvent, productId: string) => {
    e.stopPropagation();

    if (!user) {
      showToast('Đăng nhập để thích dịch vụ', 'warning');
      return;
    }

    try {
      const isCurrentlyLiked = likedStatus[productId];

      if (isCurrentlyLiked) {
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
        showToast('Bạn đã xóa thích dịch vụ', 'success');
      } else {
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
        showToast('Bạn đã thích dịch vụ', 'success');
      }
    } catch (error) {
      console.error('Failed to update like:', error);
      showToast('Lỗi khi thích dịch vụ', 'error');
    }
  };

  const [page, setPage] = useState(1);
  const productsPerPage = 8;

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getFilteredAndSortedProducts = () => {
    let filtered = [...products];

    if (selectedCategory) {
      filtered = filtered.filter(product => product.category_id._id === selectedCategory);
    }

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
        </Sidebar>

        <ProductSection>
          <HeaderSection>
            <Typography variant="h4" sx={{
              color: '#ff0000',
              fontSize: { xs: '24px', md: '32px' }
            }}>
              Danh sách dịch vụ
            </Typography>
            <div style={{ display: 'flex', gap: '12px' }}>
              <SortButton
                $active={sortOption === 'newest'}
                onClick={() => setSortOption(sortOption === 'newest' ? 'default' : 'newest')}
              >
                {sortOption === 'newest' ? 'Mới nhất' : 'Mặc định'}
              </SortButton>
            </div>
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
                  <ProductDescription variant="body2" gutterBottom>
                    {product.description.substring(0, 100)}...
                  </ProductDescription>
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

          <div style={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: '20px',
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
