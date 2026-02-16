import express from "express";
import {
  createComment,
  getCommentsByPostId,
  getCommentsByUserId,
  updateCommentById,
  deleteCommentById,
} from "../controllers/commentController.js";
import {
  validateCreateComment,
  validateUpdateComment,
  validateCommentIdParam,
  validatePostIdParamForComment,
  validateUserIdParamForComment,
} from "../middleware/validation.middleware.js";

import { protectUser } from "../middleware/auth.middleware.js";

const commentRouter = express.Router();

commentRouter.post("/", protectUser, validateCreateComment, createComment);
commentRouter.get("/post/:post_id", validatePostIdParamForComment, getCommentsByPostId);
commentRouter.get("/user/:user_id", validateUserIdParamForComment, getCommentsByUserId);
commentRouter.put("/:id", protectUser, validateCommentIdParam, validateUpdateComment, updateCommentById);
commentRouter.delete("/:id", protectUser, validateCommentIdParam, deleteCommentById);

export default commentRouter;
