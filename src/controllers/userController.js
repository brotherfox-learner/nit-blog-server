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
    const userId = req.params.userId ?? req.params.id;
    const userData = {
      username: req.body.username,
      name: req.body.name,
      profile_pic: req.body.profile_pic,
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
