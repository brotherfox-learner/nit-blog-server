import * as authService from "../services/authService.js";

/**
 * Controller Layer สำหรับ Auth
 *
 * Hybrid Approach:
 * - Client ทำ signUp/signIn/signOut กับ Supabase โดยตรง
 * - Supabase trigger สร้าง profile ใน public.users อัตโนมัติ
 * - GET /auth/me ใช้ดึง profile (ต้องผ่าน protectUser middleware ก่อน)
 * - PUT /auth/me ใช้อัพเดต profile
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
