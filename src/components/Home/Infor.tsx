import React from 'react';
import styled, { keyframes } from 'styled-components';
import { Paper, Typography } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import BuildIcon from '@mui/icons-material/Build';
import PhoneIcon from '@mui/icons-material/Phone';
import { SectionTitle } from '../Styles/StylesComponents';

const shake = keyframes`
  0% { transform: rotate(0deg); }
  25% { transform: rotate(15deg); }
  50% { transform: rotate(0deg); }
  75% { transform: rotate(-15deg); }
  100% { transform: rotate(0deg); }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
`;

const Container = styled.div`
  padding: 40px 20px;
  max-width: 1200px;
  margin: 0 auto;
  background-color: #f8f9fa;
  border-radius: 12px;
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 32px;
  padding: 20px 0;
  
  @media (max-width: 960px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
  }
  
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    gap: 20px;
  }
`;

const InfoCard = styled(Paper)`
  padding: 30px 20px;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  transition: all 0.3s ease;
  border-radius: 12px !important;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1) !important;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.15) !important;
  }
`;

const IconWrapper = styled.div<{ $iconType: string }>`
  color: #e53935;
  margin-bottom: 20px;
  padding: 15px;
  background-color: rgba(229, 57, 53, 0.1);
  border-radius: 50%;
  
  .MuiSvgIcon-root {
    font-size: 45px;
    animation: ${props => {
      switch(props.$iconType) {
        case 'home':
          return pulse;
        case 'phone':
          return shake;
        case 'build':
          return pulse;
        case 'time':
          return shake;
        default:
          return 'none';
      }
    }} 2s infinite;
  }
`;

const InfoTitle = styled(Typography)`
  color: #e53935;
  font-weight: 600 !important;
  margin-bottom: 20px !important;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const Information = () => {
  return (
    <Container>
      <SectionTitle>THÔNG TIN CHUNG</SectionTitle>
      <GridContainer>
        <InfoCard elevation={2}>
          <IconWrapper $iconType="home">
            <HomeIcon />
          </IconWrapper>
          <InfoTitle variant="h6">ĐỊA CHỈ</InfoTitle>
          <Typography variant="body2">
            Địa chỉ 1: 19 Phan Văn Trị, Phường 7, Quận Gò Vấp, TP.HCM
            <br /><br />
            Địa chỉ 2: 15 TL08 Thạnh Lộc, Quận 12, TP.HCM
          </Typography>
        </InfoCard>

        <InfoCard elevation={2}>
          <IconWrapper $iconType="time">
            <AccessTimeIcon />
          </IconWrapper>
          <InfoTitle variant="h6">GIỜ LÀM VIỆC</InfoTitle>
          <Typography variant="body2">
            HÀNG NGÀY:<br />
            07:30 - 17:00
            <br /><br />
            CHỦ NHẬT & NGÀY LỄ:<br />
            09:00 - 16:00
          </Typography>
        </InfoCard>

        <InfoCard elevation={2}>
          <IconWrapper $iconType="build">
            <BuildIcon />
          </IconWrapper>
          <InfoTitle variant="h6">HẸN SỬA CHỮA</InfoTitle>
          <Typography variant="body2">
            1. Liên hệ số điện thoại 1900.866.876 & 0908.751.765 & 0913.169.066 (Mr Nhân)
            <br />
            2. Truy cập website: www.otobathanh.com
            <br />
            3. Liên hệ số 0913.169.066 miễn trung gian
            <br />
            4. Liên hệ chăm sóc khách hàng 0902.957.977 hoặc CVDV Bá Thành sẽ gọi lại ngay
          </Typography>
        </InfoCard>

        <InfoCard elevation={2}>
          <IconWrapper $iconType="phone">
            <PhoneIcon />
          </IconWrapper>
          <InfoTitle variant="h6">CỨU HỘ 24/24</InfoTitle>
          <Typography variant="h5" style={{ color: '#ff0000', fontWeight: 'bold' }}>
            0913.169.066
          </Typography>
        </InfoCard>
      </GridContainer>
    </Container>
  );
};

export default Information;