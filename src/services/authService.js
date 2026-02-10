import * as authRepository from "../repositories/authRepository.js";

/**
 * Service Layer สำหรับ Auth
 * ทำหน้าที่จัดการ Business Logic
 * ไม่รู้จัก req, res
 *
 * หมายเหตุ: register ไม่จำเป็นแล้ว เพราะ Supabase trigger
 * (AFTER INSERT ON auth.users → INSERT public.users) จัดการสร้าง profile ให้อัตโนมัติ
 */

// ดึง profile ของ user ที่ login อยู่ (ใช้ token verify แล้วจาก middleware)
export const getMe = async (supabaseUser) => {
  const profile = await authRepository.findUserById(supabaseUser.id);

  if (!profile) {
    throw new Error("PROFILE_NOT_FOUND");
  }

  return {
    id: profile.id,
    email: supabaseUser.email,
    username: profile.username,
    name: profile.name,
    role: profile.role,
    profile_pic: profile.profile_pic,
    bio: profile.bio,
  };
};

// อัพเดต profile ของตัวเอง
export const updateMe = async (userId, profileData) => {
  const existing = await authRepository.findUserById(userId);
  if (!existing) {
    throw new Error("PROFILE_NOT_FOUND");
  }

  // ถ้าเปลี่ยน username ต้องเช็คซ้ำ
  if (profileData.username && profileData.username.trim() !== existing.username) {
    const duplicate = await authRepository.findUserByUsername(profileData.username.trim());
    if (duplicate) {
      throw new Error("USERNAME_ALREADY_TAKEN");
    }
  }

  const updated = await authRepository.updateUserProfile(userId, {
    username: profileData.username?.trim(),
    name: profileData.name?.trim(),
    profile_pic: profileData.profile_pic,
    bio: profileData.bio?.trim(),
  });

  return {
    message: "Profile updated successfully",
    user: updated,
  };
};
