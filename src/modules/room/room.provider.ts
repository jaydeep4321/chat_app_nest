import { ROOM_REPOSITORY } from '../../core/constants';
import { Room } from './entities/room.entity';

export const roomProviders = [
  {
    provide: ROOM_REPOSITORY,
    useValue: Room,
  },
];
