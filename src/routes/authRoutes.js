import { Router } from "express";
import * as authController from "../controllers/authController.js";
import { protectUser } from "../middleware/auth.middleware.js";

const authRouter = Router();

// GET /auth/me - ดึง profile ของตัวเอง
authRouter.get("/me", protectUser, authController.getMe);

// PUT /auth/me - อัพเดต profile ของตัวเอง
authRouter.put("/me", protectUser, authController.updateMe);

export default authRouter;
