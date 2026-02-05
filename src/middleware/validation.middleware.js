export const validateCreatePost = (req, res, next) => {
  const {image, title, description, content, category_id, status_id} = req.body;
  const errors = [];

  // ตรวจสอบว่ามี title และ content หรือไม่
  if (!image) {
    errors.push("Image is required");
  } else if (typeof image !== "string") {
    errors.push("Image must be a string");
  } else if (image.trim().length === 0) {
    errors.push("Image cannot be empty");
  }

  if (!title) {
    errors.push("Title is required");
  } else if (typeof title !== "string") {
    errors.push("Title must be a string");
  } else if (title.trim().length === 0) {
    errors.push("Title cannot be empty");
  } else if (title.length > 200) {
    errors.push("Title must not exceed 200 characters");
  }

  if (category_id) {
    if (typeof category_id !== "number") {
      errors.push("category ID must be a number");
    } else if (category_id <= 0) {
      errors.push("category ID must be greater than 0");
    }
  }
  
  if (!description) {
    errors.push("Description is required");
  } else if (typeof description !== "string") {
    errors.push("Description must be a string");
  } else if (description.trim().length === 0) {
    errors.push("Description cannot be empty");
  } 

  if (!content) {
    errors.push("Content is required");
  } else if (typeof content !== "string") {
    errors.push("Content must be a string");
  } else if (content.trim().length === 0) {
    errors.push("Content cannot be empty");
  } else if (content.length > 10000) {
    errors.push("Content must not exceed 10000 characters");
  }

  if (status_id) {
    if (typeof status_id !== "number") {
      errors.push("status ID must be a number");
    } else if (status_id <= 0) {
      errors.push("status ID must be greater than 0");
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({ 
      message: "Validation failed",
      errors: errors 
    });
  }

  next();
};

export const validateUpdatePost = (req, res, next) => {
  const { image, title, description, content, category_id, status_id } = req.body;
  const errors = [];

  if (image !== undefined) {
    if (typeof image !== "string") {
      errors.push("Image must be a string");
    } else if (image.trim().length === 0) {
      errors.push("Image cannot be empty");
    }
  }

  if (title !== undefined) {
    if (typeof title !== "string") {
      errors.push("Title must be a string");
    } else if (title.trim().length === 0) {
      errors.push("Title cannot be empty");
    } else if (title.length > 200) {
      errors.push("Title must not exceed 200 characters");
    }
  }

  if (description !== undefined) {
    if (typeof description !== "string") {
      errors.push("Description must be a string");
    } else if (description.trim().length === 0) {
      errors.push("Description cannot be empty");
    }
  }

  if (content !== undefined) {
    if (typeof content !== "string") {
      errors.push("Content must be a string");
    } else if (content.trim().length === 0) {
      errors.push("Content cannot be empty");
    } else if (content.length > 10000) {
      errors.push("Content must not exceed 10000 characters");
    }
  }

  if (category_id) {
    if (typeof category_id !== "number") {
      errors.push("category ID must be a number");
    } else if (category_id <= 0) {
      errors.push("category ID must be greater than 0");
    }
  }

  if (status_id) {
    if (typeof status_id !== "number") {
      errors.push("status ID must be a number");
    } else if (status_id <= 0) {
      errors.push("status ID must be greater than 0");
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      message: "Validation failed",
      errors,
    });
  }

  next();
};

const validatePostIdParam = (paramName) => (req, res, next) => {
  const id = req.params[paramName] || req.params.id;
  const errors = [];

  if (!id) {
    errors.push("Post ID is required");
  } else if (!/^\d+$/.test(String(id))) {
    errors.push("Post ID must be a valid number");
  }

  if (errors.length > 0) {
    return res.status(400).json({
      message: "Validation failed",
      errors,
    });
  }

  next();
};

export const validateDeletePost = validatePostIdParam("postId");
export const validateGetPost = validatePostIdParam("postId");
