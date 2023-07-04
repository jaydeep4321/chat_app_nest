import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatGateway } from './modules/chat/chat.gateway';
import { ChatModule } from './modules/chat/chat.module';
import { DatabaseModule } from './core/database/database.module';

@Module({
  imports: [ChatModule, DatabaseModule],
  controllers: [AppController],
  providers: [AppService, ChatGateway],
})
export class AppModule {}
