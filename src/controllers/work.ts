import { Response } from "express";
import { Query } from "express-serve-static-core";
import { JwtRequest } from "middlewares/authJwt";
import Work, { WorkType } from "models/Work";

import { TypedRequest, TypedRequestBody, TypedRequestQuery } from ".";

interface CreateWorkRequestBody {
  type: WorkType;
  start_date?: Date;
  end_date?: Date;
  memo?: string;
}

export const createWork = (
  req: TypedRequestBody<CreateWorkRequestBody>,
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

  // TODO: Work Type은 하루에 하나만 존재해야한다.
  // TODO: Breakfast, Lunch, Dinner Type은 하루에 하나만 존재해야 한다.
  // TODO: Vacation Type은 하루에 하나만 존재해야 한다.

  newWork.save().then(() => {
    res.status(200).json({ message: "success create work" });
  });
};

export const getWork = (req: JwtRequest, res: Response) => {
  const { username } = req.jwt!;

  Work.findAll({ where: { username } }).then((works) => {
    res.status(200).json({ message: "success get work", data: { works } });
  });
};

interface PutWorkRequestQuery extends Query {
  id: string;
}

interface UpdateWorkRequestBody {
  start_date?: Date;
  end_date?: Date;
  memo?: string;
}

export const updateWork = async (
  req: TypedRequest<PutWorkRequestQuery, UpdateWorkRequestBody>,
  res: Response
) => {
  const { username } = req.jwt!;
  const { id } = req.query;
  const { start_date, end_date, memo } = req.body;

  const work = await Work.findOne({ where: { id } });

  if (work) {
    if (work.username !== username) {
      return res.status(401).json({ message: "not authorized" });
    }

    await work
      .update({
        startDate: start_date ?? work.startDate,
        endDate: end_date ?? work.endDate,
        memo: memo ?? work.memo,
      })
      .then(() => res.status(200).json({ message: "success update work" }))
      .catch(() => {
        res.status(500).json({ message: "fail update work" });
      });
  } else {
    return res.status(404).json({ message: "not found work" });
  }
};

// export const deleteWork =
