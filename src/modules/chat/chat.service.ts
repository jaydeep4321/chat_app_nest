import { Inject, Injectable } from '@nestjs/common';
import { Chat } from './entities/chat.entity';
import { CHAT_REPOSITORY } from 'src/core/constants';

@Injectable()
export class ChatService {
  constructor(
    @Inject(CHAT_REPOSITORY) private readonly chatRepository: typeof Chat,
  ) {}

  async createMessage(chat: Chat): Promise<Chat> {
    console.log('inside the createMessage ===>', chat);

    return await this.chatRepository.create(chat);
  }

  async getMessages(): Promise<Chat[]> {
    return await this.chatRepository.findAll();
  }
}
