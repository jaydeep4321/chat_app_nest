import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { Chat } from './entities/chat.entity';
import { ChatService } from './chat.service';
import { RoomService } from '../room/room.service';
import { Room } from '../room/entities/room.entity';
import { readFileSync, writeFileSync } from 'fs';
import { UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private chatService: ChatService,
    private roomService: RoomService,
  ) {}

  @WebSocketServer() server: Server;

  afterInit(server: Server) {
    // console.log(server);
    //Do stuffs
  }

  handleDisconnect(client: Socket) {
    console.log(`Disconnected: ${client.id}`);
    //Do stuffs
  }

  handleConnection(client: Socket, ...args: any[]) {
    console.log(`Connected ${client.id}`);
    //Do stuffs
  }

  // @SubscribeMessage('sendMessage')
  // async handleSendMessage(client: Socket, payload: Chat): Promise<void> {
  //   await this.chatService.createMessage(payload);
  //   this.server.emit('recMessage', payload);
  // }

  @SubscribeMessage('room')
  async handleJoinRoom(client: Socket, data: Room) {
    console.log('data before room joined!!', data);
    const room = await this.roomService.createRoom(data);
    // console.log(room);
    client.join(data.room);
    client.emit('welcome-to-room', {
      message: `welcome to room - ${data.room}`,
      time: data.time,
      room: data.room,
    });
    client.to(data.room).emit('user-joined-room', {
      message: 'joined room',
      user: data.user,
      time: data.time,
    });
  }

  @SubscribeMessage('leave-room')
  async handleLeave(client: Socket, data: Room) {
    console.log('data before leave-room', data);
    client.leave(data.room);
    client.to(data.room).emit('left', {
      message: `${data.user} has left the room`,
      time: data.time,
      room: data.room,
    });
  }

  @SubscribeMessage('send-chat')
  async handleSendChat(client: Socket, data: any) {
    console.log('send-chat ====>', data);

    const chat = await this.chatService.createMessage(data);
    console.log('stored-chat', chat);
    client.to(data.room).emit('receive-chat', {
      message: data.message,
      user: data.user,
      time: data.time,
    });
  }

  @SubscribeMessage('typing')
  handleTyping(client: Socket, data: Room) {
    console.log('data while typing ===> ', data);
    client.to(data.room).emit('typing', `${data.user} is typing...`);
  }

  getFileData(data) {
    const binary = Buffer.from(data.file).toString('base64'); //or Buffer.from(data, 'binary')

    if (data.fileName.split('.').pop() === 'csv') {
      console.log('inside the csv....');
      console.log('binary for csv ==>', binary);
      const file_data = {
        user: data.username,
        file: `data:text/csv;base64,${binary}`,
        fileName: data.fileName,
        time: data.time,
        room: data.room,
      };
      console.log('file_data for csv ==>', file_data);
      return file_data;
    } else if (data.fileName.split('.').pop() === 'jpeg' || 'png' || 'jpg') {
      const file_data = {
        user: data.username,
        file: `data:image/${data.fileName.split('.').pop()};base64,${binary}`,
        fileName: data.fileName,
        time: data.time,
        room: data.room,
      };
      console.log('this is the file_data ===> ', file_data);
      return file_data;
    } else if (data.fileName.split('.').pop() === 'pdf') {
      console.log('inside the pdf....');
      const file_data = {
        user: data.username,
        file: `data:text/${data.fileName.split('.').pop()};base64,${binary}`,
        fileName: data.fileName,
        time: data.time,
        room: data.room,
      };
      return file_data;
    } else {
      console.log('Not valid type');
    }

    // const file_data = {
    //   user: data.username,
    //   file: `data:image/png;base64,${binary}`,
    //   fileName: data.fileName,
    //   time: data.time,
    //   room: data.room,
    // };
    // return file_data;
  }

  @SubscribeMessage('base64 file')
  handleFile(client: Socket, data: any) {
    console.log('data or file.....', data);
    // client.in(data.room).emit('base64 file', this.getFileData(data))
    this.server.to(data.room).emit('base64 file', this.getFileData(data));
  }

  // @SubscribeMessage('upload')
  // // @UseInterceptors(FileInterceptor('file'))
  // handleUpload(client: Socket, data: any) {
  //   console.log('data for uploading...', data);

  //   const filename = `file-${Date.now()}.${data.fileName.split('.').pop()}`;
  //   writeFileSync(`./temp/upload/${filename}`, data.file);
  //   this.server.to(data.room).emit('upload', this.getFileData(data));
  // }

  @SubscribeMessage('upload')
  @UseInterceptors(FileInterceptor('files'))
  handleUpload(
    client: Socket,
    @UploadedFiles()
    files: Express.Multer.File,
    // files: any,
  ) {
    console.log('data for uploading...', files);
  }
}
