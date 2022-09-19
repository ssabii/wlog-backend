import { body, param } from "express-validator";

import { WorkType } from "models/Work";
import validate from "./validate";

const validateId = param("id")
  .notEmpty()
  .withMessage("id is required")
  .isInt()
  .withMessage("id must be a number");

const validateWorkType = body("type").custom((value: string) => {
  const index = Object.values(WorkType).indexOf(value as unknown as WorkType);

  if (index) {
    return true;
  }
  throw new Error(`${value} type not allowed`);
});

const validateStartDate = body("startDate")
  .notEmpty()
  .withMessage("start date is required")
  .isISO8601()
  .withMessage("start date must be a date");

const validateEndDate = body("endDate")
  .optional()
  .isISO8601()
  .withMessage("end date must be a date")
  .custom((value, { req }) => {
    const startDate = new Date(req.body.startDate);
    const endDate = new Date(value);

    if (startDate.getTime() <= endDate.getTime()) {
      return true;
    }
    return new Error("end date must be after start date");
  });

export const validateCreateWork = [
  validateWorkType,
  validateStartDate,
  validateEndDate,
  validate,
];

export const validateUpdateWork = [
  validateId,
  validateWorkType,
  validateStartDate,
  validateEndDate,
  validate,
];

export const validateDeleteWork = [validateId, validate];
