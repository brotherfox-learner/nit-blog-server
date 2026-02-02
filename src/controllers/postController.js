export const getPosts = async (req, res, next) => {
  try {
    // TODO: Implement with database
    res.json({ posts: [] });
  } catch (error) {
    next(error);
  }
};

export const getPostById = async (req, res, next) => {
  try {
    const { id } = req.params;
    // TODO: Implement with database
    res.json({ post: null });
  } catch (error) {
    next(error);
  }
};

export const createPost = async (req, res, next) => {
  try {
    const { title, content } = req.body;
    // TODO: Implement with database
    res.status(201).json({ message: "Post created" });
  } catch (error) {
    next(error);
  }
};
