import { Request, Response } from "express";

import Work, { WorkType } from "models/Work";
import { APIResponse, BaseParams, Empty, JwtRequest } from ".";

interface WorkDetail {
  type: WorkType;
  start_date?: Date;
  end_date?: Date;
  memo?: string;
}

export const createWork = (
  req: JwtRequest<Empty, APIResponse<Work>, WorkDetail, Empty>,
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
    res.status(200).json({ data: newWork, message: "success create work" });
  });
};

export const getWork = (req: JwtRequest, res: Response) => {
  const { username } = req.jwt!;

  Work.findAll({ where: { username } }).then((works) => {
    res.status(200).json({ message: "success get work", data: { works } });
  });
};

export const updateWork = async (
  req: JwtRequest<BaseParams, Empty, Partial<WorkDetail>>,
  res: Response
) => {
  const { username } = req.jwt!;
  const { id } = req.params;
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
