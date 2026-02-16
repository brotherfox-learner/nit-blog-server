import express from "express";
import { getPosts, getPostById, createPost, updatePost, deletePost } from "../controllers/postController.js";
import { validateCreatePost, validateUpdatePost, validateDeletePost, validateGetPost } from "../middleware/validation.middleware.js";
import multer from "multer";
import { protectUser, protectAdmin } from "../middleware/auth.middleware.js";

const multerUpload = multer({ storage: multer.memoryStorage() });
// กำหนดฟิลด์ที่จะรับไฟล์ (สามารถรับได้หลายฟิลด์)
const imageFileUpload = multerUpload.fields([
  { name: "imageFile", maxCount: 1 },
]);
const postRouter = express.Router();

postRouter.get("/", getPosts);
postRouter.get("/:postId", validateGetPost, getPostById);
postRouter.post("/", protectAdmin, imageFileUpload, validateCreatePost, createPost);
postRouter.put("/:postId", protectAdmin, imageFileUpload, validateUpdatePost, updatePost);
postRouter.delete("/:postId", protectAdmin, validateDeletePost, deletePost);

export default postRouter;
