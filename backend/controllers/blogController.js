import BlogPost from "../models/BlogPost.js";
import Blog from "../models/BlogPost.js";

// Get all blogs
export const getBlogs = async (req, res) => {
  try {
    const blogs = await BlogPost.find().populate("author");
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create a new blog
export const createBlog = async (req, res) => {
  try {
    const blog = new BlogPost(req.body);
    await blog.save();
    res.status(201).json(blog);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
