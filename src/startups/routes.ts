import express, { type Express } from "express";
import routerBlog from "../routes/blogRouter";

export const addRoutes = (app: Express): void => {
  app.use(express.json());
  app.use("/api/blogs", routerBlog);
};
