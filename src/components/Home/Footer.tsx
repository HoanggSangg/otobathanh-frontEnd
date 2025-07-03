import React from 'react';
import styled from 'styled-components';
import { Container, Typography, Link, IconButton } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import { SiTiktok, SiYoutube } from 'react-icons/si';
import { FaFacebook } from 'react-icons/fa';

const FooterWrapper = styled.footer`
  background: linear-gradient(to right, rgb(197, 30, 30) 50%, rgb(11, 9, 9));
  color: white;
  padding: 40px 0 ;
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
  height: 104px;
  object-fit: contain;
  filter: drop-shadow(0 2px 8px rgba(227,24,55,0.12));
  border-radius: 14px;
  background: #fff;
  padding: 6px 18px;
  transition: box-shadow 0.3s, background 0.3s;
  border: 1.5px solid #e31837;
  &:hover {
    box-shadow: 0 8px 32px rgba(227,24,55,0.18);
    background: #f5f5f5;
  }
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
    width: 230px;
    height: 3px;
    background: #e31837;
  }
`;

const ContactItem = styled.div`
  display: flex;
  align-items: flex-start;
  margin-bottom: 15px;
  
  .MuiSvgIcon-root {
    color: #000;
    margin-right: 10px;
    margin-top: 4px;
  }
`;

const Copyright = styled.div`
  text-align: center;
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px dashed #fff;
  font-size: 14px;
  color: #fff;
`;

const SocialMediaSection = styled.div`
  margin-bottom: 30px;
`;

const SocialIcons = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 15px;
  
  .MuiIconButton-root {
    color: #fff;
    border: 2px solid #fff;
    padding: 8px;
    background-color: #000;
    
    svg {
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
              <Typography variant="h6">
                Bá Thành - Gara ô tô Quận 12 chuyên sửa chữa, bảo trì ô tô uy tín tại TP.HCM.
              </Typography>
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
                <IconButton href="https://www.facebook.com/profile.php?id=61576099125776" target="_blank" aria-label="Facebook">
                  <FaFacebook />
                </IconButton>
                <IconButton href="https://www.tiktok.com/@congtytnhhbathanh" target="_blank" aria-label="TikTok">
                  <SiTiktok />
                </IconButton>
                <IconButton href="https://www.youtube.com/@congtytnhhbathanhq12" target="_blank" aria-label="YouTube">
                  <SiYoutube />
                </IconButton>
              </SocialIcons>
            </SocialMediaSection>
          </div>

          <div>
            <Title variant="h6">THÔNG TIN LIÊN HỆ</Title>
            <ContactItem>
              <LocationOnIcon />
              <Typography>
                <strong>Chi nhánh 1:</strong><br />
                19 Phan Văn Trị, Phường Hạnh Thông, TP.HCM<br /><br />
                <strong>Chi nhánh 2:</strong><br />
                15 TL08, Phường An Phú Đông, TP.HCM
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
                <Link href="mailto:otobathanh@gmail.com" color="inherit">otobathanhquan12@gmail.com</Link><br />
                <Link href="mailto:nhan.duong@otobathanh.com" color="inherit">nhan.duong@otobathanh.com</Link><br />
              </div>
            </ContactItem>
          </div>
        </FooterGrid>

        <Typography align="center" style={{ marginTop: '30px', color: '#fff' }}>
          <strong>Bá Thành là gara ô tô uy tín tại Quận 12</strong> – Chuyên sửa chữa, bảo trì xe ô tô các loại, phục vụ tận tâm cho khách hàng tại TP.HCM và khu vực lân cận.
        </Typography>

        <Copyright>
          ® Ghi rõ nguồn "otobathanh.com" khi trích dẫn thông tin từ website này.
        </Copyright>
      </Container>
    </FooterWrapper>
  );
};

export default Footer;