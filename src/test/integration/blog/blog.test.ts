import request from "supertest";
import { Blog } from "../../../models/blog";
import { server } from "../../../app";
import mongoose from "mongoose";

let testServer: any;

describe("/api/blogs", () => {
  beforeEach(() => {
    testServer = server;
  });

  afterEach(async () => {
    testServer.close();
    await Blog.deleteMany({});
  });

  describe("GET /", () => {
    it("should return all blogs", async () => {
      await Blog.collection.insertMany([
        {
          title: "blog1",
          content: "content1",
        },
        {
          title: "blog2",
          content: "content2",
        },
      ]);

      const res = await request(testServer).get("/api/blogs");
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body.some((b: any) => b.title === "blog1")).toBeTruthy();
      expect(res.body.some((b: any) => b.title === "blog2")).toBeTruthy();
    });
  });

  describe("GET /:id", () => {
    it("should return a blog if valid id is passed", async () => {
      const blog = new Blog({
        title: "blog1",
        content: "content1",
      });
      await blog.save();

      const res = await request(server).get(
        "/api/blogs/" + blog._id.toString()
      );
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("title", "blog1");
    });

    it("should return 404 if no blog with given id exist", async () => {
      const id = new mongoose.Types.ObjectId();
      const res = await request(server).get("/api/blogs/" + id.toString());
      expect(res.status).toBe(404);
    });
  });

  describe("PUT /view/:id", () => {
    it("should increment the view count of a blog if valid blog id passed", async () => {
      const blog = new Blog({
        title: "blog1",
        content: "content1",
      });
      await blog.save();

      const res = await request(server).put(
        "/api/blogs/view/" + blog._id.toString()
      );
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty(
        "message",
        "blog views updated successfully"
      );
    });
  });

  describe("PUT /like/:id", () => {
    it("should increment the likes count of a blog if valid blog id passed", async () => {
      const blog = new Blog({
        title: "blog1",
        content: "content1",
      });
      await blog.save();

      const res = await request(server).put(
        "/api/blogs/like/" + blog._id.toString()
      );
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty(
        "message",
        "blog likes updated successfully"
      );
    });
  });

  describe("DELETE /delete/:id", () => {
    it("should return 401 if user is not authorized", async () => {
      const blog = new Blog({
        title: "blog1",
        content: "content1",
      });
      await blog.save();

      const res = await request(server).delete(
        "/api/blogs/delete/" + blog._id.toString()
      );
      expect(res.status).toBe(401);
    });
  });

  describe("PUT /edit/:id", () => {
    it("should return 401 if user is not authorized", async () => {
      const blog = new Blog({
        title: "blog1",
        content: "content1",
      });
      await blog.save();

      const res = await request(server).put(
        "/api/blogs/edit/" + blog._id.toString()
      );
      expect(res.status).toBe(401);
    });
  });

  describe("POST /create/:id", () => {
    it("should return 401 if user is not authorized", async () => {
      const res = await request(server).post("/api/blogs/create").send({
        title: "blog1",
        content: "content1",
      });
      expect(res.status).toBe(401);
    });
  });
});
