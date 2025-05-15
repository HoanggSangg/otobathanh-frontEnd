import React, { useState, useEffect } from 'react';
import '../css/Procedure.css';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

interface Step {
  title: string;
  description: string;
  icon: string;
  position: string;
}

const steps: Step[] = [
  { title: 'TIẾP NHẬN', description: 'Tiếp nhận thông tin và yêu cầu từ khách hàng', icon: 'https://res.cloudinary.com/drbjrsm0s/image/upload/v1745463451/procedure4_iwxdd1.jpg', position: 'position-1' },
  { title: 'KIỂM TRA', description: 'Kiểm tra tổng thể tình trạng xe', icon: 'https://res.cloudinary.com/drbjrsm0s/image/upload/v1745463451/procedure3_volt4l.jpg', position: 'position-2' },
  { title: 'CHẨN ĐOÁN', description: 'Chẩn đoán chính xác các vấn đề của xe', icon: 'https://res.cloudinary.com/drbjrsm0s/image/upload/v1745463451/procedure1_m6oigh.jpg', position: 'position-3' },
  { title: 'BÁO GIÁ', description: 'Báo giá chi tiết và minh bạch', icon: 'https://res.cloudinary.com/drbjrsm0s/image/upload/v1745463451/procedure2_sqbwvm.jpg', position: 'position-4' },
  { title: 'XÁC NHẬN', description: 'Xác nhận đồng ý từ khách hàng', icon: 'https://res.cloudinary.com/drbjrsm0s/image/upload/v1745463451/procedure4_iwxdd1.jpg', position: 'position-5' },
  { title: 'CHUẨN BỊ', description: 'Chuẩn bị phụ tùng và thiết bị cần thiết', icon: 'https://res.cloudinary.com/drbjrsm0s/image/upload/v1745463451/procedure3_volt4l.jpg', position: 'position-6' },
  { title: 'SỬA CHỮA', description: 'Tiến hành sửa chữa theo quy trình', icon: 'https://res.cloudinary.com/drbjrsm0s/image/upload/v1745463451/procedure1_m6oigh.jpg', position: 'position-7' },
  { title: 'KIỂM TRA LẠI', description: 'Kiểm tra kỹ lưỡng sau sửa chữa', icon: 'https://res.cloudinary.com/drbjrsm0s/image/upload/v1745463451/procedure2_sqbwvm.jpg', position: 'position-8' },
  { title: 'VỆ SINH', description: 'Vệ sinh xe sạch sẽ trước khi giao', icon: 'https://res.cloudinary.com/drbjrsm0s/image/upload/v1745463451/procedure4_iwxdd1.jpg', position: 'position-9' },
  { title: 'NGHIỆM THU', description: 'Nghiệm thu cùng khách hàng', icon: 'https://res.cloudinary.com/drbjrsm0s/image/upload/v1745463451/procedure3_volt4l.jpg', position: 'position-10' },
  { title: 'BÀN GIAO', description: 'Bàn giao xe cho khách hàng', icon: 'https://res.cloudinary.com/drbjrsm0s/image/upload/v1745463451/procedure1_m6oigh.jpg', position: 'position-11' },
  { title: 'BẢO HÀNH', description: 'Theo dõi và hỗ trợ bảo hành', icon: 'https://res.cloudinary.com/drbjrsm0s/image/upload/v1745463451/procedure2_sqbwvm.jpg', position: 'position-12' }
];

const images = [
  'https://res.cloudinary.com/drbjrsm0s/image/upload/v1745462527/xecuuthuong_vr3au3.png',
  'https://res.cloudinary.com/drbjrsm0s/image/upload/v1745462526/cano_kmjkxk.jpg',
  'https://res.cloudinary.com/drbjrsm0s/image/upload/v1745462526/xecsgt_qsggsw.jpg',
  'https://res.cloudinary.com/drbjrsm0s/image/upload/v1745462527/xecuuhoa_ome8tj.png',
];

const WorkProcess: React.FC = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const isAtStart = container.scrollLeft === 0;
    const isAtEnd = container.scrollLeft + container.clientWidth >= container.scrollWidth - 1;

    setShowLeftButton(!isAtStart);
    setShowRightButton(!isAtEnd);
  };

  return (
    <div className="work-process-container">
      <h2 className="work-process-title">QUY TRÌNH</h2>
      <p className="work-process-subtitle">
        Cho dù chiếc xe của bạn cần dịch vụ thường xuyên hoặc sửa chữa khẩn cấp, bạn có thể tin tưởng vào đội ngũ chuyên gia của chúng tôi.
      </p>

      <div className="work-process-wrapper">
        <div className="car-center">
          <img src={images[currentImageIndex]} alt="Car rotating" />
        </div>

        <div className="scroll-container">
          <button 
            className="scroll-button left"
            style={{ display: showLeftButton ? 'flex' : 'none' }}
            onClick={() => {
              const el = document.getElementById('steps-scroll');
              if (el) el.scrollBy({ left: -600, behavior: 'smooth' });
            }}
          >
            <FaChevronLeft />
          </button>
          <button 
            className="scroll-button right"
            style={{ display: showRightButton ? 'flex' : 'none' }}
            onClick={() => {
              const el = document.getElementById('steps-scroll');
              if (el) el.scrollBy({ left: 600, behavior: 'smooth' });
            }}
          >
            <FaChevronRight />
          </button>
          <div className="steps-container" id="steps-scroll" onScroll={handleScroll}>
            {steps.map((step, index) => (
              <div key={index} className="step-box">
                <img src={step.icon} alt={step.title} className="step-icon" />
                <div className="step-content">
                  <h3 className="step-title">{step.title}</h3>
                  <p className="step-description">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkProcess;
