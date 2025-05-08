import React from 'react';
import styled from 'styled-components';

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

const LogoContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 40px;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
`;

const LogoBox = styled.div`
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

const Partner = () => {
  const partners = [
    { name: 'Mercedes-Benz', logo: 'https://www.carlogos.org/car-logos/mercedes-benz-logo.png' },
    { name: 'BMW', logo: 'https://www.carlogos.org/car-logos/bmw-logo.png' },
    { name: 'Audi', logo: 'https://www.carlogos.org/car-logos/audi-logo.png' },
    { name: 'Lexus', logo: 'https://www.carlogos.org/car-logos/lexus-logo.png' },
    { name: 'Porsche', logo: 'https://www.carlogos.org/car-logos/porsche-logo.png' },
    { name: 'Rolls-Royce', logo: 'https://www.carlogos.org/car-logos/ferrari-logo.png' }
  ];

  return (
    <PartnerSection>
      <Title>THƯƠNG HIỆU ĐỐI TÁC</Title>
      <LogoContainer>
        {partners.map((partner, index) => (
          <LogoBox key={index}>
            <img src={partner.logo} alt={partner.name} />
          </LogoBox>
        ))}
      </LogoContainer>
    </PartnerSection>
  );
};

export default Partner;