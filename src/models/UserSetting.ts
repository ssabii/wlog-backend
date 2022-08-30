import {
  AllowNull,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from "sequelize-typescript";
import User from "./User";

interface UserSettingAttributes {
  workStartDate: Date;
  workEndDate: Date;
  lunchStartDate: Date;
  lunchEndDate: Date;
  workingDay: number;
  autoRecord: boolean;
  isTwelveHour: number;
}

interface UserSettingCreationAttributes extends UserSettingAttributes {}

@Table({
  tableName: "user_settings",
  modelName: "user_setting",
  charset: "utf8",
  timestamps: true,
  underscored: true,
})
export default class UserSetting extends Model<
  UserSettingAttributes,
  UserSettingCreationAttributes
> {
  @ForeignKey(() => User)
  @Column({
    type: DataType.STRING,
  })
  username!: string;

  @AllowNull
  @Column({
    type: DataType.DATE,
  })
  workStartDate!: Date;

  @AllowNull
  @Column({
    type: DataType.DATE,
  })
  workEndDate!: Date;

  @AllowNull
  @Column({
    type: DataType.DATE,
  })
  lunchStartDate!: Date;

  @AllowNull
  @Column({
    type: DataType.DATE,
  })
  lunchEndDate!: Date;

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
