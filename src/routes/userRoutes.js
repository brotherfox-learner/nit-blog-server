import express from "express";
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";
import {
  validateCreateUser,
  validateUpdateUser,
  validateUserIdParam,
} from "../middleware/validation.middleware.js";

const userRouter = express.Router();

userRouter.get("/", getUsers);
userRouter.get("/:userId", validateUserIdParam, getUserById);
userRouter.post("/", validateCreateUser, createUser);
userRouter.put("/:userId", validateUserIdParam, validateUpdateUser, updateUser);
userRouter.delete("/:userId", validateUserIdParam, deleteUser);

export default userRouter;
