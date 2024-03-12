import express from "express";
import BlogController from "../controllers/blogController";

const routerBlog = express();

routerBlog.post("/create", BlogController.createBlog);
routerBlog.get("", BlogController.getAllBlogs);
routerBlog.get("/:id", BlogController.getSingleBlog);
routerBlog.put("/edit/:id", BlogController.editBlogs);

export default routerBlog;
