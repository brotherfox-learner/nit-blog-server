import * as userService from "../services/userService.js";

/**
 * Controller Layer สำหรับ User
 */

export const getUsers = async (req, res, next) => {
  try {
    const result = await userService.getUsers();
    res.status(200).json(result);
  } catch (error) {
    if (error.code === "ECONNREFUSED" || error.message?.includes("connection")) {
      return res.status(500).json({ message: "Database connection error" });
    }
    next(error);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const userId = req.params.userId ?? req.params.id;
    const user = await userService.getUserById(userId);
    res.status(200).json(user);
  } catch (error) {
    if (error.message === "USER_NOT_FOUND") {
      return res.status(404).json({ message: "User not found" });
    }
    next(error);
  }
};

export const createUser = async (req, res, next) => {
  try {
    const userData = {
      username: req.body.username,
      name: req.body.name,
      profile_pic: req.body.profile_pic,
      role: req.body.role,
      bio: req.body.bio,
    };
    const user = await userService.createUser(userData);
    res.status(201).json({ message: "User created successfully", user });
  } catch (error) {
    if (error.message === "Username is required") {
      return res.status(400).json({ message: error.message });
    }
    if (error.message === "USERNAME_ALREADY_TAKEN") {
      return res.status(400).json({ message: "This username is already taken" });
    }
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const userId = req.body.id;
    const imageFile = req.files?.imageFile?.[0];
    // ใช้ไฟล์ที่อัพโหลดก่อน ถ้าไม่มีให้ใช้ profile_pic จาก body (base64 string)
    const profilePic = imageFile
      ? imageFile.buffer.toString("base64")
      : req.body.profile_pic ?? null;
    const userData = {
      username: req.body.username,
      name: req.body.name,
      profile_pic: profilePic,
      role: req.body.role,
      bio: req.body.bio,
    };
    const user = await userService.updateUser(userId, userData);
    res.status(200).json({ message: "User updated successfully", user });
  } catch (error) {
    if (error.message === "USER_NOT_FOUND") {
      return res.status(404).json({ message: "User not found" });
    }
    if (error.message === "USERNAME_ALREADY_TAKEN") {
      return res.status(400).json({ message: "This username is already taken" });
    }
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const userId = req.params.userId ?? req.params.id;
    const result = await userService.deleteUser(userId);
    res.status(200).json(result);
  } catch (error) {
    if (error.message === "USER_NOT_FOUND") {
      return res.status(404).json({ message: "User not found" });
    }
    next(error);
  }
};

// สำหรับดึงรูปและชื่อคนเดียว id = fb79d5ea-8598-45a6-aadb-605b6d1af81d เท่านั้นไม่ต้อง auth
export const getUserForProfile = async (req, res, next) => {
  try {
    const user = await userService.getUserForProfile();
    res.status(200).json(user);
  } catch (error) {
    if (error.message === "USER_NOT_FOUND") {
      return res.status(404).json({ message: "User not found" });
    }
    next(error);
  }
};

// สำหรับเปลี่ยนรหัสผ่าน
export const changePassword = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    const result = await userService.changePassword(req.user, req.body, token);

    res.status(200).json(result);
  } catch (err) {
    if (err.message === "MISSING_FIELDS") {
      return res.status(400).json({ message: "Current password and new password are required" });
    }
    if (err.message === "PASSWORD_NOT_MATCH") {
      return res.status(400).json({ message: "New password and confirm password do not match" });
    }
    if (err.message === "CURRENT_PASSWORD_INCORRECT") {
      return res.status(400).json({ message: "Current password is incorrect" });
    }
    next(err);
  }
};
