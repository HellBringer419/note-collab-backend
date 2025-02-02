import express from "express";

import MessageResponse from "../interfaces/MessageResponse";
import auth from "./auth";
import notes from "./notes";
import { verifyUserRest } from "../middlewares/verify-user";

const router = express.Router();

router.get<{}, MessageResponse>("/", (req, res) => {
  res.json({
    message: "API - 👋🌎🌍🌏",
  });
});

router.use("/auth", auth);
router.use(verifyUserRest);
router.use("/notes", notes);

export default router;
