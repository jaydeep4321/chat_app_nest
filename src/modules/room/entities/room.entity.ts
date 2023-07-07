import { ColdObservable } from 'rxjs/internal/testing/ColdObservable';
import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
} from 'sequelize-typescript';

@Table
export class Room extends Model<Room> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @Column({
    type: DataType.STRING,
    // unique: true,
    allowNull: false,
  })
  user: string;

  @Column({
    type: DataType.STRING,
  })
  room: string;

  @Column({
    type: DataType.STRING,
  })
  time: string;
}
