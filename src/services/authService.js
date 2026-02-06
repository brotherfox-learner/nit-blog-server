import * as authRepository from "../repositories/authRepository.js";

/**
 * Service Layer สำหรับ Auth
 * ทำหน้าที่จัดการ Business Logic ของระบบ
 * เรียกใช้ Repository เพื่อเข้าถึงข้อมูล
 * ไม่รู้จัก req, res
 */

// Register user
export const register = async (registerData) => {
  const { email, password, username, name } = registerData;

  // Business Logic: ตรวจสอบว่ามีข้อมูลครบถ้วนหรือไม่
  if (!email || !password || !username || !name) {
    throw new Error("MISSING_REQUIRED_FIELDS");
  }

  // Business Logic: ตรวจสอบว่า username มีอยู่แล้วหรือไม่
  const existingUser = await authRepository.findUserByUsername(username);
  if (existingUser) {
    throw new Error("USERNAME_ALREADY_TAKEN");
  }

  // สร้าง user ใน Supabase
  const { data, error: supabaseError } = await authRepository.createSupabaseUser(
    email,
    password
  );

  if (supabaseError) {
    if (supabaseError.code === "user_already_exists") {
      throw new Error("EMAIL_ALREADY_EXISTS");
    }
    throw new Error("SUPABASE_SIGNUP_FAILED");
  }

  // สร้าง user ใน PostgreSQL database
  const supabaseUserId = data.user.id;
  const user = await authRepository.createUser(
    supabaseUserId,
    username,
    name,
    "user"
  );

  return {
    message: "User created successfully",
    user,
  };
};

// Login user
export const login = async (loginData) => {
  const { email, password } = loginData;

  // Business Logic: ตรวจสอบว่ามีข้อมูลครบถ้วนหรือไม่
  if (!email || !password) {
    throw new Error("MISSING_CREDENTIALS");
  }

  // Login ด้วย Supabase
  const { data, error } = await authRepository.signInWithPassword(
    email,
    password
  );

  if (error) {
    if (
      error.code === "invalid_credentials" ||
      error.message.includes("Invalid login credentials")
    ) {
      throw new Error("INVALID_CREDENTIALS");
    }
    throw new Error("LOGIN_FAILED");
  }

  return {
    message: "Signed in successfully",
    access_token: data.session.access_token,
  };
};

// Get user by token
export const getUser = async (token) => {
  // Business Logic: ตรวจสอบว่ามี token หรือไม่
  if (!token) {
    throw new Error("TOKEN_MISSING");
  }

  // ดึงข้อมูล user จาก Supabase ด้วย token
  const { data, error } = await authRepository.getUserFromToken(token);

  if (error || !data.user) {
    throw new Error("INVALID_TOKEN");
  }

  // ดึงข้อมูล user จาก PostgreSQL database
  const supabaseUserId = data.user.id;
  const user = await authRepository.findUserById(supabaseUserId);

  if (!user) {
    throw new Error("USER_NOT_FOUND");
  }

  return {
    id: data.user.id,
    email: data.user.email,
    username: user.username,
    name: user.name,
    role: user.role,
    profilePic: user.profile_pic,
  };
};
