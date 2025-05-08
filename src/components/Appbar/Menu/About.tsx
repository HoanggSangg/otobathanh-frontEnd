import React from 'react';
import styled from 'styled-components';

const AboutContainer = styled.div`
  margin: 0 auto;
  padding: clamp(20px, 4vw, 40px) clamp(10px, 3vw, 20px);
`;

const AboutContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: clamp(30px, 5vw, 60px);
  margin: clamp(20px, 5vw, 50px);
  align-items: center;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    margin: clamp(15px, 3vw, 30px);
  }
`;

const AboutImage = styled.img`
  width: 100%;
  height: auto;
  padding: clamp(15px, 3vw, 30px);
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.02);
  }
`;

const AboutText = styled.div`
  background: #fff;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);

  h2 {
    color: #e31837;
    font-size: clamp(20px, 3vw, 28px);
    margin-bottom: 20px;
    text-transform: uppercase;
    position: relative;
    padding-bottom: 12px;

    &:after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 60px;
      height: 3px;
      background: #e31837;
    }
  }

  p {
    color: #444;
    font-size: clamp(14px, 2vw, 16px);
    line-height: 1.8;
    margin-bottom: 25px;
    text-align: justify;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 20px 0;

    li {
      color: #444;
      font-size: 16px;
      line-height: 1.8;
      margin-bottom: 15px;
      padding-left: 25px;
      position: relative;

      &:before {
        content: "→";
        color: #e31837;
        position: absolute;
        left: 0;
        font-weight: bold;
      }

      &:hover {
        color: #e31837;
        transform: translateX(5px);
        transition: all 0.3s ease;
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
            Honda Ô tô Bá Thành tự hào là đại lý ủy quyền chính thức của Honda Việt Nam,
            với hơn 10 năm kinh nghiệm trong lĩnh vực phân phối xe và dịch vụ bảo dưỡng.
            Chúng tôi cam kết mang đến những sản phẩm và dịch vụ chất lượng cao nhất theo
            tiêu chuẩn Honda toàn cầu.
          </p>
          <h2>Tầm nhìn</h2>
          <p>
            Với khát vọng trở thành đại lý Honda hàng đầu tại khu vực, chúng tôi không ngừng
            đổi mới và nâng cao chất lượng dịch vụ, mang đến trải nghiệm tuyệt vời và sự
            hài lòng tối đa cho khách hàng.
          </p>
          <h2>Giá trị cốt lõi</h2>
          <ul>
            <li>Chất lượng dịch vụ đạt chuẩn Honda toàn cầu</li>
            <li>Đội ngũ kỹ thuật viên được đào tạo chuyên sâu</li>
            <li>Trang thiết bị hiện đại, công nghệ tiên tiến</li>
            <li>Không gian showroom rộng rãi, sang trọng</li>
            <li>Dịch vụ chăm sóc khách hàng 24/7</li>
            <li>Cam kết giá cả cạnh tranh nhất thị trường</li>
            <li>Chính sách bảo hành, bảo dưỡng ưu đãi</li>
          </ul>
        </AboutText>
      </AboutContent>
    </AboutContainer>
  );
};

export default About;