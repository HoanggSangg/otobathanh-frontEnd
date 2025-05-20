import React from 'react';
import styled from 'styled-components';
import { SiZalo } from 'react-icons/si';
import { FaPhone } from 'react-icons/fa';

const FloatingContainer = styled.div`
  position: fixed;
  right: 40px;
  bottom: 115px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  z-index: 999;
`;

const FloatingButton = styled.a`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  cursor: pointer;
  text-decoration: none;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.3);
  }
`;

const ZaloButton = styled(FloatingButton)`
  background-color: #0068ff;
  color: white;
  position: relative;

  &::before {
    content: 'Zalo';
    position: absolute;
    right: 60px;
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 5px 10px;
    border-radius: 4px;
    font-size: 14px;
    opacity: 0;
    transition: opacity 0.3s;
    white-space: nowrap;
  }

  &:hover::before {
    opacity: 1;
  }
`;

const PhoneButton = styled(FloatingButton)`
  background-color: #e31837;
  color: white;
  animation: pulse 1.5s infinite;
  position: relative;

  &::before {
    content: 'Gọi ngay';
    position: absolute;
    right: 60px;
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 5px 10px;
    border-radius: 4px;
    font-size: 14px;
    opacity: 0;
    transition: opacity 0.3s;
    white-space: nowrap;
  }

  &:hover::before {
    opacity: 1;
  }

  @keyframes pulse {
    0% {
      box-shadow: 0 0 0 0 rgba(227, 24, 55, 0.7);
    }
    70% {
      box-shadow: 0 0 0 15px rgba(227, 24, 55, 0);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(227, 24, 55, 0);
    }
  }
`;

const FloatingButtons = () => {
  return (
    <FloatingContainer>
      <ZaloButton 
        href="https://zalo.me/0908751765"
        target="_blank"
        rel="noopener noreferrer"
      >
        <SiZalo />
      </ZaloButton>
      <PhoneButton href="tel:0913169066">
        <FaPhone />
      </PhoneButton>
    </FloatingContainer>
  );
};

export default FloatingButtons;