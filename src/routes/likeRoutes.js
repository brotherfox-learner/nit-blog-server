import express from "express";
import {
  likePost,
  unlikePost,
  getLikesByPostId,
  checkUserLiked,
} from "../controllers/likeController.js";
import { validateLikeBody, validatePostIdParamForLike } from "../middleware/validation.middleware.js";

const likeRouter = express.Router();

likeRouter.get("/posts/:postId", validatePostIdParamForLike, getLikesByPostId);
likeRouter.get("/posts/:postId/check", validatePostIdParamForLike, checkUserLiked);
likeRouter.post("/posts/:postId", validatePostIdParamForLike, validateLikeBody, likePost);
likeRouter.delete("/posts/:postId", validatePostIdParamForLike, validateLikeBody, unlikePost);

export default likeRouter;
