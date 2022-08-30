import { DataTypes, Optional } from "sequelize";
import {
  AllowNull,
  Column,
  DataType,
  Default,
  HasMany,
  Model,
  PrimaryKey,
  Table,
  Unique,
} from "sequelize-typescript";
import UserSetting from "./UserSetting";
import Work from "./Work";

interface UserAttributes {
  id: string;
  username: string;
  hash: string;
  salt: string;
  displayName: string;
  profileUrl: string;
}

interface UserCreationAttributes
  extends Optional<UserAttributes, "id" | "profileUrl"> {}

@Table({
  tableName: "users",
  modelName: "user",
  charset: "utf8",
  timestamps: true,
  underscored: true,
})
export default class User extends Model<
  UserAttributes,
  UserCreationAttributes
> {
  @PrimaryKey
  @AllowNull(false)
  @Default(DataTypes.UUIDV4)
  @Column({
    type: DataType.UUID,
  })
  id!: string;

  @Unique
  @AllowNull(false)
  @Column({
    type: DataType.STRING,
  })
  username!: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING,
  })
  hash!: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING,
  })
  salt!: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING,
  })
  displayName!: string;

  @AllowNull
  @Column({
    type: DataType.STRING,
  })
  profileUrl!: string;

  @HasMany(() => Work, { foreignKey: "username", sourceKey: "username" })
  works?: Work[];

  @HasMany(() => UserSetting, { foreignKey: "username", sourceKey: "username" })
  userSettings?: UserSetting[];
}
