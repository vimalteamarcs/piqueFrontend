import { io } from 'socket.io-client';

const token = localStorage.getItem('access_token');
const socket = io('https://your-domain.com/chat', {
  transports: ['websocket'],
  query: {
    token,
  },
  autoConnect: false, 
});

export default socket;
 