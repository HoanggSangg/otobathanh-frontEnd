import React from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import styled from 'styled-components';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

const BreadcrumbContainer = styled.div`
  margin-top: 120px;
  padding: 20px 0;
  background-color: #f5f5f5;
`;

const BreadcrumbList = styled.div`
  display: flex;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  font-size: 14px;
  color: #666;
`;

const BreadcrumbItem = styled(Link)`
  color: #666;
  text-decoration: none;
  display: flex;
  align-items: center;
  
  &:hover {
    color: #e31837;
  }
`;

const Separator = styled(NavigateNextIcon)`
  margin: 0 8px;
  color: #666;
  font-size: 16px;
`;

const CurrentPage = styled.span`
  color: #e31837;
  text-transform: uppercase;
  font-weight: 500;
`;

const Breadcrumb = () => {
  const location = useLocation();
  const { id } = useParams();
  const pathSegments = location.pathname.split('/').filter(segment => segment);

  const getPageTitle = (path: string) => {
    switch(path) {
      case 'services':
        return 'DỊCH VỤ SỬA CHỮA';
      case 'products':
        return 'Sản phẩm';
      case 'about':
        return 'Giới thiệu';
      case 'contact':
        return 'Liên hệ';
      case 'news':
        return 'Tin tức';
      default:
        return path;
    }
  };

  if (location.pathname === '/') return null;

  // Tạo breadcrumb items dựa trên pathSegments
  const renderBreadcrumbItems = () => {
    let items = [];
    
    // Luôn thêm Trang chủ
    items.push(
      <BreadcrumbItem key="home" to="/">
        Trang chủ
      </BreadcrumbItem>
    );

    // Xử lý các segments
    pathSegments.forEach((segment, index) => {
      // Thêm separator
      items.push(<Separator key={`sep-${index}`} />);

      // Xử lý trường hợp đặc biệt cho news detail
      if (segment === id && pathSegments[0] === 'news') {
        items.push(
          <BreadcrumbItem key="news" to="/news">
            Tin tức
          </BreadcrumbItem>
        );
        items.push(<Separator key={`sep-detail`} />);
        items.push(
          <CurrentPage key="detail">
            Chi tiết tin tức
          </CurrentPage>
        );
        return;
      }

      // Xử lý segment cuối cùng
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