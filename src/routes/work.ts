import { createWork } from "controllers/work";
import express from "express";
import authJwt from "middlewares/authJwt";

const router = express.Router();

router.use(authJwt);

router.route("/work").post(createWork);

export default router;
