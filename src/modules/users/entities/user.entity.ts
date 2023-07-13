import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  BelongsToMany,
  HasMany,
} from 'sequelize-typescript';
import { Chat } from 'src/modules/chat/entities/chat.entity';
import { RoomUser } from 'src/modules/room-user/entities/room-user.entity';
import { Room } from 'src/modules/room/entities/room.entity';

@Table
export class User extends Model<User> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  name: string;

  @BelongsToMany(() => Room, () => RoomUser)
  rooms: Room[];

  @HasMany(() => Chat)
  Chats: Chat[];
}
