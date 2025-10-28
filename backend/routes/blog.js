import express from "express";
import { getBlogs, createBlog } from "../controllers/blogController.js";

const router = express.Router();

router.route("/").get(getBlogs).post(createBlog);

export default router;
