import React, { useState } from 'react';
import styled from 'styled-components';
import { Modal, Box } from '@mui/material';

const AboutContainer = styled.div`
  margin: 0 auto;
  padding: 60px 80px;

  @media (max-width: 900px) {
    padding: 20px 0;
  }
`;

const AboutContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: clamp(20px, 3vw, 20px);
  margin: clamp(0, 5vw, 50px);
  align-items: start;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    margin: clamp(15px, 3vw, 30px);
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const AboutImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  padding: clamp(10px, 2vw, 10px);
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.02);
    cursor: pointer;
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

const ImageContainer = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 10px;
  
  @media (max-width: 900px) {
    order: 2;
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const ModalImage = styled.img`
  max-width: 90vw;
  max-height: 90vh;
  object-fit: contain;
`;

const ModalStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  bgcolor: 'rgba(0, 0, 0, 0.5)',
};

const About = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleImageClick = (imageSrc: string) => {
    setSelectedImage(imageSrc);
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
  };

  return (
    <AboutContainer>
      <AboutContent>
        <ImageContainer>
          <AboutImage 
            src="https://res.cloudinary.com/drbjrsm0s/image/upload/v1747106483/bangcap3_ygcoer.jpg" 
            alt="Honda Ô tô Bá Thành Showroom 1" 
            onClick={() => handleImageClick("https://res.cloudinary.com/drbjrsm0s/image/upload/v1747106483/bangcap3_ygcoer.jpg")}
          />
          <AboutImage 
            src="https://res.cloudinary.com/drbjrsm0s/image/upload/v1747106485/Untitled_DANG_ISO_t73hk1.png" 
            alt="Honda Ô tô Bá Thành Showroom 2" 
            onClick={() => handleImageClick("https://res.cloudinary.com/drbjrsm0s/image/upload/v1747106485/Untitled_DANG_ISO_t73hk1.png")}
          />
          <AboutImage 
            src="https://res.cloudinary.com/drbjrsm0s/image/upload/v1747106692/bangcap2_es8csu.jpg" 
            alt="Honda Ô tô Bá Thành Showroom 2" 
            onClick={() => handleImageClick("https://res.cloudinary.com/drbjrsm0s/image/upload/v1747106692/bangcap2_es8csu.jpg")}
          />
          <AboutImage 
            src="https://res.cloudinary.com/drbjrsm0s/image/upload/v1747106698/iso_hfu6kz.jpg" 
            alt="Honda Ô tô Bá Thành Showroom 2" 
            onClick={() => handleImageClick("https://res.cloudinary.com/drbjrsm0s/image/upload/v1747106698/iso_hfu6kz.jpg")}
          />
        </ImageContainer>
        
        <AboutText>
          <h2>Giới thiệu chung</h2>
          <p>
            Trong nhu cầu thực tế hiện nay, việc chọn lựa dịch vụ và mua bán sao cho phù hợp là một việc làm mọi người rất đắn đo, đặc biệt là những dịch vụ thuộc lĩnh vực hot nhất hiện nay: dịch vụ mua bán, bảo trì và sửa chữa ô tô.
          </p>
          <h2>Tầm nhìn</h2>
          <p>
            Bằng niềm tin vững chắc, cùng với lòng nhiệt huyết của ban giám đốc và đội ngũ nhân viên, kỹ thuật viên chuyên nghiệp,lành nghề và năng động, tận tâm với công việc. Garage ô tô Bá Thành đã có những bước đi vững chắc, đầy ấn tượng và đáng tự hào trên thị trường xe ô tô hiện nay.
          </p>
          <h2>Giá trị cốt lõi</h2>
          <ul>
            <li>Bằng niềm tin vững chắc, cùng với lòng nhiệt huyết của ban giám đốc và đội ngũ nhân viên, kỹ thuật viên chuyên nghiệp,lành nghề và năng động, tận tâm với công việc</li>
            <li>Với sự chuyên nghiệp và sự tận tâm</li>
            <li>Khẳng định chất lượng đảm bảo sẽ mang đến cho quý khách sự hài lòng</li>
          </ul>
        </AboutText>
      </AboutContent>

      <Modal
        open={!!selectedImage}
        onClose={handleCloseModal}
        sx={ModalStyle}
        onClick={handleCloseModal}
      >
        <Box onClick={(e) => e.stopPropagation()}>
          {selectedImage && <ModalImage src={selectedImage} alt="Enlarged view" />}
        </Box>
      </Modal>
    </AboutContainer>
  );
};

export default About;