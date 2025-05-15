import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { useLocation } from 'react-router-dom';

const ScrollButton = styled.div.attrs<{ $isVisible: boolean }>(({ $isVisible }) => ({
  style: {
    opacity: $isVisible ? '1' : '0',
    visibility: $isVisible ? 'visible' : 'hidden',
  }
}))<{ $isVisible: boolean }>`
  position: fixed;
  bottom: 40px;
  left: 40px;
  z-index: 1000;
  cursor: pointer;
  background-color: rgba(227, 24, 55, 0.8);
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.3s ease;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);

  &:hover {
    background-color: rgba(227, 24, 55, 1);
    transform: translateY(-3px);
  }

  svg {
    color: white;
    font-size: 30px;
  }
`;

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <ScrollButton $isVisible={isVisible} onClick={scrollToTop}>
      <KeyboardArrowUpIcon />
    </ScrollButton>
  );
};

export default ScrollToTop;
