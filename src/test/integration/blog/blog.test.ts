import request from "supertest";
import { Blog } from "../../../models/blog";
import { server } from "../../../app";
import mongoose from "mongoose";
import jwt, { type Secret } from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

let testServer: any;

describe("/api/blogs", () => {
  beforeEach(() => {
    testServer = server;
  });

  afterEach(async () => {
    await testServer.close();
    await Blog.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoose.connection.close();
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
      expect(res.body.blogsWithComments.length).toBe(2);
      expect(
        res.body.blogsWithComments.some((b: any) => b.title === "blog1")
      ).toBeTruthy();
      expect(
        res.body.blogsWithComments.some((b: any) => b.title === "blog2")
      ).toBeTruthy();
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
      expect(res.body.blogWithComments).toHaveProperty("title", "blog1");
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

    it("should return 404 if blog doesn't exist", async () => {
      const res = await request(server).put(
        "/api/blogs/view/" + new mongoose.Types.ObjectId().toString()
      );
      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty(
        "error",
        "blog with the given ID was not found."
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

    it("should return 404 if blog doesn't exist", async () => {
      const res = await request(server).put(
        "/api/blogs/like/" + new mongoose.Types.ObjectId().toString()
      );
      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty(
        "error",
        "blog with the given ID was not found."
      );
    });
  });

  describe("DELETE /:id", () => {
    it("should return 401 if user is not authorized", async () => {
      const blog = new Blog({
        title: "blog1",
        content: "content1",
      });
      await blog.save();

      const res = await request(server).delete(
        "/api/blogs/" + blog._id.toString()
      );
      expect(res.status).toBe(401);
    });

    it("should return 404 if user is authorized but blog doesn't exist", async () => {
      const token = jwt.sign(
        { _id: new mongoose.Types.ObjectId().toString(), isAdmin: true },
        process.env.JWT_ACCESS_KEY as Secret
      );

      const res = await request(server)
        .delete("/api/blogs/" + new mongoose.Types.ObjectId().toString())
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty(
        "error",
        "blog with the given ID was not found."
      );
    });

    it("should return 200 if user is authorized and blog deleted successfully", async () => {
      const token = jwt.sign(
        { _id: new mongoose.Types.ObjectId().toString(), isAdmin: true },
        process.env.JWT_ACCESS_KEY as Secret
      );

      const blog = new Blog({
        title: "blog1",
        content: "content1",
      });
      await blog.save();

      const res = await request(server)
        .delete("/api/blogs/" + blog._id.toString())
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("message", "blog deleted successfully");
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
        "/api/blogs/" + blog._id.toString()
      );
      expect(res.status).toBe(401);
    });

    it("should return 400 if user is authorized and content is missing as a required field", async () => {
      const token = jwt.sign(
        { _id: new mongoose.Types.ObjectId().toString(), isAdmin: true },
        process.env.JWT_ACCESS_KEY as Secret
      );

      const blog = new Blog({
        title: "blog1",
        content: "content1",
      });
      await blog.save();

      const res = await request(server)
        .put("/api/blogs/" + blog._id.toString())
        .set("Authorization", `Bearer ${token}`)
        .send({
          title: "blog1",
        });
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("error", "content is required.");
    });

    it("should return 404 if user is authorized but blog doesn't exist", async () => {
      const token = jwt.sign(
        { _id: new mongoose.Types.ObjectId().toString(), isAdmin: true },
        process.env.JWT_ACCESS_KEY as Secret
      );

      const res = await request(server)
        .put("/api/blogs/" + new mongoose.Types.ObjectId().toString())
        .set("Authorization", `Bearer ${token}`)
        .send({
          title: "blog1",
          content: "content1",
        });
      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty(
        "error",
        "blog with the given ID was not found."
      );
    });

    it("should return 200 if user is authorized and blog updated successfully", async () => {
      const token = jwt.sign(
        { _id: new mongoose.Types.ObjectId().toString(), isAdmin: true },
        process.env.JWT_ACCESS_KEY as Secret
      );

      const blog = new Blog({
        title: "blog1",
        content: "content1",
      });
      await blog.save();

      const res = await request(server)
        .put("/api/blogs/" + blog._id.toString())
        .set("Authorization", `Bearer ${token}`)
        .send({
          title: "blog1 edited",
          content: "content1 edited",
        });
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("message", "blog edited successfully");
    });
  });

  describe("POST /", () => {
    it("should return 401 if user is not authorized", async () => {
      const res = await request(server).post("/api/blogs").send({
        title: "blog1",
        content: "content1",
      });
      expect(res.status).toBe(401);
    });

    it("should return 400 if user is authorized and content is missing as a required field", async () => {
      const token = jwt.sign(
        { _id: new mongoose.Types.ObjectId().toString(), isAdmin: true },
        process.env.JWT_ACCESS_KEY as Secret
      );
      const res = await request(server)
        .post("/api/blogs")
        .set("Authorization", `Bearer ${token}`)
        .send({
          title: "blog1",
        });
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("error", "content is required.");
    });

    it("should return 400 if user is authorized and title is missing as a required field", async () => {
      const token = jwt.sign(
        { _id: new mongoose.Types.ObjectId().toString(), isAdmin: true },
        process.env.JWT_ACCESS_KEY as Secret
      );
      const res = await request(server)
        .post("/api/blogs")
        .set("Authorization", `Bearer ${token}`)
        .send({
          content: "blog1",
        });
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("error", "title is required.");
    });

    it("should return 201 if user is authorized and blog is created successfully", async () => {
      const token = jwt.sign(
        { _id: new mongoose.Types.ObjectId().toString(), isAdmin: true },
        process.env.JWT_ACCESS_KEY as Secret
      );
      const res = await request(server)
        .post("/api/blogs")
        .set("Authorization", `Bearer ${token}`)
        .send({
          title: "title1",
          content: "blog1",
        });
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty("message", "blog created successfully");
    });
  });
});
