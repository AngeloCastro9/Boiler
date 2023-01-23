import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  transport: ['websocket'],
})
export class WebsocketGateway {
  @WebSocketServer()
  server: Server;
}
