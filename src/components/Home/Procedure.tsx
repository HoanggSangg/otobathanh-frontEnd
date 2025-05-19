import React, { useState, useEffect } from 'react';
import '../css/Procedure.css';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

interface Step {
  title: string;
  description: string;
  icon: string;
}

const steps: Step[] = [
  { title: '1. TIẾP NHẬN', description: 'Tiếp nhận thông tin và yêu cầu từ khách hàng', icon: 'https://res.cloudinary.com/drbjrsm0s/image/upload/v1745463451/procedure4_iwxdd1.jpg' },
  { title: '2. KIỂM TRA', description: 'Kiểm tra tổng thể tình trạng xe', icon: 'https://res.cloudinary.com/drbjrsm0s/image/upload/v1745463451/procedure3_volt4l.jpg' },
  { title: '3. CHẨN ĐOÁN', description: 'Chẩn đoán chính xác các vấn đề của xe', icon: 'https://res.cloudinary.com/drbjrsm0s/image/upload/v1745463451/procedure1_m6oigh.jpg' },
  { title: '4. BÁO GIÁ CHI TIẾT', description: 'Báo giá chi tiết và minh bạch', icon: 'https://res.cloudinary.com/drbjrsm0s/image/upload/v1745463451/procedure2_sqbwvm.jpg' },
  { title: '5. XÁC NHẬN', description: 'Xác nhận đồng ý từ khách hàng', icon: 'https://res.cloudinary.com/drbjrsm0s/image/upload/v1745463451/procedure4_iwxdd1.jpg' },
  { title: '6. CHUẨN BỊ', description: 'Chuẩn bị phụ tùng và thiết bị cần thiết', icon: 'https://res.cloudinary.com/drbjrsm0s/image/upload/v1745463451/procedure3_volt4l.jpg' },
  { title: '7. SỬA CHỮA', description: 'Tiến hành sửa chữa theo quy trình', icon: 'https://res.cloudinary.com/drbjrsm0s/image/upload/v1745463451/procedure1_m6oigh.jpg' },
  { title: '8. KIỂM TRA LẠI', description: 'Kiểm tra kỹ lưỡng sau sửa chữa', icon: 'https://res.cloudinary.com/drbjrsm0s/image/upload/v1745463451/procedure2_sqbwvm.jpg' },
  { title: '9. VỆ SINH', description: 'Vệ sinh xe sạch sẽ trước khi giao', icon: 'https://res.cloudinary.com/drbjrsm0s/image/upload/v1745463451/procedure4_iwxdd1.jpg' },
  { title: '10. NGHIỆM THU', description: 'Nghiệm thu cùng khách hàng', icon: 'https://res.cloudinary.com/drbjrsm0s/image/upload/v1745463451/procedure3_volt4l.jpg' },
  { title: '11. BÀN GIAO', description: 'Bàn giao xe cho khách hàng', icon: 'https://res.cloudinary.com/drbjrsm0s/image/upload/v1745463451/procedure1_m6oigh.jpg' },
  { title: '12. BẢO HÀNH', description: 'Theo dõi và hỗ trợ bảo hành', icon: 'https://res.cloudinary.com/drbjrsm0s/image/upload/v1745463451/procedure2_sqbwvm.jpg' }
];

const images = [
  'https://res.cloudinary.com/drbjrsm0s/image/upload/v1745462527/xecuuthuong_vr3au3.png',
  'https://res.cloudinary.com/drbjrsm0s/image/upload/v1745462526/cano_kmjkxk.jpg',
  'https://res.cloudinary.com/drbjrsm0s/image/upload/v1745462526/xecsgt_qsggsw.jpg',
  'https://res.cloudinary.com/drbjrsm0s/image/upload/v1745462527/xecuuhoa_ome8tj.png'
];

const WorkProcess: React.FC = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex(prev => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    setShowLeftButton(container.scrollLeft > 0);
    setShowRightButton(container.scrollLeft + container.clientWidth < container.scrollWidth - 1);
  };

  const scrollSteps = (direction: 'left' | 'right') => {
    const el = document.getElementById('steps-scroll');
    if (el) {
      el.scrollBy({ left: direction === 'left' ? -600 : 600, behavior: 'smooth' });
    }
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
          <button className="scroll-button left" style={{ display: showLeftButton ? 'flex' : 'none' }} onClick={() => scrollSteps('left')}>
            <FaChevronLeft />
          </button>
          <button className="scroll-button right" style={{ display: showRightButton ? 'flex' : 'none' }} onClick={() => scrollSteps('right')}>
            <FaChevronRight />
          </button>
          <div className="steps-container" id="steps-scroll" onScroll={handleScroll}>
            {steps.map((step, idx) => (
              <div key={idx} className="step-box">
                <img src={step.icon} alt={step.title} className="step-icon" />
                <div className="step-content">
                  <h3 className="step-title">{step.title}</h3>
                  <p className="step-description">
                    {step.description}
                  </p>
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
