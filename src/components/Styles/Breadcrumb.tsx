import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

const BreadcrumbContainer = styled.div`
  margin-top: 100px;
  padding: 20px 0;
  background-color: #f5f5f5;
  
  @media (max-width: 768px) {
    margin-top: 100px;
    padding: 15px 0;
  }
`;

const BreadcrumbList = styled.div`
  display: flex;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  font-size: 14px;
  color: #666;
  padding: 0 20px;
  
  @media (max-width: 768px) {
    font-size: 12px;
    flex-wrap: wrap;
  }
`;

const BreadcrumbItem = styled(Link)`
  color: #666;
  text-decoration: none;
  display: flex;
  align-items: center;
  white-space: nowrap;
  
  &:hover {
    color: #e31837;
  }
  
  @media (max-width: 768px) {
    font-size: 12px;
  }
`;

const Separator = styled(NavigateNextIcon)`
  margin: 0 8px;
  color: #666;
  font-size: 16px;
  
  @media (max-width: 768px) {
    font-size: 14px;
    margin: 0 5px;
  }
`;

const CurrentPage = styled.span`
  color: #e31837;
  text-transform: uppercase;
  font-weight: 500;
  
  @media (max-width: 768px) {
    font-size: 12px;
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
        return 'Sản phẩm';
      case 'accounts':
        return 'Tài khoản';
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
          Sản phẩm
        </BreadcrumbItem>
      );
      items.push(<Separator key="sep-detail" />);
      items.push(
        <CurrentPage key="detail">
          CHI TIẾT SẢN PHẨM
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