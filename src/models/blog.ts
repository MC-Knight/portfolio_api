import Joi from "joi";
import { Schema, model } from "mongoose";

interface IBlog {
  title: string;
  content: string;
  date: Date;
  views: number;
  likes: number;
}

const blogSchema = new Schema<IBlog>({
  title: { type: String, required: true },
  content: { type: String, required: true },
  date: { type: Date, default: Date.now() },
  views: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
});

const Blog = model<IBlog>("Blog", blogSchema);

const validateBlog = (blog: Pick<IBlog, "title" | "content">) => {
  const schema = Joi.object({
    title: Joi.string().min(2).required(),
    content: Joi.string().min(3).required(),
  });

  return schema.validate(blog);
};

export { Blog, validateBlog as validate };
