import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { getProductByIdAPI, getAllProductsAPI } from '../API';

const ThumbnailContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 15px;
  width: 100%;
  overflow-x: auto;
  padding-bottom: 10px;

  &::-webkit-scrollbar {
    height: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: #e31837;
    border-radius: 3px;
  }
`;

const MainContent = styled.div`
  position: relative;
  min-width: 0;
`;

const StyledThumbnailWrapper = styled.div`
  min-width: 100px;
  height: 80px;
  border: 2px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;

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
  display: block;
  width: 100%;
  height: auto;
  max-height: 500px;
  object-fit: contain;
  border-radius: 8px;
  background-color: #f8f8f8;

  @media (max-width: 768px) {
    max-height: 350px;
  }

  @media (max-width: 480px) {
    max-height: 250px;
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
  overflow-x: hidden;

  @media (max-width: 768px) {
    padding: 15px;
    margin-top: 10px;
    margin-bottom: 10px;
    border-radius: 0;
  }
`;

const ProductHeader = styled.div`
  margin-bottom: 30px;
`;

const ProductTitle = styled.h1`
  font-size: 28px;
  color: #333;
  margin-bottom: 20px;
  line-height: 1.4;

  @media (max-width: 768px) {
    font-size: 22px;
  }
`;

const ProductContent = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 40px;
  margin-top: 30px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 30px;
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

  @media (max-width: 480px) {
    flex-direction: column;
    gap: 4px;
  }
`;

const SpecLabel = styled.span`
  color: #666;
  font-weight: 500;
  min-width: 120px;

  @media (max-width: 480px) {
    min-width: auto;
    font-weight: 600;
  }
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

  @media (max-width: 768px) {
    width: 100%;
    margin-right: 0;
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

  @media (max-width: 900px) {
    margin-top: 30px;
    border-top: 1px solid #eee;
    padding-top: 30px;
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

const ProductPage = () => {

  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

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
        navigate('/san-pham');
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

              <ContactButton onClick={() => navigate('/lien-he')}>
                Liên hệ tư vấn
              </ContactButton>
            </MainContent>

            <Sidebar>
              <h3>Dịch vụ liên quan</h3>
              <RelatedProductsList>
                {relatedProducts.map(prod => (
                  <li key={prod._id} onClick={() => navigate(`/san-pham/${prod._id}`)}>
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