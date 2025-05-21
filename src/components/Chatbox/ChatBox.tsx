import React, { useState } from 'react';
import styled from 'styled-components';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import DeleteIcon from '@mui/icons-material/Close';
import { sendCozeMessageAPI, createContactAPI } from '../API';
import { getCurrentUser } from '../Utils/auth';
import { IconButton, Paper, TextField, MenuItem } from '@mui/material';

interface ChatMessage {
  text: string;
  isUser: boolean;
}

const SubmitButton = styled.button`
  background-color: #ff0000;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  width: 100%;
  margin-top: 10px;
  transition: background-color 0.2s;

  &:hover {
    background-color: #cc0000;
  }

  &:active {
    transform: scale(0.98);
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const ChatContainer = styled.div`
  position: fixed;
  bottom: 40px;
  right: 20px;
  z-index: 1000;

  @media (max-width: 768px) {
    bottom: 20px;
    right: 10px;
  }
`;

const ChatButton = styled(IconButton)`
  color: white !important;
  width: 75px;
  height: 75px;
  img {
    width: 90%;
    height: 90%;
    border-radius: 50%;
  }

  @media (max-width: 768px) {
    width: 60px;
    height: 60px;
  }
`;

const ChatWindow = styled(Paper)`
  position: absolute;
  bottom: 70px;
  right: 0;
  width: 320px;
  height: 500px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);

  @media (max-width: 1024px) {
    width: 25vw;
    height: 60vh;
    bottom: 70px;
    right: -10px;
  }

  @media (max-width: 768px) {
    width: 40vw;
    height: 40vh;
    bottom: 60px;
    right: -8px;
  }

  @media (max-width: 480px) {
    width: 65vw;
    height: 45vh;
    bottom: 55px;
    right: 8px;
  }
`;

const ChatHeader = styled.div`
  background-color: #ff0000;
  color: white;
  padding: 12px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Avatar = styled.img`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: white;
`;

const ChatTitle = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 14px;

  & span:first-child {
    font-weight: bold;
  }

  & span:last-child {
    font-size: 12px;
    color: #b2f2bb;
  }
`;

const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Message = styled.div<{ $isUser?: boolean }>`
  max-width: 80%;
  padding: 8px 12px;
  border-radius: 12px;
  align-self: ${props => props.$isUser ? 'flex-end' : 'flex-start'};
  background-color: ${props => props.$isUser ? '#007AFF' : '#f1f1f1'};
  color: ${props => props.$isUser ? 'white' : 'black'};
  display: flex;
  align-items: center;
`;

const BotAvatarInline = styled(Avatar)`
  width: 20px;
  height: 20px;
  margin-right: 6px;
`;

const InputContainer = styled.div`
  padding: 12px;
  display: flex;
  gap: 8px;
  border-top: 1px solid #eee;
`;

const StyledTextField = styled(TextField)`
  flex: 1;
`;

const SendButton = styled(IconButton)`
  color: #ff0000 !important;
`;

const FormInputMessage = styled(TextField)`
  && {
    background: white;
    border-radius: 12px;
    margin: 4px 0;
    width: 100%;
    align-self: flex-start;

    .MuiOutlinedInput-root {
      border-radius: 12px;
    }

    .MuiInputBase-input {
      padding: 8px 12px;
    }

    &.MuiTextField-root {
      margin-bottom: 8px;
    }
  }
`;

const ImageUploadContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  label {
    display: block;
    width: 100%;
  }

  input[type='file'] {
    width: 100%;
    padding: 8px;
    border: 1px dashed #ccc;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;

    &::file-selector-button {
      background: #ff0000;
      color: white;
      padding: 6px 12px;
      border: none;
      border-radius: 4px;
      margin-right: 8px;
      cursor: pointer;
      font-size: 14px;

      &:hover {
        background: #cc0000;
      }
    }
  }

  .preview-container {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }

  .image-preview {
    position: relative;
    width: 60px;
    height: 60px;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 4px;
    }

    .remove-button {
      position: absolute;
      top: -8px;
      right: -8px;
      padding: 2px;
      background: white;
      border-radius: 50%;
      cursor: pointer;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }
  }
`;

const ChatBox = () => {
  const timeSlots = [
    '08:00', '09:00', '10:00', '11:00',
    '13:00', '14:00', '15:00', '16:00'
  ];
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { text: 'Xin chào! Tôi có thể giúp gì cho bạn?', isUser: false }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [contactData, setContactData] = useState({
    fullName: '',
    numberPhone: '',
    description: '',
    date: '',
    timeSlot: '',
    images: [] as string[]
  });

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!contactData.fullName || !contactData.numberPhone || !contactData.date || !contactData.timeSlot) {
      setMessages(prev => [
        ...prev,
        { text: 'Vui lòng điền đầy đủ thông tin trước khi gửi.', isUser: false }
      ]);
      return;
    }

    try {
      await createContactAPI(contactData);
      setMessages(prev => [
        ...prev,
        { text: 'Cảm ơn bạn đã để lại thông tin, chúng tôi sẽ liên hệ sớm nhất.', isUser: false }
      ]);
      setContactData({ fullName: '', numberPhone: '', description: '', date: '', timeSlot: '', images: [] });
      setShowContactForm(false);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || 'Gửi thông tin thất bại. Vui lòng thử lại sau.';
      setMessages(prev => [...prev, { text: errorMessage, isUser: false }]);
    }
  };

  const handleSend = async () => {
    if (!inputText.trim() || isLoading) return;
  
    const userMessage = { text: inputText, isUser: true };
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
  
    const keywords = ["liên hệ", "đặt lịch", "gặp", "hẹn gặp", "đặt hẹn"];
    const lowerCaseMessage = inputText.toLowerCase();
  
    if (keywords.some(keyword => lowerCaseMessage.includes(keyword))) {
      setShowContactForm(true);
      setMessages(prev => [
        ...prev,
        { text: 'Vui lòng điền thông tin bên dưới để chúng tôi có thể hỗ trợ bạn.', isUser: false }
      ]);
      return;
    }
  
    if (showContactForm) {
      setShowContactForm(false);
    }
  
    setIsLoading(true);
    try {
      const currentUser = getCurrentUser();
      const userId = currentUser?.id || 'guest';
      const response = await sendCozeMessageAPI(inputText, userId);
      const botResponse = {
        text: response.botReply || 'Xin lỗi, tôi không thể xử lý yêu cầu này.',
        isUser: false
      };
      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      setMessages(prev => [
        ...prev,
        { text: 'Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau.', isUser: false }
      ]);
    } finally {
      setIsLoading(false);
    }
  };
  

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <ChatContainer>
      {isOpen && (
        <ChatWindow elevation={3}>
          <ChatHeader>
            <HeaderLeft>
              <Avatar src="https://res.cloudinary.com/drbjrsm0s/image/upload/v1747809635/z6623831613116_235dd36d63910822264d104d3529a58f_zfdkr1.jpg" alt="Bot Avatar" />
              <ChatTitle>
                <span>Trợ lý ảo của 2HM</span>
                <span>● Online</span>
              </ChatTitle>
            </HeaderLeft>
            <IconButton size="small" onClick={() => setIsOpen(false)} style={{ color: 'white' }}>
              <CloseIcon />
            </IconButton>
          </ChatHeader>

          <MessagesContainer>
            {messages.map((message, index) => (
              <Message key={index} $isUser={message.isUser}>
                {!message.isUser && <BotAvatarInline src="https://res.cloudinary.com/drbjrsm0s/image/upload/v1747809635/z6623831613116_235dd36d63910822264d104d3529a58f_zfdkr1.jpg" alt="Bot" />}
                {message.text}
              </Message>
            ))}

            {showContactForm && (
              <>
                <Message $isUser={false}>
                  <BotAvatarInline src="https://res.cloudinary.com/drbjrsm0s/image/upload/v1747809635/z6623831613116_235dd36d63910822264d104d3529a58f_zfdkr1.jpg" alt="Bot" />
                  Vui lòng điền thông tin của bạn:
                </Message>
                <FormInputMessage label="Họ tên *" value={contactData.fullName} onChange={e => setContactData({ ...contactData, fullName: e.target.value })} size="small" />
                <FormInputMessage label="Số điện thoại *" value={contactData.numberPhone} onChange={e => setContactData({ ...contactData, numberPhone: e.target.value })} size="small" />
                <FormInputMessage label="Mô tả" multiline rows={2} value={contactData.description} onChange={e => setContactData({ ...contactData, description: e.target.value })} size="small" />
                <FormInputMessage label="Ngày *" type="date" value={contactData.date} onChange={e => setContactData({ ...contactData, date: e.target.value })} InputLabelProps={{ shrink: true }} size="small" />
                <FormInputMessage
                  select
                  label="Khung giờ *"
                  value={contactData.timeSlot}
                  onChange={e => setContactData({ ...contactData, timeSlot: e.target.value })}
                  size="small"
                >
                  {timeSlots.map((time) => (
                    <MenuItem key={time} value={time}>
                      {time}
                    </MenuItem>
                  ))}
                </FormInputMessage>
                
                <ImageUploadContainer>
                  <label>
                    <input type="file" accept="image/*" multiple onChange={async (e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        const files = Array.from(e.target.files);
                        const imagePromises = files.map(file => {
                          return new Promise<string>((resolve) => {
                            const reader = new FileReader();
                            reader.onloadend = () => resolve(reader.result as string);
                            reader.readAsDataURL(file);
                          });
                        });
                        const imageUrls = await Promise.all(imagePromises);
                        setContactData(prev => ({ ...prev, images: [...prev.images, ...imageUrls] }));
                      }
                    }} />
                  </label>
                  <div className="preview-container">
                    {contactData.images.map((image, index) => (
                      <div key={index} className="image-preview">
                        <img src={image} alt={`Preview ${index}`} />
                        <IconButton className="remove-button" size="small" onClick={() => {
                          setContactData(prev => ({
                            ...prev,
                            images: prev.images.filter((_, i) => i !== index)
                          }));
                        }}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </div>
                    ))}
                  </div>
                </ImageUploadContainer>
                <SubmitButton onClick={handleContactSubmit}>Gửi liên hệ</SubmitButton>
              </>
            )}
          </MessagesContainer>

          <InputContainer>
            <StyledTextField
              placeholder="Nhập tin nhắn..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              size="small"
              multiline
              maxRows={3}
            />
            <SendButton onClick={handleSend}>
              <SendIcon />
            </SendButton>
          </InputContainer>
        </ChatWindow>
      )}
      <ChatButton onClick={() => setIsOpen(true)}>
        <img src="https://res.cloudinary.com/drbjrsm0s/image/upload/v1747809635/z6623831613116_235dd36d63910822264d104d3529a58f_zfdkr1.jpg" alt="Chat" />
      </ChatButton>
    </ChatContainer>
  );
};

export default ChatBox;
