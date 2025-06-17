import React, { useRef, useState, useEffect } from 'react';
import styled from 'styled-components';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const PartnerSection = styled.section`
  background: #f8f9fa;
  padding: 20px;
  text-align: center;
`;

const Title = styled.h2`
  font-size: 32px;
  color: #e31837;
  margin-bottom: 50px;
  font-weight: 700;
  text-transform: uppercase;
  font-family: 'Roboto', sans-serif;
  position: relative;
  padding-bottom: 20px;
  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 4px;
    background: linear-gradient(90deg, #e31837 0%, #ff4d6d 100%);
    border-radius: 2px;
  }
`;

const ScrollWrapper = styled.div`
  position: relative;
`;

const ScrollContainer = styled.div`
  display: flex;
  overflow-x: auto;
  scroll-behavior: smooth;
  gap: 24px;
  padding: 10px 20px;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const LogoBox = styled.div`
  min-width: 180px;
  flex: 0 0 calc(16.666% - 20px);
  background: white;
  border-radius: 15px;
  padding: 25px;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  position: relative;
  overflow: hidden;
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  }
  img {
    max-width: 80%;
    max-height: 80%;
    object-fit: contain;
    filter: grayscale(100%);
    transition: filter 0.3s ease;
  }
  &:hover img {
    filter: grayscale(0%);
  }
`;

const ScrollButton = styled.button<{ visible: boolean }>`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: white;
  border: none;
  border-radius: 50%;
  box-shadow: 0 2px 6px rgba(0,0,0,0.15);
  width: 40px;
  height: 40px;
  z-index: 2;
  cursor: pointer;
  display: ${({ visible }) => (visible ? 'flex' : 'none')};
  align-items: center;
  justify-content: center;
  &:hover {
    background: #eee;
  }
`;

const LeftButton = styled(ScrollButton)`
  left: 0;
`;

const RightButton = styled(ScrollButton)`
  right: 0;
`;

const partners = [
  { name: 'ziegler', logo: 'https://res.cloudinary.com/drbjrsm0s/image/upload/v1747644343/ziegler_jromum.gif' },
  { name: 'gimaex', logo: 'https://res.cloudinary.com/drbjrsm0s/image/upload/v1747644343/gimaex_mjiexx.png' },
  { name: 'klaas', logo: 'https://res.cloudinary.com/drbjrsm0s/image/upload/v1747644343/klaas_bolelq.png' },
  { name: 'parsch', logo: 'https://res.cloudinary.com/drbjrsm0s/image/upload/v1747644343/parsch_nlvcit.png' },
  { name: 'sany', logo: 'https://res.cloudinary.com/drbjrsm0s/image/upload/v1747644343/sany_y0page.png' },
  { name: 'vema', logo: 'https://res.cloudinary.com/drbjrsm0s/image/upload/v1747644343/vema_cnqcv4.png' },
  { name: 'magirus', logo: 'https://res.cloudinary.com/drbjrsm0s/image/upload/v1747644342/magirus_tliwq4.png' },
  { name: 'rosenbauer', logo: 'https://res.cloudinary.com/drbjrsm0s/image/upload/v1747644342/rosenbauer_pvoilz.png' },
  { name: 'morita', logo: 'https://res.cloudinary.com/drbjrsm0s/image/upload/v1747644342/morita_xnfiep.png' }
];

const Partner = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(true);

  const scrollBy = (offset: number) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setShowLeft(el.scrollLeft > 10);
    setShowRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 10);
  };

  useEffect(() => {
    handleScroll(); // Run on mount
  }, []);

  return (
    <PartnerSection>
      <Title>THƯƠNG HIỆU ĐỐI TÁC</Title>
      <ScrollWrapper>
        <LeftButton onClick={() => scrollBy(-300)} visible={showLeft}><ChevronLeft /></LeftButton>
        <ScrollContainer ref={scrollRef} onScroll={handleScroll}>
          {partners.map((partner, index) => (
            <LogoBox key={index}>
              <img src={partner.logo} alt={partner.name} />
            </LogoBox>
          ))}
        </ScrollContainer>
        <RightButton onClick={() => scrollBy(300)} visible={showRight}><ChevronRight /></RightButton>
      </ScrollWrapper>
    </PartnerSection>
  );
};

export default Partner;
