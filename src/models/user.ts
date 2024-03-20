import Joi from "joi";
import { Schema, model } from "mongoose";
import jwt, { type Secret } from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  isAdmin: boolean;
  generateAuthToken: () => string;
  generateRefreshToken: () => string;
}

const userSchema = new Schema<IUser>({
  firstName: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50,
  },
  lastName: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50,
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
});

userSchema.methods.generateAuthToken = function (): string {
  const token: string = jwt.sign(
    { _id: this._id, isAdmin: this.isAdmin },
    process.env.JWT_ACCESS_KEY as Secret,
    { expiresIn: "1h" }
  );
  return token;
};

userSchema.methods.generateRefreshToken = function (): string {
  const token: string = jwt.sign(
    { _id: this._id, isAdmin: this.isAdmin },
    process.env.JWT_REFRESH_KEY as Secret
  );
  return token;
};

const User = model<IUser>("User", userSchema);

const PASSWORD_REGEX = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{12,}$/;

const validateUser = (user: IUser): Joi.ValidationResult<any> => {
  const schema = Joi.object({
    firstName: Joi.string().min(3).max(50).required().messages({
      "any.required": "firstName is required.",
    }),
    lastName: Joi.string().min(3).max(50).required().messages({
      "any.required": "lastName is required.",
    }),
    email: Joi.string().min(5).max(255).required().email().messages({
      "any.required": "Email is required.",
    }),
    password: Joi.string()
      .pattern(PASSWORD_REGEX)
      .max(1024)
      .required()
      .messages({
        "string.pattern.base":
          "Password must be at least 12 characters long and include at least one uppercase letter, one lowercase letter, one digit, and one special character.",
      }),
  });

  return schema.validate(user);
};

export { type IUser, User, validateUser as validate };
