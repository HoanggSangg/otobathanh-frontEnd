import React from 'react';
import styled from 'styled-components';

const PartnerSection = styled.section`
  background: #fff;
  padding: 40px 0;
  text-align: center;
`;

const Title = styled.h2`
  text-align: center;
  font-size: 32px;
  color: #e31837;
  margin-bottom: 40px;
  font-weight: 600;
  text-transform: uppercase;
  font-family: 'Roboto', sans-serif;
  position: relative;
  padding-bottom: 15px;

  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 3px;
    background-color: #e31837;
  }
`;

const LogoContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 30px;
  flex-wrap: wrap;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
`;

const LogoBox = styled.div`
  background: linear-gradient(to right, rgb(246, 238, 238), rgb(242, 12, 12) 50%, rgb(11, 9, 9));
  border-radius: 10px;
  padding: 20px;
  width: 150px;
  height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }

  img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
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