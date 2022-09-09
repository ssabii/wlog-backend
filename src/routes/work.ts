import { createWork, getWork, updateWork } from "controllers/work";
import express from "express";
import authJwt from "middlewares/authJwt";

const router = express.Router();

router.use(authJwt);

router.route("/work").post(createWork).get(getWork).put(updateWork);

export default router;
