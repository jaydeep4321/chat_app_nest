import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { ChatService } from './chat.service';
import { RoomService } from '../room/room.service';
import { Room } from '../room/entities/room.entity';
import { Req, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { diskStorage } from 'multer';
import { extname } from 'path';
import { multerOptions } from 'src/utils/multer.config';
import { writeFileSync } from 'fs';
import { FileService } from '../files/file.service';
import { File } from '../files/entities/file.entity';
import { Request } from 'express';
import { UsersService } from '../users/users.service';
import { RoomUserService } from '../room-user/room-user.service';
import { ScopeTableOptions } from 'sequelize-typescript';

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
    private fileService: FileService,
    private userService: UsersService,
    private roomUserService: RoomUserService,
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
    // console.log(`Connected `, client);

    //Do stuffs
  }

  // @SubscribeMessage('sendMessage')
  // async handleSendMessage(client: Socket, payload: Chat): Promise<void> {
  //   await this.chatService.createMessage(payload);
  //   this.server.emit('recMessage', payload);
  // }

  @SubscribeMessage('createUser')
  async handleUser(client: Socket, data: any) {
    //===User data entry =====//
    console.log('in createUser', data);

    const user = await this.userService.findOneByUserName(data.user);
    if (!user) {
      const user_data: any = {};
      user_data.name = data.user;

      const user = await this.userService.createUser(user_data);

      client.emit('createUser', user);
    } else {
      // console.log('before sending to the client');
      client.emit('createUser', user);
    }
  }

  @SubscribeMessage('room')
  async handleJoinRoom(client: Socket, data: any) {
    // console.log('data before room joined!!', data);

    //====Room data entry =====//
    const room = await this.roomService.findRoomByRoomName(data.room);
    console.log('room after finding from findRoomByRoomName ==>', room);
    client.emit('room', room);
    if (!room) {
      const room_data: any = {};
      room_data.name = data.room;

      const room = await this.roomService.createRoom(room_data);
      console.log('room ===>', room);

      //==== junction table entry =====//
      const roomUser_data: any = {};
      roomUser_data.roomId = room.dataValues.id;
      roomUser_data.userId = data.id;

      console.log(roomUser_data);

      const roomUser = await this.roomUserService.createRoomUser(roomUser_data);
      console.log(roomUser);
    }

    //==== junction table entry =====//
    const roomUser_data: any = {};
    roomUser_data.roomId = room.dataValues.id;
    roomUser_data.userId = data.id;

    const search = await this.roomUserService.getDataById(roomUser_data);
    console.log(search);

    if (!search) {
      const roomUser = await this.roomUserService.createRoomUser(roomUser_data);
      console.log(roomUser);
    }

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
  async handleLeave(client: Socket, data: any) {
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
  handleTyping(client: Socket, data: any) {
    console.log('data while typing ===> ', data);
    client.to(data.room).emit('typing', `${data.user} is typing...`);
  }

  //=========== old getFileData ===========//
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
  }

  //=========== new getFileData ===========//
  // getFileData(data) {
  //   if (data.name.split('.').pop() === 'jpeg' || 'png' || 'jpg') {
  //     const file_data = {
  //       user: data.username,
  //       file: `data:image/${data.fileName.split('.').pop()};base64,${binary}`,
  //       fileName: data.fileName,
  //       time: data.time,
  //       room: data.room,
  //     };
  //     console.log('this is the file_data ===> ', file_data);
  //     return file_data;
  //   } else {
  //     console.log('Not valid type');
  //   }
  // }

  // @SubscribeMessage('base64 file')
  // handleFile(client: Socket, data: any) {
  //   console.log('data or file.....', data);
  //   // client.in(data.room).emit('base64 file', this.getFileData(data))
  //   this.server.to(data.room).emit('base64 file', this.getFileData(data));
  // }

  @SubscribeMessage('upload')
  // @UseInterceptors(FileInterceptor('file'))
  async handleUpload(client: Socket, data: any) {
    // console.log('whole socket', client);
    // console.log('data for uploading...', data);

    const filename = `file-${Date.now()}.${data.fileName.split('.').pop()}`;
    writeFileSync(`./public/upload/${filename}`, data.file);

    const file_data: any = {};

    file_data.name = filename;
    file_data.size = data.size;
    file_data.room = data.room;
    file_data.extension = data.fileName.split('.').pop();
    // file_data.path = `http://localhost:${process.env.PORT}/public/upload`;
    file_data.path = client.handshake.headers.origin + '/upload';

    // console.log('file data before saving to the database', file_data);

    const url = file_data.path + '/' + filename;
    console.log('url for the file....====>', url);

    const file = await this.fileService.createFile(file_data);
    console.log('inside the handleUpload', file);
    this.server.to(data.room).emit('upload', this.getFileData(data));
    // this.server.to(data.room).emit('upload', url);
  }

  // @UseInterceptors(FileInterceptor('files', multerOptions))
  // @SubscribeMessage('upload')
  // handleUpload(
  //   client: Socket,
  //   @UploadedFiles()
  //   files: Array<Express.Multer.File>,
  //   // files: any,
  // ) {
  //   console.log('data for uploading...', files);
  // }
}
