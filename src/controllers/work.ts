import { NextFunction, Response } from "express";

import Work from "models/Work";
import workService from "services/work";
import { APIResponse, BaseParams, Empty, JwtRequest } from ".";

export const createWork = async (
  req: JwtRequest<Empty, APIResponse<Work>, Work>,
  res: Response
) => {
  try {
    const { username } = req.jwt!;
    const work = new Work({
      ...req.body,
      username,
    });
    const newWork = await workService.createWork(work);

    return res
      .status(201)
      .json({ data: newWork, message: "success create work" });
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
};

export const getWork = async (req: JwtRequest, res: Response) => {
  try {
    const { username } = req.jwt!;
    const works = await workService.getWork(username);

    return res.status(200).json({ data: works, message: "success get work" });
  } catch (e: any) {
    return res.status(400).json({ error: e.message });
  }
};

export const updateWork = async (
  req: JwtRequest<BaseParams, Empty, Work>,
  res: Response
) => {
  try {
    const { username } = req.jwt!;
    const { id } = req.params;
    const work = new Work({ ...req.body, id, username });
    const updatedWork = await workService.updateWork(work);

    return res
      .status(200)
      .json({ data: updatedWork, message: "success update work" });
  } catch (e: any) {
    return res.status(400).json({ error: e.message });
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

    return res.status(200).json({ message: "success delete work" });
  } catch (e: any) {
    return res.status(400).json({ error: e.message });
  }
};
