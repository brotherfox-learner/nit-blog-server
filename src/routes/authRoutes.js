import { Router } from "express";
import * as authController from "../controllers/authController.js";
import { protectUser } from "../middleware/auth.middleware.js";

const authRouter = Router();

// POST /auth/signup - สมัครสมาชิก (public)
authRouter.post("/signup", authController.signUp);

// POST /auth/signin - เข้าสู่ระบบ (public)
authRouter.post("/signin", authController.signIn);

// GET /auth/me - ดึง profile ของตัวเอง (protected)
authRouter.get("/me", protectUser, authController.getMe);

// PUT /auth/me - อัพเดต profile ของตัวเอง (protected)
authRouter.put("/me", protectUser, authController.updateMe);

export default authRouter;
