import authMiddleware from "../../../middleware/authMiddleware";
import { type NextFunction } from "express";

jest.mock("jsonwebtoken", () => ({
  verify: jest.fn(),
}));

describe("authMiddleware", () => {
  let req: any;
  let res: any;
  let next: NextFunction;

  beforeEach(() => {
    req = {
      headers: {
        authorization: undefined,
      },
      user: undefined,
    };
    res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it("should return 401 if no token provided", () => {
    authMiddleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      error: "Access denied. No token provided.",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 401 if invalid authorization header format", () => {
    req.headers.authorization = "invalidHeader";
    authMiddleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      error: "Invalid authorization header format.",
    });
    expect(next).not.toHaveBeenCalled();
  });
});
