import express, { type Express } from "express";
import routerBlog from "../routes/blogRouter";
import routerComment from "../routes/commentRouter";
import routerUser from "../routes/userRouter";

export const addRoutes = (app: Express): void => {
  app.use(express.json());
  app.use("/api/blogs", routerBlog);
  app.use("/api/comments", routerComment);
  app.use("/api/users", routerUser);
};
