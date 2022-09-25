import express from "express";
import { validateLogin, validateRegister } from "middlewares/AuthValidation";

import {
  renderLogin,
  logout,
  renderProtected,
  renderRegister,
  login,
  register,
  refreshJwt,
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
