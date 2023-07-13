import { Inject, Injectable } from '@nestjs/common';
import { ROOM_USER_REPOSITORY } from 'src/core/constants';
import { RoomUser } from './entities/room-user.entity';

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
}
