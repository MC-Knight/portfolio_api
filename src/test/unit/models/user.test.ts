/* eslint-disable @typescript-eslint/consistent-type-imports */
import { User } from "../../../models/user";
import jwt, { Secret, JwtPayload } from "jsonwebtoken";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { describe, expect, it } from "@jest/globals";

dotenv.config();

describe("user.generateAuthToken", () => {
  it("should return a valid JWT", () => {
    const payload = {
      _id: new mongoose.Types.ObjectId().toHexString(),
      isAdmin: true,
    };
    const user = new User(payload);
    const token = user.generateAuthToken();
    const decoded = jwt.verify(
      token,
      process.env.JWT_ACCESS_KEY as Secret
    ) as JwtPayload;
    expect(decoded).toMatchObject(payload);
  });
});

describe("user.generateRefreshToken", () => {
  it("should return a valid JWT", () => {
    const payload = {
      _id: new mongoose.Types.ObjectId().toHexString(),
      isAdmin: true,
    };
    const user = new User(payload);
    const token = user.generateRefreshToken();
    const decoded = jwt.verify(
      token,
      process.env.JWT_REFRESH_KEY as Secret
    ) as JwtPayload;
    expect(decoded).toMatchObject(payload);
  });
});
