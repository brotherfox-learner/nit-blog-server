export const validateCreatePost = (req, res, next) => {
  // FormData ส่ง values มาเป็น string ทั้งหมด ต้อง parse ก่อน
  const image = req.body.image;
  const title = req.body.title;
  const description = req.body.description;
  const content = req.body.content;
  // parse category_id และ status_id เป็น number
  const category_id = req.body.category_id ? parseInt(req.body.category_id, 10) : undefined;
  const status_id = req.body.status_id ? parseInt(req.body.status_id, 10) : undefined;

  // อัพเดต req.body ให้เป็น number สำหรับ controller
  if (category_id !== undefined) req.body.category_id = category_id;
  if (status_id !== undefined) req.body.status_id = status_id;

  const errors = [];

  // image อาจมาจาก file upload แทน field ดังนั้นเช็คแค่ถ้ามีค่า
  // ถ้าไม่มี image และไม่มี imageFile ก็ error
  const hasImageFile = req.files && req.files.imageFile && req.files.imageFile.length > 0;
  if (!image && !hasImageFile) {
    errors.push("Image is required (either image URL or imageFile)");
  } else if (image && typeof image !== "string") {
    errors.push("Image must be a string");
  } else if (image && image.trim().length === 0 && !hasImageFile) {
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

  if (category_id !== undefined) {
    if (isNaN(category_id)) {
      errors.push("category ID must be a valid number");
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

  if (status_id !== undefined) {
    if (isNaN(status_id)) {
      errors.push("status ID must be a valid number");
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
  // FormData ส่ง values มาเป็น string ทั้งหมด ต้อง parse ก่อน
  const image = req.body.image;
  const title = req.body.title;
  const description = req.body.description;
  const content = req.body.content;
  // parse category_id และ status_id เป็น number
  const category_id = req.body.category_id ? parseInt(req.body.category_id, 10) : undefined;
  const status_id = req.body.status_id ? parseInt(req.body.status_id, 10) : undefined;

  // อัพเดต req.body ให้เป็น number สำหรับ controller
  if (category_id !== undefined) req.body.category_id = category_id;
  if (status_id !== undefined) req.body.status_id = status_id;

  const errors = [];

  // image อาจมาจาก file upload แทน field หรืออาจ keep existing image
  const hasImageFile = req.files && req.files.imageFile && req.files.imageFile.length > 0;
  if (image !== undefined && !hasImageFile) {
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

  if (category_id !== undefined) {
    if (isNaN(category_id)) {
      errors.push("category ID must be a valid number");
    } else if (category_id <= 0) {
      errors.push("category ID must be greater than 0");
    }
  }

  if (status_id !== undefined) {
    if (isNaN(status_id)) {
      errors.push("status ID must be a valid number");
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

// --- User validation ---
const validateIdParam = (paramName, paramLabel) => (req, res, next) => {
  const id = req.params[paramName] ?? req.params.id;
  const errors = [];
  if (!id) {
    errors.push(`${paramLabel} is required`);
  } else if (!/^\d+$/.test(String(id))) {
    errors.push(`${paramLabel} must be a valid number`);
  }
  if (errors.length > 0) {
    return res.status(400).json({ message: "Validation failed", errors });
  }
  next();
};

export const validateUserIdParam = validateIdParam("userId", "User ID");

export const validateCreateUser = (req, res, next) => {
  const { username } = req.body;
  const errors = [];
  if (!username) {
    errors.push("Username is required");
  } else if (typeof username !== "string") {
    errors.push("Username must be a string");
  } else if (username.trim().length === 0) {
    errors.push("Username cannot be empty");
  }
  if (req.body.name !== undefined && typeof req.body.name !== "string") {
    errors.push("Name must be a string");
  }
  if (req.body.bio !== undefined && typeof req.body.bio !== "string") {
    errors.push("Bio must be a string");
  }
  if (errors.length > 0) {
    return res.status(400).json({ message: "Validation failed", errors });
  }
  next();
};

export const validateUpdateUser = (req, res, next) => {
  const { username, name, bio } = req.body;
  const errors = [];
  if (username !== undefined) {
    if (typeof username !== "string") {
      errors.push("Username must be a string");
    } else if (username.trim().length === 0) {
      errors.push("Username cannot be empty");
    }
  }
  if (name !== undefined && typeof name !== "string") {
    errors.push("Name must be a string");
  }
  if (bio !== undefined && typeof bio !== "string") {
    errors.push("Bio must be a string");
  }
  if (errors.length > 0) {
    return res.status(400).json({ message: "Validation failed", errors });
  }
  next();
};

// --- Status validation ---
export const validateStatusIdParam = validateIdParam("statusId", "Status ID");

// --- Category validation ---
export const validateCategoryIdParam = validateIdParam("categoryId", "Category ID");

export const validateCreateCategory = (req, res, next) => {
  const { name } = req.body;
  const errors = [];
  if (!name) {
    errors.push("Category name is required");
  } else if (typeof name !== "string") {
    errors.push("Category name must be a string");
  } else if (name.trim().length === 0) {
    errors.push("Category name cannot be empty");
  }
  if (errors.length > 0) {
    return res.status(400).json({ message: "Validation failed", errors });
  }
  next();
};

export const validateUpdateCategory = (req, res, next) => {
  const { name } = req.body;
  const errors = [];
  if (name !== undefined) {
    if (typeof name !== "string") {
      errors.push("Category name must be a string");
    } else if (name.trim().length === 0) {
      errors.push("Category name cannot be empty");
    }
  }
  if (errors.length > 0) {
    return res.status(400).json({ message: "Validation failed", errors });
  }
  next();
};

// --- Like validation ---
export const validatePostIdParamForLike = (req, res, next) => {
  const postId = req.params.postId ?? req.params.id;
  const errors = [];
  if (!postId) {
    errors.push("Post ID is required");
  } else if (!/^\d+$/.test(String(postId))) {
    errors.push("Post ID must be a valid number");
  }
  if (errors.length > 0) {
    return res.status(400).json({ message: "Validation failed", errors });
  }
  next();
};

export const validateLikeBody = (req, res, next) => {
  const user_id = req.body.user_id;
  const errors = [];
  if (user_id === undefined || user_id === null || user_id === "") {
    errors.push("user_id is required");
  } else if (!/^\d+$/.test(String(user_id))) {
    errors.push("user_id must be a valid number");
  }
  if (errors.length > 0) {
    return res.status(400).json({ message: "Validation failed", errors });
  }
  next();
};

// --- Comment validation ---
export const validateCommentIdParam = validateIdParam("id", "Comment ID");

export const validatePostIdParamForComment = (req, res, next) => {
  const post_id = req.params.post_id;
  const errors = [];
  if (!post_id) {
    errors.push("post_id is required");
  } else if (!/^\d+$/.test(String(post_id))) {
    errors.push("post_id must be a valid number");
  }
  if (errors.length > 0) {
    return res.status(400).json({ message: "Validation failed", errors });
  }
  next();
};

export const validateUserIdParamForComment = (req, res, next) => {
  const user_id = req.params.user_id;
  const errors = [];
  if (!user_id) {
    errors.push("user_id is required");
  } else if (!/^\d+$/.test(String(user_id))) {
    errors.push("user_id must be a valid number");
  }
  if (errors.length > 0) {
    return res.status(400).json({ message: "Validation failed", errors });
  }
  next();
};

export const validateCreateComment = (req, res, next) => {
  const { post_id, comment_text } = req.body;
  const errors = [];
  if (post_id === undefined || post_id === null || post_id === "") {
    errors.push("post_id is required");
  } else if (!/^\d+$/.test(String(post_id))) {
    errors.push("post_id must be a valid number");
  }
  // user_id มาจาก req.user.id (protectUser middleware) ไม่ต้องเช็คจาก body
  if (!comment_text) {
    errors.push("comment_text is required");
  } else if (typeof comment_text !== "string") {
    errors.push("comment_text must be a string");
  } else if (comment_text.trim().length === 0) {
    errors.push("comment_text cannot be empty");
  }
  if (errors.length > 0) {
    return res.status(400).json({ message: "Validation failed", errors });
  }
  next();
};

export const validateUpdateComment = (req, res, next) => {
  const { comment_text } = req.body;
  const errors = [];
  if (!comment_text) {
    errors.push("comment_text is required");
  } else if (typeof comment_text !== "string") {
    errors.push("comment_text must be a string");
  } else if (comment_text.trim().length === 0) {
    errors.push("comment_text cannot be empty");
  }
  if (errors.length > 0) {
    return res.status(400).json({ message: "Validation failed", errors });
  }
  next();
};
