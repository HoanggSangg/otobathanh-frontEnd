import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { SectionTitle } from '../Styles/StylesComponents';
import { getAllNewsAPI } from '../API';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const NewsSection = styled.section`
  padding: 30px 0;
  background-color: #f8f9fa;
`;

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
`;

const HorizontalScroll = styled.div`
  display: flex;
  overflow-x: auto;
  scroll-behavior: smooth;
  gap: 24px;
  padding-bottom: 10px;
  &::-webkit-scrollbar {
    display: none;
  }
`;

// Update ScrollContainer styling
const ScrollContainer = styled.div`
  position: relative;
  width: 100%;
  
  @media (min-width: 768px) {
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
      background: linear-gradient(to right, #ffffff 0%, rgba(255, 255, 255, 0) 100%);
    }

    &::after {
      right: 0;
      background: linear-gradient(to left, #ffffff 0%, rgba(255, 255, 255, 0) 100%);
    }
  }
`;

// Update ScrollButton to handle visibility
const ScrollButton = styled.button<{ $show: boolean }>`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 2;
  background: white;
  border: none;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  border-radius: 50%;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 24px;
  transition: all 0.2s;
  opacity: ${props => props.$show ? 1 : 0};
  visibility: ${props => props.$show ? 'visible' : 'hidden'};
  
  &:hover {
    background: #f5f5f5;
  }
`;

const CardWrapper = styled.div`
  min-width: 300px;
  max-width: 300px;
  flex: 0 0 300px;
  border-radius: 20px;
  overflow: hidden;
  background: #fff;
  box-shadow: 0 2px 12px rgba(0,0,0,0.07);
  cursor: pointer;
  display: flex;
  flex-direction: column;
  transition: box-shadow 0.2s;
  position: relative;
  &:hover {
    box-shadow: 0 4px 24px rgba(0,0,0,0.13);
  }
`;

const CardImage = styled.div<{ src: string }>`
  width: 100%;
  height: 180px;
  background: url(${props => props.src}) center/cover no-repeat;
`;

const CardInfo = styled.div`
  padding: 18px 16px 14px 16px;
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const NewsTitleStyled = styled.div`
  font-size: 1.1rem;
  font-weight: bold;
  margin-bottom: 8px;
  color: #222;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const NewsDesc = styled.div`
  font-size: 0.98rem;
  color: #666;
  margin-bottom: 10px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const NewsDateStyled = styled.div`
  font-size: 0.95rem;
  color: #888;
  margin-top: auto;
  font-style: italic;
`;

interface NewsItem {
  _id: string;
  title: string;
  image: string;
  content: string;
  createdAt: string;
}

const News = () => {
  const navigate = useNavigate();
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const data = await getAllNewsAPI();
        setNewsItems(data);
      } catch (error) {
        console.error('Error fetching news:', error);
      }
    };

    fetchNews();
  }, []);

  const handleNewsClick = (newsId: string) => {
    navigate(`/news/${newsId}`);
  };

  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(true);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const isAtStart = container.scrollLeft === 0;
    const isAtEnd = container.scrollLeft + container.clientWidth >= container.scrollWidth - 1;

    setShowLeftButton(!isAtStart);
    setShowRightButton(!isAtEnd);
  };

  // Update the return JSX ScrollContainer section
  return (
    <NewsSection>
      <Container>
        <SectionTitle>TIN TỨC KHUYẾN MÃI</SectionTitle>
        <ScrollContainer>
          <ScrollButton
            style={{ left: -15 }}
            $show={showLeftButton}
            onClick={() => {
              const el = document.getElementById('horizontal-news-scroll');
              if (el) el.scrollBy({ left: -320, behavior: 'smooth' });
            }}
          >
            <FaChevronLeft />
          </ScrollButton>
          <ScrollButton
            style={{ right: -15 }}
            $show={showRightButton}
            onClick={() => {
              const el = document.getElementById('horizontal-news-scroll');
              if (el) el.scrollBy({ left: 320, behavior: 'smooth' });
            }}
          >
            <FaChevronRight />
          </ScrollButton>
          <HorizontalScroll
            id="horizontal-news-scroll"
            onScroll={handleScroll}
          >
            {newsItems.map(item => (
              <CardWrapper key={item._id} onClick={() => handleNewsClick(item._id)}>
                <CardImage src={item.image} />
                <CardInfo>
                  <NewsTitleStyled>{item.title}</NewsTitleStyled>
                  <NewsDesc>{item.content}</NewsDesc>
                  <NewsDateStyled>{new Date(item.createdAt).toLocaleDateString('vi-VN')}</NewsDateStyled>
                </CardInfo>
              </CardWrapper>
            ))}
          </HorizontalScroll>
        </ScrollContainer>
      </Container>
    </NewsSection>
  );
};

export default News;