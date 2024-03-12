import express from "express";
import BlogController from "../controllers/blogController";

const routerBlog = express();

routerBlog.post("/create", BlogController.createBlog);
routerBlog.get("", BlogController.getAllBlogs);

export default routerBlog;
