import React from 'react';
import styled from 'styled-components';
import { Container, Typography, Link, IconButton } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import { SiTiktok, SiYoutube } from 'react-icons/si';
import { FaFacebook } from 'react-icons/fa';  // Add this import

const FooterWrapper = styled.footer`
  background: linear-gradient(to right, rgb(246, 238, 238), rgb(242, 12, 12) 50%, rgb(11, 9, 9));
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
              <Typography variant="h6">Bá Thành - Dịch Vụ Hoàn Hảo - Tận Tâm và Chuyên Nghiệp - Sửa Xe Bằng Cả Trái Tim</Typography>
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
                ĐỊA CHỈ<br />
                19 Phan Văn Trị, Phường 07, Quận Gò Vấp,Tp HCM<br />
                15 TL08, Phường Thạnh Lộc, Quận 12, TP.HCM
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