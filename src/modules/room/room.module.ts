import { Module } from '@nestjs/common';
import { RoomService } from './room.service';
import { RoomController } from './room.controller';
import { roomProviders } from './room.provider';

@Module({
  controllers: [RoomController],
  providers: [RoomService, ...roomProviders],
  exports: [RoomService, ...roomProviders],
})
export class RoomModule {}
