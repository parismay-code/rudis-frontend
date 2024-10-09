import { env } from '~shared/lib/env';
import io from 'socket.io-client';
import Socket = SocketIOClient.Socket;

export class WebSocket {
  public client: Socket;

  constructor(wsNamespace: string = '') {
    const host = env('SOCKET_HOST', 'localhost');
    const port = env('SOCKET_PORT', '81');

    const url = `ws://${host}:${port}${wsNamespace}`;

    this.client = io(url, { transports: ['websocket'], autoConnect: false });
  }
}