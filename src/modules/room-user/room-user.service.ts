import { Inject, Injectable } from '@nestjs/common';
import { ROOM_USER_REPOSITORY } from 'src/core/constants';
import { RoomUser } from './entities/room-user.entity';
import { RoomController } from '../room/room.controller';

@Injectable()
export class RoomUserService {
  constructor(
    @Inject(ROOM_USER_REPOSITORY)
    private readonly roomUserRepository: typeof RoomUser,
  ) {}

  async createRoomUser(roomUser: RoomUser): Promise<RoomUser> {
    return await this.roomUserRepository.create(roomUser);
  }

  async getRoomUserData(): Promise<RoomUser[]> {
    return await this.roomUserRepository.findAll();
  }

  async getDataById(data: RoomUser): Promise<RoomUser> {
    const userId = data.userId;
    const roomId = data.roomId;
    return await this.roomUserRepository.findOne<RoomUser>({
      where: { userId: userId, roomId: roomId },
    });
  }
}
