import express from "express";
import { getPosts, getPostById, createPost, updatePost, deletePost, getPostsByCategoryId, getPostsByTitleKeyword } from "../controllers/postController.js";

const postRouter = express.Router();

postRouter.get("/", getPosts);
postRouter.get("/:id", getPostById);
postRouter.post("/", createPost);
postRouter.put("/:id", updatePost);
postRouter.delete("/:id", deletePost);

export default postRouter;
