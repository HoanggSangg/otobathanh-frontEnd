import React, { useEffect, useState, useRef } from 'react';
import { Socket } from 'socket.io-client';
import styled from 'styled-components';
import { getCurrentUser, getToken } from '../components/Utils/auth';
import { createSocketConnection } from '../config/socket';
import { getAccountByIdAPI } from '../components/API';

const Container = styled.div`
    height: 80vh;
    max-width: 1400px;
    margin: 0 auto;
    padding: 20px;
    background: linear-gradient(145deg, #ffffff, #f5f5f5);
    display: flex;
  `;

const Sidebar = styled.div`
    width: 380px;
    background: white;
    border-right: 1px solid #eee;
    display: flex;
    flex-direction: column;
    box-shadow: 4px 0 15px rgba(0, 0, 0, 0.05);
  `;

const SidebarHeader = styled.div`
    padding: 25px;
    border-bottom: 1px solid #eee;
    
    h2 {
      color: #1e2124;
      font-size: 1.8rem;
      font-weight: 700;
      margin-bottom: 8px;
    }
    
    p {
      color: #666;
      font-size: 0.9rem;
    }
  `;

const ChatList = styled.div`
    overflow-y: auto;
    flex: 1;
  `;

const ChatItem = styled.div<{ active: boolean }>`
    padding: 15px 25px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 15px;
    border-bottom: 1px solid #eee;
    transition: all 0.3s ease;
    background: ${props => props.active ? 'linear-gradient(145deg, #f0f7ff, #e6f0ff)' : 'white'};
    border-left: 4px solid ${props => props.active ? '#e31837' : 'transparent'};
  
    &:hover {
      background: ${props => props.active ? 'linear-gradient(145deg, #f0f7ff, #e6f0ff)' : '#f9f9f9'};
    }
  `;

const Avatar = styled.div<{ imageUrl?: string }>`
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: ${props => props.imageUrl ? `url(${props.imageUrl}) center/cover` : 'linear-gradient(135deg, #e31837, #c41730)'};
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    font-size: 1.2rem;
    position: relative;
  `;

const OnlineIndicator = styled.div`
    width: 12px;
    height: 12px;
    background: #22c55e;
    border-radius: 50%;
    border: 2px solid white;
    position: absolute;
    bottom: 0;
    right: 0;
  `;

const ChatMain = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
  `;

const ChatHeader = styled.div`
    padding: 20px 30px;
    background: white;
    border-bottom: 1px solid #eee;
    display: flex;
    justify-content: space-between;
    align-items: center;
  `;

const EndChatButton = styled.button`
    background: linear-gradient(135deg, #e31837, #c41730);
    color: white;
    padding: 12px 24px;
    border: none;
    border-radius: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 8px;
  
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(227, 24, 55, 0.2);
    }
  
    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  `;

const MessagesContainer = styled.div`
    flex: 1;
    overflow-y: auto;
    padding: 30px;
    background: linear-gradient(145deg, #f5f5f5, #ffffff);
  `;

const MessageBubble = styled.div<{ isAdmin: boolean }>`
    display: flex;
    justify-content: ${props => props.isAdmin ? 'flex-end' : 'flex-start'};
    margin-bottom: 20px;
  
    > div {
      max-width: 70%;
      padding: 15px 20px;
      border-radius: 16px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
      background: ${props => props.isAdmin ? 'linear-gradient(135deg, #e31837, #c41730)' : 'white'};
      color: ${props => props.isAdmin ? 'white' : '#333'};
    }
  `;

const InputContainer = styled.div`
    padding: 20px 30px;
    background: white;
    border-top: 1px solid #eee;
  
    form {
      display: flex;
      gap: 15px;
    }
  
    input {
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
    }
  `;

const SendButton = styled.button<{ active: boolean | undefined }>`
  padding: 15px;
  border-radius: 50%;
  border: none;
  cursor: ${props => props.active ? 'pointer' : 'not-allowed'};
  background: ${props => props.active ? 'linear-gradient(135deg, #e31837, #c41730)' : '#eee'};
  color: ${props => props.active ? 'white' : '#999'};
  transition: all 0.3s ease;

  &:hover {
    transform: ${props => props.active ? 'translateY(-2px)' : 'none'};
    box-shadow: ${props => props.active ? '0 8px 20px rgba(227, 24, 55, 0.2)' : 'none'};
  }
`;

const ErrorMessage = styled.div`
    margin-top: 15px;
    padding: 12px 20px;
    background: #fee2e2;
    color: #ef4444;
    border-radius: 8px;
    font-size: 0.9rem;
  `;

interface Message {
  from: string;
  message: string;
  userId?: string;
}

interface UserData {
  id: string;
  fullName: string;
  avatar?: string;
}

interface ActiveChats {
  [key: string]: UserData;
}

interface Messages {
  [key: string]: Message[];
}

interface StartChatData {
  userId: string;
  socketId: string;
}

interface Role {
  id: string;
  name: string;
}

const AdminChat: React.FC = () => {
  const [currentUserSocketId, setCurrentUserSocketId] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [activeChats, setActiveChats] = useState<ActiveChats>({});
  const [messages, setMessages] = useState<Messages>({});
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const activeChatsRef = useRef<ActiveChats>({});
  const currentAdmin = getCurrentUser();

  useEffect(() => {
    activeChatsRef.current = activeChats;
  }, [activeChats]);

  useEffect(() => {
    const checkAdminRole = async () => {
      try {
        if (!currentAdmin?.id) {
          setError('Vui lòng đăng nhập để sử dụng chat');
          return;
        }

        const userData = await getAccountByIdAPI(currentAdmin.id);
        const userRoles = userData.account.roles?.map((role: Role) =>
          role.name.toLowerCase()
        ) || [];

        const hasAdminRole = userRoles.includes('admin');
        setIsAdmin(hasAdminRole);

        if (!hasAdminRole) {
          setError('Bạn không có quyền truy cập trang này');
          return;
        }

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

        socket.on('connect', () => {
          setIsConnected(true);
          setError(null);
        });

        socket.on('disconnect', () => {
          setIsConnected(false);
          setError('Mất kết nối với server');
        });

        socket.on('start_chat', ({ userId, socketId }: StartChatData) => {
          addUserToList(userId, socketId);
          logMessageToUser(socketId, `💬 Đã kết nối với user ID: ${userId}`, "System");
        });

        socket.on('receive_message', (data: Message) => {
          const senderSocketId = Object.entries(activeChatsRef.current).find(
            ([_, userData]) => userData.id === data.userId
          )?.[0];

          if (senderSocketId) {
            logMessageToUser(senderSocketId, data.message, data.from);
          } else {
            const allSocketIds = Object.keys(activeChatsRef.current);
            if (allSocketIds.length > 0) {
              const defaultSocketId = allSocketIds[0];
              logMessageToUser(defaultSocketId, data.message, data.from);
            }
          }
        });

      } catch (error) {
        setError('Có lỗi xảy ra khi kiểm tra quyền truy cập');
      }
    };

    checkAdminRole();

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  const addUserToList = async (userId: string, socketId: string) => {
    if (activeChats[socketId]) return;
  
    try {
      const userData = await getAccountByIdAPI(userId);
      setActiveChats(prev => ({
        ...prev,
        [socketId]: {
          id: userId,
          fullName: userData.account.fullName || 'Unknown User',
          avatar: userData.account.avatar
        }
      }));
      setMessages(prev => ({ ...prev, [socketId]: [] }));
  
      if (!currentUserSocketId) {
        setCurrentUserSocketId(socketId);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      // Fallback to basic user info if API fails
      setActiveChats(prev => ({
        ...prev,
        [socketId]: {
          id: userId,
          fullName: 'Unknown User'
        }
      }));
    }
  };

  const removeUserFromList = (socketId: string) => {
    setActiveChats(prev => {
      const newChats = { ...prev };
      delete newChats[socketId];
      return newChats;
    });

    setMessages(prev => {
      const newMessages = { ...prev };
      delete newMessages[socketId];
      return newMessages;
    });

    if (currentUserSocketId === socketId) {
      setCurrentUserSocketId(null);
    }
  };

  const logMessageToUser = (socketId: string, message: string, from: string) => {
    setMessages(prev => {
      const currentMessages = prev[socketId] || [];
      return {
        ...prev,
        [socketId]: [...currentMessages, { from, message }]
      };
    });
  };

  const handleSendMessage = () => {
    if (!currentUserSocketId) {
      setError("Vui lòng chọn user để chat!");
      return;
    }

    if (!socketRef.current || !isConnected) {
      setError('Không thể gửi tin nhắn. Vui lòng kiểm tra kết nối.');
      return;
    }

    if (message.trim()) {
      const userId = activeChats[currentUserSocketId].id;
      socketRef.current.emit("send_message", {
        userId,
        message,
        from: currentAdmin?.fullName || 'Admin'
      });
      logMessageToUser(currentUserSocketId, message, "Admin");
      setMessage('');
    }
  };

  const handleEndChat = () => {
    if (!currentUserSocketId || !socketRef.current || !isConnected) {
      setError('Không thể kết thúc chat. Vui lòng kiểm tra kết nối.');
      return;
    }

    const userId = activeChats[currentUserSocketId];
    socketRef.current.emit("end_chat", { userId });
    logMessageToUser(currentUserSocketId, "Bạn đã kết thúc cuộc trò chuyện.", "System");
    removeUserFromList(currentUserSocketId);
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Admin Chat Portal</h2>
            <p className="text-gray-600 mb-4">Access Restricted</p>
            {error && (
              <div className="mt-4 p-4 bg-red-50 rounded-lg text-red-600 text-sm">
                {error}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Update the return statement in your AdminChat component:
  return (
    <Container>
      <Sidebar>
        <SidebarHeader>
          <h2>Active Chats</h2>
          <p>{Object.keys(activeChats).length} active conversations</p>
        </SidebarHeader>
        <ChatList>
          {Object.entries(activeChats).map(([socketId, userData]) => (
            <ChatItem
              key={socketId}
              active={currentUserSocketId === socketId}
              onClick={() => setCurrentUserSocketId(socketId)}
            >
              <Avatar imageUrl={userData.avatar}>
                {!userData.avatar && userData.fullName.charAt(0).toUpperCase()}
                <OnlineIndicator />
              </Avatar>
              <div>
                <div style={{ fontWeight: 600 }}>{userData.fullName}</div>
                <div style={{ fontSize: '0.9rem', color: '#22c55e' }}>Active now</div>
              </div>
            </ChatItem>
          ))}
        </ChatList>
      </Sidebar>

      <ChatMain>
        <ChatHeader>
          {currentUserSocketId && (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <Avatar imageUrl={activeChats[currentUserSocketId]?.avatar}>
                  {!activeChats[currentUserSocketId]?.avatar && 
                    activeChats[currentUserSocketId]?.fullName.charAt(0).toUpperCase()}
                  <OnlineIndicator />
                </Avatar>
                <div>
                  <div style={{ fontWeight: 600 }}>{activeChats[currentUserSocketId]?.fullName}</div>
                  <div style={{ fontSize: '0.9rem', color: '#22c55e' }}>Online</div>
                </div>
              </div>
              <EndChatButton onClick={handleEndChat} disabled={!isConnected}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" />
                </svg>
                End Chat
              </EndChatButton>
            </>
          )}
        </ChatHeader>

        <MessagesContainer>
          {currentUserSocketId && messages[currentUserSocketId]?.map((msg, index) => (
            <MessageBubble key={index} isAdmin={msg.from === 'Admin'}>
              <div>
                <div style={{ fontSize: '0.9rem', opacity: 0.8, marginBottom: '4px' }}>{msg.from}</div>
                <div>{msg.message}</div>
              </div>
            </MessageBubble>
          ))}
        </MessagesContainer>

        <InputContainer>
          <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}>
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              disabled={!isConnected || !currentUserSocketId}
            />
            <SendButton
              type="submit"
              active={!!(isConnected && currentUserSocketId && message.trim().length > 0)}
              disabled={!isConnected || !currentUserSocketId}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
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

export default AdminChat;
