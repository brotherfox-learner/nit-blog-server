import { Router } from "express";
import * as authController from "../controllers/authController.js";

const authRouter = Router();

// POST /register - สร้าง user ใหม่
authRouter.post("/register", authController.register);

// POST /login - Login user
authRouter.post("/login", authController.login);

// GET /get-user - ดึงข้อมูล user จาก token
authRouter.get("/get-user", authController.getUser);

export default authRouter;