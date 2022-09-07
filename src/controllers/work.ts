import { Response } from "express";
import Work from "models/Work";

import { TypedRequestBody } from ".";

enum WorkType {
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

interface WorkRequestBody {
  type: WorkType;
  start_date?: Date;
  end_date?: Date;
  memo?: string;
}

export const createWork = (
  req: TypedRequestBody<WorkRequestBody>,
  res: Response
) => {
  const { username } = req.jwt!;
  const { type, start_date, end_date, memo } = req.body;

  if (!type || !(start_date || end_date)) {
    return res
      .status(400)
      .json({ message: "type or start_date or end_date is required" });
  }

  const newWork = Work.build({
    username,
    type,
    startDate: start_date ?? undefined,
    endDate: end_date ?? undefined,
    memo: memo ?? undefined,
  });

  newWork.save().then(() => {
    res.status(200).json({ message: "success create work" });
  });
};

// export const getWork =

// export const putWork =

// export const deleteWork =
