import express from "express";
import postRoutes from "./postRoutes.js";
import userRoutes from "./userRoutes.js";
import statusRoutes from "./statusRoutes.js";
import categoryRoutes from "./categoryRoutes.js";
import likeRoutes from "./likeRoutes.js";
import commentRoutes from "./commentRoutes.js";
import authRoutes from "./authRoutes.js";
import notificationRoutes from "./notificationRoutes.js";
import statisticsRoutes from "./statisticsRoutes.js";
// import adminRoutes from "./adminRoutes.js";

const router = express.Router();

router.use("/posts", postRoutes);
router.use("/users", userRoutes);
router.use("/statuses", statusRoutes);
router.use("/categories", categoryRoutes);
router.use("/likes", likeRoutes);
router.use("/comments", commentRoutes);
router.use("/auth", authRoutes);
router.use("/notifications", notificationRoutes);
router.use("/statistics", statisticsRoutes);
// router.use("/admin", adminRoutes);

export default router;
