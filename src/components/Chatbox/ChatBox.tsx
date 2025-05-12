import React, { useState } from 'react';
import styled from 'styled-components';
import { IconButton, Paper, TextField } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';

const ChatContainer = styled.div`
  position: fixed;
  bottom: 40px;
  right: 20px;
  z-index: 1000;
`;

const ChatButton = styled(IconButton)`
  color: white !important;
  width: 75px;
  height: 75px;
  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }
`;

const ChatWindow = styled(Paper)`
  position: absolute;
  bottom: 70px;
  right: 0;
  width: 320px;
  height: 460px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
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
  position: relative;
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

interface ChatMessage {
  text: string;
  isUser: boolean;
}

const autoResponses = {
  'xin chào': 'Xin chào! Tôi có thể giúp gì cho bạn?',
  'giá': 'Để biết giá cụ thể của dịch vụ, vui lòng cho chúng tôi biết loại xe và dịch vụ bạn cần. Hoặc gọi số hotline: 1900.866.876',
  'địa chỉ': '19 Phan Văn Trị, Phường 07, Quận Gò Vấp, Tp HCM',
  'liên hệ': 'Bạn có thể liên hệ với chúng tôi qua:\nHotline: 1900.866.876\nDi động: 0908.751.765 - 0913.169.066\nEmail: otobathanh@gmail.com',
  'default': 'Cảm ơn bạn đã liên hệ. Vui lòng để lại số điện thoại, chúng tôi sẽ gọi lại cho bạn sớm nhất!'
};

const ChatBox = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { text: 'Xin chào! Tôi có thể giúp gì cho bạn?', isUser: false }
  ]);
  const [inputText, setInputText] = useState('');

  const handleSend = () => {
    if (!inputText.trim()) return;

    const userMessage = { text: inputText, isUser: true };
    setMessages(prev => [...prev, userMessage]);

    // Find auto response
    const lowerInput = inputText.toLowerCase();
    let responseText = autoResponses.default;

    for (const [key, value] of Object.entries(autoResponses)) {
      if (lowerInput.includes(key)) {
        responseText = value;
        break;
      }
    }

    setTimeout(() => {
      const botResponse = { text: responseText, isUser: false };
      setMessages(prev => [...prev, botResponse]);
    }, 1000);

    setInputText('');
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
              <Avatar src="https://res.cloudinary.com/drbjrsm0s/image/upload/v1746511865/pngtree-chatbot-in-modern-blue-circle-png-image_11914075_a8qju6.png" alt="Bot" />
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
                {!message.isUser && <BotAvatarInline src="https://res.cloudinary.com/drbjrsm0s/image/upload/v1746511865/pngtree-chatbot-in-modern-blue-circle-png-image_11914075_a8qju6.png" alt="Bot" />}
                {message.text}
              </Message>
            ))}
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
        <img src="https://res.cloudinary.com/drbjrsm0s/image/upload/v1746511865/pngtree-chatbot-in-modern-blue-circle-png-image_11914075_a8qju6.png" alt="Chat" />
      </ChatButton>
    </ChatContainer>
  );
};

export default ChatBox;
