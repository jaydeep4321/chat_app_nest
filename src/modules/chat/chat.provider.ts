import { CHAT_REPOSITORY } from '../../core/constants';
import { Chat } from './entities/chat.entity';

export const chatProviders = [
  {
    provide: CHAT_REPOSITORY,
    useValue: Chat,
  },
];
