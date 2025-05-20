import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';

const PartnerSection = styled.section`
  background: #f8f9fa;
  padding: 20px;
  text-align: center;
`;

const Title = styled.h2`
  text-align: center;
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

const ScrollContainer = styled.div`
  position: relative;
  width: 100%;
  padding: 0 20px;
  
  &::before, &::after {
    content: '';
    position: absolute;
    top: 0;
    width: 100px;
    height: 100%;
    pointer-events: none;
    z-index: 1;
  }

  &::before {
    left: 0;
    background: linear-gradient(to right, #f8f9fa 0%, rgba(248, 249, 250, 0) 100%);
  }

  &::after {
    right: 0;
    background: linear-gradient(to left, #f8f9fa 0%, rgba(248, 249, 250, 0) 100%);
  }
`;

const HorizontalScroll = styled.div`
  display: flex;
  gap: 24px;
  padding: 10px 0;
  overflow-x: auto;
  scroll-behavior: smooth;
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
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, #e31837 0%, #ff4d6d 100%);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);

    &::before {
      opacity: 1;
    }
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
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const isAtStart = container.scrollLeft === 0;
    const isAtEnd = container.scrollLeft + container.clientWidth >= container.scrollWidth - 1;

    setShowLeftButton(!isAtStart);
    setShowRightButton(!isAtEnd);
  };

  useEffect(() => {
    let animationFrameId: number;
    let lastTimestamp = 0;
    const scrollSpeed = 2;

    const animate = (timestamp: number) => {
      if (!lastTimestamp) lastTimestamp = timestamp;
      const elapsed = timestamp - lastTimestamp;

      if (scrollRef.current && !isPaused && elapsed > 32) {
        const container = scrollRef.current;
        const isAtEnd = container.scrollLeft + container.clientWidth >= container.scrollWidth - 1;
        
        if (isAtEnd) {
          container.scrollLeft = 0;
        } else {
          container.scrollBy({ left: scrollSpeed, behavior: 'auto' });
        }
        lastTimestamp = timestamp;
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isPaused]);

  return (
    <PartnerSection>
      <Title>THƯƠNG HIỆU ĐỐI TÁC</Title>
      <ScrollContainer>
        <HorizontalScroll
          ref={scrollRef}
          id="partner-scroll"
          onScroll={handleScroll}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {[...partners, ...partners, ...partners].map((partner, index) => (
            <LogoBox key={index}>
              <img src={partner.logo} alt={partner.name} />
            </LogoBox>
          ))}
        </HorizontalScroll>
      </ScrollContainer>
    </PartnerSection>
  );
};

export default Partner;