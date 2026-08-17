import { ClientToServerEvents, ServerToClientEvents } from 'dogsplayingpoker-shared/socket';
import { io, Socket } from 'socket.io-client';

// Vite defines PROD/DEV/MODE, not NODE_ENV. In production the socket is served from the
// same origin as the app, so undefined lets socket.io default to the page's origin.
const URL = import.meta.env.PROD ? undefined : 'http://localhost:4000';

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(URL, {
  autoConnect: false,
  transports: ['websocket']
});
