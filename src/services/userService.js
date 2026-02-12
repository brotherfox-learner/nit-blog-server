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

export const updateUser = async (id, userData) => {
  const existing = await userRepository.findById(id);
  if (!existing) {
    throw new Error("USER_NOT_FOUND");
  }
  if (userData.username !== undefined && userData.username !== existing.username) {
    const taken = await userRepository.findByUsername(userData.username.trim());
    if (taken) {
      throw new Error("USERNAME_ALREADY_TAKEN");
    }
  }
  return userRepository.updateById(id, {
    username: userData.username?.trim(),
    name: userData.name?.trim(),
    profile_pic: userData.profile_pic,
    role: userData.role,
    bio: userData.bio?.trim(),
  });
};

export const deleteUser = async (id) => {
  const existing = await userRepository.findById(id);
  if (!existing) {
    throw new Error("USER_NOT_FOUND");
  }
  await userRepository.deleteById(id);
  return { message: "User deleted successfully" };
};
