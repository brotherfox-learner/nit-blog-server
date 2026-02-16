import * as categoryRepository from "../repositories/categoryRepository.js";

/**
 * Service Layer สำหรับ Category
 */

export const getCategories = async () => {
  const rows = await categoryRepository.findAll();
  return rows.map((row) => ({ id: row.id, name: row.name }));
};

export const getCategoryById = async (id) => {
  const category = await categoryRepository.findById(id);
  if (!category) {
    throw new Error("CATEGORY_NOT_FOUND");
  }
  return { id: category.id, name: category.name };
};

export const createCategory = async (categoryData) => {
  const { name } = categoryData;
  if (!name || !name.trim()) {
    throw new Error("Category name is required");
  }
  const existing = await categoryRepository.findByName(name.trim());
  if (existing) {
    throw new Error("CATEGORY_NAME_EXISTS");
  }
  return categoryRepository.create({ name: name.trim() });
};

export const updateCategory = async (id, categoryData) => {
  const existing = await categoryRepository.findById(id);
  if (!existing) {
    throw new Error("CATEGORY_NOT_FOUND");
  }
  const { name } = categoryData;
  if (!name || !name.trim()) {
    throw new Error("Category name is required");
  }
  const duplicate = await categoryRepository.findByName(name.trim());
  if (duplicate && duplicate.id !== parseInt(id, 10)) {
    throw new Error("CATEGORY_NAME_EXISTS");
  }
  return categoryRepository.updateById(id, { name: name.trim() });
};

export const deleteCategory = async (id) => {
  const existing = await categoryRepository.findById(id);
  if (!existing) {
    throw new Error("CATEGORY_NOT_FOUND");
  }
  await categoryRepository.deleteById(id);
  return { message: "Category deleted successfully" };
};
