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
import { User } from 'src/modules/users/entities/user.entity';

@Table
export class Room extends Model<Room> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @Column({
    type: DataType.STRING,
  })
  name: string;

  @BelongsToMany(() => User, () => RoomUser)
  users: User[];

  @HasMany(() => Chat)
  Chats: Chat[];
}
