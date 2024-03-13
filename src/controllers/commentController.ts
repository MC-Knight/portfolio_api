import { type Request, type Response } from "express";
import { Blog } from "../models/blog";
import { Comment, validate } from "../models/comment";

class CommentController {
  static async createComment(
    req: Request,
    res: Response
  ): Promise<undefined | Response<any, Record<string, any>>> {
    try {
      const { error } = validate(req.body);
      if (error !== undefined) {
        return res.status(400).json({ error: error?.details[0].message });
      }

      const existingBlog = await Blog.findById(req.body.blog);
      if (existingBlog == null) {
        return res.status(404).json({ error: "Invalid blog ID" });
      }
      const comment = new Comment({
        title: req.body.title,
        content: req.body.content,
        blog: req.body.blog,
      });

      await comment.save();

      res.status(201).json({ message: "comment posted successfully", comment });
    } catch (error) {
      res.status(400).json({ error: "sommething goes wrong" });
    }
  }

  static async deleteComments(
    req: Request,
    res: Response
  ): Promise<undefined | Response<any, Record<string, any>>> {
    const comment = await Comment.findByIdAndDelete(req.params.id);

    if (comment == null) {
      return res
        .status(404)
        .json({ error: "comment with the given ID was not found." });
    }

    res.status(200).json({ message: "comment deleted successfully" });
  }
}

export default CommentController;
