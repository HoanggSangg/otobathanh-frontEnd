
import { getCurrentUser } from '../../Utils/auth';
import { useToast } from '../../Styles/ToastProvider';
import styled, { keyframes } from 'styled-components';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import React, { useState, useEffect, useRef } from 'react';
import { Typography, CardContent, CardMedia, Button, Paper } from '@mui/material';
import { addToCartAPI, getCartItemsAPI, getFavoriteProductsAPI } from '../../API';
import { likeProductAPI, unlikeProductAPI, countProductLikesAPI, isProductLikedAPI } from '../../API';
import { useNavigate } from 'react-router-dom';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';

const Container = styled.div`
  max-width: 1200px;
  margin: 120px auto 40px;
  padding: 20px;
`;

const Title = styled.h2`
  color: #1e2124;
  margin-bottom: 30px;
  text-align: center;
`;

const rippleEffect = keyframes`
  0% {
    transform: scale(0);
    opacity: 1;
  }
  100% {
    transform: scale(4);
    opacity: 0;
  }
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

// Update the AddToCartButton styling
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
    animation: ${rippleEffect} 0.4s ease-out;
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
  color: #e31837 !important;
  box-shadow: 0 2px 5px rgba(0,0,0,0.2) !important;
  
  &:hover {
    background-color: #f5f5f5 !important;
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

interface Product {
  _id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  description: string;
}

interface CartItem {
  _id: string;
  quantity: number;
  product_id: {
    _id: string;
    name: string;
    price: number;
    quantity: number;
  };
}

const LikeProducts = () => {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const showToast = useToast();
  const [productLikes, setProductLikes] = useState<Record<string, number>>({});
  const [likedStatus, setLikedStatus] = useState<Record<string, boolean>>({});
  const [likedProducts, setLikedProducts] = useState<Product[]>([]);
  const productRefs = useRef<(HTMLDivElement | null)[]>([]);

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

  useEffect(() => {
    fetchFavoriteProducts();
  }, []);


  useEffect(() => {
    if (user && likedProducts.length > 0) {
      fetchLikeData();
    }
  }, [user, likedProducts]);

  const fetchLikeData = async () => {
    if (!user) return;

    try {
      // Get like counts for all products
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
            const response = await unlikeProductAPI({
                accountId: user.id,
                productId: productId
            });

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
                
                // Remove product from liked products list
                setLikedProducts(prev => prev.filter(p => p._id !== productId));
            }
        } else {
            // Like logic remains unchanged
            await likeProductAPI({
                accountId: user.id,
                productId: productId
            });

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

  const handleAddToCart = async (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    if (!user || !user.id) {
        navigate('/');
        return;
    }
    try {
        if (product.quantity < 1) {
            showToast('Sản phẩm hết hàng!', 'info');
            return;
        }

        // Get current cart items to check quantity
        const cartItems = await getCartItemsAPI(user.id);
        const existingCartItem = cartItems.find((item: CartItem) => item.product_id._id === product._id);
        const currentCartQuantity = existingCartItem ? existingCartItem.quantity : 0;

        // Check if adding one more would exceed available quantity
        if (currentCartQuantity + 1 > product.quantity) {
            showToast(`Không thể thêm vào giỏ hàng. Chỉ còn ${product.quantity} sản phẩm trong kho!`, 'info');
            return;
        }

        const cartData = {
            quantity: 1,
            product_id: product._id,
            account_id: user.id
        };

        const response = await addToCartAPI(cartData);
        if (response.message) {
            showToast(response.message, 'success');
        }
    } catch (err: any) {
        if (err.response?.status === 400) {
            showToast(err.response.data.message, 'error'); // Invalid ID
        } else if (err.response?.status === 404) {
            showToast(err.response.data.message, 'error'); // Product or account not found
        } else if (err.response?.status === 500) {
            showToast(err.response.data.message, 'error'); // Server error
        } else {
            showToast('Không thể thêm vào giỏ hàng!', 'error');
        }
        console.error('Failed to add to cart:', err);
    }
};

  const handleViewDetail = (productId: string) => {
    navigate(`/products/${productId}`);
  };

  return (
    <Container>
      <Title>Sản Phẩm Yêu Thích</Title>

      {likedProducts.length > 0 ? (
        <ProductGrid>
          {likedProducts.map((product, index) => (
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
                  <AddToCartButton
                    variant="contained"
                    startIcon={<ShoppingCartIcon />}
                    onClick={(e) => handleAddToCart(e, product)}
                  >
                    Mua ngay
                  </AddToCartButton>
                </ButtonGroup>
              </ProductContent>
            </InfoCard>
          ))}
        </ProductGrid>
      ) : (
        <EmptyMessage>
          Bạn chưa có sản phẩm yêu thích nào
        </EmptyMessage>
      )}
    </Container>
  );
};

export default LikeProducts;