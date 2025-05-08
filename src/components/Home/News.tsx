import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { SectionTitle } from '../Styles/StylesComponents';
import { getAllNewsAPI } from '../API';

const NewsSection = styled.section`
  padding: 40px 0;
  background-color: #f8f9fa;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
`;

const NewsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
  margin-top: 40px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 25px;
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    gap: 20px;
  }
`;

const NewsImage = styled.img`
  width: 100%;
  height: 220px;
  object-fit: cover;
  transition: transform 0.4s ease;
`;

const NewsContent = styled.div`
  padding: 25px;
`;

const NewsTitle = styled.h3`
  color: #333;
  font-size: 20px;
  margin-bottom: 12px;
  font-weight: 600;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  transition: color 0.3s ease;
  line-height: 1.4;
`;

const NewsCard = styled.div`
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.4s ease;
  cursor: pointer;
  border: 1px solid #eee;

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 25px rgba(0, 0, 0, 0.15);

    ${NewsImage} {
      transform: scale(1.05);
    }

    ${NewsTitle} {
      color: #e31837;
    }
  }
`;

const NewsDescription = styled.p`
  color: #666;
  font-size: 15px;
  line-height: 1.7;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-top: 10px;
`;

const NewsDate = styled.span`
  color: #888;
  font-size: 14px;
  display: block;
  margin-top: 15px;
  font-style: italic;
`;

interface NewsItem {
  _id: string;
  title: string;
  image: string;
  content: string;
  date: string;
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

  return (
    <NewsSection>
      <Container>
        <SectionTitle>TIN TỨC KHUYẾN MÃI</SectionTitle>
        <NewsGrid>
          {newsItems.map(item => (
            <NewsCard key={item._id} onClick={() => handleNewsClick(item._id)}>
              <NewsImage src={item.image} alt={item.title} />
              <NewsContent>
                <NewsTitle>{item.title}</NewsTitle>
                <NewsDescription>{item.content}</NewsDescription>
                <NewsDate>{new Date(item.date).toLocaleDateString('vi-VN')}</NewsDate>
              </NewsContent>
            </NewsCard>
          ))}
        </NewsGrid>
      </Container>
    </NewsSection>
  );
};

export default News;