import { Module } from '@nestjs/common';
import { RoomUserService } from './room-user.service';
import { RoomUserController } from './room-user.controller';
import { roomUserProviders } from './room-user.provider';

@Module({
  controllers: [RoomUserController],
  providers: [RoomUserService, ...roomUserProviders],
  exports: [RoomUserService, ...roomUserProviders],
})
export class RoomUserModule {}
