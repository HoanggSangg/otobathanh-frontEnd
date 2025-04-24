import React from 'react';
import styled from 'styled-components';
import { Container, Typography, Link, IconButton } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import FacebookIcon from '@mui/icons-material/Facebook';
import YouTubeIcon from '@mui/icons-material/YouTube';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

const FooterWrapper = styled.footer`
  background-color: #1e2124;
  color: white;
  padding: 60px 0 20px 0;
`;

const FooterGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 40px;
  
  @media (max-width: 960px) {
    grid-template-columns: 1fr;
  }
`;

const Logo = styled.img`
  height: 80px;
  margin-bottom: 20px;
`;

const CompanyInfo = styled.div`
  margin-bottom: 20px;
`;

const Title = styled(Typography)`
  color: white;
  font-size: 20px !important;
  font-weight: bold !important;
  margin-bottom: 20px !important;
  position: relative;
  padding-bottom: 10px;
  
  &:after {
    content: '';
    position: absolute;
    left: 0;
    bottom: 0;
    width: 40px;
    height: 3px;
    background: #e31837;
  }
`;

const ContactItem = styled.div`
  display: flex;
  align-items: flex-start;
  margin-bottom: 15px;
  
  .MuiSvgIcon-root {
    color: #e31837;
    margin-right: 10px;
    margin-top: 4px;
  }
`;

const Copyright = styled.div`
  text-align: center;
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px dashed rgba(255, 255, 255, 0.1);
  font-size: 14px;
  color: #888;
`;

const SocialMediaSection = styled.div`
  margin-bottom: 30px;
`;

const SocialIcons = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 15px;
  
  .MuiIconButton-root {
    color: white;
    border: 2px solid #e31837;
    padding: 8px;
    
    &:hover {
      background-color: #e31837;
    }
    
    .MuiSvgIcon-root {
      font-size: 24px;
    }
  }
`;

const Footer = () => {
  return (
    <FooterWrapper>
      <Container>
        <FooterGrid>
          <div>
            <Logo src="https://res.cloudinary.com/drbjrsm0s/image/upload/v1745463450/logo_ulbaie.png" alt="Ô Tô Bá Thành" />
            <CompanyInfo>
              <Typography variant="h6">ÔTÔ Bá Thành - Dịch Vụ Hoàn Hảo - Tận Tâm và Chuyên Nghiệp</Typography>
              <Typography variant="subtitle1">Sửa Xe Bằng Cả Trái Tim</Typography>
              <Typography>Công ty TNHH Bá Thành</Typography>
              <Typography>Mã số thuế / Mã số doanh nghiệp : 0304342069</Typography>
              <Typography>Hỗ trợ khách hàng</Typography>
              <Typography>1900.866.876 - 0908.751.765 - 0913.169.066</Typography>
            </CompanyInfo>
          </div>

          <div>
            <SocialMediaSection>
              <Title variant="h6">THEO DÕI CHÚNG TÔI</Title>
              <SocialIcons>
                <IconButton href="https://facebook.com" target="_blank" aria-label="Facebook">
                  <FacebookIcon />
                </IconButton>
                <IconButton href="https://youtube.com" target="_blank" aria-label="YouTube">
                  <YouTubeIcon />
                </IconButton>
                <IconButton href="https://linkedin.com" target="_blank" aria-label="LinkedIn">
                  <LinkedInIcon />
                </IconButton>
              </SocialIcons>
            </SocialMediaSection>
          </div>

          <div>
            <Title variant="h6">THÔNG TIN LIÊN HỆ</Title>
            <ContactItem>
              <LocationOnIcon />
              <Typography>
                ĐỊA CHỈ<br />
                19 Phan Văn Trị, Phường 07, Quận Gò Vấp,Tp HCM
              </Typography>
            </ContactItem>
            <ContactItem>
              <PhoneIcon />
              <div>
                <Typography>HOTLINE<br />1900.866.876</Typography>
                <Typography>ĐIỆN THOẠI<br />0908.751.765 - 0913.169.066</Typography>
              </div>
            </ContactItem>
            <ContactItem>
              <EmailIcon />
              <div>
                <Typography>EMAIL</Typography>
                <Link href="mailto:otobathanh@gmail.com" color="inherit">otobathanh@gmail.com</Link><br />
                <Link href="mailto:nhan.duong@otobathanh.com" color="inherit">nhan.duong@otobathanh.com</Link><br />
                <Link href="mailto:nhantoyota@yahoo.com" color="inherit">nhantoyota@yahoo.com</Link><br />
                <Link href="mailto:nhanserver@yahoo.com" color="inherit">nhanserver@yahoo.com</Link>
              </div>
            </ContactItem>
          </div>
        </FooterGrid>

        <Copyright>
          ® Ghi rõ nguồn "otobathanh.com" khi trích dẫn thông tin từ website này.
        </Copyright>
      </Container>
    </FooterWrapper>
  );
};

export default Footer; 