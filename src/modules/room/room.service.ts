import { Inject, Injectable } from '@nestjs/common';
import { Room } from './entities/room.entity';
import { ROOM_REPOSITORY } from 'src/core/constants';

@Injectable()
export class RoomService {
  constructor(
    @Inject(ROOM_REPOSITORY) private readonly RoomRepository: typeof Room,
  ) {}

  async createRoom(Room: Room): Promise<Room> {
    return await this.RoomRepository.create(Room);
  }

  async findRoomByRoomName(roomName: string): Promise<Room> {
    console.log('roomName before findOne', roomName);
    return await this.RoomRepository.findOne<Room>({
      where: { name: roomName },
    });
  }

  async getRoomData(): Promise<Room[]> {
    return await this.RoomRepository.findAll();
  }
}
