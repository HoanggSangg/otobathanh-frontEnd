import { getCurrentUser } from '../../Utils/auth';
import { useToast } from '../../Styles/ToastProvider';
import styled, { keyframes } from 'styled-components';
import React, { useState, useEffect, useRef } from 'react';
import { Typography, CardContent, CardMedia, Button, Paper } from '@mui/material';
import { getAllCategoriesAPI, getFavoriteProductsAPI } from '../../API';
import { likeProductAPI, unlikeProductAPI, countProductLikesAPI, isProductLikedAPI } from '../../API';
import { useNavigate } from 'react-router-dom';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { Pagination } from '@mui/material';

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

const SortButton = styled.button<{ $active: boolean }>`
  padding: 8px 16px;
  border: 2px solid #e31837;
  border-radius: 8px;
  background-color: ${props => props.$active ? '#e31837' : 'white'};
  color: ${props => props.$active ? 'white' : '#e31837'};
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s ease;

  &:hover {
    background-color: ${props => props.$active ? '#c41230' : '#fff5f5'};
  }
`;

const CategoryButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`;

const CategoryButton = styled.button<{ $active: boolean }>`
  padding: 8px 16px;
  border: 2px solid #e31837;
  border-radius: 8px;
  background-color: ${props => props.$active ? '#e31837' : 'white'};
  color: ${props => props.$active ? 'white' : '#e31837'};
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s ease;

  &:hover {
    background-color: ${props => props.$active ? '#c41230' : '#fff5f5'};
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

const ProductContent = styled(CardContent)`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
`;

const ProductTitle = styled(Typography)`
  font-weight: bold !important;
  margin-bottom: 8px !important;
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

const EmptyMessage = styled.div`
  text-align: center;
  padding: 40px;
  color: #666;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

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

interface Product {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  description: string;
  createdAt: string;
  likes?: number;
  category_id: string;
}

interface Category {
  _id: string;
  name: string;
}

const LikeProducts = () => {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const showToast = useToast();
  const [sortOption, setSortOption] = useState<'default' | 'newest'>('newest');
  const [productLikes, setProductLikes] = useState<Record<string, number>>({});
  const [likedStatus, setLikedStatus] = useState<Record<string, boolean>>({});
  const [likedProducts, setLikedProducts] = useState<Product[]>([]);
  const productRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [hasLoadedLikes, setHasLoadedLikes] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [categories, setCategories] = useState<Category[]>([]);

  const fetchFavoriteProducts = async () => {
    try {
      if (!user) {
        showToast('Vui lòng đăng nhập để xem sản phẩm yêu thích', 'warning');
        navigate('/login');
        return;
      }
      const data = await getFavoriteProductsAPI(user.id);
      setLikedProducts(data);
    } catch (error) {
      console.error('Error fetching favorite products:', error);
      showToast('Không thể tải danh sách sản phẩm yêu thích', 'error');
    }
  };

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(prev => prev === categoryId ? 'all' : categoryId);
    setCurrentPage(1);
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

  useEffect(() => {
    fetchCategories();
    fetchFavoriteProducts();
  }, []);


  useEffect(() => {
    if (user && likedProducts.length > 0 && !hasLoadedLikes) {
      fetchLikeData();
      setHasLoadedLikes(true);
    }

  }, [user, likedProducts, hasLoadedLikes]);

  const fetchLikeData = async () => {
    if (!user) return;

    try {
      const likeCounts = await Promise.all(
        likedProducts.map(async (likedProducts) => {
          try {
            const count = await countProductLikesAPI(likedProducts._id);
            const isLiked = await isProductLikedAPI(user.id, likedProducts._id);
            return {
              id: likedProducts._id,
              count: Number(count),
              isLiked
            };
          } catch (error) {
            console.error(`Failed to get likes for product ${likedProducts._id}:`, error);
            return { id: likedProducts._id, count: 0, isLiked: false };
          }
        })
      );

      const likesMap = likeCounts.reduce((acc, curr) => ({
        ...acc,
        [curr.id]: curr.count
      }), {});

      const likedStatusMap = likeCounts.reduce((acc, curr) => ({
        ...acc,
        [curr.id]: curr.isLiked
      }), {});

      setProductLikes(likesMap);
      setLikedStatus(likedStatusMap);
    } catch (error) {
      console.error('Failed to fetch like data:', error);
      showToast('Không thể tải dữ liệu yêu thích', 'error');
    }
  };

  const getSortedProducts = () => {
    let filtered = [...likedProducts];

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category_id === selectedCategory);
    }

    switch (sortOption) {
      case 'newest':
        filtered.sort((a, b) => {
          if (!a.createdAt || !b.createdAt) return 0;
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
        break;
      default:
        filtered.sort((a, b) => {
          const likesA = productLikes[a._id] || 0;
          const likesB = productLikes[b._id] || 0;
          if (likesB !== likesA) {
            return likesB - likesA;
          }
          return a.name.localeCompare(b.name);
        });
        break;
    }

    return filtered.slice(indexOfFirstProduct, indexOfLastProduct);
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
        const response = await unlikeProductAPI({
          accountId: user.id,
          productId: productId
        });

        fetchLikeData();

        if (response) {
          setLikedStatus(prev => ({
            ...prev,
            [productId]: false
          }));
          setProductLikes(prev => ({
            ...prev,
            [productId]: Math.max((prev[productId] || 1) - 1, 0)
          }));
          showToast(response, 'success');

          setLikedProducts(prev => prev.filter(p => p._id !== productId));
        }
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
        showToast('Bạn đã thích sản phẩm', 'success');
      }
    } catch (err: any) {
      if (err.response?.status === 500) {
        showToast(err.response.data.message, 'error');
      } else {
        showToast('Lỗi khi thao tác với sản phẩm', 'error');
      }
      console.error('Failed to update like:', err);
    }
  };

  const handleViewDetail = (productId: string) => {
    navigate(`/products/${productId}`);
  };

  const totalPages = Math.ceil(
    likedProducts.filter(product =>
      selectedCategory === 'all' || product.category_id === selectedCategory
    ).length / productsPerPage
  );

  return (
    <PageWrapper>
      <MainContainer>
        <HeaderSection>
          <Typography variant="h4" sx={{
            color: '#ff0000',
            fontSize: { xs: '24px', md: '32px' }
          }}>
            Sản Phẩm Yêu Thích
          </Typography>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
            <CategoryButtonGroup>
              <CategoryButton
                $active={selectedCategory === 'all'}
                onClick={() => setSelectedCategory('all')}
              >
                Tất cả
              </CategoryButton>
              {categories.map(category => (
                <CategoryButton
                  key={category._id}
                  $active={selectedCategory === category._id}
                  onClick={() => handleCategoryClick(category._id)}
                >
                  {category.name}
                </CategoryButton>
              ))}
            </CategoryButtonGroup>
            <SortButton
              $active={sortOption === 'newest'}
              onClick={() => setSortOption(sortOption === 'newest' ? 'default' : 'newest')}
            >
              {sortOption === 'newest' ? 'Mới nhất' : 'Mặc định'}
            </SortButton>
          </div>
        </HeaderSection>

        {likedProducts.length > 0 ? (
          <>
            <ProductGrid>
              {getSortedProducts().map((product, index) => (
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
            <PaginationContainer>
              <Pagination
                count={totalPages}
                page={currentPage}
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
            </PaginationContainer>
          </>
        ) : (
          <EmptyMessage>
            Bạn chưa có sản phẩm yêu thích nào
          </EmptyMessage>
        )}
      </MainContainer>
    </PageWrapper>
  );
};

export default LikeProducts;