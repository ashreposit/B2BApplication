import * as userService from "../services/user.service";
import prisma from "../config/prismaClient";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import CONFIG from "../config/config";

jest.mock("bcrypt");
jest.mock("jsonwebtoken");
jest.mock("../config/prismaClient", () => ({
  __esModule: true,
  default: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
  },
}));

describe("user.service", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("createUser", () => {
    it("should create a new user successfully", async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
      (bcrypt.genSalt as jest.Mock).mockResolvedValue("salt");
      (bcrypt.hash as jest.Mock).mockResolvedValue("hashedPassword");

      (prisma.user.create as jest.Mock).mockResolvedValue({
        id: 1,
        email: "test@example.com",
        passwordHash: "hashedPassword",
        role: "ADMIN",
        userImage: "image-url",
      });

      const result = await userService.createUser({
        email: "test@example.com",
        password: "password123",
        role: "ADMIN",
        awsImageUrl: "image-url",
      });

      expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { email: "test@example.com" } });
      expect(bcrypt.hash).toHaveBeenCalledWith("password123", "salt");
      expect(prisma.user.create).toHaveBeenCalled();
      expect(result.user.email).toBe("test@example.com");
    });

    it("should throw an error if user already exists", async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({ id: 1 });

      await expect(
        userService.createUser({
          email: "existing@example.com",
          password: "password123",
          role: "ADMIN",
          awsImageUrl: "image-url",
        })
      ).rejects.toThrow("User already exists");
    });
  });

  describe("loginUser", () => {
    it("should login user and return token", async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: 1,
        email: "test@example.com",
        passwordHash: "hashedPassword",
        role: "ADMIN",
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock).mockReturnValue("mockedToken");

      const result = await userService.loginUser({
        email: "test@example.com",
        password: "password123",
      });

      expect(prisma.user.findUnique).toHaveBeenCalled();
      expect(bcrypt.compare).toHaveBeenCalledWith("password123", "hashedPassword");
      expect(jwt.sign).toHaveBeenCalledWith(
        { id: 1, role: "ADMIN" },
        CONFIG.JWT_SECRET_KEY,
        { expiresIn: CONFIG.JWT_EXPIRATION }
      );
      expect(result.authorizationToken).toBe("mockedToken");
    });

    it("should throw error if user not found", async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(
        userService.loginUser({
          email: "invalid@example.com",
          password: "password123",
        })
      ).rejects.toThrow("Invalid email or password");
    });

    it("should throw error if password invalid", async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: 1,
        email: "test@example.com",
        passwordHash: "hashedPassword",
        role: "ADMIN",
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        userService.loginUser({
          email: "test@example.com",
          password: "wrongpassword",
        })
      ).rejects.toThrow("Invalid email or password");
    });
  });

  describe("getMe", () => {
    it("should return user details", async () => {
      const fakeUser = {
        id: 1,
        email: "test@example.com",
        role: "ADMIN",
        userImage: "image-url",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(fakeUser);

      const result = await userService.getMe(1);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        select: {
          id: true,
          email: true,
          role: true,
          userImage: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      expect(result).toEqual(fakeUser);
    });

    it("should throw error if user not found", async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(userService.getMe(999)).rejects.toThrow("User not found");
    });
  });

  describe("updateUser", () => {
    it("should update user successfully", async () => {
      const updatedUser = {
        id: 1,
        email: "updated@example.com",
        userImage: "new-image-url",
        updatedAt: new Date(),
      };

      (prisma.user.update as jest.Mock).mockResolvedValue(updatedUser);

      const result = await userService.updateUser("1", {
        email: "updated@example.com",
        awsImageUrl: "new-image-url",
      });

      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          email: "updated@example.com",
          userImage: "new-image-url",
          updatedAt: expect.any(Date),
        },
      });

      expect(result).toEqual(updatedUser);
    });

    it("should throw error if prisma update fails", async () => {
      (prisma.user.update as jest.Mock).mockRejectedValue(new Error("Update failed"));

      await expect(
        userService.updateUser("999", { email: "fail@example.com" })
      ).rejects.toThrow("Update failed");
    });
  });
});
