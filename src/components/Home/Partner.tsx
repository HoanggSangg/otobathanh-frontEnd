import React, { useState } from 'react';
import styled from 'styled-components';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const PartnerSection = styled.section`
  background: #f8f9fa;
  padding: 20px 0;
  text-align: center;
`;

const Title = styled.h2`
  text-align: center;
  font-size: 32px;
  color: #e31837;
  margin-bottom: 50px;
  font-weight: 700;
  text-transform: uppercase;
  font-family: 'Roboto', sans-serif;
  position: relative;
  padding-bottom: 20px;

  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 4px;
    background: linear-gradient(90deg, #e31837 0%, #ff4d6d 100%);
    border-radius: 2px;
  }
`;

const ScrollContainer = styled.div`
  position: relative;
  width: 100%;
  padding: 0 20px;
  
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
    background: linear-gradient(to right, #f8f9fa 0%, rgba(248, 249, 250, 0) 100%);
  }

  &::after {
    right: 0;
    background: linear-gradient(to left, #f8f9fa 0%, rgba(248, 249, 250, 0) 100%);
  }
`;

const HorizontalScroll = styled.div`
  display: flex;
  gap: 24px;
  padding: 10px 0;
  overflow-x: auto;
  scroll-behavior: smooth;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const LogoBox = styled.div`
  min-width: 180px;
  flex: 0 0 calc(16.666% - 20px); // Show 6 items
  background: white;
  border-radius: 15px;
  padding: 25px;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, #e31837 0%, #ff4d6d 100%);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);

    &::before {
      opacity: 1;
    }
  }

  img {
    max-width: 80%;
    max-height: 80%;
    object-fit: contain;
    filter: grayscale(100%);
    transition: filter 0.3s ease;
  }

  &:hover img {
    filter: grayscale(0%);
  }
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

const Partner = () => {
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(true);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const isAtStart = container.scrollLeft === 0;
    const isAtEnd = container.scrollLeft + container.clientWidth >= container.scrollWidth - 1;

    setShowLeftButton(!isAtStart);
    setShowRightButton(!isAtEnd);
  };

  const partners = [
    { name: 'Mercedes-Benz', logo: 'https://www.carlogos.org/car-logos/mercedes-benz-logo.png' },
    { name: 'BMW', logo: 'https://www.carlogos.org/car-logos/bmw-logo.png' },
    { name: 'Audi', logo: 'https://www.carlogos.org/car-logos/audi-logo.png' },
    { name: 'Lexus', logo: 'https://www.carlogos.org/car-logos/lexus-logo.png' },
    { name: 'Porsche', logo: 'https://www.carlogos.org/car-logos/porsche-logo.png' },
    { name: 'Rolls-Royce', logo: 'https://www.carlogos.org/car-logos/ferrari-logo.png' },
    { name: 'Toyota', logo: 'https://www.carlogos.org/car-logos/toyota-logo.png' },
    { name: 'Honda', logo: 'https://www.carlogos.org/car-logos/honda-logo.png' },
    { name: 'Mazda', logo: 'https://www.carlogos.org/car-logos/mazda-logo.png' },
    { name: 'Volkswagen', logo: 'https://www.carlogos.org/car-logos/volkswagen-logo.png' },
    { name: 'Hyundai', logo: 'https://www.carlogos.org/car-logos/hyundai-logo.png' },
    { name: 'Kia', logo: 'https://www.carlogos.org/car-logos/kia-logo.png' },
    { name: 'Subaru', logo: 'https://www.carlogos.org/car-logos/subaru-logo.png' },
    { name: 'Land Rover', logo: 'https://www.carlogos.org/car-logos/land-rover-logo.png' }
  ];

  return (
    <PartnerSection>
      <Title>THƯƠNG HIỆU ĐỐI TÁC</Title>
      <ScrollContainer>
        <ScrollButton
          style={{ left: 5 }}
          $show={showLeftButton}
          onClick={() => {
            const el = document.getElementById('partner-scroll');
            if (el) el.scrollBy({ left: -300, behavior: 'smooth' });
          }}
        >
          <FaChevronLeft />
        </ScrollButton>
        <ScrollButton
          style={{ right: 5 }}
          $show={showRightButton}
          onClick={() => {
            const el = document.getElementById('partner-scroll');
            if (el) el.scrollBy({ left: 300, behavior: 'smooth' });
          }}
        >
          <FaChevronRight />
        </ScrollButton>
        <HorizontalScroll
          id="partner-scroll"
          onScroll={handleScroll}
        >
          {partners.map((partner, index) => (
            <LogoBox key={index}>
              <img src={partner.logo} alt={partner.name} />
            </LogoBox>
          ))}
        </HorizontalScroll>
      </ScrollContainer>
    </PartnerSection>
  );
};

export default Partner;