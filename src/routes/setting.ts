import express from "express";

import authJwt from "middlewares/authJwt";
import {
  createSetting,
  deleteSetting,
  getSetting,
  updateSetting,
} from "controllers/setting";

const router = express.Router();

router.use(authJwt);
router.route("/setting").post(createSetting);
router.route("/setting").get(getSetting);
router.route("/setting").put(updateSetting);
router.route("/setting").delete(deleteSetting);

export default router;
