import {
  AllowNull,
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

interface SettingCreationAttributes
  extends Optional<
    SettingAttributes,
    | "id"
    | "workStartTime"
    | "workEndTime"
    | "lunchStartTime"
    | "lunchEndTime"
    | "workingDay"
    | "autoRecord"
    | "isTwelveHour"
  > {}

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

  @AllowNull
  @Column({
    type: DataType.DATE,
  })
  workStartTime!: Date;

  @AllowNull
  @Column({
    type: DataType.DATE,
  })
  workEndTime!: Date;

  @AllowNull
  @Column({
    type: DataType.DATE,
  })
  lunchStartTime!: Date;

  @AllowNull
  @Column({
    type: DataType.DATE,
  })
  lunchEndTime!: Date;

  @AllowNull
  @Column({
    type: DataType.TINYINT.UNSIGNED,
  })
  workingDay!: number;

  @AllowNull
  @Column({
    type: DataType.BOOLEAN,
  })
  autoRecord!: boolean;

  @AllowNull
  @Column({
    type: DataType.BOOLEAN,
  })
  isTwelveHour!: boolean;
}
