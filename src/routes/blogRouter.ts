import express from "express";
import BlogController from "../controllers/blogController";
import upload from "../middleware/multer";

const routerBlog = express();

routerBlog.post("/create", upload.single("image"), BlogController.createBlog);
routerBlog.get("", BlogController.getAllBlogs);
routerBlog.get("/:id", BlogController.getSingleBlog);
routerBlog.put("/edit/:id", BlogController.editBlogs);
routerBlog.delete("/delete/:id", BlogController.deleteBlogs);
routerBlog.put("/view/:id", BlogController.viewBlogs);
routerBlog.put("/like/:id", BlogController.likeBlogs);

export default routerBlog;
