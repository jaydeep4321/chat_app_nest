import { CHAT_REPOSITORY } from '../../core/constants';
import { Chat } from './chat.entity';

export const chatProviders = [
  {
    provide: CHAT_REPOSITORY,
    useValue: Chat,
  },
];
