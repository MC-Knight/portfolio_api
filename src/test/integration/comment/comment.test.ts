import request from "supertest";
import { Comment } from "../../../models/comment";
import { Blog } from "../../../models/blog";
import { server } from "../../../app";
import mongoose from "mongoose";

let testServer: any;

describe("/api/comments", () => {
  beforeEach(() => {
    testServer = server;
  });

  afterEach(async () => {
    await testServer.close();
    await Blog.deleteMany({});
    await Comment.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoose.connection.close();
  });

  describe("POST /create", () => {
    it("should return 400 if required blog field is missing", async () => {
      const res = await request(testServer).post("/api/comments/create").send({
        content: "This is a comment",
      });
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("error", "blog is required.");
    });

    it("should return 400 if required content field is missing", async () => {
      const res = await request(testServer).post("/api/comments/create").send({
        blog: new mongoose.Types.ObjectId().toString(),
      });
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("error", "content is required.");
    });

    it("should return 404 if passed blog doesn't exist", async () => {
      const res = await request(testServer).post("/api/comments/create").send({
        content: "This is a comment",
        blog: new mongoose.Types.ObjectId().toString(),
      });
      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty("error", "Invalid blog ID");
    });

    it("should return 500 if passed blog is not valid mongoose objectId", async () => {
      const res = await request(testServer).post("/api/comments/create").send({
        content: "This is a comment",
        blog: "12345",
      });
      expect(res.status).toBe(500);
    });

    it("should return 201 if passed blog is valid mongoose objectId and comment posted successfully", async () => {
      const blog = new Blog({
        title: "blog1",
        content: "content1",
      });
      await blog.save();

      const res = await request(testServer).post("/api/comments/create").send({
        content: "This is a comment",
        blog: blog._id.toString(),
      });
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty("message", "comment posted successfully");
    });
  });

  describe("DELETE /delete/:id", () => {
    it("should return 404 if passed comment id doesn't exist", async () => {
      const res = await request(testServer).delete(
        `/api/comments/delete/${new mongoose.Types.ObjectId().toString()}`
      );
      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty(
        "error",
        "comment with the given ID was not found."
      );
    });

    it("should return 200 if passed comment id exist", async () => {
      const blog = new Blog({
        title: "blog1",
        content: "content1",
      });
      await blog.save();

      const comment = new Comment({
        content: "content1",
        blog: blog._id.toString(),
      });
      await comment.save();

      const res = await request(testServer).delete(
        `/api/comments/delete/${comment._id.toString()}`
      );
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty(
        "message",
        "comment deleted successfully"
      );
    });
  });
});
