import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatGateway } from './modules/chat/chat.gateway';
import { ChatModule } from './modules/chat/chat.module';
import { DatabaseModule } from './core/database/database.module';
import { RoomModule } from './modules/room/room.module';
import { FileModule } from './modules/files/file.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { RoomUserModule } from './modules/room-user/room-user.module';

@Module({
  imports: [
    ChatModule,
    DatabaseModule,
    RoomModule,
    FileModule,
    UsersModule,
    // AuthModule,
    RoomUserModule,
  ],
  controllers: [AppController],
  providers: [AppService, ChatGateway],
})
export class AppModule {}
