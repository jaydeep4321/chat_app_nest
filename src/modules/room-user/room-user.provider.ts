import { ROOM_USER_REPOSITORY } from '../../core/constants';
import { RoomUser } from './entities/room-user.entity';

export const roomUserProviders = [
  {
    provide: ROOM_USER_REPOSITORY,
    useValue: RoomUser,
  },
];
