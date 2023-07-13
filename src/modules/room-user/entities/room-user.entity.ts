// export class RoomUser {}
import { Table, Column, Model, ForeignKey } from 'sequelize-typescript';
import { Room } from 'src/modules/room/entities/room.entity';
import { User } from 'src/modules/users/entities/user.entity';

@Table
export class RoomUser extends Model<RoomUser> {
  @ForeignKey(() => Room)
  @Column
  roomId: number;

  @ForeignKey(() => User)
  @Column
  userId: number;
}
