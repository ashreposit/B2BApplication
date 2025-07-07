import { Request, Response } from "express";
import * as userService from "../services/user.service";
import * as userController from "../controller/user.controller";

jest.mock("../services/user.service");

const mockResponse = () => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.cookie = jest.fn().mockReturnValue(res);
  res.locals = { user: { id: 1 } };
  return res;
};

describe("User Controller", () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("userCreation", () => {
    it("should return 201 on successful user creation", async () => {
      (userService.createUser as jest.Mock).mockResolvedValue({ id: 1 });

      const req = { body: { email: "test@test.com" } } as Request;
      const res = mockResponse();

      await userController.userCreation(req, res);

      expect(userService.createUser).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: "User registered successfully" });
    });

    it("should return 400 on error", async () => {
      (userService.createUser as jest.Mock).mockRejectedValue(new Error("Creation failed"));

      const req = { body: {} } as Request;
      const res = mockResponse();

      await userController.userCreation(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Creation failed" });
    });
  });

  describe("login", () => {
    it("should return 200 and set cookie on successful login", async () => {
      (userService.loginUser as jest.Mock).mockResolvedValue({ authorizationToken: "token123" });

      const req = { body: { email: "test@test.com" } } as Request;
      const res = mockResponse();

      await userController.login(req, res);

      expect(userService.loginUser).toHaveBeenCalledWith(req.body);
      expect(res.cookie).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: "Login successful" });
    });

    it("should return 401 if invalid credentials", async () => {
      (userService.loginUser as jest.Mock).mockResolvedValue({});

      const req = { body: { email: "wrong@test.com" } } as Request;
      const res = mockResponse();

      await userController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: "Invalid credentials" });
    });

    it("should return 400 on error", async () => {
      (userService.loginUser as jest.Mock).mockRejectedValue(new Error("Login failed"));

      const req = { body: {} } as Request;
      const res = mockResponse();

      await userController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Login failed" });
    });
  });

  describe("getOneUser", () => {
    it("should return user data if authenticated", async () => {
      (userService.getMe as jest.Mock).mockResolvedValue({ id: 1, email: "test@test.com" });

      const req = {} as Request;
      const res = mockResponse();

      await userController.getOneUser(req, res);

      expect(userService.getMe).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ user: { id: 1, email: "test@test.com" } });
    });

    it("should return 401 if no user in res.locals", async () => {
      const req = {} as Request;
      const res = mockResponse();
      res.locals.user = undefined;

      await userController.getOneUser(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: "Unauthorized" });
    });

    it("should return 400 on error", async () => {
      (userService.getMe as jest.Mock).mockRejectedValue(new Error("Fetch failed"));

      const req = {} as Request;
      const res = mockResponse();

      await userController.getOneUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Fetch failed" });
    });
  });

});
