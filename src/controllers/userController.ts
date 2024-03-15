import { type Request, type Response } from "express";
import _ from "lodash";
import Joi from "joi";
import { User, validate } from "../models/user";
import bcrypt from "bcrypt";

function validateLoginRequestBody(req: {
  email: string;
  passwor: string;
}): Joi.ValidationResult<any> {
  const schema = Joi.object({
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(3).max(1024).required(),
  });

  return schema.validate(req);
}

class UserController {
  static async createUser(
    req: Request,
    res: Response
  ): Promise<undefined | Response<any, Record<string, any>>> {
    const { error } = validate(req.body);
    if (error !== undefined) {
      return res.status(400).json({ error: error.details[0].message });
    }

    let user = await User.findOne({ email: req.body.email });
    if (user !== null) {
      return res
        .status(400)
        .json({ error: "User with that email already Exist" });
    }

    user = new User(
      _.pick(req.body, ["firstName", "lastName", "email", "password"])
    );
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    await user.save();

    const token = user.generateAuthToken();

    res.status(201).json({
      message: "Registered successfully",
      access: token,
    });
  }

  static async loginUser(
    req: Request,
    res: Response
  ): Promise<undefined | Response<any, Record<string, any>>> {
    const { error } = validateLoginRequestBody(req.body);
    if (error !== undefined) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const user = await User.findOne({ email: req.body.email });
    if (user === null) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const token = user.generateAuthToken();
    res.status(200).json({
      message: "Logged in successfully!",
      access: token,
    });
  }
}

export default UserController;
