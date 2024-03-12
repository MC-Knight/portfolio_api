import express from "express";
import BlogController from "../controllers/blogController";

const routerBlog = express();

routerBlog.post("/create", BlogController.createBlog);

export default routerBlog;
