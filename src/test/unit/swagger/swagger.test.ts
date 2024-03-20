import { getSwaggerServer } from "../../../startups/getSwaggerServer";
import mongoose from "mongoose";

describe("Swagger server", () => {
  beforeEach(() => {
    delete process.env.SWAGGER_SERVER;
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoose.connection.close();
  });

  describe("server assignment", () => {
    it("should assign default server when process.env.SWAGGER_SERVER is not defined", () => {
      const expectedServer = "http://localhost:7000/api";
      const server = getSwaggerServer();
      expect(server).toEqual(expectedServer);
    });

    it("should assign process.env.SWAGGER_SERVER when defined", () => {
      const expectedServer = "http://localhost:7000/api";
      process.env.SWAGGER_SERVER = expectedServer;
      const server = getSwaggerServer();
      expect(server).toEqual(expectedServer);
    });
  });
});
