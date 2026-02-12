import express from "express";
import {
  likePost,
  unlikePost,
  getLikesByPostId,
  checkUserLiked,
} from "../controllers/likeController.js";
import { validateLikeBody, validatePostIdParamForLike } from "../middleware/validation.middleware.js";
import { protectUser } from "../middleware/auth.middleware.js";
const likeRouter = express.Router();

likeRouter.get("/posts/:postId", validatePostIdParamForLike, getLikesByPostId);
likeRouter.get("/posts/:postId/check", validatePostIdParamForLike, checkUserLiked);
likeRouter.post("/posts/:postId", protectUser, validatePostIdParamForLike, validateLikeBody, likePost);
likeRouter.delete("/posts/:postId", protectUser, validatePostIdParamForLike, validateLikeBody, unlikePost);

export default likeRouter;
