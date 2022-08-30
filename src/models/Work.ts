import {
  AllowNull,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from "sequelize-typescript";
import { Optional } from "sequelize/types";
import User from "./User";

interface WorkAttributes {
  type: string;
  startDate: Date;
  endDate: Date;
  memo: string;
}

interface WorkCreationAttributes
  extends Optional<WorkAttributes, "startDate" | "endDate" | "memo"> {}

@Table({
  tableName: "works",
  modelName: "work",
  charset: "utf8",
  timestamps: true,
  underscored: true,
})
export default class Work extends Model<
  WorkAttributes,
  WorkCreationAttributes
> {
  @ForeignKey(() => User)
  @Column({
    type: DataType.STRING,
  })
  username!: string;

  @Column({
    type: DataType.STRING,
  })
  type!: string;

  @AllowNull
  @Column({
    type: DataType.DATE,
  })
  startDate!: Date;

  @AllowNull
  @Column({
    type: DataType.DATE,
  })
  endDate!: Date;

  @AllowNull
  @Column({
    type: DataType.STRING,
  })
  memo!: string;
}
