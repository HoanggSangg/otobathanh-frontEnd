import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { SectionTitle } from '../../Styles/StylesComponents';
import { Build, Engineering, Handyman, LocalShipping } from '@mui/icons-material';

// Add interface for type safety
interface SubService {
  name: string;
  path: string;
}

interface Service {
  icon: React.ReactNode;
  title: string;
  description: string;
  subServices: SubService[];
}

const ServicesSection = styled.section`
  padding: clamp(40px, 5vw, 60px) 0;
  background: linear-gradient(to bottom, #f8f9fa, #fff);
`;

const Container = styled.div`
  max-width: 1300px;
  margin: 0 auto;
  padding: 0 clamp(15px, 3vw, 30px);
`;

const ServicesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: clamp(20px, 3vw, 30px);
  margin-top: clamp(30px, 4vw, 50px);
`;

const IconWrapper = styled.div`
  width: 60px;
  height: 60px;
  background: #e31837;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  color: white;
  transition: all 0.3s ease;
  position: relative;
  z-index: 1;

  svg {
    font-size: 30px;
  }

  @media (max-width: 1024px) {
    width: 70px;
    height: 70px;
    
    svg {
      font-size: 35px;
    }
  }
`;

const ServiceTitle = styled.h3`
  color: #333;
  font-size: 18px;
  margin-bottom: 12px;
  font-weight: 600;
  transition: color 0.3s ease;
  position: relative;
  z-index: 1;

  @media (max-width: 1024px) {
    font-size: 20px;
    margin-bottom: 15px;
  }
`;

const ServiceDescription = styled.p`
  color: #666;
  line-height: 1.5;
  margin: 0;
  font-size: 14px;
  position: relative;
  z-index: 1;

  @media (max-width: 1024px) {
    font-size: 16px;
    line-height: 1.6;
  }
`;

const ServiceCard = styled.div`
  background: white;
  border-radius: 10px;
  padding: 25px 15px;
  text-align: center;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  position: relative;
  overflow: hidden;

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(227, 24, 55, 0.05);
    transform: scaleX(0);
    transform-origin: 0 50%;
    transition: transform .3s ease-out;
    z-index: 0;
  }

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2);

    &:before {
      transform: scaleX(1);
    }

    ${IconWrapper} {
      background: #c41730;
      transform: scale(1.1);
    }

    ${ServiceTitle} {
      color: #e31837;
    }
  }

  @media (max-width: 1024px) {
    padding: 30px 20px;
  }
`;

const SubServicesList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 15px 0 0;
  display: none;
  text-align: left;

  ${ServiceCard}:hover & {
    display: block;
  }
`;

const SubServiceItem = styled.li`
  padding: 8px 15px;
  font-size: 14px;
  color: #666;
  transition: all 0.3s ease;
  border-radius: 4px;

  &:hover {
    background: rgba(227, 24, 55, 0.1);
    color: #e31837;
    padding-left: 20px;
  }
`;

const services: Service[] = [
  {
    icon: <Build />,
    title: 'Sửa Chữa Tổng Quát',
    description: 'Dịch vụ sửa chữa chuyên nghiệp với đội ngũ kỹ thuật viên giàu kinh nghiệm, trang thiết bị hiện đại.',
    subServices: [
      { name: 'Sửa chữa động cơ', path: '/services/engine-repair' },
      { name: 'Sửa chữa hộp số', path: '/services/transmission' },
      { name: 'Sửa chữa hệ thống phanh', path: '/services/brake-system' },
      { name: 'Sửa chữa điện', path: '/services/electrical' }
    ]
  },
  {
    icon: <Engineering />,
    title: 'Bảo Trì',
    description: 'Dịch vụ bảo trì định kỳ giúp xe hoạt động ổn định, kéo dài tuổi thọ và phát hiện sớm các vấn đề tiềm ẩn.',
    subServices: [
      { name: 'Kiểm tra định kỳ', path: '/services/periodic-check' },
      { name: 'Bảo trì động cơ', path: '/services/engine-maintenance' },
      { name: 'Bảo trì hệ thống', path: '/services/system-maintenance' },
      { name: 'Vệ sinh kỹ thuật', path: '/services/technical-cleaning' }
    ]
  },
  {
    icon: <Handyman />,
    title: 'Bảo Dưỡng',
    description: 'Dịch vụ bảo dưỡng chuyên nghiệp, đảm bảo xe luôn trong tình trạng hoạt động tốt nhất.',
    subServices: [
      { name: 'Thay dầu động cơ', path: '/services/oil-change' },
      { name: 'Bảo dưỡng phanh', path: '/services/brake-maintenance' },
      { name: 'Bảo dưỡng điều hòa', path: '/services/ac-service' },
      { name: 'Kiểm tra tổng quát', path: '/services/general-inspection' }
    ]
  },
  {
    icon: <LocalShipping />,
    title: 'Cứu Hộ 24/7',
    description: 'Dịch vụ cứu hộ xe chuyên nghiệp, hỗ trợ 24/7 với đội ngũ nhân viên nhiều kinh nghiệm.',
    subServices: [
      { name: 'Cứu hộ khẩn cấp', path: '/services/emergency-rescue' },
      { name: 'Kéo xe', path: '/services/towing' },
      { name: 'Hỗ trợ tại chỗ', path: '/services/onsite-support' },
      { name: 'Sửa chữa lưu động', path: '/services/mobile-repair' }
    ]
  }
];

const HomeServices = () => {
  const navigate = useNavigate();

  const handleServiceClick = (service: Service) => {
    if (service.subServices && service.subServices.length > 0) {
      navigate(`/dich-vu`);
    }
  };

  const handleSubServiceClick = (e: React.MouseEvent, path: string) => {
    e.stopPropagation();
    navigate(path);
  };

  return (
    <ServicesSection>
      <Container>
        <SectionTitle>DỊCH VỤ NỔI BẬT</SectionTitle>
        <ServicesGrid>
          {services.map((service, index) => (
            <ServiceCard
              key={index}
              onClick={() => handleServiceClick(service)}
            >
              <IconWrapper>
                {service.icon}
              </IconWrapper>
              <ServiceTitle>{service.title}</ServiceTitle>
              <ServiceDescription>{service.description}</ServiceDescription>
              <SubServicesList>
                {service.subServices.map((subService, subIndex) => (
                  <SubServiceItem
                    key={subIndex}
                    onClick={(e) => handleSubServiceClick(e, subService.path)}
                  >
                    {subService.name}
                  </SubServiceItem>
                ))}
              </SubServicesList>
            </ServiceCard>
          ))}
        </ServicesGrid>
      </Container>
    </ServicesSection>
  );
};

export default HomeServices;