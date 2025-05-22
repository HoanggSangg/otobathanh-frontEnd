import { getCurrentUser, getToken } from '../components/Utils/auth';
import { io, Socket } from 'socket.io-client';

interface SocketConfig {
  url: string;
  options: {
    auth: {
      token: string | null;
    };
    reconnection: boolean;
    reconnectionAttempts: number;
    reconnectionDelay: number;
    timeout: number;
  };
}

export const getSocketConfig = (): SocketConfig => {
  const token = getToken();
  return {
    url: "https://otobathanhh.onrender.com",
    options: {
      auth: {
        token: token
      },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 20000
    }
  };
};

export const createSocketConnection = (): Socket | null => {
  try {
    const token = getToken();
    if (!token) {
      console.error('No authentication token available');
      return null;
    }

    const { url, options } = getSocketConfig();
    const socket = io(url, options);

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error.message);
    });

    socket.on('connect_timeout', () => {
      console.error('Socket connection timeout');
    });

    socket.on('reconnect_attempt', (attemptNumber) => {
      console.log(`Attempting to reconnect (${attemptNumber})...`);
    });

    socket.on('reconnect', (attemptNumber) => {
      console.log(`Reconnected after ${attemptNumber} attempts`);
    });

    socket.on('reconnect_error', (error) => {
      console.error('Reconnection error:', error.message);
    });

    socket.on('reconnect_failed', () => {
      console.error('Failed to reconnect');
    });

    return socket;
  } catch (error) {
    console.error('Error creating socket connection:', error);
    return null;
  }
};