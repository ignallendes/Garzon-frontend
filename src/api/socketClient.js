import { io } from 'socket.io-client';

const DEFAULT_SOCKET_URL = import.meta.env.VITE_SOCKET_URL || import.meta.env.VITE_API_URL || 'http://localhost:3001';

export let socketClient = null;

export const initSocket = (url) => {
  const targetUrl = url || DEFAULT_SOCKET_URL;

  if (socketClient) {
    socketClient.disconnect();
  }

  socketClient = io(targetUrl, {
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 10000,
    randomizationFactor: 0.5,
    timeout: 5000,
  });

  return socketClient;
};

export default socketClient;