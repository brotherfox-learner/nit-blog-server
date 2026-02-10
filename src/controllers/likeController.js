import * as likeService from "../services/likeService.js";

/**
 * Controller Layer สำหรับ Like
 */

export const likePost = async (req, res, next) => {
  try {
    const postId = req.params.postId ?? req.params.id;
    const userId = req.body.user_id;
    const result = await likeService.likePost(postId, userId);
    res.status(201).json(result);
  } catch (error) {
    if (error.message === "POST_NOT_FOUND") {
      return res.status(404).json({ message: "Post not found" });
    }
    if (error.message === "ALREADY_LIKED") {
      return res.status(400).json({ message: "You have already liked this post" });
    }
    if (error.message === "user_id is required") {
      return res.status(400).json({ message: error.message });
    }
    next(error);
  }
};

export const unlikePost = async (req, res, next) => {
  try {
    const postId = req.params.postId ?? req.params.id;
    const userId = req.body.user_id;
    const result = await likeService.unlikePost(postId, userId);
    res.status(200).json(result);
  } catch (error) {
    if (error.message === "LIKE_NOT_FOUND") {
      return res.status(404).json({ message: "Like not found" });
    }
    if (error.message === "user_id is required") {
      return res.status(400).json({ message: error.message });
    }
    next(error);
  }
};

export const getLikesByPostId = async (req, res, next) => {
  try {
    const postId = req.params.postId ?? req.params.id;
    const result = await likeService.getLikesByPostId(postId);
    res.status(200).json(result);
  } catch (error) {
    if (error.message === "POST_NOT_FOUND") {
      return res.status(404).json({ message: "Post not found" });
    }
    next(error);
  }
};

export const checkUserLiked = async (req, res, next) => {
  try {
    const postId = req.params.postId ?? req.params.id;
    const userId = req.query.user_id;
    const result = await likeService.checkUserLiked(postId, userId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
