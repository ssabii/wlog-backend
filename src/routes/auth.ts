import express from "express";

import { validateLogin, validateRegister } from "middlewares/AuthValidation";
import {
  login,
  logout,
  refreshJwt,
  register,
  renderLogin,
  renderProtected,
  renderRegister,
} from "../controllers/auth";
import authJwt from "../middlewares/authJwt";

const router = express.Router();

router.post("/login", validateLogin, login);
router.post("/register", validateRegister, register);

router.get("/login", renderLogin);
router.get("/register", renderRegister);
router.get("/logout", authJwt, logout);
router.get("/protected", authJwt, renderProtected);
router.get("/refresh", refreshJwt);

export default router;
