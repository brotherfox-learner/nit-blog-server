import * as authRepository from "../repositories/authRepository.js";

/**
 * Service Layer สำหรับ Auth
 * ทำหน้าที่จัดการ Business Logic
 * ไม่รู้จัก req, res
 *
 * Server-side Auth:
 * - signUp / signIn ผ่าน Supabase Admin (server-side)
 * - Supabase trigger สร้าง profile ใน public.users อัตโนมัติหลัง signUp
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

// ========== Server-side Auth Operations ==========

// Sign up ผ่าน server
export const signUp = async ({ email, password, username, name }) => {
  // ตรวจสอบ username ซ้ำ
  const existingUsername = await authRepository.findUserByUsername(username);
  if (existingUsername) {
    throw new Error("USERNAME_ALREADY_TAKEN");
  }

  // สมัครผ่าน Supabase Admin
  const { data, error } = await authRepository.signUpWithEmail({
    email,
    password,
    username,
    name,
  });

  if (error) {
    // แปลง Supabase error เป็น custom error
    if (error.message?.includes("already registered")) {
      throw new Error("EMAIL_ALREADY_REGISTERED");
    }
    throw new Error(error.message || "SIGNUP_FAILED");
  }

  // ถ้า signUp สำเร็จ, ดึง profile (trigger สร้าง row ให้แล้ว)
  // รอสักครู่ให้ trigger ทำงาน
  let profile = null;
  if (data.user) {
    // retry หา profile สูงสุด 3 ครั้ง (trigger อาจใช้เวลาเล็กน้อย)
    for (let i = 0; i < 3; i++) {
      profile = await authRepository.findUserById(data.user.id);
      if (profile) break;
      await new Promise((r) => setTimeout(r, 200));
    }
  }

  return {
    user: data.user,
    session: data.session,
    profile,
  };
};

// Sign in ผ่าน server
export const signIn = async ({ email, password }) => {
  const { data, error } = await authRepository.signInWithEmail({
    email,
    password,
  });

  if (error) {
    if (error.message?.includes("Invalid login credentials")) {
      throw new Error("INVALID_CREDENTIALS");
    }
    throw new Error(error.message || "SIGNIN_FAILED");
  }

  // ดึง profile
  let profile = null;
  if (data.user) {
    profile = await authRepository.findUserById(data.user.id);
  }

  return {
    user: data.user,
    session: data.session,
    profile,
  };
};
