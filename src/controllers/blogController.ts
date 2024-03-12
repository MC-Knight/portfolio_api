import { type Request, type Response } from "express";
import { Blog, validate } from "../models/blog";

class BlogController {
  static async createBlog(
    req: Request,
    res: Response
  ): Promise<undefined | Response<any, Record<string, any>>> {
    try {
      const { error } = validate(req.body);
      if (error !== undefined) {
        return res.status(400).json({ error: error?.details[0].message });
      }

      const blog = new Blog({
        title: req.body.title,
        content: req.body.content,
      });

      await blog.save();

      res.status(201).json({ message: "blog created successfully", blog });
    } catch (error) {
      res.status(400).json({ error: "sommething goes wrong" });
    }
  }

  static async getSingleBlog(
    req: Request,
    res: Response
  ): Promise<undefined | Response<any, Record<string, any>>> {
    try {
      const blogId = req.params.id;
      const blog = await Blog.findById(blogId);

      if (blog == null) {
        return res
          .status(404)
          .json({ error: "blog with the given ID was not found." });
      }

      res.status(200).json({ blog });
    } catch (error) {
      res.status(400).json({ error: "Something went wrong" });
    }
  }

  static async getAllBlogs(
    req: Request,
    res: Response
  ): Promise<undefined | Response<any, Record<string, any>>> {
    try {
      const blogs = await Blog.find();
      res.status(200).json({ blogs });
    } catch (error) {
      return res.status(400).json({ error: "Something went wrong" });
    }
  }

  static async editBlogs(
    req: Request,
    res: Response
  ): Promise<undefined | Response<any, Record<string, any>>> {
    const { error } = validate(req.body);
    if (error !== undefined) {
      return res.status(400).json({ error: error?.details[0].message });
    }

    const blog = await Blog.findByIdAndUpdate(req.params.id, {
      title: req.body.title,
      content: req.body.content,
    });

    if (blog == null) {
      res.status(404).json({ error: "blog with the given ID was not found." });
      return;
    }

    res.status(200).json({ message: "blog edited successfully" });
  }

  static async deleteBlogs(
    req: Request,
    res: Response
  ): Promise<undefined | Response<any, Record<string, any>>> {
    const blog = await Blog.findByIdAndDelete(req.params.id);

    if (blog == null) {
      return res
        .status(404)
        .json({ error: "blog with the given ID was not found." });
    }

    res.status(200).json({ message: "blog deleted successfully" });
  }
}

export default BlogController;
