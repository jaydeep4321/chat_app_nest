import { Sequelize } from 'sequelize-typescript';
import { SEQUELIZE, DEVELOPMENT, TEST, PRODUCTION } from '../constants';
import { databaseConfig } from './database.config';
import { Chat } from 'src/modules/chat/entities/chat.entity';
import { Room } from 'src/modules/room/entities/room.entity';
import { File } from 'src/modules/files/entities/file.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { RoomUser } from 'src/modules/room-user/entities/room-user.entity';

export const databaseProviders = [
  {
    provide: SEQUELIZE,
    useFactory: async () => {
      let config;
      switch (process.env.NODE_ENV) {
        case DEVELOPMENT:
          config = databaseConfig.development;
          break;
        case TEST:
          config = databaseConfig.test;
          break;
        case PRODUCTION:
          config = databaseConfig.production;
          break;
        default:
          config = databaseConfig.development;
      }
      const sequelize = new Sequelize(config);
      sequelize.addModels([Chat, Room, File, User, RoomUser]);
      await sequelize.sync();
      return sequelize;
    },
  },
];
