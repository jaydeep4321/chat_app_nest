import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
} from 'sequelize-typescript';

@Table
export class File extends Model<File> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @Column({
    type: DataType.STRING,
    // unique: true,
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.INTEGER,
  })
  size: number;

  @Column({
    type: DataType.STRING,
  })
  path: string;

  @Column({
    type: DataType.STRING,
  })
  extension: string;

  @Column({
    type: DataType.STRING,
  })
  room: string;
}
