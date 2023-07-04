import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { chatProviders } from './chat.provider';

@Module({
  controllers: [ChatController],
  providers: [ChatService, ...chatProviders],
  exports: [ChatService, ...chatProviders],
})
export class ChatModule {}
