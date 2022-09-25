import { NextFunction, Response } from "express";

import StatusCode from "lib/errors/enums/StatusCode";
import Work from "models/Work";
import workService from "services/work";
import { APIResponse, BaseParams, Empty, JwtRequest } from ".";

export const createWork = async (
  req: JwtRequest<Empty, APIResponse<Work>, Work>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username } = req.jwt!;
    const work = new Work({
      ...req.body,
      username,
    });
    const newWork = await workService.createWork(work);

    return res
      .status(StatusCode.CREATED)
      .json({ data: newWork, message: "success create work" });
  } catch (e: any) {
    return next(e);
  }
};

export const getWork = async (
  req: JwtRequest,
  res: Response,
  next: Function
) => {
  try {
    const { username } = req.jwt!;
    const works = await workService.getWork(username);

    return res
      .status(StatusCode.OK)
      .json({ data: works, message: "success get work" });
  } catch (e: any) {
    return next(e);
  }
};

export const updateWork = async (
  req: JwtRequest<BaseParams, Empty, Work>,
  res: Response,
  next: Function
) => {
  try {
    const { username } = req.jwt!;
    const { id } = req.params;
    const work = new Work({ ...req.body, id, username });
    const updatedWork = await workService.updateWork(work);

    return res
      .status(StatusCode.OK)
      .json({ data: updatedWork, message: "success update work" });
  } catch (e: any) {
    return next(e);
  }
};

export const deleteWork = async (
  req: JwtRequest<BaseParams>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username } = req.jwt!;
    const { id } = req.params;
    await workService.deleteWork({ id, username });

    return res.status(StatusCode.OK).json({ message: "success delete work" });
  } catch (e: any) {
    return next(e);
  }
};
