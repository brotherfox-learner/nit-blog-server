import express from "express";
import {
  likePost,
  unlikePost,
  getLikesByPostId,
  checkUserLiked,
} from "../controllers/likeController.js";
import { validatePostIdParamForLike } from "../middleware/validation.middleware.js";
import { protectUser } from "../middleware/auth.middleware.js";
const likeRouter = express.Router();

likeRouter.get("/posts/:postId", validatePostIdParamForLike, getLikesByPostId);
likeRouter.get("/posts/:postId/check", validatePostIdParamForLike, checkUserLiked);
likeRouter.post("/posts/:postId", protectUser, validatePostIdParamForLike, likePost);
likeRouter.delete("/posts/:postId", protectUser, validatePostIdParamForLike, unlikePost);

export default likeRouter;
