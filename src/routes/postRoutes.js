import express from "express";
import { getPosts, getPostById, createPost, updatePost, deletePost } from "../controllers/postController.js";
import { validateCreatePost, validateUpdatePost, validateDeletePost, validateGetPost } from "../middleware/validation.middleware.js";

const postRouter = express.Router();

postRouter.get("/", getPosts);
postRouter.get("/:postId", validateGetPost, getPostById);
postRouter.post("/", validateCreatePost, createPost);
postRouter.put("/:postId", validateUpdatePost, updatePost);
postRouter.delete("/:postId", validateDeletePost, deletePost);

export default postRouter;
