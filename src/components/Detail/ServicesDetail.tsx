import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const ServicesContainer = styled.div`
  max-width: 1400px;
  margin: 20px auto 0;
  padding: 40px 20px;
`;

const ServiceHeader = styled.div`
  margin-bottom: clamp(30px, 5vw, 50px);
  background: white;
  padding: clamp(20px, 3vw, 30px);
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
`;

const CategoryLinks = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 15px;
  font-size: 14px;
  text-transform: uppercase;

  a {
    color: #666;
    text-decoration: none;
    transition: all 0.3s ease;

    &:hover {
      color: #e31837;
    }
  }

  span {
    color: #999;
  }
`;

const ServiceContent = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(0, 1fr);
  gap: clamp(20px, 4vw, 40px);
  margin-top: 30px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

// Add these new styled components after the existing ones
const ServiceTitle = styled.h1`
  font-size: clamp(24px, 3vw, 32px);
  color: #333;
  margin-bottom: 15px;
  line-height: 1.4;
  font-weight: 600;
`;

const ServiceMeta = styled.div`
  font-size: 12px;
  color: #999;
  text-transform: uppercase;
  letter-spacing: 1px;

  span {
    color: #e31837;
    font-weight: 600;
    margin: 0 5px;
  }
`;

const ServiceList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 20px 0;

  li {
    padding: 12px 15px;
    border-bottom: 1px solid #eee;
    color: #666;
    transition: all 0.3s ease;

    a {
      color: inherit;
      text-decoration: none;
      display: block;
      
      &:hover {
        color: #e31837;
      }
    }

    &:last-child {
      border-bottom: none;
    }
  }
`;

// Update the MainContent styled component
const MainContent = styled.div`
  background: white;
  padding: clamp(20px, 3vw, 30px);
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);

  img {
    width: 100%;
    height: auto;
    border-radius: 12px;
    margin-bottom: 25px;
    transition: transform 0.3s ease;

    &:hover {
      transform: scale(1.02);
    }
  }

  h2 {
    color: #e31837;
    font-size: clamp(20px, 2.5vw, 24px);
    margin: 35px 0 20px;
    position: relative;
    padding-left: 15px;

    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 4px;
      background: #e31837;
      border-radius: 2px;
    }
  }
`;

const Sidebar = styled.div`
  background: white;
  padding: clamp(20px, 3vw, 30px);
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  height: fit-content;
  position: sticky;
  top: 130px;

  h3 {
    color: #e31837;
    font-size: 20px;
    margin-bottom: 20px;
    text-transform: uppercase;
    position: relative;
    padding-bottom: 10px;

    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 60px;
      height: 3px;
      background: #e31837;
    }
  }

  ul li {
    transition: all 0.3s ease;

    &:hover {
      padding-left: 10px;
      background: rgba(227, 24, 55, 0.05);
    }
  }
`;

const ServicesDetail = () => {

  return (
    <ServicesContainer>
      <ServiceHeader>
        <CategoryLinks>
          <Link to="/">SỬA CHỮA ĐỘNG CƠ Ô TÔ</Link>
          <span>,</span>
          <Link to="/services">DỊCH VỤ SỬA CHỮA</Link>
        </CategoryLinks>
        <ServiceTitle>
          Dịch vụ bảo dưỡng xe Đảm bảo sự hoàn hảo tới từng chi tiết nhỏ nhất
        </ServiceTitle>
        <ServiceMeta>
          ĐĂNG VÀO <span>27/03/2025</span> BỞI <span>ADMIN</span>
        </ServiceMeta>
      </ServiceHeader>

      <ServiceContent>
        <MainContent>
          <img src="https://res.cloudinary.com/drbjrsm0s/image/upload/v1745463450/logo_ulbaie.png" alt="Dịch vụ bảo dưỡng Rolls-Royce" />
          <p>
            Dịch Vụ Bảo Dưỡng Xe Đình Cao Chăm Sóc Xe Siêu Sang Giới Thiệu
            Rolls-Royce – Tuyệt Tác Nghệ Thuật Di Động. Rolls-Royce, biểu tượng của sự tinh hoa và đẳng cấp vượt thời
            gian, không chỉ là một phương tiện di chuyển, mà còn là một tuyệt tác nghệ thuật di động.
          </p>

          <h2>Dịch vụ bảo dưỡng chuyên nghiệp</h2>
          <ul>
            <li>Kiểm tra và bảo dưỡng động cơ theo tiêu chuẩn nhà sản xuất</li>
            <li>Thay thế phụ tùng chính hãng</li>
            <li>Bảo dưỡng hệ thống điện và điều hòa</li>
            <li>Chăm sóc nội thất cao cấp</li>
            <li>Dịch vụ sơn và phục hồi xe</li>
          </ul>

          <h2>Cam kết của chúng tôi</h2>
          <ul>
            <li>Đội ngũ kỹ thuật viên được đào tạo chuyên sâu</li>
            <li>Trang thiết bị và công nghệ hiện đại</li>
            <li>Phụ tùng chính hãng 100%</li>
            <li>Bảo hành dài hạn cho mọi dịch vụ</li>
          </ul>
        </MainContent>
        <Sidebar>
          <h3>Dịch vụ khác</h3>
          <ServiceList>
            <li><Link to="/services/maintenance">Bảo dưỡng định kỳ</Link></li>
            <li><Link to="/services/engine-repair">Sửa chữa động cơ</Link></li>
            <li><Link to="/services/paint">Đồng sơn xe</Link></li>
            <li><Link to="/services/parts">Phụ tùng chính hãng</Link></li>
            <li><Link to="/services/care">Chăm sóc xe</Link></li>
          </ServiceList>
        </Sidebar>
      </ServiceContent>
    </ServicesContainer>
  );
};

export default ServicesDetail;