import express from "express";

import authJwt from "middlewares/authJwt";
import { createWork, getWork, updateWork } from "controllers/work";

const router = express.Router();

router.use(authJwt);
router.route("/work").post(createWork).get(getWork);
router.route("/work/:id").put(updateWork);

export default router;
