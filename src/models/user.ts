import { Column, DataType, Model, Table } from "sequelize-typescript";

@Table({
  timestamps: false,
  tableName: "users",
  modelName: "User",
  charset: "utf8",
})
export default class User extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false,
    primaryKey: true,
    unique: true,
  })
  username!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  hash!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  salt!: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  admin!: boolean;
}
