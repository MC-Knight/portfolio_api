import request from "supertest";
import { User } from "../../../models/user";
import { RefreshToken } from "../../../models/authTokens";
import { server } from "../../../app";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt, { type Secret } from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

let testServer: any;

describe("/api/users", () => {
  beforeEach(() => {
    testServer = server;
  });

  afterEach(async () => {
    await testServer.close();
    await RefreshToken.deleteMany({});
    await User.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoose.connection.close();
  });

  describe("POST /register", () => {
    it("should return 400 if there is missing required field", async () => {
      const res = await request(testServer).post("/api/users/register").send({
        firstName: "john",
        lastName: "doe",
        password: "John@knight1234",
      });
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("error", "Email is required.");
    });

    it("should return 400 if there a user with the same email registered", async () => {
      const user = new User({
        firstName: "john",
        lastName: "doe",
        email: "example@gmail.com",
        password: "John@knight1234",
      });
      await user.save();

      const res = await request(testServer).post("/api/users/register").send({
        firstName: "john",
        lastName: "doe",
        email: "example@gmail.com",
        password: "John@knight1234",
      });
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty(
        "error",
        "User with that email already Exist"
      );
    });

    it("should return 201 if user is created successfully", async () => {
      const res = await request(testServer).post("/api/users/register").send({
        firstName: "john",
        lastName: "doe",
        email: "example@gmail.com",
        password: "John@knight1234",
      });
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty("message", "Registered successfully");
    });
  });

  describe("POST /login", () => {
    it("should return 400 if there is missing required field", async () => {
      const res = await request(testServer).post("/api/users/login").send({
        password: "John@knight1234",
      });
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("error", "email is required.");
    });

    it("should return 400 if there is no registered user with the same email and password", async () => {
      const res = await request(testServer).post("/api/users/login").send({
        email: "teto@gmail.com",
        password: "John@knight1234",
      });
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("error", "Invalid email or password");
    });

    it("should return 200 if there is user with the same email and password", async () => {
      const salt = await bcrypt.genSalt(10);
      const password = await bcrypt.hash("John@knight1234", salt);
      const user = new User({
        firstName: "john",
        lastName: "doe",
        email: "example@gmail.com",
        password,
      });
      await user.save();

      const res = await request(testServer).post("/api/users/login").send({
        email: "example@gmail.com",
        password: "John@knight1234",
      });
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("message", "Logged in successfully!");
    });

    it("should return 400 if there is user with the same email but with wrong password", async () => {
      const salt = await bcrypt.genSalt(10);
      const password = await bcrypt.hash("John@knight1234", salt);
      const user = new User({
        firstName: "john",
        lastName: "doe",
        email: "example@gmail.com",
        password,
      });
      await user.save();

      const res = await request(testServer).post("/api/users/login").send({
        email: "example@gmail.com",
        password: "John@knight123456",
      });
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("error", "Invalid email or password");
    });
  });

  describe("POST /token", () => {
    it("should return 400 if there is missing required field", async () => {
      const res = await request(testServer).post("/api/users/token").send({});
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("error", "token is required.");
    });

    it("should return 403 if token is not registered in db", async () => {
      const res = await request(testServer).post("/api/users/token").send({
        token: "123456",
      });
      expect(res.status).toBe(403);
      expect(res.body).toHaveProperty("error", "Refresh token not found");
    });

    it("should return 403 if token is registered but decoded with wrong user", async () => {
      const token = jwt.sign(
        { _id: new mongoose.Types.ObjectId().toString(), isAdmin: false },
        process.env.JWT_REFRESH_KEY as Secret
      );
      const refreshToken = new RefreshToken({
        token,
      });
      await refreshToken.save();
      const res = await request(testServer).post("/api/users/token").send({
        token,
      });
      expect(res.status).toBe(403);
      expect(res.body).toHaveProperty("error", "Forbidden");
    });

    it("should return 200 if token is registered and decoded with existing user", async () => {
      const user = new User({
        firstName: "john",
        lastName: "doe",
        email: "example@gmail.com",
        password: "John@knight1234",
      });
      await user.save();

      const token = jwt.sign(
        { _id: user._id, isAdmin: false },
        process.env.JWT_REFRESH_KEY as Secret
      );

      const refreshToken = new RefreshToken({
        token,
      });
      await refreshToken.save();
      const res = await request(testServer).post("/api/users/token").send({
        token,
      });
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("access");
    });
  });

  describe("POST /logout", () => {
    it("should return 400 if there is missing required field", async () => {
      const res = await request(testServer).post("/api/users/logout").send({});
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("error", "token is required.");
    });

    it("should return 403 if sent token is not registered in db", async () => {
      const res = await request(testServer).post("/api/users/logout").send({
        token: "123456",
      });
      expect(res.status).toBe(403);
      expect(res.body).toHaveProperty("error", "Refresh token not found");
    });

    it("should return 200 if logged out successfully", async () => {
      const token = new RefreshToken({
        token: "123456",
      });
      await token.save();

      const res = await request(testServer).post("/api/users/logout").send({
        token: "123456",
      });
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("message", "logged out successfully");
    });
  });
});
