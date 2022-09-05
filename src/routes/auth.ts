import express from "express";

import {
  getLogin,
  getLogout,
  getProtected,
  getRegister,
  postLogin,
  postRegister,
} from "../controllers/auth";
import authJwt from "../middlewares/authJwt";

const router = express.Router();

router.post("/login", postLogin);
router.post("/register", postRegister);

router.get("/login", getLogin);
router.get("/register", getRegister);
router.get("/logout", authJwt, getLogout);
router.get("/protected", authJwt, getProtected);

export default router;
