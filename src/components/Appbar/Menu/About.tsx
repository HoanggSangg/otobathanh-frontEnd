import React from 'react';
import styled from 'styled-components';

const AboutContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const AboutContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  margin-top: 30px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const AboutImage = styled.img`
  width: 100%;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const AboutText = styled.div`
  h2 {
    color: #e31837;
    font-size: 24px;
    margin-bottom: 20px;
    text-transform: uppercase;
  }

  p {
    color: #333;
    font-size: 16px;
    line-height: 1.8;
    margin-bottom: 20px;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 20px 0;

    li {
      color: #333;
      font-size: 16px;
      line-height: 1.8;
      margin-bottom: 10px;
      padding-left: 20px;
      position: relative;

      &:before {
        content: "•";
        color: #e31837;
        position: absolute;
        left: 0;
      }
    }
  }
`;

const About = () => {
  return (
    <AboutContainer>
      <AboutContent>
        <AboutImage src="https://res.cloudinary.com/drbjrsm0s/image/upload/v1745463450/logo_ulbaie.png" alt="Honda Ô tô Bá Thành Showroom" />
        <AboutText>
          <h2>Giới thiệu chung</h2>
          <p>
            Honda Ô tô Bá Thành là đại lý ủy quyền chính thức của Honda Việt Nam,
            chuyên phân phối các dòng xe Honda chính hãng và cung cấp dịch vụ bảo dưỡng,
            sửa chữa theo tiêu chuẩn Honda toàn cầu.
          </p>
          <h2>Tầm nhìn</h2>
          <p>
            Trở thành đại lý Honda hàng đầu tại khu vực, mang đến trải nghiệm
            tuyệt vời và sự hài lòng cao nhất cho khách hàng.
          </p>
          <h2>Giá trị cốt lõi</h2>
          <ul>
            <li>Chất lượng dịch vụ đạt chuẩn Honda toàn cầu</li>
            <li>Đội ngũ nhân viên chuyên nghiệp, tận tâm</li>
            <li>Trang thiết bị hiện đại, công nghệ tiên tiến</li>
            <li>Không gian showroom sang trọng, tiện nghi</li>
            <li>Dịch vụ chăm sóc khách hàng chu đáo</li>
          </ul>
        </AboutText>
      </AboutContent>
    </AboutContainer>
  );
};

export default About; 