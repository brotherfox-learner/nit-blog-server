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

const categoryRouter = express.Router();

categoryRouter.get("/", getCategories);
categoryRouter.get("/:categoryId", validateCategoryIdParam, getCategoryById);
categoryRouter.post("/", validateCreateCategory, createCategory);
categoryRouter.put("/:categoryId", validateCategoryIdParam, validateUpdateCategory, updateCategory);
categoryRouter.delete("/:categoryId", validateCategoryIdParam, deleteCategory);

export default categoryRouter;
