import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
} from '@nestjs/common';
import { RoomUserService } from './room-user.service';
import { RoomUser } from './entities/room-user.entity';

@Controller('room-user')
export class RoomUserController {
  constructor(private roomUserService: RoomUserService) {}

  // constructor(private userService: UsersService) {}

  @Get()
  async finAll(@Res() res) {
    const users = await this.roomUserService.getRoomUserData();
    return users;
  }

  @Post()
  async createUser(@Body() body: RoomUser) {
    const user = await this.roomUserService.createRoomUser(body);
    return user;
  }
}
