import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { getProductByIdAPI, getAllProductsAPI, createCommentAPI, getCommentsByProductIdAPI } from '../API';
import { getCurrentUser } from '../Utils/auth';
import { useToast } from '../Styles/ToastProvider';
import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton } from '@mui/material';
import { deleteCommentAPI } from '../API';

const ThumbnailContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 10px;
  margin-top: 15px;
`;

const StyledThumbnailWrapper = styled.div`
  width: 100%;
  height: 80px;
  border: 2px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    transform: scale(1.05);
  }

  &[data-selected='true'] {
    border-color: #e31837;
  }
`;

const ThumbnailWrapper: React.FC<{ isSelected: boolean; onClick: () => void; children: React.ReactNode }> = ({
  isSelected,
  onClick,
  children
}) => (
  <StyledThumbnailWrapper data-selected={isSelected} onClick={onClick}>
    {children}
  </StyledThumbnailWrapper>
);

const ThumbnailImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
`;

const MainImage = styled.img`
  width: 100%;
  height: 500px;
  object-fit: contain;
  border-radius: 8px;
  background-color: #f8f8f8;
`;

const CommentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  
  span {
    color: #666;
    font-size: 14px;
  }
  
  div {
    display: flex;
    align-items: center;
    gap: 8px;
  }
`;

const ProductContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  border-radius: 12px;
  margin-top: 20px;
  margin-bottom: 20px;
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
    position: relative;
    padding-bottom: 10px;

    &:after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 60px;
      height: 2px;
      background-color: #e31837;
    }
  }
`;

const CommentSection = styled.div`
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid #eee;

  h3 {
    color: #e31837;
    font-size: 18px;
    margin-bottom: 15px;
    position: relative;
    padding-bottom: 10px;

    &:after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 60px;
      height: 2px;
      background-color: #e31837;
    }
  }
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
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-2px);
  }
`;

const RelatedProductsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;

  li {
    padding: 15px;
    border-bottom: 1px solid #eee;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    gap: 10px;

    &:hover {
      background-color: #f5f5f5;
      padding-left: 20px;
    }

    &::before {
      content: "•";
      color: #e31837;
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
      if (!user?.id) {
        showToast('Vui lòng đăng nhập để xóa bình luận!', 'error');
        return;
      }

      const response = await deleteCommentAPI(commentId, user.id);
      if (response.message) {
        setComments(comments.filter(comment => comment._id !== commentId));
        showToast(response.message, 'success');
      }
    } catch (err: any) {
      if (err.response?.status === 404) {
        showToast('Bình luận không tồn tại.', 'error');
      } else if (err.response?.status === 403) {
        showToast('Bạn không có quyền xóa bình luận này.', 'error');
      } else {
        showToast('Lỗi khi xóa bình luận.', 'error');
        console.error('Error deleting comment:', err);
      }
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
    setSelectedImage(imageUrl);
  };

  return (
    <ProductContainer>
      {product ? (
        <>
          <ProductHeader>
            <ProductTitle>{product.name}</ProductTitle>
          </ProductHeader>

          <ProductContent>
            <MainContent>
              <MainImage src={selectedImage || product.image} alt={product.name} />

              {product.subImages && product.subImages.length > 0 && (
                <ThumbnailContainer>
                  <ThumbnailWrapper
                    isSelected={selectedImage === product.image}
                    onClick={() => handleThumbnailClick(product.image)}
                  >
                    <ThumbnailImage src={product.image} alt="Main Thumbnail" />
                  </ThumbnailWrapper>
                  {product.subImages.map((image, index) => (
                    <ThumbnailWrapper key={index} isSelected={selectedImage === image} onClick={() => handleThumbnailClick(image)}>
                      <ThumbnailImage src={image} alt={`Thumbnail ${index}`} />
                    </ThumbnailWrapper>
                  ))}
                </ThumbnailContainer>
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
              <h3>Dịch vụ liên quan</h3>
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