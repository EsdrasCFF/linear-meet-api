import express, { Application } from 'express';
import http from 'http';
import cors from 'cors';
import { Server, Socket } from 'socket.io';
class App {
  private app: Application;
  private http: http.Server;
  private io: Server;
  private port: Number;
  constructor() {
    this.port = 3333
    this.app = express();
    this.http = new http.Server(this.app);
    this.io = new Server(this.http, {
      cors: {
        origin: '*',
      },
    });
  }
  public listen() {
    this.http.listen(this.port, () => {
      console.log('Server running on port: ' + this.port);
    });
  }

  public listenSocket() {
    this.io.of('/streams').on('connection', this.socketEvents);
  }
  private socketEvents(socket: Socket) {
    console.log('Socket connected: ' + socket.id);
    socket.on('subscribe', (data) => {
      console.log('usuario inserido na sala: ' + data.roomId);
      socket.join(data.roomId);

      socket.on('chat', (data) => {
        socket.broadcast.to(data.roomId).emit('chat', {
          message: data.message,
          username: data.username,
          time: data.time,
        });
      });
    });
  }
}

export { App };