import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { getProductByIdAPI, getAllProductsAPI, createCommentAPI, getCommentsByProductIdAPI } from '../API';
import { getCurrentUser } from '../Utils/auth';
import { useToast } from '../Styles/ToastProvider';
import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton } from '@mui/material';
import { deleteCommentAPI } from '../API';

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

const DeleteCommentButton = styled(IconButton)`
  padding: 4px;
  &:hover {
    color: #e31837;
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
  specifications: {
    label: string;
    value: string;
  }[];
  date: string;
  createdAt: string;
  updatedAt: string;
}

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
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
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

  const handleDeleteComment = async (commentId: string) => {
    try {
      const response = await deleteCommentAPI(commentId);
      if (response.message) {
        setComments(comments.filter(comment => comment._id !== commentId));
        showToast(response.message, 'success');
      }
    } catch (err: any) {
      if (err.response?.status === 404) {
        showToast(err.response.data.message, 'error');
      } else if (err.response?.status === 403) {
        showToast(err.response.data.message, 'error');
      } else if (err.response?.status === 500) {
        showToast(err.response.data.message, 'error');
      } else {
        showToast('Có lỗi khi xóa bình luận!', 'error');
      }
      console.error('Error deleting comment:', err);
    }
  };


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
    const fetchProductDetails = async () => {
      try {
        if (id) {
          const productData = await getProductByIdAPI(id);
          setProduct(productData);
          setSelectedImage(productData.image);

          const allProducts = await getAllProductsAPI();
          const filtered = allProducts
            .filter((p: Product) => 
              p._id !== id && 
              p.category_id._id === productData.category_id._id
            )
            .slice(0, 8);
          setRelatedProducts(filtered);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        navigate('/products');
      }
    };

    fetchProductDetails();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id, navigate]);

  const handleThumbnailClick = (imageUrl: string) => {
    setSelectedImage(imageUrl); // Cập nhật ảnh chính khi nhấp vào thumbnail
  };

  if (!product && id) {
    return <div>Loading...</div>;
  }

  return (
    <ProductContainer>
      {product ? (
        <>
          <ProductHeader>
            <ProductTitle>{product.name}</ProductTitle>
            <ProductPrice>
              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
            </ProductPrice>
          </ProductHeader>

          <ProductContent>
            <MainContent>
              <img src={selectedImage || product.image} alt={product.name} />
              {product.subImages && product.subImages.length > 0 && (
                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                  <img
                    src={product.image}
                    alt="Main Thumbnail"
                    onClick={() => handleThumbnailClick(product.image)}
                    style={{
                      width: '80px',
                      height: '80px',
                      objectFit: 'cover',
                      cursor: 'pointer',
                      border: selectedImage === product.image ? '2px solid #e31837' : '1px solid #ddd',
                      borderRadius: '4px',
                    }}
                  />
                  {product.subImages.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`Thumbnail ${index}`}
                      onClick={() => handleThumbnailClick(image)}
                      style={{
                        width: '80px',
                        height: '80px',
                        objectFit: 'cover',
                        cursor: 'pointer',
                        border: selectedImage === image ? '2px solid #e31837' : '1px solid #ddd',
                        borderRadius: '4px',
                      }}
                    />
                  ))}
                </div>
              )}

              <ProductDescription>{product.description}</ProductDescription>

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

              <ContactButton onClick={() => navigate('/contact')}>
                Liên hệ tư vấn
              </ContactButton>

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
                          <div>
                            <span>{new Date(comment.createdAt).toLocaleDateString('vi-VN')}</span>
                            {user?.id === comment.account._id && (
                              <DeleteCommentButton
                                onClick={() => handleDeleteComment(comment._id)}
                                size="small"
                              >
                                <DeleteIcon fontSize="small" />
                              </DeleteCommentButton>
                            )}
                          </div>
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