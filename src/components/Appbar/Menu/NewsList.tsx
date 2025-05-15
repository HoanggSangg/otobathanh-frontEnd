import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { getAllNewsAPI } from '../../API';
import { SectionTitle } from '../../Styles/StylesComponents';

const NewsSection = styled.section`
  padding: 20px 0;
  background-color: #f8f9fa;
  min-height: 100vh;
`;

const Container = styled.div`
  max-width: 1300px;
  margin: 0 auto;
  padding: 0 20px;
`;

const SearchContainer = styled.div`
  margin: 30px 0;
  display: flex;
  gap: 16px;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    flex-direction: column;
    width: 100%;
  }
`;

const SearchInput = styled.input`
  padding: 12px 24px;
  border: 2px solid #eee;
  border-radius: 30px;
  width: 500px;
  font-size: 1rem;
  transition: all 0.3s ease;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);

  &:focus {
    outline: none;
    border-color: #e31837;
    box-shadow: 0 4px 15px rgba(227, 24, 55, 0.1);
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const SortButton = styled.button<{ $active?: boolean }>`
  padding: 12px 24px;
  border: none;
  border-radius: 30px;
  background: ${props => props.$active ? '#e31837' : '#fff'};
  color: ${props => props.$active ? '#fff' : '#333'};
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(0,0,0,0.15);
  }
`;

const NewsGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px 0;
`;

const CardWrapper = styled.div`
  width: 100%;
  border-radius: 24px;
  overflow: hidden;
  background: #fff;
  box-shadow: 0 4px 20px rgba(0,0,0,0.06);
  cursor: pointer;
  display: flex;
  transition: all 0.3s ease;
  position: relative;

  @media (max-width: 768px) {
    flex-direction: column;
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 30px rgba(0,0,0,0.12);
  }
`;

const CardImage = styled.div<{ src: string }>`
  width: 300px;
  height: 200px;
  background: url(${props => props.src}) center/cover no-repeat;
  border-right: 2px solid #e31837;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.02) 100%);
  }

  @media (max-width: 768px) {
    width: 100%;
    height: 220px;
    border-right: none;
    border-bottom: 2px solid #e31837;
  }
`;

const CardInfo = styled.div`
  padding: 24px;
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 12px;
`;

const NewsTitleStyled = styled.div`
  font-size: 1.25rem;
  font-weight: 700;
  color: #1a1a1a;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.4;
`;

const NewsDesc = styled.div`
  font-size: 1rem;
  color: #555;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.6;
`;

const NewsDateStyled = styled.div`
  font-size: 0.9rem;
  color: #777;
  margin-top: auto;
  font-style: italic;
  display: flex;
  align-items: center;
  gap: 6px;

  &::before {
    content: '';
    display: inline-block;
    width: 4px;
    height: 4px;
    background: #e31837;
    border-radius: 50%;
  }
`;

interface NewsItem {
  _id: string;
  title: string;
  image: string;
  content: string;
  createdAt: string;
}

const NewsList = () => {
  const navigate = useNavigate();
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

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

  const toggleSortOrder = () => {
    setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc');
  };

  const filteredAndSortedNews = newsItems
    .filter(item =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });

  return (
    <NewsSection>
      <Container>
        <SectionTitle>TIN TỨC KHUYẾN MÃI</SectionTitle>
        <SearchContainer>
          <SearchInput
            type="text"
            placeholder="Tìm kiếm tin tức..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <SortButton
            $active={sortOrder === 'desc'}
            onClick={toggleSortOrder}
          >
            {sortOrder === 'desc' ? 'Mới nhất' : 'Cũ nhất'}
          </SortButton>
        </SearchContainer>
        <NewsGrid>
          {filteredAndSortedNews.map(item => (
            <CardWrapper key={item._id} onClick={() => handleNewsClick(item._id)}>
              <CardImage src={item.image} />
              <CardInfo>
                <NewsTitleStyled>{item.title}</NewsTitleStyled>
                <NewsDesc>{item.content}</NewsDesc>
                <NewsDateStyled>
                  {new Date(item.createdAt).toLocaleDateString('vi-VN')}
                </NewsDateStyled>
              </CardInfo>
            </CardWrapper>
          ))}
        </NewsGrid>
      </Container>
    </NewsSection>
  );
};

export default NewsList;