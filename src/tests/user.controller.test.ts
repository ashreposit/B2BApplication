import * as userController from "../controller/user.controller";
import * as userService from "../services/user.service";
import CONFIG from "../config/config";

jest.mock("../services/user.service");

const mockResponse = () => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.cookie = jest.fn().mockReturnValue(res);
  res.clearCookie = jest.fn().mockReturnValue(res);
  res.locals = {};
  return res;
};

describe("User Controller", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("userCreation", () => {
    it("should create user successfully", async () => {
      (userService.createUser as jest.Mock).mockResolvedValue({ user: { id: 1 } });

      const req = { body: { email: "test@example.com" } } as any;
      const res = mockResponse();

      await userController.userCreation(req, res);

      expect(userService.createUser).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: "User registered successfully" });
    });

    it("should handle error on create user", async () => {
      (userService.createUser as jest.Mock).mockRejectedValue(new Error("Create failed"));

      const req = { body: {} } as any;
      const res = mockResponse();

      await userController.userCreation(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Create failed" });
    });
  });

  describe("login", () => {
    it("should login and set token cookie", async () => {
      (userService.loginUser as jest.Mock).mockResolvedValue({ authorizationToken: "token" });

      const req = { body: { email: "test@example.com" } } as any;
      const res = mockResponse();

      await userController.login(req, res);

      expect(res.cookie).toHaveBeenCalledWith("authorizationToken", "token", {
        maxAge: CONFIG.JWT_COOKIE_EXPIRATION,
        httpOnly: true,
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: "Login successful" });
    });

    it("should return 401 for invalid login", async () => {
      (userService.loginUser as jest.Mock).mockResolvedValue({});

      const req = { body: {} } as any;
      const res = mockResponse();

      await userController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: "Invalid credentials" });
    });

    it("should handle login errors", async () => {
      (userService.loginUser as jest.Mock).mockRejectedValue(new Error("Login failed"));

      const req = { body: {} } as any;
      const res = mockResponse();

      await userController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Login failed" });
    });
  });

  describe("getOneUser", () => {
    it("should get user details if authorized", async () => {
      (userService.getMe as jest.Mock).mockResolvedValue({ id: 1 });

      const req = {} as any;
      const res = mockResponse();
      res.locals.user = { id: 1 };

      await userController.getOneUser(req, res);

      expect(userService.getMe).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ user: { id: 1 } });
    });

    it("should return 401 if no user in locals", async () => {
      const req = {} as any;
      const res = mockResponse();

      await userController.getOneUser(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: "Unauthorized" });
    });

    it("should handle errors on getMe", async () => {
      (userService.getMe as jest.Mock).mockRejectedValue(new Error("Fetch failed"));

      const req = {} as any;
      const res = mockResponse();
      res.locals.user = { id: 1 };

      await userController.getOneUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Fetch failed" });
    });
  });

  describe("updateUser", () => {
    it("should update user successfully", async () => {
      (userService.updateUser as jest.Mock).mockResolvedValue({ id: 1 });

      const req = { params: { userId: "1" }, body: {} } as any;
      const res = mockResponse();

      await userController.updateUser(req, res);

      expect(userService.updateUser).toHaveBeenCalledWith("1", req.body);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ user: { id: 1 } });
    });

    it("should return 401 if no userId param", async () => {
      const req = { params: {} } as any;
      const res = mockResponse();

      await userController.updateUser(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: "Unauthorized" });
    });

    it("should handle errors on updateUser", async () => {
      (userService.updateUser as jest.Mock).mockRejectedValue(new Error("Update failed"));

      const req = { params: { userId: "1" }, body: {} } as any;
      const res = mockResponse();

      await userController.updateUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Update failed" });
    });
  });

  describe("logout", () => {
    it("should clear auth cookie and respond", async () => {
      const req = {} as any;
      const res = mockResponse();

      await userController.logout(req, res);

      expect(res.clearCookie).toHaveBeenCalledWith("authorizationToken");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: "logged out successfully..." });
    });
  });
});
