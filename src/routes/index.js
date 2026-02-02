import express from "express";
import postRoutes from "./postRoutes.js";

const router = express.Router();

router.use("/posts", postRoutes);

export default router;
