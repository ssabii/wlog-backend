import express from "express";

import errorHandler from "middlewares/errorHandler";
import authRouter from "./auth";
import workRouter from "./work";
import settingRouter from "./setting";

const router = express.Router();

router.use(authRouter);
router.use(workRouter);
router.use(settingRouter);

router.use(errorHandler);

export default router;
