import express from "express";

import { createWork, deleteWork, getWork, updateWork } from "controllers/work";
import authJwt from "middlewares/authJwt";
import {
  validateCreateWork,
  validateDeleteWork,
  validateUpdateWork,
} from "middlewares/validateWork";

const router = express.Router();

router.use(authJwt);
router.route("/work").post(validateCreateWork, createWork);
router.route("/work").get(getWork);
router.route("/work/:id").put(validateUpdateWork, updateWork);
router.route("/work/:id").delete(validateDeleteWork, deleteWork);

export default router;
