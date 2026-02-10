import * as categoryService from "../services/categoryService.js";

/**
 * Controller Layer สำหรับ Category
 */

export const getCategories = async (req, res, next) => {
  try {
    const result = await categoryService.getCategories();
    res.status(200).json(result);
  } catch (error) {
    if (error.code === "ECONNREFUSED" || error.message?.includes("connection")) {
      return res.status(500).json({ message: "Database connection error" });
    }
    next(error);
  }
};

export const getCategoryById = async (req, res, next) => {
  try {
    const categoryId = req.params.categoryId ?? req.params.id;
    const category = await categoryService.getCategoryById(categoryId);
    res.status(200).json(category);
  } catch (error) {
    if (error.message === "CATEGORY_NOT_FOUND") {
      return res.status(404).json({ message: "Category not found" });
    }
    next(error);
  }
};

export const createCategory = async (req, res, next) => {
  try {
    const categoryData = { name: req.body.name };
    const category = await categoryService.createCategory(categoryData);
    res.status(201).json({ message: "Category created successfully", category });
  } catch (error) {
    if (error.message === "Category name is required") {
      return res.status(400).json({ message: error.message });
    }
    if (error.message === "CATEGORY_NAME_EXISTS") {
      return res.status(400).json({ message: "Category with this name already exists" });
    }
    next(error);
  }
};

export const updateCategory = async (req, res, next) => {
  try {
    const categoryId = req.params.categoryId ?? req.params.id;
    const categoryData = { name: req.body.name };
    const category = await categoryService.updateCategory(categoryId, categoryData);
    res.status(200).json({ message: "Category updated successfully", category });
  } catch (error) {
    if (error.message === "CATEGORY_NOT_FOUND") {
      return res.status(404).json({ message: "Category not found" });
    }
    if (error.message === "Category name is required" || error.message === "CATEGORY_NAME_EXISTS") {
      return res.status(400).json({ message: error.message });
    }
    next(error);
  }
};

export const deleteCategory = async (req, res, next) => {
  try {
    const categoryId = req.params.categoryId ?? req.params.id;
    const result = await categoryService.deleteCategory(categoryId);
    res.status(200).json(result);
  } catch (error) {
    if (error.message === "CATEGORY_NOT_FOUND") {
      return res.status(404).json({ message: "Category not found" });
    }
    next(error);
  }
};
