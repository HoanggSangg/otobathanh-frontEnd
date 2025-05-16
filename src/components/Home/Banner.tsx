import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Box, IconButton } from '@mui/material';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { getAllBannersAPI } from '../API';

const BannerContainer = styled(Box)`
  position: relative;
  height: 615px;
  margin-top: 80px;
  overflow: hidden;
  width: 100%;
  z-index: 1;
  max-width: 1920px;

  @media (max-width: 1024px) {
    height: auto;
    padding: 0;
  }

  @media (max-width: 768px) {
    height: auto;
    margin-top: -10px;
    padding: 0;
  }

  @media (max-width: 480px) {
    height: auto;
    margin-top: -10px;
    padding: 0;
  }
`;

const SlideContainer = styled.div<{ $translateX: number }>`
  display: flex;
  height: 100%;
  transition: transform 0.5s ease-in-out;
  transform: translateX(${props => props.$translateX}%);
`;

const Slide = styled.div`
  flex: 0 0 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: 8px;

  @media (max-width: 768px) {
    border-radius: 6px;
  }

  @media (max-width: 480px) {
    border-radius: 4px;
  }
`;

const BannerImage = styled.img`
  width: 100%;
  height: auto;
  object-fit: cover;
  object-position: center;
  display: block;
  margin: 0;
  padding: 0;
`;

const NavigationButton = styled(IconButton)`
  position: absolute;
  top: -50%;
  transform: translateY(-50%);
  background-color: rgba(255, 255, 255, 0.3) !important;
  z-index: 999;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  
  svg {
    font-size: 20px;
    color: #333;
  }

  &:hover {
    background-color: white !important;
    svg {
      color: #e31837;
    }
  }
`;

const RightButton = styled(NavigationButton)`
  right: -91%;
  opacity: 1;
  transition: all 0.3s ease;

  @media (max-width: 1024px) {
    display: none !important;
  }
`;

const LeftButton = styled(NavigationButton)`
  left: 10px;
  opacity: 1;

  @media (max-width: 1024px) {
    display: none !important;
  }
`;

const DotContainer = styled.div`
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 10px;
  z-index: 2;

  @media (max-width: 768px) {
    bottom: 10px;
    gap: 8px;
  }
`;

const Dot = styled.div<{ $active: boolean }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${props => props.$active ? '#e31837' : 'white'};
  cursor: pointer;
  transition: background-color 0.3s;

  @media (max-width: 768px) {
    width: 8px;
    height: 8px;
  }
`;

const Banner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [banners, setBanners] = useState<Array<{ image: string }>>([]);

  // Fetch banners from API
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await getAllBannersAPI();
        setBanners(response);
      } catch (error) {
        console.error('Error fetching banners:', error);
      }
    };

    fetchBanners();
  }, []);

  const nextSlide = () => {
    setCurrentSlide(current =>
      current === banners.length - 1 ? 0 : current + 1
    );
  };

  const prevSlide = () => {
    setCurrentSlide(current =>
      current === 0 ? banners.length - 1 : current - 1
    );
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 75) {
      nextSlide(); // Swipe left
    }

    if (touchStart - touchEnd < -75) {
      prevSlide(); // Swipe right
    }
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [banners.length]); // Add dependency on banners.length

  // Don't render anything if no banners are loaded
  if (banners.length === 0) {
    return null;
  }

  return (
    <BannerContainer>
      <SlideContainer
        $translateX={-currentSlide * 100}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {banners.map((banner, index) => (
          <Slide key={index}>
            <BannerImage src={banner.image} alt={`Banner ${index + 1}`} />
          </Slide>
        ))}
      </SlideContainer>
      <LeftButton onClick={prevSlide}>
        <FaChevronLeft />
      </LeftButton>
      <RightButton onClick={nextSlide}>
        <FaChevronRight />
      </RightButton>
      <DotContainer>
        {banners.map((_, index) => (
          <Dot
            key={index}
            $active={currentSlide === index}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </DotContainer>
    </BannerContainer>
  );
};

export default Banner;