import { ClientToServerEvents, ServerToClientEvents } from 'dogsplayingpoker-shared/socket';
import { io, Socket } from 'socket.io-client';

const URL = import.meta.env.NODE_ENV === 'production' ? undefined : 'http://localhost:4000';

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(URL, {
  autoConnect: false
});