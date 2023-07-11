import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript';
import { Room } from 'src/modules/room/entities/room.entity';

@Table({ timestamps: false })
export class Chat extends Model<Chat> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  user: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  room: string;

  @Column({
    type: DataType.STRING,
  })
  message: string;

  @Column({
    type: DataType.STRING,
  })
  time: string;

  @ForeignKey(() => Room)
  @Column
  roomId: number;

  @BelongsTo(() => Room)
  vroom: Room;
}

// send-data object
// { time: '14:22 pm', room: 'xyz', msg: 'hello', user: 'jaydeep' }
