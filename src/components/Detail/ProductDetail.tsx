import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { getProductByIdAPI, addToCartAPI, getAllProductsAPI, createCommentAPI, getCommentsByProductIdAPI, getCartItemsAPI } from '../API';
import { getCurrentUser } from '../Utils/auth';
import { useToast } from '../Styles/ToastProvider';

// Styled Components for layout and design
const ProductContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const ProductHeader = styled.div`
  margin-bottom: 30px;
`;

const ProductTitle = styled.h1`
  font-size: 28px;
  color: #333;
  margin-bottom: 20px;
  line-height: 1.4;
`;

const ProductContent = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 40px;
  margin-top: 30px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const MainContent = styled.div`
  img {
    width: 100%;
    height: auto;
    max-height: 400px;
    object-fit: cover;
    border-radius: 8px;
    margin-bottom: 20px;
  }
`;

const ProductPrice = styled.div`
  color: #e31837;
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 20px;
`;

const ProductDescription = styled.p`
  color: #666;
  font-size: 16px;
  line-height: 1.8;
  margin-bottom: 20px;
`;

const SpecificationList = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 15px;
  margin-bottom: 30px;
`;

const SpecificationItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  border-bottom: 1px solid #eee;
  padding: 10px 0;
`;

const SpecLabel = styled.span`
  color: #666;
  font-weight: 500;
  min-width: 120px;
`;

const SpecValue = styled.span`
  color: #333;
`;

const ContactButton = styled.button`
  background-color: #e31837;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 12px 25px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  margin-right: 20px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #c41730;
  }
`;

const Sidebar = styled.div`
  h3 {
    color: #e31837;
    font-size: 18px;
    margin-bottom: 15px;
    text-transform: uppercase;
  }
`;

// Add these styled components after your existing styled components
const CommentSection = styled.div`
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid #eee;
`;

const CommentForm = styled.form`
  margin-bottom: 30px;
`;

const CommentInput = styled.textarea`
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 10px;
  min-height: 80px;
  font-family: inherit;
`;

const CommentButton = styled.button`
  background-color: #e31837;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 10px 20px;
  cursor: pointer;
  
  &:hover {
    background-color: #c41730;
  }
`;

const CommentList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const CommentItem = styled.div`
  background-color: #f9f9f9;
  padding: 15px;
  border-radius: 8px;
`;

const CommentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 14px;
  color: #666;
`;

// Add this styled component for related products
const RelatedProductsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;

  li {
    padding: 10px;
    border-bottom: 1px solid #eee;
    cursor: pointer;
    transition: background-color 0.2s;

    &:hover {
      background-color: #f5f5f5;
    }
  }
`;

// Interface for Product data structure
interface Product {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  description: string;
  image: string;
  specifications: {
    label: string;
    value: string;
  }[];
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

// Update the Comment interface
interface Comment {
  _id: string;
  comment: string;
  account: {
    _id: string;
    fullName: string;
  };
  product: string;
  createdAt: string;
}

const ProductPage = () => {

  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const user = getCurrentUser();
  const showToast = useToast();

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!user?.id) {
        showToast('Vui lòng đăng nhập để thêm bình luận!', 'error');
        return;
      }

      if (id && newComment.trim()) {
        const commentData = {
          productId: id,
          comment: newComment,
          accountId: user.id
        };

        const response = await createCommentAPI(commentData);
        if (response) {
          const updatedComments = await getCommentsByProductIdAPI(id);
          setComments(updatedComments);
          setNewComment('');
          showToast('Bình luận được thêm thành công!', 'success');
        }
      }
    } catch (error: any) {
      console.error('Error posting comment:', error);
      showToast('Không thể thêm bình luận. Vui lòng thử lại sau!', 'error');
    }
  };

  // Add this useEffect after your existing useEffect
  useEffect(() => {
    const fetchComments = async () => {
      try {
        if (id) {
          const commentsData = await getCommentsByProductIdAPI(id);
          setComments(commentsData);
        }
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    fetchComments();
  }, [id]);

  useEffect(() => {
    // Function to fetch product details and related products
    const fetchProductDetails = async () => {
      try {
        if (id) {
          // Fetch current product details
          const productData = await getProductByIdAPI(id);
          setProduct(productData);

          // Fetch all products and filter for related products
          const allProducts = await getAllProductsAPI();
          const filtered = allProducts
            .filter((p: Product) => p._id !== id) // Exclude current product
            .slice(0, 8); // Get only 3 related products
          setRelatedProducts(filtered);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        navigate('/products'); // Redirect to products page on error
      }
    };

    fetchProductDetails();
    // Scroll to top when loading new product
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id, navigate]); // Re-run effect when ID changes

  const handleAddToCart = async (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();

    if (!user || !user.id) {
      navigate('/');
      return;
    }

    try {
      if (product.quantity < 1) {
        showToast('Sản phẩm đã hết hàng!', 'info');
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
    } catch (error) {
      console.error('Failed to add to cart:', error);
      showToast('Không thể thêm vào của hàng!', 'error');
    }
  };

  // Show loading state while fetching data
  if (!product && id) {
    return <div>Loading...</div>;
  }

  return (
    <ProductContainer>
      {product ? (
        <>
          {/* Product Header Section */}
          <ProductHeader>
            <ProductTitle>{product.name}</ProductTitle>
            <ProductPrice>
              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
            </ProductPrice>
          </ProductHeader>

          <ProductContent>
            {/* Main Product Content */}
            <MainContent>
              {/* Product Image */}
              <img src={product.image} alt={product.name} />

              {/* Product Description */}
              <ProductDescription>{product.description}</ProductDescription>

              {/* Technical Specifications */}
              {product.specifications && product.specifications.length > 0 && (
                <SpecificationList>
                  {product.specifications.map((spec, index) => (
                    <SpecificationItem key={index}>
                      <SpecLabel>{spec.label}:</SpecLabel>
                      <SpecValue>{spec.value}</SpecValue>
                    </SpecificationItem>
                  ))}
                </SpecificationList>
              )}

              {/* Contact Button */}
              {/* <ContactButton
                onClick={(e) => handleAddToCart(e, product)}
              >
                Mua ngay
              </ContactButton> */}
              <ContactButton onClick={() => navigate('/contact')}>
                Liên hệ tư vấn
              </ContactButton>

              {/* Add Comment Section */}
              <CommentSection>
                <h3>Bình luận</h3>
                <CommentForm onSubmit={handleCommentSubmit}>
                  <CommentInput
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Viết bình luận của bạn..."
                    required
                  />
                  <CommentButton type="submit">Gửi bình luận</CommentButton>
                </CommentForm>

                <CommentList>
                  {comments && comments.length > 0 ? (
                    comments.map((comment) => (
                      <CommentItem key={comment._id}>
                        <CommentHeader>
                          <span>{comment.account?.fullName || 'Anonymous'}</span>
                          <span>{new Date(comment.createdAt).toLocaleDateString('vi-VN')}</span>
                        </CommentHeader>
                        <p>{comment.comment}</p>
                      </CommentItem>
                    ))
                  ) : (
                    <p>Chưa có bình luận nào.</p>
                  )}
                </CommentList>
              </CommentSection>
            </MainContent>

            {/* Sidebar with Related Products */}
            <Sidebar>
              <h3>Sản phẩm liên quan</h3>
              <RelatedProductsList>
                {relatedProducts.map(prod => (
                  <li key={prod._id} onClick={() => navigate(`/products/${prod._id}`)}>
                    {prod.name}
                  </li>
                ))}
              </RelatedProductsList>
            </Sidebar>
          </ProductContent>
        </>
      ) : null}
    </ProductContainer>
  );
};

export default ProductPage;