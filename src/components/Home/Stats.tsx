import React from 'react';
import styled from 'styled-components';
import { SectionTitle } from '../Styles/StylesComponents';

const Container = styled.div`
  background-color: #f5f5f5;
  padding: 40px 0;
  position: relative;
  overflow: hidden;
`;

const Content = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  position: relative;
  z-index: 2;

  ${SectionTitle} {
    color: #e31837;
    margin-bottom: 40px;
    text-align: center;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 30px;
  
  @media (max-width: 960px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 40px;
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 30px;
  }
`;

const StatItem = styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const IconWrapper = styled.div`
  width: 60px;
  height: 60px;
  margin-bottom: 20px;
  
  svg {
    width: 100%;
    height: 100%;
    fill: #e31837;
  }
`;

const StatNumber = styled.div`
  font-size: 36px;
  font-weight: bold;
  color: #e31837;
  margin-bottom: 10px;
  
  @media (max-width: 768px) {
    font-size: 30px;
  }
`;

const StatTitle = styled.div`
  font-size: 18px;
  color: #333;
  font-weight: 500;
  
  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

const ProjectIcon = () => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zm-2-9H7v-2h10v2zm0 4H7v-2h10v2zm-3 4H7v-2h7v2z"/>
  </svg>
);

const AwardIcon = () => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z"/>
  </svg>
);

const TechnicianIcon = () => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4zm4.51-8.95C17.41 6.99 18 8.4 18 10c0 1.48-.5 2.84-1.34 3.93.67.47 1.21 1.03 1.59 1.66C19.95 13.9 21 11.83 21 9.5c0-2.63-1.07-5.03-2.82-6.65-.44.38-.85.8-1.23 1.24.04.14.06.28.06.41zm-9.02 0c.04-.13.06-.27.06-.41-.38-.44-.79-.86-1.23-1.24C4.07 4.47 3 6.87 3 9.5c0 2.33 1.05 4.4 2.75 6.09.38-.63.92-1.19 1.59-1.66C6.5 12.84 6 11.48 6 10c0-1.6.59-3.01 1.49-3.95z"/>
  </svg>
);

const TransparencyIcon = () => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/>
  </svg>
);

const HomeStats = () => {
  return (
    <Container>
      <Content>
        <SectionTitle>THÀNH TÍCH</SectionTitle>
        <StatsGrid>
          <StatItem>
            <IconWrapper>
              <ProjectIcon />
            </IconWrapper>
            <StatNumber>620 +</StatNumber>
            <StatTitle>Dự án hoàn thành</StatTitle>
          </StatItem>
          <StatItem>
            <IconWrapper>
              <AwardIcon />
            </IconWrapper>
            <StatNumber>120 +</StatNumber>
            <StatTitle>Giải thưởng</StatTitle>
          </StatItem>
          <StatItem>
            <IconWrapper>
              <TechnicianIcon />
            </IconWrapper>
            <StatNumber>100 +</StatNumber>
            <StatTitle>Kĩ thuật viên</StatTitle>
          </StatItem>
          <StatItem>
            <IconWrapper>
              <TransparencyIcon />
            </IconWrapper>
            <StatNumber>120%</StatNumber>
            <StatTitle>Tính minh bạch</StatTitle>
          </StatItem>
        </StatsGrid>
      </Content>
    </Container>
  );
};

export default HomeStats; 