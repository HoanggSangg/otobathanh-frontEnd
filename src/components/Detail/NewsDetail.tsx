import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { getNewsByIdAPI, getAllNewsAPI } from '../API';

const NewsContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
  background-color: #fff;
  box-shadow: 0 4px 16px rgba(0,0,0,0.08);
  border-radius: 16px;
  margin-top: 30px;
  margin-bottom: 30px;

  @media (max-width: 768px) {
    padding: 15px;
    margin-top: 15px;
    margin-bottom: 15px;
  }
`;

const NewsHeader = styled.div`
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 2px solid #f5f5f5;
`;

const NewsTitle = styled.h1`
  font-size: 32px;
  color: #333;
  margin-bottom: 20px;
  line-height: 1.4;
  font-weight: 600;

  @media (max-width: 768px) {
    font-size: 24px;
    margin-bottom: 15px;
  }
`;

const NewsMeta = styled.div`
  font-size: 14px;
  color: #888;
  font-style: italic;

  span {
    color: #e31837;
    font-weight: 500;
    margin-left: 4px;
    margin-right: 8px;
  }

  @media (max-width: 768px) {
    font-size: 13px;
  }
`;

const Sidebar = styled.div`
  background-color: #f8f8f8;
  padding: 25px;
  border-radius: 12px;
  height: fit-content;
  position: sticky;
  top: 150px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);

  @media (max-width: 768px) {
    padding: 20px;
    position: static;
  }

  h3 {
    color: #e31837;
    font-size: 20px;
    margin-bottom: 20px;
    text-transform: uppercase;
    font-weight: 600;
    padding-bottom: 10px;
    position: relative;

    &:after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 2px;
      background-color: #e31837;
    }

    @media (max-width: 768px) {
      font-size: 18px;
      margin-bottom: 15px;
    }
  }

  ul {
    list-style: none;
    padding: 0;
  }
`;

const NewsContent = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 40px;
  margin-top: 30px;
  padding: 20px;
  background-color: #fff;

  @media (max-width: 1024px) {
    grid-template-columns: 2fr 1fr;
    gap: 30px;
    padding: 15px;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    padding: 10px;
    gap: 20px;
  }
`;

const MainContent = styled.div`
  img {
    width: 100%;
    object-fit: cover;
    border-radius: 12px;
    margin-bottom: 30px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);

    @media (max-width: 768px) {
      margin-bottom: 20px;
    }
  }

  p {
    color: #444;
    font-size: 16px;
    line-height: 1.8;
    margin-bottom: 20px;
    text-align: justify;
    white-space: pre-line;

    @media (max-width: 768px) {
      font-size: 15px;
      line-height: 1.6;
    }
  }
`;

const RelatedNewsItem = styled.li`
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px 0;
  border-bottom: 1px solid #eee;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 15px;

  @media (max-width: 768px) {
    font-size: 14px;
    padding: 12px 0;
  }

  &:hover {
    color: #e31837;
    padding-left: 10px;
    background-color: rgba(227, 24, 55, 0.05);
  }

  &::before {
    content: "→";
    color: #e31837;
    font-size: 18px;
    min-width: 20px;
  }
`;

interface NewsItem {
  _id: string;
  title: string;
  content: string;
  image: string;
  createdAt: string;
}

const NewsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentNews, setCurrentNews] = useState<NewsItem | null>(null);
  const [relatedNews, setRelatedNews] = useState<NewsItem[]>([]);

  useEffect(() => {
    const fetchNewsDetails = async () => {
      try {
        if (id) {
          // Fetch current news
          const newsData = await getNewsByIdAPI(id);
          setCurrentNews(newsData);

          // Fetch all news for related news
          const allNews = await getAllNewsAPI();
          const filtered = allNews.filter((news: NewsItem) => news._id !== id).slice(0, 3);
          setRelatedNews(filtered);
        }
      } catch (error) {
        console.error('Error fetching news:', error);
      }
    };

    fetchNewsDetails();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id, navigate]);

  if (!currentNews && id) {
    return <div>Loading...</div>;
  }

  return (
    <NewsContainer>
      {currentNews ? (
        <>
          <NewsHeader>
            <NewsTitle>{currentNews.title}</NewsTitle>
            <NewsMeta>
              ĐĂNG VÀO <span>{new Date(currentNews.createdAt).toLocaleDateString('vi-VN')}</span> BỞI <span>ADMIN</span>
            </NewsMeta>
          </NewsHeader>

          <NewsContent>
            <MainContent>
              <img src={currentNews.image} alt={currentNews.title} />
              <p>{currentNews.content}</p>
            </MainContent>

            <Sidebar>
              <h3>Tin tức liên quan</h3>
              <ul>
                {relatedNews.map(news => (
                  <RelatedNewsItem key={news._id} onClick={() => navigate(`/tin-tuc/${news._id}`)}>
                    {news.title}
                  </RelatedNewsItem>
                ))}
              </ul>
            </Sidebar>
          </NewsContent>
        </>
      ) : null}
    </NewsContainer>
  );
};

export default NewsPage;