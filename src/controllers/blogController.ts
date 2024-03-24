import { type Request, type Response } from "express";
import { Blog, validate } from "../models/blog";
import { Comment } from "../models/comment";
import cloudinary from "../utils/cloudinary";

class BlogController {
  static async createBlog(
    req: Request,
    res: Response
  ): Promise<undefined | Response<any, Record<string, any>>> {
    try {
      const { error } = validate(req.body);
      if (error !== undefined) {
        return res
          .status(400)
          .json({ statuCode: 400, error: error?.details[0].message });
      }

      let posterUrl: string | undefined;

      if (req.file !== undefined) {
        const file = req.file.path;
        const link = await cloudinary.uploader.upload(file);
        posterUrl = link.secure_url;
      }

      const blog = new Blog({
        title: req.body.title,
        content: req.body.content,
        poster: posterUrl,
      });

      await blog.save();

      res.status(201).json({
        statuCode: 201,
        message: "blog created successfully",
        blog,
      });
    } catch (error) {
      res.status(500).json({ statuCode: 500, error: "sommething goes wrong" });
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
        return res.status(404).json({
          statuCode: 404,
          error: "blog with the given ID was not found.",
        });
      }

      const comments = await Comment.find({ blog: blog._id });

      const blogWithComments = {
        _id: blog._id,
        title: blog.title,
        content: blog.content,
        poster: blog.poster,
        date: blog.date,
        views: blog.views,
        likes: blog.likes,
        comments,
      };

      res.status(200).json({ statuCode: 200, blogWithComments });
    } catch (error) {
      res.status(500).json({ statuCode: 500, error: "Something went wrong" });
    }
  }

  static async getAllBlogs(
    req: Request,
    res: Response
  ): Promise<undefined | Response<any, Record<string, any>>> {
    try {
      const blogs = await Blog.find();

      const blogsWithComments = [];

      if (blogs.length !== 0) {
        for (const blog of blogs) {
          const comments = await Comment.find({ blog: blog._id });
          const blogWithComments = {
            _id: blog._id,
            title: blog.title,
            content: blog.content,
            poster: blog.poster,
            date: blog.date,
            views: blog.views,
            likes: blog.likes,
            comments,
          };
          blogsWithComments.push(blogWithComments);
        }
      }

      res.status(200).json({ statuCode: 200, blogsWithComments });
    } catch (error) {
      return res
        .status(500)
        .json({ statuCode: 500, error: "Something went wrong" });
    }
  }

  static async editBlogs(
    req: Request,
    res: Response
  ): Promise<undefined | Response<any, Record<string, any>>> {
    const { error } = validate(req.body);
    if (error !== undefined) {
      return res
        .status(400)
        .json({ statuCode: 400, error: error?.details[0].message });
    }

    const blog = await Blog.findByIdAndUpdate(req.params.id, {
      title: req.body.title,
      content: req.body.content,
    });

    if (blog == null) {
      res.status(404).json({
        statuCode: 404,
        error: "blog with the given ID was not found.",
      });
      return;
    }

    res
      .status(200)
      .json({ statuCode: 200, message: "blog edited successfully" });
  }

  static async deleteBlogs(
    req: Request,
    res: Response
  ): Promise<undefined | Response<any, Record<string, any>>> {
    await Comment.deleteMany({ blog: req.params.id });
    const blog = await Blog.findByIdAndDelete(req.params.id);

    if (blog == null) {
      return res.status(404).json({
        statuCode: 404,
        error: "blog with the given ID was not found.",
      });
    }

    res
      .status(200)
      .json({ statuCode: 200, message: "blog deleted successfully" });
  }

  static async viewBlogs(
    req: Request,
    res: Response
  ): Promise<undefined | Response<any, Record<string, any>>> {
    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    );

    if (blog == null) {
      return res.status(404).json({
        statuCode: 404,
        error: "blog with the given ID was not found.",
      });
    }

    res
      .status(200)
      .json({ statuCode: 200, message: "blog views updated successfully" });
  }

  static async likeBlogs(
    req: Request,
    res: Response
  ): Promise<undefined | Response<any, Record<string, any>>> {
    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      { $inc: { likes: 1 } },
      { new: true }
    );

    if (blog == null) {
      return res.status(404).json({
        statuCode: 404,
        error: "blog with the given ID was not found.",
      });
    }

    res
      .status(200)
      .json({ statuCode: 200, message: "blog likes updated successfully" });
  }
}

export default BlogController;
