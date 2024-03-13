import Joi from "joi";
import { Schema, model } from "mongoose";

interface IComment {
  content: string;
  date: Date;
  blog: Schema.Types.ObjectId;
}

const commentSchema = new Schema<IComment>({
  content: { type: String, required: true },
  date: { type: Date, default: Date.now() },
  blog: { type: Schema.Types.ObjectId, ref: "Blog", required: true },
});

const Comment = model<IComment>("Comment", commentSchema);

const validateComment = (
  comment: Pick<IComment, "content" | "blog">
): Joi.ValidationResult<any> => {
  const schema = Joi.object({
    content: Joi.string().min(3).required(),
    blog: Joi.string().required(),
  });

  return schema.validate(comment);
};

export { type IComment, Comment, validateComment as validate, commentSchema };
