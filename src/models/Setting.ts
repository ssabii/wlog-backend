import {
  AllowNull,
  NotNull,
  AutoIncrement,
  Column,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
  Unique,
} from "sequelize-typescript";
import { Optional } from "sequelize/types";
import User from "./User";

interface SettingAttributes {
  id: number;
  username: string;
  workStartTime: Date;
  workEndTime: Date;
  lunchStartTime: Date;
  lunchEndTime: Date;
  workingDay: number;
  autoRecord: boolean;
  isTwelveHour: boolean;
}

interface SettingCreationAttributes extends Optional<SettingAttributes, "id"> {}

@Table({
  tableName: "settings",
  modelName: "setting",
  charset: "utf8",
  timestamps: true,
  underscored: true,
})
export default class Setting extends Model<
  SettingAttributes,
  SettingCreationAttributes
> {
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.INTEGER.UNSIGNED,
  })
  id!: number;

  @Unique
  @ForeignKey(() => User)
  @Column({
    type: DataType.STRING,
  })
  username!: string;

  @AllowNull(false)
  @Column({
    type: DataType.DATE,
  })
  workStartTime!: Date;

  @AllowNull(false)
  @Column({
    type: DataType.DATE,
  })
  workEndTime!: Date;

  @AllowNull(false)
  @Column({
    type: DataType.DATE,
  })
  lunchStartTime!: Date;

  @AllowNull(false)
  @Column({
    type: DataType.DATE,
  })
  lunchEndTime!: Date;

  @AllowNull(false)
  @Column({
    type: DataType.TINYINT.UNSIGNED,
  })
  workingDay!: number;

  @AllowNull(false)
  @Column({
    type: DataType.BOOLEAN,
  })
  autoRecord!: boolean;

  @AllowNull(false)
  @Column({
    type: DataType.BOOLEAN,
  })
  isTwelveHour!: boolean;
}
