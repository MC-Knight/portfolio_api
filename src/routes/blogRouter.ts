import express from "express";
import BlogController from "../controllers/blogController";
import upload from "../middleware/multer";
import authMiddleware from "../middleware/authMiddleware";
import isAdminMiddleware from "../middleware/verifyAccess";

const routerBlog = express();

routerBlog.post(
  "/create",
  authMiddleware,
  isAdminMiddleware,
  upload.single("image"),
  BlogController.createBlog
);
routerBlog.get("", BlogController.getAllBlogs);
routerBlog.get("/:id", BlogController.getSingleBlog);
routerBlog.put(
  "/edit/:id",
  authMiddleware,
  isAdminMiddleware,
  BlogController.editBlogs
);
routerBlog.delete(
  "/delete/:id",
  authMiddleware,
  isAdminMiddleware,
  BlogController.deleteBlogs
);
routerBlog.put("/view/:id", BlogController.viewBlogs);
routerBlog.put("/like/:id", BlogController.likeBlogs);

export default routerBlog;
