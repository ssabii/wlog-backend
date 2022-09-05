import express from "express";

import authRouter from "./auth";
import workRouter from "./work";

const router = express.Router();

router.use(authRouter);
router.use(workRouter);

export default router;
