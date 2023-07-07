import { Inject, Injectable } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
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

  async getRoomData(): Promise<Room[]> {
    return await this.RoomRepository.findAll();
  }
}
