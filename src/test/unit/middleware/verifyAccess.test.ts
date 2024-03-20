import { type NextFunction } from "express";
import isAdminMiddleware from "../../../middleware/verifyAccess";

describe("isAdminMiddleware", () => {
  let req: any;
  let res: any;
  let next: NextFunction;

  beforeEach(() => {
    req = { user: undefined };
    res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it("should return 401 if user is undefined", () => {
    isAdminMiddleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: "Access denied." });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 403 if user is not admin", () => {
    req.user = { isAdmin: false };
    isAdminMiddleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ error: "Forbidden." });
    expect(next).not.toHaveBeenCalled();
  });

  it("should call next if user is admin", () => {
    req.user = { isAdmin: true };
    isAdminMiddleware(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });
});
