import request from "supertest";
import { server } from "../../../app";
import { getPort } from "../../../startups/getPort";
import mongoose from "mongoose";

let testServer: any;

describe("INITIAL ENDPOINT", () => {
  beforeEach(() => {
    testServer = server;
    delete process.env.PORT;
  });

  afterEach(async () => {
    await testServer.close();
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoose.connection.close();
  });

  describe("GET /", () => {
    it("should return 200", async () => {
      const res = await request(testServer).get("");
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("message", "my brand api");
    });
  });

  describe("Port assignment", () => {
    it("should assign default port when process.env.PORT is not defined", () => {
      const expectedPort = 7000;
      const port = getPort();
      expect(port).toEqual(expectedPort);
    });

    it("should assign process.env.PORT when defined", () => {
      const expectedPort = 5000;
      process.env.PORT = expectedPort.toString();
      const port = getPort();
      expect(port).toEqual(expectedPort);
    });
  });
});
