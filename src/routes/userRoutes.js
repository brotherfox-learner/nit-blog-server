import express from "express";
import {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";
import {
  validateUpdateUser,
  validateUserIdParam,
} from "../middleware/validation.middleware.js";
import { protectUser, protectAdmin } from "../middleware/auth.middleware.js";
const userRouter = express.Router();

userRouter.get("/", protectAdmin, getUsers);
userRouter.get("/:userId", protectUser, validateUserIdParam, getUserById);
userRouter.put("/:userId", protectUser, validateUserIdParam, validateUpdateUser, updateUser);
userRouter.delete("/:userId", protectUser, validateUserIdParam, deleteUser);

export default userRouter;
