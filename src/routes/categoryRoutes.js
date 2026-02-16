import express from "express";
import {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";
import {
  validateCreateCategory,
  validateUpdateCategory,
  validateCategoryIdParam,
} from "../middleware/validation.middleware.js";
import { protectAdmin } from "../middleware/auth.middleware.js";

const categoryRouter = express.Router();

categoryRouter.get("/", getCategories);
categoryRouter.get("/:categoryId", validateCategoryIdParam, getCategoryById);
categoryRouter.post("/", protectAdmin, validateCreateCategory, createCategory);
categoryRouter.put("/:categoryId", protectAdmin, validateCategoryIdParam, validateUpdateCategory, updateCategory);
categoryRouter.delete("/:categoryId", protectAdmin, validateCategoryIdParam, deleteCategory);

export default categoryRouter;
