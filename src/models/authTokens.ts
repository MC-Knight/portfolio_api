import Joi from "joi";
import { Schema, model } from "mongoose";

interface IRefToken {
  token: string;
}

const refToken = new Schema<IRefToken>({
  token: { type: String, required: true },
});

const RefreshToken = model<IRefToken>("RefreshToken", refToken);

const validateRefToken = (reftoken: IRefToken): Joi.ValidationResult<any> => {
  const schema = Joi.object({
    token: Joi.string().min(3).required().messages({
      "any.required": "token is required.",
    }),
  });

  return schema.validate(reftoken);
};

export { type IRefToken, RefreshToken, validateRefToken };
