import { type Request, type Response } from "express";
import _ from "lodash";
import Joi from "joi";
import { User, validate } from "../models/user";
import { RefreshToken, validateRefToken } from "../models/authTokens";
import bcrypt from "bcrypt";
import jwt, { type JwtPayload, type Secret } from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

function validateLoginRequestBody(req: {
  email: string;
  passwor: string;
}): Joi.ValidationResult<any> {
  const schema = Joi.object({
    email: Joi.string().min(5).max(255).required().email().messages({
      "any.required": "email is required.",
    }),
    password: Joi.string().min(3).max(1024).required().messages({
      "any.required": "password is required.",
    }),
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
      return res
        .status(400)
        .json({ statuCode: 400, error: error.details[0].message });
    }

    let user = await User.findOne({ email: req.body.email });
    if (user !== null) {
      return res
        .status(400)
        .json({ statuCode: 400, error: "User with that email already Exist" });
    }

    user = new User(
      _.pick(req.body, ["firstName", "lastName", "email", "password"])
    );
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    await user.save();

    const token = user.generateAuthToken();

    res.status(201).json({
      statuCode: 201,
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
      return res
        .status(400)
        .json({ statuCode: 400, error: error.details[0].message });
    }

    const user = await User.findOne({ email: req.body.email });
    if (user === null) {
      return res
        .status(400)
        .json({ statuCode: 400, error: "Invalid email or password" });
    }

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!validPassword) {
      return res
        .status(400)
        .json({ statuCode: 400, error: "Invalid email or password" });
    }

    if (!user.isAdmin) {
      return res.status(403).json({ statusCode: 403, error: "Forbidden" });
    }

    const accessToken = user.generateAuthToken();

    const refreshToken = user.generateRefreshToken();

    const newRefToken = new RefreshToken({
      token: refreshToken,
    });

    await newRefToken.save();

    res.status(200).json({
      statuCode: 200,
      message: "Logged in successfully!",
      access: accessToken,
      refresh: refreshToken,
    });
  }

  static async refreshAccessToken(
    req: Request,
    res: Response
  ): Promise<undefined | Response<any, Record<string, any>>> {
    const { error } = validateRefToken(req.body);
    if (error !== undefined) {
      return res
        .status(400)
        .json({ statuCode: 400, error: error.details[0].message });
    }

    const refreshToken = req.body.token;

    const refreshTokenDoc = await RefreshToken.findOne({
      token: refreshToken,
    });

    if (refreshTokenDoc === null) {
      return res
        .status(403)
        .json({ statuCode: 403, error: "Refresh token not found" });
    }

    const decode = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_KEY as Secret
    ) as JwtPayload;

    const userId = decode._id;

    const user = await User.findById(userId);
    if (user === null) {
      await RefreshToken.findByIdAndDelete(refreshTokenDoc._id);
      return res.status(403).json({ statuCode: 403, error: "Forbidden" });
    }

    const accessToken = user.generateAuthToken();
    res.status(200).json({ statuCode: 200, access: accessToken });
  }

  static async logout(
    req: Request,
    res: Response
  ): Promise<undefined | Response<any, Record<string, any>>> {
    const { error } = validateRefToken(req.body);
    if (error !== undefined) {
      return res
        .status(400)
        .json({ statuCode: 400, error: error.details[0].message });
    }

    const refreshToken = req.body.token;

    const refreshTokenDoc = await RefreshToken.findOneAndDelete({
      token: refreshToken,
    });

    if (refreshTokenDoc === null) {
      return res
        .status(403)
        .json({ statuCode: 403, error: "Refresh token not found" });
    }

    res
      .status(200)
      .json({ statuCode: 200, message: "logged out successfully" });
  }
}

export default UserController;
