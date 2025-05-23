import React, { useState, useEffect, useRef } from 'react';
import { Socket } from 'socket.io-client';
import { getCurrentUser } from '../components/Utils/auth';
import { createSocketConnection } from '../config/socket';
import SendIcon from '@mui/icons-material/Send';
import { IconButton, TextField } from '@mui/material';
import styled from 'styled-components';

const ChatContent = styled.div`
  display: flex;
  flex-direction: column;
  height: calc(100% - 64px); // Adjust for header height
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

const AdminAvatar = styled.img`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  margin-right: 6px;
`;

const InputContainer = styled.div`
  padding: 12px;
  display: flex;
  gap: 8px;
  border-top: 1px solid #eee;
  background: white;
`;

const StyledTextField = styled(TextField)`
  flex: 1;
`;

const SendButton = styled(IconButton)`
  color: #ff0000 !important;
`;

const ErrorMessage = styled.div`
  margin: 8px 16px;
  padding: 8px 12px;
  background-color: #fee2e2;
  color: #ef4444;
  border-radius: 8px;
  font-size: 14px;
`;

const StatusMessage = styled.div`
  text-align: center;
  color: #666;
  font-size: 14px;
  margin: 8px 0;
  font-style: italic;
`;

interface Message {
  text: string;
  isUser: boolean;
}

const UserChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { text: 'Xin chào! Vui lòng đợi trong giây lát, nhân viên sẽ sớm kết nối với bạn.', isUser: false }
  ]);
  const [inputText, setInputText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [adminConnected, setAdminConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const adminSocketIdRef = useRef<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const socket = createSocketConnection();
    if (socket) {
      socketRef.current = socket;

      socket.on('start_chat', ({ adminSocketId }) => {
        adminSocketIdRef.current = adminSocketId;
        setAdminConnected(true);
        setMessages(prev => [
          ...prev,
          { text: '💬 Admin đã kết nối với bạn.', isUser: false }
        ]);
      });

      socket.on('chat_ended', ({ message }) => {
        setMessages(prev => [
          ...prev,
          { text: `❌ ${message}`, isUser: false }
        ]);
        adminSocketIdRef.current = null;
        setAdminConnected(false);
      });

      socket.on('receive_message', (data: { message: string; from: string }) => {
        setMessages(prev => [...prev, { text: data.message, isUser: false }]);
      });

      socket.on('connect_error', () => {
        setError('Không thể kết nối đến server');
      });

      socket.on('connect', () => {
        setError(null);
      });

      return () => {
        socket.disconnect();
      };
    }
  }, []);

  const handleSend = () => {
    if (!inputText.trim() || !socketRef.current || !adminConnected) return;

    const currentUser = getCurrentUser();
    const message = {
      message: inputText,
      from: currentUser?.fullName || 'Guest',
      userId: currentUser?.id || 'guest',
      adminSocketId: adminSocketIdRef.current
    };

    socketRef.current.emit('send_message', message);
    setMessages(prev => [...prev, { text: inputText, isUser: true }]);
    setInputText('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <ChatContent>
      <MessagesContainer>
        {messages.map((message, index) => (
          <Message key={index} $isUser={message.isUser}>
            {!message.isUser && (
              <AdminAvatar 
                src="https://res.cloudinary.com/drbjrsm0s/image/upload/v1747809635/z6623831613116_235dd36d63910822264d104d3529a58f_zfdkr1.jpg" 
                alt="Admin" 
              />
            )}
            {message.text}
          </Message>
        ))}
        {!adminConnected && (
          <StatusMessage>
            Đang chờ kết nối với nhân viên...
          </StatusMessage>
        )}
        <div ref={messagesEndRef} />
        {error && <ErrorMessage>{error}</ErrorMessage>}
      </MessagesContainer>

      <InputContainer>
        <StyledTextField
          placeholder={adminConnected ? "Nhập tin nhắn..." : "Đang chờ kết nối..."}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={handleKeyPress}
          size="small"
          multiline
          maxRows={3}
          disabled={!adminConnected}
        />
        <SendButton onClick={handleSend} disabled={!adminConnected}>
          <SendIcon />
        </SendButton>
      </InputContainer>
    </ChatContent>
  );
};

export default UserChat;
