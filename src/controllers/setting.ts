import { NextFunction, Response } from "express";

import StatusCode from "lib/errors/enums/StatusCode";
import Setting from "models/Setting";
import settingService from "services/setting";
import { APIResponse, BaseParams, Empty, JwtRequest } from ".";

export const createSetting = async (
  req: JwtRequest<Empty, Empty, Setting>,
  res: Response<APIResponse<Setting>>,
  next: NextFunction
) => {
  try {
    const { username } = req.jwt!;
    const setting = new Setting({
      ...req.body,
      username,
    });
    const newSetting = await settingService.createSetting(setting);

    return res.status(StatusCode.CREATED).json({
      data: newSetting,
      message: "success create setting",
    });
  } catch (e) {
    return next(e);
  }
};

export const getSetting = async (
  req: JwtRequest,
  res: Response<APIResponse<Setting>>,
  next: Function
) => {
  try {
    const { username } = req.jwt!;
    const setting = await settingService.getSetting(username);

    return res
      .status(StatusCode.OK)
      .json({ data: setting, message: "success get setting" });
  } catch (e) {
    return next(e);
  }
};

export const updateSetting = async (
  req: JwtRequest<Empty, Empty, Setting>,
  res: Response<APIResponse<Setting>>,
  next: NextFunction
) => {
  try {
    const { username } = req.jwt!;
    const setting = new Setting({ ...req.body, username });
    const updatedSetting = await settingService.updateSetting(setting);

    return res.status(StatusCode.OK).json({
      data: updatedSetting,
      message: "success update setting",
    });
  } catch (e) {
    return next(e);
  }
};

export const deleteSetting = async (
  req: JwtRequest<BaseParams>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username } = req.jwt!;
    await settingService.deleteSetting(username);

    return res.status(StatusCode.OK).json({
      message: "success delete setting",
    });
  } catch (e) {
    return next(e);
  }
};
