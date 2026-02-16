import * as userRepository from "../repositories/userRepository.js";

/**
 * Service Layer สำหรับ User
 * ทำหน้าที่จัดการ Business Logic
 */

export const getUsers = async () => {
  const rows = await userRepository.findAll();
  return rows.map((row) => ({
    id: row.id,
    username: row.username,
    name: row.name,
    profile_pic: row.profile_pic,
    role: row.role,
    bio: row.bio,
  }));
};

export const getUserById = async (id) => {
  const user = await userRepository.findById(id);
  if (!user) {
    throw new Error("USER_NOT_FOUND");
  }
  return {
    id: user.id,
    username: user.username,
    name: user.name,
    profile_pic: user.profile_pic,
    role: user.role,
    bio: user.bio,
  };
};

export const updateUser = async (userId, userData) => {
  const existing = await userRepository.findById(userId);
  if (!existing) {
    throw new Error("USER_NOT_FOUND");
  }
  if (userData.username !== undefined && userData.username !== existing.username) {
    const taken = await userRepository.findByUsername(userData.username.trim());
    if (taken) {
      throw new Error("USERNAME_ALREADY_TAKEN");
    }
  }
  return userRepository.updateById(userId, {
    username: userData.username?.trim(),
    name: userData.name?.trim(),
    profile_pic: userData.profile_pic,
    role: userData.role,
    bio: userData.bio?.trim(),
  });
};

export const deleteUser = async (userId) => {
  const existing = await userRepository.findById(userId);
  if (!existing) {
    throw new Error("USER_NOT_FOUND");
  }
  await userRepository.deleteById(userId);
  return { message: "User deleted successfully" };
};

// สำหรับดึงรูปและชื่อคนเดียว id = fb79d5ea-8598-45a6-aadb-605b6d1af81d เท่านั้นไม่ต้อง auth
export const getUserForProfile = async () => {
  const user = await userRepository.findByIdForProfile();
  if (!user) {
    throw new Error("USER_NOT_FOUND");
  }
  return user;
};

// สำหรับเปลี่ยนรหัสผ่าน
export const changePassword = async (user, body, token) => {
  const { currentPassword, newPassword, confirmPassword } = body;

  if (!currentPassword || !newPassword) {
    throw new Error("MISSING_FIELDS");
  }

  if (newPassword !== confirmPassword) {
    throw new Error("PASSWORD_NOT_MATCH");
  }

  // 1) ตรวจสอบรหัสผ่านปัจจุบัน โดย sign in ด้วย email
  const { error: loginError } = await userRepository.verifyUserPassword(
    user.email,
    currentPassword
  );

  if (loginError) {
    throw new Error("CURRENT_PASSWORD_INCORRECT");
  }

  // 2) อัพเดตรหัสผ่านใหม่ผ่าน Supabase Admin API (ใช้ user.id ไม่ต้องใช้ session)
  const { error: updateError } = await userRepository.updateUserPassword(
    user.id,
    newPassword
  );

  if (updateError) {
    throw new Error(updateError.message || "PASSWORD_UPDATE_FAILED");
  }

  return { message: "Password updated successfully" };
};
