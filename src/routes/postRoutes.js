import express from "express";
import { getPosts, getPostById, createPost } from "../controllers/postController.js";

const postRouter = express.Router();

postRouter.get("/", getPosts);
postRouter.get("/:id", getPostById);
postRouter.post("/", createPost);

export default postRouter;
