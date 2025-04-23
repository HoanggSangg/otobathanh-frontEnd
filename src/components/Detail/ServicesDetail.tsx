import React, { useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const ServicesContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const ServiceHeader = styled.div`
  margin-bottom: 30px;
`;

const CategoryLinks = styled.div`
  display: flex;
  gap: 5px;
  margin-bottom: 10px;
  font-size: 12px;
  text-transform: uppercase;

  a {
    color: #666;
    text-decoration: none;

    &:hover {
      color: #e31837;
    }
  }
`;

const ServiceTitle = styled.h1`
  font-size: 28px;
  color: #333;
  margin-bottom: 20px;
  line-height: 1.4;
`;

const ServiceMeta = styled.div`
  color: #666;
  font-size: 14px;
  margin-bottom: 30px;
  
  span {
    color: #e31837;
  }
`;

const ServiceContent = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 40px;
  margin-top: 30px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const MainContent = styled.div`
  img {
    width: 100%;
    height: auto;
    border-radius: 8px;
    margin-bottom: 20px;
  }

  p {
    color: #333;
    font-size: 16px;
    line-height: 1.8;
    margin-bottom: 20px;
  }

  h2 {
    color: #e31837;
    font-size: 22px;
    margin: 30px 0 20px;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 20px 0;

    li {
      color: #333;
      font-size: 16px;
      line-height: 1.8;
      margin-bottom: 10px;
      padding-left: 20px;
      position: relative;

      &:before {
        content: "•";
        color: #e31837;
        position: absolute;
        left: 0;
      }
    }
  }
`;

const Sidebar = styled.div`
  h3 {
    color: #e31837;
    font-size: 18px;
    margin-bottom: 15px;
    text-transform: uppercase;
  }

  ul {
    list-style: none;
    padding: 0;

    li {
      border-bottom: 1px solid #eee;
      padding: 10px 0;

      a {
        color: #333;
        text-decoration: none;
        font-size: 15px;
        
        &:hover {
          color: #e31837;
        }
      }
    }
  }
`;

const Services = () => {

  return (
    <ServicesContainer>
      <ServiceHeader>
        <CategoryLinks>
          <Link to="/">SỬA CHỮA ĐỘNG CƠ Ô TÔ</Link>
          <span>,</span>
          <Link to="/services">DỊCH VỤ SỬA CHỮA</Link>
        </CategoryLinks>
        <ServiceTitle>
          Dịch vụ bảo dưỡng xe Rolls-Royce tại Garage Ô Tô Vương Phát Đảm bảo sự hoàn hảo tới từng chi tiết nhỏ nhất
        </ServiceTitle>
        <ServiceMeta>
          ĐĂNG VÀO <span>27/03/2025</span> BỞI <span>ADMIN</span>
        </ServiceMeta>
      </ServiceHeader>

      <ServiceContent>
        <MainContent>
          <img src="../../image/logo.png" alt="Dịch vụ bảo dưỡng Rolls-Royce" />
          <p>
            Dịch Vụ Bảo Dưỡng Xe Rolls-Royce tại Garage Ô Tô Vương Phát Đình Cao Chăm Sóc Xe Siêu Sang Giới Thiệu
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
          <ul>
            <li><a href="">Bảo dưỡng định kỳ</a></li>
            <li><a href="">Sửa chữa động cơ</a></li>
            <li><a href="">Đồng sơn xe</a></li>
            <li><a href="">Phụ tùng chính hãng</a></li>
            <li><a href="">Chăm sóc xe</a></li>
          </ul>
        </Sidebar>
      </ServiceContent>
    </ServicesContainer>
  );
};

export default Services; 