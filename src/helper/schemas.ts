import Joi from "joi";

const blogSchema = Joi.object({
  title: Joi.string().min(2).required(),
  content: Joi.string().min(3).required(),
});

export default blogSchema;
