import * as authService from "../services/authService.js";

/**
 * Controller Layer สำหรับ Auth
 * ทำหน้าที่จัดการ req/res และเรียกใช้ Service เพื่อประมวลผลข้อมูล
 * ดึงข้อมูลที่ผ่านการตรวจสอบแล้วจาก req.body
 * สร้าง Input DTO และส่งให้ Service Layer
 * รับค่าจาก Service แล้วสร้าง Output DTO และส่ง res กลับไป
 */

// POST /register - สร้าง user ใหม่
export const register = async (req, res, next) => {
  try {
    const { email, password, username, name } = req.body;

    const registerData = {
      email,
      password,
      username,
      name,
    };

    const result = await authService.register(registerData);
    res.status(201).json(result);
  } catch (error) {
    if (error.message === "MISSING_REQUIRED_FIELDS") {
      return res.status(400).json({
        error: "An error occurred during registration",
      });
    }
    if (error.message === "USERNAME_ALREADY_TAKEN") {
      return res.status(400).json({
        error: "This username is already taken",
      });
    }
    if (error.message === "EMAIL_ALREADY_EXISTS") {
      return res.status(400).json({
        error: "User with this email already exists",
      });
    }
    if (error.message === "SUPABASE_SIGNUP_FAILED") {
      return res.status(400).json({
        error: "Failed to create user. Please try again.",
      });
    }
    next(error);
  }
};

// POST /login - Login user
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const loginData = {
      email,
      password,
    };

    const result = await authService.login(loginData);
    res.status(200).json(result);
  } catch (error) {
    if (error.message === "MISSING_CREDENTIALS") {
      return res.status(400).json({
        error: "An error occurred during login",
      });
    }
    if (error.message === "INVALID_CREDENTIALS") {
      return res.status(400).json({
        error: "Your password is incorrect or this email doesn't exist",
      });
    }
    if (error.message === "LOGIN_FAILED") {
      return res.status(400).json({
        error: error.message || "An error occurred during login",
      });
    }
    next(error);
  }
};

// GET /get-user - ดึงข้อมูล user จาก token
export const getUser = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        error: "Unauthorized: Token missing",
      });
    }

    const user = await authService.getUser(token);
    res.status(200).json(user);
  } catch (error) {
    if (error.message === "TOKEN_MISSING") {
      return res.status(401).json({
        error: "Unauthorized: Token missing",
      });
    }
    if (error.message === "INVALID_TOKEN") {
      return res.status(401).json({
        error: "Unauthorized or token expired",
      });
    }
    if (error.message === "USER_NOT_FOUND") {
      return res.status(404).json({
        error: "User not found",
      });
    }
    next(error);
  }
};
