import React from 'react';
import '../css/Procedure.css';
import { useState, useEffect } from 'react';

interface Step {
  title: string;
  description: string;
  icon: string;
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

const steps: Step[] = [
  {
    title: 'CUỘC HẸN',
    description:
      'Bạn có thể trực tiếp đến xưởng dịch vụ của chúng tôi hoặc để lại thông tin để đội ngũ chúng tôi liên lạc.',
    icon: 'https://res.cloudinary.com/drbjrsm0s/image/upload/v1745463451/procedure4_iwxdd1.jpg',
    position: 'top-left',
  },
  {
    title: 'CHẨN ĐOÁN',
    description:
      'Chúng tôi đã đầu tư vào các công cụ và phần mềm chẩn đoán hiện đại cho xe của bạn.',
    icon: 'https://res.cloudinary.com/drbjrsm0s/image/upload/v1745463451/procedure3_volt4l.jpg',
    position: 'top-right',
  },
  {
    title: 'SỬA CHỮA',
    description:
      'Chúng tôi là xưởng sửa chữa hàng đầu với thợ có trình độ cao tại Sài Gòn.',
    icon: 'https://res.cloudinary.com/drbjrsm0s/image/upload/v1745463451/procedure1_m6oigh.jpg',
    position: 'bottom-left',
  },
  {
    title: 'HOÀN THÀNH',
    description:
      'Xe của bạn sẽ được vệ sinh sạch sẽ và trả đúng hẹn sau khi hoàn thành.',
    icon: 'https://res.cloudinary.com/drbjrsm0s/image/upload/v1745463451/procedure2_sqbwvm.jpg',
    position: 'bottom-right',
  },
];

const images = [
  'https://res.cloudinary.com/drbjrsm0s/image/upload/v1745462527/xecuuthuong_vr3au3.png',
  'https://res.cloudinary.com/drbjrsm0s/image/upload/v1745462526/cano_kmjkxk.jpg',
  'https://res.cloudinary.com/drbjrsm0s/image/upload/v1745462526/xecsgt_qsggsw.jpg',
  'https://res.cloudinary.com/drbjrsm0s/image/upload/v1745462527/xecuuhoa_ome8tj.png',
];

const WorkProcess: React.FC = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="work-process-container">
      <h2 className="work-process-title">QUY TRÌNH LÀM VIỆC CỦA CHÚNG TÔI</h2>
      <p className="work-process-subtitle">
        Cho dù chiếc xe của bạn cần dịch vụ thường xuyên hoặc sửa chữa khẩn cấp, bạn có thể tin tưởng vào đội ngũ chuyên gia của chúng tôi.
      </p>
      
      <div className="work-process-wrapper">
        <div className="car-center">
          <img 
            src={images[currentImageIndex]} 
            alt={`Car ${currentImageIndex + 1}`} 
            style={{ transition: 'opacity 0.5s ease-in-out' }}
          />
        </div>

        {steps.map((step, index) => (
          <div key={index} className={`step-box ${step.position}`}>
            <img src={step.icon} alt={step.title} className="step-icon" />
            <h3 className="step-title">{step.title}</h3>
            <p className="step-description">{step.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkProcess;
