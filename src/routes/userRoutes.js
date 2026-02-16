import express from "express";
import multer from "multer";
import {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUserForProfile,
  changePassword,
} from "../controllers/userController.js";
import {
  validateUpdateUser,
} from "../middleware/validation.middleware.js";
import { protectUser, protectAdmin } from "../middleware/auth.middleware.js";

const multerUpload = multer({ storage: multer.memoryStorage() });
const imageFileUpload = multerUpload.fields([
  { name: "imageFile", maxCount: 1 },
]);
const userRouter = express.Router();

userRouter.get("/", protectAdmin, getUsers);
userRouter.get("/profile", getUserForProfile);
userRouter.get("/:userId", protectUser, getUserById);
userRouter.put("/", protectUser, imageFileUpload, validateUpdateUser, updateUser);
userRouter.put("/change-password", protectUser, changePassword);
userRouter.delete("/:userId", protectUser, deleteUser);

export default userRouter;
