import React, { useEffect, useState, useRef } from 'react';
import { Socket } from 'socket.io-client';
import styled from 'styled-components';
import { getCurrentUser, getToken } from '../components/Utils/auth';
import { createSocketConnection } from '../config/socket';

const Container = styled.div`
  height: 80vh;
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
  background: linear-gradient(145deg, #ffffff, #f5f5f5);
`;

const ChatMain = styled.div`
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  height: 100%;
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
`;

const ChatHeader = styled.div`
  padding: 20px 30px;
  background: white;
  border-bottom: 1px solid #eee;
  border-radius: 16px 16px 0 0;

  h2 {
    color: #1e2124;
    font-size: 1.8rem;
    font-weight: 700;
    margin: 0;
  }
`;

const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 30px;
  background: linear-gradient(145deg, #f5f5f5, #ffffff);
`;

const MessageBubble = styled.div<{ isUser: boolean }>`
  display: flex;
  justify-content: ${props => props.isUser ? 'flex-end' : 'flex-start'};
  margin-bottom: 20px;

  > div {
    max-width: 70%;
    padding: 15px 20px;
    border-radius: 16px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    background: ${props => props.isUser ? 'linear-gradient(135deg, #e31837, #c41730)' : 'white'};
    color: ${props => props.isUser ? 'white' : '#333'};
  }
`;

const InputContainer = styled.div`
  padding: 20px 30px;
  background: white;
  border-top: 1px solid #eee;
  border-radius: 0 0 16px 16px;

  form {
    display: flex;
    gap: 15px;
  }
`;

const Input = styled.input`
  flex: 1;
  padding: 15px 25px;
  border: 2px solid #eee;
  border-radius: 25px;
  font-size: 1rem;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #e31837;
    box-shadow: 0 0 0 3px rgba(227, 24, 55, 0.1);
  }

  &:disabled {
    background: #f5f5f5;
    cursor: not-allowed;
  }
`;

const SendButton = styled.button<{ isActive: boolean }>`
  padding: 15px;
  border-radius: 50%;
  border: none;
  cursor: ${props => props.isActive ? 'pointer' : 'not-allowed'};
  background: ${props => props.isActive ? 'linear-gradient(135deg, #e31837, #c41730)' : '#eee'};
  color: ${props => props.isActive ? 'white' : '#999'};
  transition: all 0.3s ease;

  &:hover {
    transform: ${props => props.isActive ? 'translateY(-2px)' : 'none'};
    box-shadow: ${props => props.isActive ? '0 8px 20px rgba(227, 24, 55, 0.2)' : 'none'};
  }

  svg {
    width: 24px;
    height: 24px;
  }
`;

const ErrorMessage = styled.div`
  margin: 15px 0;
  padding: 12px 20px;
  background: #fee2e2;
  color: #ef4444;
  border-radius: 12px;
  font-size: 0.95rem;
`;

const WarningMessage = styled.div`
  margin: 15px 0;
  padding: 12px 20px;
  background: #fef3c7;
  color: #d97706;
  border-radius: 12px;
  font-size: 0.95rem;
`;

const UserChat: React.FC = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<string[]>([]);
  const [adminSocketId, setAdminSocketId] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);
  const currentUser = getCurrentUser();

  const logMessage = (msg: string) => {
    setMessages(prev => [...prev, msg]);
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setError('Vui lòng đăng nhập để sử dụng chat');
      return;
    }

    const socket = createSocketConnection();
    if (!socket) {
      setError('Không thể kết nối đến server');
      return;
    }

    socketRef.current = socket;

    socket.on("connect", () => {
      setIsConnected(true);
      setError(null);
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
      setError('Mất kết nối với server');
    });

    socket.on("start_chat", ({ adminSocketId: id }) => {
      setAdminSocketId(id);
      logMessage("💬 Admin đã kết nối với bạn.");
    });

    socket.on("receive_message", (data) => {
      const from = "👨‍💼 Admin";
      logMessage(`${from}: ${data.message}`);
    });

    socket.on("chat_ended", ({ message }) => {
      logMessage("❌ " + message);
      setAdminSocketId(null);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleSendMessage = () => {
    if (!socketRef.current || !isConnected) {
      setError('Không thể gửi tin nhắn. Vui lòng kiểm tra kết nối.');
      return;
    }
    
    if (message.trim()) {
      socketRef.current.emit("send_message", {
        message: message,
        from: currentUser?.fullName || 'Anonymous'
      });
      logMessage(`🧑 ${currentUser?.fullName || 'Bạn'}: ${message}`);
      setMessage('');
    } else {
      logMessage("⚠️ Tin nhắn rỗng.");
    }
  };

  return (
    <Container>
      <ChatMain>
        <ChatHeader>
          <h2>Chat với Admin</h2>
        </ChatHeader>

        {error && <ErrorMessage>{error}</ErrorMessage>}
        {!isConnected && !error && (
          <WarningMessage>Đang kết nối...</WarningMessage>
        )}

        <MessagesContainer ref={messagesRef}>
          {messages.map((msg, index) => {
            const isUserMessage = msg.startsWith('🧑');
            return (
              <MessageBubble key={index} isUser={isUserMessage}>
                <div>{msg}</div>
              </MessageBubble>
            );
          })}
        </MessagesContainer>

        <InputContainer>
          <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}>
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Nhập tin nhắn..."
              disabled={!isConnected}
            />
            <SendButton
              type="submit"
              disabled={!isConnected}
              isActive={isConnected && message.trim().length > 0}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </SendButton>
          </form>
          {error && <ErrorMessage>{error}</ErrorMessage>}
        </InputContainer>
      </ChatMain>
    </Container>
  );
};

export default UserChat;
