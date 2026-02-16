import * as authService from "../services/authService.js";

/**
 * Controller Layer สำหรับ Auth
 *
 * Server-side Auth:
 * - POST /auth/signup - สมัครสมาชิกผ่าน server
 * - POST /auth/signin - เข้าสู่ระบบผ่าน server
 * - GET /auth/me - ดึง profile (ต้องผ่าน protectUser middleware)
 * - PUT /auth/me - อัพเดต profile
 */

// GET /auth/me - ดึง profile ของ user ที่ login อยู่
export const getMe = async (req, res, next) => {
  try {
    // req.user มาจาก protectUser middleware
    const result = await authService.getMe(req.user);
    res.status(200).json(result);
  } catch (error) {
    if (error.message === "PROFILE_NOT_FOUND") {
      return res.status(404).json({
        message: "User profile not found",
      });
    }
    next(error);
  }
};

// PUT /auth/me - อัพเดต profile ของตัวเอง
export const updateMe = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const profileData = {
      username: req.body.username,
      name: req.body.name,
      profile_pic: req.body.profile_pic,
      bio: req.body.bio,
    };

    const result = await authService.updateMe(userId, profileData);
    res.status(200).json(result);
  } catch (error) {
    if (error.message === "PROFILE_NOT_FOUND") {
      return res.status(404).json({
        message: "User profile not found",
      });
    }
    if (error.message === "USERNAME_ALREADY_TAKEN") {
      return res.status(400).json({
        message: "This username is already taken",
      });
    }
    next(error);
  }
};

// ========== Server-side Auth Operations ==========

// POST /auth/signup - สมัครสมาชิก
export const signUp = async (req, res, next) => {
  try {
    const { email, password, username, name } = req.body;

    // Validation
    if (!email || !password || !username || !name) {
      return res.status(400).json({
        message: "Missing required fields: email, password, username, name",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }

    const result = await authService.signUp({ email, password, username, name });
    res.status(201).json(result);
  } catch (error) {
    if (error.message === "USERNAME_ALREADY_TAKEN") {
      return res.status(400).json({
        message: "This username is already taken",
      });
    }
    if (error.message === "EMAIL_ALREADY_REGISTERED") {
      return res.status(400).json({
        message: "This email is already registered",
      });
    }
    next(error);
  }
};

// POST /auth/signin - เข้าสู่ระบบ
export const signIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        message: "Missing required fields: email, password",
      });
    }

    const result = await authService.signIn({ email, password });
    res.status(200).json(result);
  } catch (error) {
    if (error.message === "INVALID_CREDENTIALS") {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }
    next(error);
  }
};
