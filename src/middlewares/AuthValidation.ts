import { body } from "express-validator";

import validate from "./validate";

const validateLoginUsername = body("username")
  .notEmpty()
  .withMessage("username은 필수 입력값입니다.")
  .isLength({ min: 4, max: 20 })
  .withMessage("username은 4자 이상 20자 이하입니다.");

const validateLoginPassword = body("password")
  .notEmpty()
  .withMessage("password는 필수 입력값입니다.")
  .isLength({ min: 4, max: 20 })
  .withMessage("password는 4자 이상 20자 이하입니다.");

const validateRegisterUsername = body("username")
  .notEmpty()
  .withMessage("username은 필수 입력값입니다.")
  .isLength({ min: 4, max: 20 })
  .withMessage("username은 4자 이상 20자 이하입니다.")
  .custom((value) => {
    const reg = /^[a-z][0-9a-z]*/;

    if (reg.test(value)) {
      return true;
    }

    throw new Error("username은 영문 소문자와 숫자로만 입력해야 합니다.");
  });

const validateRegisterPassword = body("password")
  .notEmpty()
  .withMessage("password는 필수 입력값입니다.")
  .isLength({ min: 4, max: 20 })
  .withMessage("password는 4자 이상 20자 이하입니다.")
  .custom((value) => {
    const reg = /(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]/;

    if (reg.test(value)) {
      return true;
    }

    throw new Error("password는 영문자와 숫자로 입력해야 합니다.");
  });

export const validateLogin = [
  validateLoginUsername,
  validateLoginPassword,
  validate,
];

export const validateRegister = [
  validateRegisterUsername,
  validateRegisterPassword,
  validate,
];
