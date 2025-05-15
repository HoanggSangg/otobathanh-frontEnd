import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

const BreadcrumbContainer = styled.div`
  margin-top: 80px;
  padding: 15px 0;
  background: linear-gradient(to right, #f8f9fa, #ffffff);
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.03);
  
  @media (max-width: 768px) {
    margin-top: 85px;
    padding: 10px 0;
  }
`;

const BreadcrumbList = styled.div`
  display: flex;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  font-size: 15px;
  color: #555;
  padding: 0 20px;
  
  @media (max-width: 768px) {
    font-size: 13px;
    flex-wrap: wrap;
  }
`;

const BreadcrumbItem = styled(Link)`
  color: #555;
  text-decoration: none;
  display: flex;
  align-items: center;
  white-space: nowrap;
  transition: all 0.3s ease;
  font-weight: 500;
  
  &:hover {
    color: #e31837;
    transform: translateX(2px);
  }
  
  @media (max-width: 768px) {
    font-size: 13px;
  }
`;

const Separator = styled(NavigateNextIcon)`
  margin: 0 10px;
  color: #999;
  font-size: 18px;
  opacity: 0.7;
  
  @media (max-width: 768px) {
    font-size: 16px;
    margin: 0 6px;
  }
`;

const CurrentPage = styled.span`
  color: #e31837;
  text-transform: uppercase;
  font-weight: 600;
  letter-spacing: 0.5px;
  
  @media (max-width: 768px) {
    font-size: 13px;
  }
`;

const Breadcrumb = () => {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(segment => segment);

  if (location.pathname === '/') {
    return null;
  }

  const getPageTitle = (path: string) => {
    switch (path) {
      case 'services':
        return 'Dịch vụ';
      case 'products':
        return 'Dịch vụ';
      case 'accounts':
        return 'Tài khoản';
      case 'account':
        return 'Tài khoản';
      case 'profile':
        return 'Thông tin cá nhân';
      case 'update':
        return 'Cập nhật thông tin';
      case 'likeProducts':
        return 'Dịch vụ yêu thích';
      case 'changePass':
        return 'Thay đổi mật khẩu';
      case 'booking':
        return 'Đặt lịch';
      case 'category':
        return 'Danh mục';
      case 'about':
        return 'Giới thiệu';
      case 'contact':
        return 'Liên hệ';
      case 'news':
        return 'Tin tức';
      case 'newslist':
        return 'Danh mục tin tức';
      case 'manager':
        return 'Quản lý';
      case 'banner':
        return 'Banner';
      default:
        return path;
    }
  };

  const renderBreadcrumbItems = () => {
    let items = [];

    items.push(
      <BreadcrumbItem key="home" to="/">
        Trang chủ
      </BreadcrumbItem>
    );

    // Handle product detail page
    if (pathSegments[0] === 'products' && pathSegments.length > 1) {
      items.push(<Separator key="sep-products" />);
      items.push(
        <BreadcrumbItem key="products" to="/products">
          dịch vụ
        </BreadcrumbItem>
      );
      items.push(<Separator key="sep-detail" />);
      items.push(
        <CurrentPage key="detail">
          CHI TIẾT dịch vụ
        </CurrentPage>
      );
      return items;
    }

    // Handle news detail page
    if (pathSegments[0] === 'news' && pathSegments.length > 1) {
      items.push(<Separator key="sep-news" />);
      items.push(
        <BreadcrumbItem key="news" to="/news">
          Tin tức
        </BreadcrumbItem>
      );
      items.push(<Separator key="sep-detail" />);
      items.push(
        <CurrentPage key="detail">
          CHI TIẾT TIN TỨC
        </CurrentPage>
      );
      return items;
    }

    // Handle regular pages
    pathSegments.forEach((segment, index) => {
      items.push(<Separator key={`sep-${index}`} />);
      if (index === pathSegments.length - 1) {
        items.push(
          <CurrentPage key={segment}>
            {getPageTitle(segment)}
          </CurrentPage>
        );
      } else {
        items.push(
          <BreadcrumbItem key={segment} to={`/${pathSegments.slice(0, index + 1).join('/')}`}>
            {getPageTitle(segment)}
          </BreadcrumbItem>
        );
      }
    });

    return items;
  };

  return (
    <BreadcrumbContainer>
      <BreadcrumbList>
        {renderBreadcrumbItems()}
      </BreadcrumbList>
    </BreadcrumbContainer>
  );
};

export default Breadcrumb;