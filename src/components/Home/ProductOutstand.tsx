import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { SectionTitle } from '../Styles/StylesComponents';
import { getFeaturedProductsAPI } from '../API';
import { useNavigate } from 'react-router-dom';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const ProductSection = styled.section`
  padding: 40px 0;
  background-color: #f5f5f5;
`;

const ProductContainer = styled.div`
  max-width: 1300px;
  margin: 0 auto;
  padding: 0 20px;
`;

const HorizontalScroll = styled.div`
  display: flex;
  overflow-x: auto;
  scroll-behavior: smooth;
  gap: 24px;
  padding-bottom: 10px;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const ScrollContainer = styled.div`
  position: relative;
  width: 100%;
  
  @media (min-width: 768px) {
    &::before, &::after {
      content: '';
      position: absolute;
      top: 0;
      width: 100px;
      height: 100%;
      pointer-events: none;
      z-index: 1;
    }

    &::before {
      left: 0;
      background: linear-gradient(to right, #ffffff 0%, rgba(255, 255, 255, 0) 100%);
    }

    &::after {
      right: 0;
      background: linear-gradient(to left, #ffffff 0%, rgba(255, 255, 255, 0) 100%);
    }
  }
`;

const ContactButton = styled.button`
  background: #e31837;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 10px 16px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  position: absolute;
  bottom: 10px;
  left: 16px;
  right: 16px;

  &:hover {
    background: #c41730;
  }
`;

const CardInfo = styled.div`
  padding: 18px 16px 14px 16px;
  display: flex;
  flex-direction: column;
  flex: 1;
  position: relative;
  padding-bottom: 60px;
`;

const ScrollButton = styled.button<{ $show: boolean }>`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 2;
  background: white;
  border: none;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  border-radius: 50%;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  opacity: ${props => props.$show ? 1 : 0};
  visibility: ${props => props.$show ? 'visible' : 'hidden'};
  
  &:hover {
    background: #f5f5f5;
  }
`;

const CardWrapper = styled.div`
  min-width: 260px;
  max-width: 260px;
  flex: 0 0 260px;
  border-radius: 20px;
  overflow: hidden;
  background: #fff;
  box-shadow: 0 2px 12px rgba(0,0,0,0.07);
  cursor: pointer;
  display: flex;
  flex-direction: column;
  transition: box-shadow 0.2s;
  position: relative;
  &:hover {
    box-shadow: 0 4px 24px rgba(0,0,0,0.13);
  }
`;

const CardImage = styled.div<{ src: string }>`
  width: 100%;
  height: 180px;
  background: url(${props => props.src}) center/cover no-repeat;
  border-bottom: 1px solid red;
`;

const PlaceName = styled.div`
  font-size: 1rem;
  font-weight: bold;
  margin-bottom: 8px;
  color: #222;
  text-transform: lowercase;
  &::first-letter {
    text-transform: uppercase;
  }
`;

interface Product {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  description: string;
}

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const navigate = useNavigate();
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await getFeaturedProductsAPI();
      setProducts(data);
    } catch (error) {
      console.error('Failed to fetch featured products:', error);
    }
  };

  const handleViewDetail = (productId: string) => {
    navigate(`/products/${productId}`);
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const isAtStart = container.scrollLeft === 0;
    const isAtEnd = container.scrollLeft + container.clientWidth >= container.scrollWidth - 1;

    setShowLeftButton(!isAtStart);
    setShowRightButton(!isAtEnd);
  };

  return (
    <ProductSection>
      <ProductContainer>
        <SectionTitle>DỊCH VỤ</SectionTitle>
        <ScrollContainer>
          <ScrollButton
            style={{ left: -15 }}
            $show={showLeftButton}
            onClick={() => {
              const el = document.getElementById('horizontal-scroll');
              if (el) el.scrollBy({ left: -300, behavior: 'smooth' });
            }}
          >
            <FaChevronLeft />
          </ScrollButton>
          <ScrollButton
            style={{ right: -15 }}
            $show={showRightButton}
            onClick={() => {
              const el = document.getElementById('horizontal-scroll');
              if (el) el.scrollBy({ left: 300, behavior: 'smooth' });
            }}
          >
            <FaChevronRight />
          </ScrollButton>
          <HorizontalScroll
            id="horizontal-scroll"
            onScroll={handleScroll}
          >
            {products.map((product) => (
              <CardWrapper key={product._id}>
                <CardImage src={product.image} onClick={() => handleViewDetail(product._id)} />
                <CardInfo>
                  <PlaceName>{product.name}</PlaceName>
                  <ContactButton onClick={(e) => {
                    e.stopPropagation();
                    navigate('/contact');
                  }}>
                    Liên hệ tư vấn
                  </ContactButton>
                </CardInfo>
              </CardWrapper>
            ))}
          </HorizontalScroll>
        </ScrollContainer>
      </ProductContainer>
    </ProductSection>
  );
};

export default Products;