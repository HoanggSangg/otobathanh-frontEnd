import styled from 'styled-components';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { createContactAPI } from '../../API';
import { useToast } from '../../Styles/ToastProvider';
import React, { useState } from 'react';

const ContactContainer = styled.div`
  margin: 0 auto;
  padding: 20px;
`;

const ContactGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  margin: clamp(20px, 5vw, 50px);

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    margin: clamp(5px, 3vw, 10px);
  }
`;

const MapSection = styled.div`
  margin-top: 40px;
  
  h2 {
    color: #e31837;
    font-size: 24px;
    margin-bottom: 20px;
    text-transform: uppercase;
  }
`;

const MapContainer = styled.div`
  width: 100%;
  height: 450px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  iframe {
    width: 100%;
    height: 100%;
    border: none;
  }
`;

const ContactInfo = styled.div`
  background: #fff;
  padding: 30px;

  h2 {
    color: #e31837;
    font-size: 24px;
    margin-bottom: 20px;
    text-transform: uppercase;
    position: relative;
    padding-bottom: 10px;

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
    color: #333;
    font-size: 16px;
    line-height: 1.8;
    margin-bottom: 20px;
    text-align: justify;
  }
`;

const InfoList = styled.div`
  margin-top: 30px;
  display: flex;
  flex-direction: column;
  gap: 25px;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: flex-start;
  padding: 15px;
  background: #f8f8f8;
  border-radius: 8px;
  transition: all 0.3s ease;
  
  svg {
    color: #e31837;
    margin-right: 15px;
    margin-top: 3px;
    font-size: 24px;
    transition: all 0.3s ease;
  }

  &:hover {
    transform: translateX(10px);
    background: #fff;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);

    svg {
      transform: scale(1.1);
    }
  }

  div {
    h3 {
      color: #333;
      font-size: 16px;
      margin-bottom: 8px;
      font-weight: 600;
    }

    p {
      color: #666;
      font-size: 15px;
      margin: 0;
      line-height: 1.6;
    }
  }
`;

const ContactForm = styled.form`
  background: #f8f8f8;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);

  h2 {
    color: #e31837;
    font-size: 24px;
    margin-bottom: 20px;
    text-transform: uppercase;
    position: relative;
    padding-bottom: 10px;

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
`;

const FormGroup = styled.div`
  margin-bottom: 20px;

  label {
    display: block;
    color: #333;
    margin-bottom: 8px;
    font-size: 15px;
    font-weight: 500;
  }

  input, textarea, select {
    width: 100%;
    padding: 12px 15px;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 15px;
    transition: all 0.3s ease;

    &:focus {
      outline: none;
      border-color: #e31837;
      box-shadow: 0 0 0 3px rgba(227, 24, 55, 0.1);
    }

    &::placeholder {
      color: #999;
    }
  }

  textarea {
    height: 120px;
    resize: vertical;
  }
`;

const SubmitButton = styled.button`
  background: #e31837;
  color: white;
  border: none;
  padding: 14px 35px;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  display: inline-block;
  margin-top: 10px;

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      120deg,
      transparent,
      rgba(255, 255, 255, 0.3),
      transparent
    );
    transition: all 0.6s;
  }

  &:hover {
    background: #c41230;
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(227, 24, 55, 0.3);

    &:before {
      left: 100%;
    }
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const TimeSlotSelect = styled.select`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 15px;

  &:focus {
    outline: none;
    border-color: #e31837;
  }
`;

const Contact = () => {
  const showToast = useToast();
  const [images, setImages] = useState<File[]>([]);
  // Update the formData state type
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    message: '',
    timeSlot: '',
    date: '',
    images: [] as string[]
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const timeSlots = [
    '08:00', '09:00', '10:00', '11:00',
    '13:00', '14:00', '15:00', '16:00'
  ];

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files); // Chuyển FileList thành mảng
      setImages((prevImages) => [...prevImages, ...selectedFiles]); // Thêm ảnh mới vào state
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Date validation
      if (!formData.date) {
        throw new Error('Vui lòng chọn ngày hẹn.');
      }

      const base64Images = await Promise.all(images.map((image) => convertToBase64(image)));

      const submitData = {
        fullName: formData.name,
        date: formData.date,
        timeSlot: formData.timeSlot,
        numberPhone: formData.phone,
        description: formData.message,
        images: base64Images,
      };

      const response = await createContactAPI(submitData);

      showToast("Đặt lịch thành công!", 'success');
      setFormData({
        name: '',
        phone: '',
        message: '',
        timeSlot: '',
        date: '',
        images: []
      });
      setImages([]);
    } catch (error: any) {
      console.error('Error during form submission:', error);  // Log the error for debugging

      // Hiển thị lỗi nếu có
      if (error.response && error.response.data && error.response.data.message) {
        showToast(error.response.data.message, 'error');
      } else {
        showToast(error.message || 'Đã xảy ra lỗi không xác định.', 'error');
      }
    } finally {
      setIsSubmitting(false);
    }
  };



  const handleRemoveImage = (index: number) => {
    setImages(prevImages => prevImages.filter((_, i) => i !== index));
  };

  return (
    <ContactContainer>
      <ContactGrid>
        <ContactInfo>
          <h2>Thông tin liên hệ</h2>
          <p>
            Công ty cung cấp nhiều dịch vụ như bảo dưỡng nhanh, đồng sơn cao cấp (DUPONT & 3M), sửa chữa lưu động, và cứu hộ giao thông. Với trang thiết bị hiện đại và đội ngũ kỹ thuật viên chuyên nghiệp, Ô tô Bá Thành cam kết mang đến chất lượng dịch vụ tốt nhất cho khách hàng.
          </p>
          <InfoList>
            <InfoItem>
              <LocationOnIcon />
              <div>
                <h3>Địa chỉ</h3>
                <p>462 Phan Văn Trị, Phường 7, Quận Gò Vấp, TP.HCM</p>
                <p>​19 Phan Văn Trị, Phường 7, Quận Gò Vấp, TP.HCM</p>
              </div>
            </InfoItem>
            <InfoItem>
              <PhoneIcon />
              <div>
                <h3>Điện thoại</h3>
                <p>0913.169.066 - 1900.866.876</p>
              </div>
            </InfoItem>
            <InfoItem>
              <EmailIcon />
              <div>
                <h3>Email</h3>
                <p>otobathanh@gmail.com</p>
                <p>nhan.duong@otobathanh.com</p>
              </div>
            </InfoItem>
            <InfoItem>
              <AccessTimeIcon />
              <div>
                <h3>Giờ làm việc</h3>
                <p>​Thứ Hai - Thứ Bảy: 7:30 - 17:00</p>
              </div>
            </InfoItem>
          </InfoList>
        </ContactInfo>

        <ContactForm onSubmit={handleSubmit}>
          <h2>Gửi thông tin</h2>
          <FormGroup>
            <label>Họ và tên</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Nhập họ và tên"
              required
            />
          </FormGroup>
          <FormGroup>
            <label>Số điện thoại</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Nhập số điện thoại"
              required
            />
          </FormGroup>
          <FormGroup>
            <label>Ngày hẹn</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              min={new Date().toISOString().split('T')[0]}
              required
            />
          </FormGroup>
          <FormGroup>
            <label>Khung giờ hẹn</label>
            <TimeSlotSelect
              name="timeSlot"
              value={formData.timeSlot}
              onChange={handleChange}
              required
            >
              <option value="">Chọn khung giờ</option>
              {timeSlots.map(slot => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </TimeSlotSelect>
          </FormGroup>
          <FormGroup>
            <label>Nội dung</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Nhập nội dung liên hệ"
              required
            ></textarea>
          </FormGroup>
          <FormGroup>
            <label>Hình ảnh</label>
            <input
              type="file"
              name="images"
              accept="image/*"
              multiple // Cho phép chọn nhiều ảnh
              onChange={handleImageChange}
            />
          </FormGroup>
          <div style={{ marginTop: '20px' }}>
            {images.map((image, index) => (
              <div key={index} style={{ display: 'inline-block', position: 'relative', marginRight: '10px' }}>
                <img
                  src={URL.createObjectURL(image)}
                  alt={`Selected ${index}`}
                  style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px' }}
                />
                <button
                  onClick={() => handleRemoveImage(index)}
                  style={{
                    position: 'absolute',
                    top: '-10px',
                    right: '-10px',
                    background: '#e31837',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    width: '24px',
                    height: '24px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <SubmitButton type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Đang gửi...' : 'Gửi thông tin'}
          </SubmitButton>
        </ContactForm>
      </ContactGrid>

      <MapSection>
        <h2>Vị trí của chúng tôi</h2>
        <MapContainer>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.872957774987!2d106.684123!3d10.822155!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317528d1b2a4b1b3%3A0x3f2c4d5e6f7g8h9i!2s19%20Phan%20V%C4%83n%20Tr%E1%BB%8B%2C%20Ph%C6%B0%E1%BB%9Dng%207%2C%20G%C3%B2%20V%E1%BA%A5p%2C%20TP.HCM!5e0!3m2!1sen!2s!4v1610000000001!5m2!1sen!2s"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Bản đồ vị trí Honda Ô tô Bá Thành"
          />
        </MapContainer>
      </MapSection>
      <MapSection>
        <MapContainer>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.123456789012!2d106.700000!3d10.830000!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317528d1b2a4b1b3%3A0x4j5k6l7m8n9o0p1q!2s15%20TL08%2C%20Ph%C6%B0%E1%BB%9Dng%20Th%E1%BA%A1nh%20L%E1%BB%9Dc%2C%20Qu%E1%BA%ADn%2012%2C%20TP.HCM!5e0!3m2!1sen!2s!4v1610000000002!5m2!1sen!2s"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Bản đồ vị trí Honda Ô tô Bá Thành"
          />
        </MapContainer>
      </MapSection>
    </ContactContainer>
  );
};

export default Contact;
