import { type Request, type Response } from "express";
import { Blog, validate } from "../models/blog";

class BlogController {
  static async createBlog(req: Request, res: Response): Promise<void> {
    try {
      const { error } = validate(req.body);
      if (error !== null) {
        res.status(400).json({ error: error?.details[0].message });
        return;
      }

      const blog = await Blog.create(req.body);

      res.status(201).json({ message: "blog created successfully", blog });
    } catch (error) {
      res.status(400).json({ error: "sommething goes wrong" });
    }
  }
}

export default BlogController;
