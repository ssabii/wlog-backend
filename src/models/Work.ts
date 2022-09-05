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

export enum WorkType {
  // 식사 관련
  Breakfast = "breakfast",
  Lunch = "lunch",
  Dinner = "dinner",

  // 근무 관련
  Work = "work",
  Overtime = "overtime",
  BusinessTrip = "business trip",
  Outside = "outside",

  // 기타
  Vacation = "vacation",
  Rest = "rest",
}

interface WorkAttributes {
  username: string;
  type: WorkType;
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
  type!: WorkType;

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
