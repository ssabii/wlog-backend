import { body, param } from "express-validator";

import { WorkType } from "models/Work";
import validate from "./validate";

const validateWorkStartTime = body("workStartTime")
  .notEmpty()
  .withMessage("work start time is required")
  .isISO8601()
  .withMessage("work start time must be a date");

const validateWorkEndTime = body("workEndTime")
  .notEmpty()
  .withMessage("work end time is required")
  .isISO8601()
  .withMessage("work end time must be a date")
  .custom((value, { req }) => {
    const workStartTime = new Date(req.body.workStartTime);
    const workEndTime = new Date(value);

    if (workStartTime.getTime() <= workEndTime.getTime()) {
      return true;
    }
    return new Error("work end time must be after work start time");
  });

const validateLunchStartTime = body("lunchStartTime")
  .notEmpty()
  .withMessage("lunch start time is required")
  .isISO8601()
  .withMessage("lunch start time must be a date");

const validateLunchEndTime = body("lunchEndTime")
  .notEmpty()
  .withMessage("lunch end time is required")
  .isISO8601()
  .withMessage("lunch end time must be a date")
  .custom((value, { req }) => {
    const lunchStartTime = new Date(req.body.lunchStartTime);
    const lunchEndTime = new Date(value);

    if (lunchStartTime.getTime() <= lunchEndTime.getTime()) {
      return true;
    }
    return new Error("lunch end time must be after lunch start time");
  });

const validateAutoRecord = body("autoRecord")
  .notEmpty()
  .withMessage("auto record is required")
  .isBoolean()
  .withMessage("auto record must be a boolean");

const validateWorkingDay = body("workingDay")
  .notEmpty()
  .withMessage("working day is required")
  .isInt()
  .withMessage("working day must be a number");

const validateIsTwelveHour = body("isTwelveHour")
  .notEmpty()
  .withMessage("is twelve hour is required")
  .isBoolean()
  .withMessage("is twelve hour must be a boolean");

export const validateUpdateSetting = [
  validateWorkStartTime,
  validateWorkEndTime,
  validateLunchStartTime,
  validateLunchEndTime,
  validateAutoRecord,
  validateWorkingDay,
  validateIsTwelveHour,
  validate,
];
