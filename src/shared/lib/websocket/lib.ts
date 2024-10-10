import { env } from '~shared/lib/env';
import io from 'socket.io-client';
import Socket = SocketIOClient.Socket;

export class WebSocket {
  public client: Socket;

  constructor(wsNamespace: string = '') {
    const host = env('VITE_SOCKET_HOST', 'localhost');
    const port = env('VITE_SOCKET_PORT', '81');

    const url = `${host}:${port}${wsNamespace}`;

    this.client = io(url, { transports: ['websocket'], autoConnect: false });
  }
}