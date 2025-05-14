import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { getAllNewsAPI } from '../../API';
import { SectionTitle } from '../../Styles/StylesComponents';

const NewsSection = styled.section`
  padding: 30px 0;
  background-color: #f8f9fa;
`;

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
`;

const NewsGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 0;
`;

const CardWrapper = styled.div`
  width: 100%;
  border-radius: 20px;
  overflow: hidden;
  background: #fff;
  box-shadow: 0 2px 12px rgba(0,0,0,0.07);
  cursor: pointer;
  display: flex;
  transition: box-shadow 0.2s;
  position: relative;

  @media (max-width: 768px) {
    flex-direction: column;
  }

  &:hover {
    box-shadow: 0 4px 24px rgba(0,0,0,0.13);
  }
`;

const CardImage = styled.div<{ src: string }>`
  width: 250px;
  height: 140px;
  background: url(${props => props.src}) center/cover no-repeat;

  @media (max-width: 768px) {
    width: 100%;
    height: 180px;
  }
`;

const CardInfo = styled.div`
  padding: 12px;
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
  date: string;
}

const NewsList = () => {
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

  return (
    <NewsSection>
      <Container>
        <SectionTitle>TIN TỨC KHUYẾN MÃI</SectionTitle>
        <NewsGrid>
          {newsItems.map(item => (
            <CardWrapper key={item._id} onClick={() => handleNewsClick(item._id)}>
              <CardImage src={item.image} />
              <CardInfo>
                <NewsTitleStyled>{item.title}</NewsTitleStyled>
                <NewsDesc>{item.content}</NewsDesc>
                <NewsDateStyled>{new Date(item.date).toLocaleDateString('vi-VN')}</NewsDateStyled>
              </CardInfo>
            </CardWrapper>
          ))}
        </NewsGrid>
      </Container>
    </NewsSection>
  );
};

export default NewsList;