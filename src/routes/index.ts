import express from "express";

import errorHandler from "middlewares/errorHandler";
import authRouter from "./auth";
import workRouter from "./work";

const router = express.Router();

router.use(authRouter);
router.use(workRouter);

router.use(errorHandler);

export default router;
