import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { useToast } from '../Styles/ToastProvider';
import { Typography, CardContent, CardMedia, Button, Paper } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { SectionTitle } from '../Styles/StylesComponents';
import { getAllProductsAPI, addToCartAPI, getCartItemsAPI } from '../API';
import { likeProductAPI, unlikeProductAPI, countProductLikesAPI, isProductLikedAPI } from '../API';
import { useNavigate } from 'react-router-dom';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { getCurrentUser } from '../Utils/auth';

const ProductSection = styled.section`
  padding: 40px 0;
  background-color: #f5f5f5;
`;

const ProductContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
`;

// Define the fade-in-up animation
const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

// Update InfoCard to include the animation
const InfoCard = styled(Paper) <{ isVisible: boolean }>`
  height: 100%;
  display: flex;
  flex-direction: column;
  transition: transform 0.3s ease;
  cursor: pointer;
  position: relative;
  animation: ${({ isVisible }) => (isVisible ? fadeInUp : 'none')} 0.8s ease both;

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

// Add quantity to the product interface at the top
interface Product {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
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

const Products = () => {
  // Update useState type
  const [products, setProducts] = useState<Product[]>([]);
  const [productLikes, setProductLikes] = useState<Record<string, number>>({});
  const [likedStatus, setLikedStatus] = useState<Record<string, boolean>>({});
  const navigate = useNavigate();
  const user = getCurrentUser();
  const showToast = useToast();
  const [visibleProducts, setVisibleProducts] = useState<Record<string, boolean>>({});
  const productRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const productId = entry.target.getAttribute('data-id');
          if (productId) {
            if (entry.isIntersecting) {
              // Khi sản phẩm vào vùng hiển thị
              setVisibleProducts((prev) => ({
                ...prev,
                [productId]: true,
              }));
            } else {
              // Khi sản phẩm rời khỏi vùng hiển thị
              setVisibleProducts((prev) => ({
                ...prev,
                [productId]: false,
              }));
            }
          }
        });
      },
      { threshold: 0.1 } // Trigger khi 10% của phần tử hiển thị
    );

    productRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      productRefs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, [products, visibleProducts]);

  useEffect(() => {
    if (user && products.length > 0) {
      fetchLikeData();
    }
  }, [user, products]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await getAllProductsAPI();
      setProducts(data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    }
  };

  const fetchLikeData = async () => {
    if (!user) return;

    try {
      // Get like counts for all products
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
        await unlikeProductAPI({
          accountId: user.id,
          productId: productId
        });

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

  const handleViewDetail = (productId: string) => {
    navigate(`/products/${productId}`);
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

      await addToCartAPI(cartData);
      showToast('Thêm vào giỏ hàng thành công', 'success');
    } catch (error) {
      console.error('Failed to add to cart:', error);
      showToast('Không thể thêm vào giỏ hàng!', 'error');
    }
  };

  // In the render section, add quantity display
  return (
    <ProductSection>
      <ProductContainer>
        <SectionTitle>SẢN PHẨM NỔI BẬT</SectionTitle>
        <ProductGrid>
          {products.map((product, index) => (
            <InfoCard
              elevation={2}
              key={product._id}
              isVisible={!!visibleProducts[product._id]}
              data-id={product._id}
              ref={(el) => {
                productRefs.current[index] = el as HTMLDivElement;
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
      </ProductContainer>
    </ProductSection>
  );
};

export default Products;