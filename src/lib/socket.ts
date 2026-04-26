import { io } from 'socket.io-client';

// The URL should be your backend server URL. 
// In this environment, it's usually the same as the window location for full-stack apps.
const SOCKET_URL = window.location.origin;

export const socket = io(SOCKET_URL, {
  autoConnect: true,
  reconnection: true,
});

// Helper functions for common game events
export const joinSession = (sessionId: string, teamName: string) => {
  socket.emit('join-session', { sessionId, teamName });
};

export const submitBenefits = (sessionId: string, teamName: string, data: any) => {
  socket.emit('submit-benefits', { sessionId, teamName, data });
};

socket.on('connect', () => {
  console.log('Connected to socket server');
});

socket.on('disconnect', () => {
  console.log('Disconnected from socket server');
});
