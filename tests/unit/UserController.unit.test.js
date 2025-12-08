import { describe, it, expect, beforeEach, vi } from "vitest";
import { UserController } from "../../src/controllers/UserController.js";
import { User } from "../../src/models/User.js";
import bcrypt from "bcrypt";
import { ObjectId } from "mongodb";

vi.mock("../../src/models/User.js");
vi.mock("bcrypt");

describe("User Controller - Unit Tests", () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {},
      params: {},
      query: {},
    };
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    };
    vi.clearAllMocks();
  });

  describe("createUser", () => {
    it("should create user with valid data", async () => {
      req.body = {
        first_name: "John",
        last_name: "Doe",
        email: "john@example.com",
        phone: "1234567890",
        password: "password123",
        role: "patient",
      };

      User.findByEmail.mockResolvedValue(null);
      bcrypt.hash.mockResolvedValue("hashedpassword123");
      User.create.mockResolvedValue({
        _id: new ObjectId(),
        ...req.body,
        hashed_password: "hashedpassword123",
      });

      await UserController.createUser(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalled();
      expect(bcrypt.hash).toHaveBeenCalledWith("password123", 10);
    });

    it("should return 400 if required fields are missing", async () => {
      req.body = {
        first_name: "John",
        // missing last_name, email, password
      };

      await UserController.createUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "Missing required fields" });
    });

    it("should return 409 if email already exists", async () => {
      req.body = {
        first_name: "John",
        last_name: "Doe",
        email: "existing@example.com",
        password: "password123",
      };

      User.findByEmail.mockResolvedValue({
        _id: new ObjectId(),
        email: "existing@example.com",
      });

      await UserController.createUser(req, res);

      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.json).toHaveBeenCalledWith({ error: "User with this email already exists" });
    });

    it("should hash password before storing", async () => {
      req.body = {
        first_name: "John",
        last_name: "Doe",
        email: "john@example.com",
        phone: "1234567890",
        password: "password123",
      };

      User.findByEmail.mockResolvedValue(null);
      bcrypt.hash.mockResolvedValue("hashedpassword");
      User.create.mockResolvedValue({
        _id: new ObjectId(),
        hashed_password: "hashedpassword",
      });

      await UserController.createUser(req, res);

      expect(bcrypt.hash).toHaveBeenCalledWith("password123", 10);
    });
  });

  describe("getUserById", () => {
    it("should return user without password", async () => {
      req.params.id = new ObjectId().toString();
      const userId = new ObjectId();

      User.findById.mockResolvedValue({
        _id: userId,
        first_name: "John",
        email: "john@example.com",
        hashed_password: "secret123",
      });

      await UserController.getUserById(req, res);

      expect(res.json).toHaveBeenCalled();
      const response = res.json.mock.calls[0][0];
      expect(response.hashed_password).toBeUndefined();
      expect(response.first_name).toBe("John");
    });

    it("should return 404 if user not found", async () => {
      req.params.id = new ObjectId().toString();
      User.findById.mockResolvedValue(null);

      await UserController.getUserById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "User not found" });
    });
  });

  describe("getAllUsers", () => {
    it("should return all users without passwords", async () => {
      const users = [
        {
          _id: new ObjectId(),
          first_name: "John",
          hashed_password: "secret1",
        },
        {
          _id: new ObjectId(),
          first_name: "Jane",
          hashed_password: "secret2",
        },
      ];

      User.findAll.mockResolvedValue(users);

      await UserController.getAllUsers(req, res);

      expect(res.json).toHaveBeenCalled();
      const response = res.json.mock.calls[0][0];
      expect(response).toHaveLength(2);
      expect(response[0].hashed_password).toBeUndefined();
    });

    it("should filter users by role", async () => {
      req.query.role = "practitioner";
      User.findAll.mockResolvedValue([]);

      await UserController.getAllUsers(req, res);

      expect(User.findAll).toHaveBeenCalledWith({ role: "practitioner" });
    });
  });

  describe("updateUser", () => {
    it("should update user successfully", async () => {
      req.params.id = new ObjectId().toString();
      req.body = { first_name: "Jane", phone: "9876543210" };

      User.update.mockResolvedValue(true);
      User.findById.mockResolvedValue({
        _id: req.params.id,
        first_name: "Jane",
        phone: "9876543210",
      });

      await UserController.updateUser(req, res);

      expect(User.update).toHaveBeenCalledWith(req.params.id, req.body);
      expect(res.json).toHaveBeenCalled();
    });

    it("should prevent password update through this endpoint", async () => {
      req.params.id = new ObjectId().toString();
      req.body = { first_name: "Jane", hashed_password: "newhash" };

      User.update.mockResolvedValue(true);
      User.findById.mockResolvedValue({ _id: req.params.id });

      await UserController.updateUser(req, res);

      const updateCall = User.update.mock.calls[0][1];
      expect(updateCall.hashed_password).toBeUndefined();
    });

    it("should return 404 if user not found", async () => {
      req.params.id = new ObjectId().toString();
      req.body = { first_name: "Jane" };
      User.update.mockResolvedValue(false);

      await UserController.updateUser(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe("deleteUser", () => {
    it("should delete user successfully", async () => {
      req.params.id = new ObjectId().toString();
      User.delete.mockResolvedValue(true);

      await UserController.deleteUser(req, res);

      expect(User.delete).toHaveBeenCalledWith(req.params.id);
      expect(res.json).toHaveBeenCalledWith({ message: "User deleted successfully" });
    });

    it("should return 404 if user not found", async () => {
      req.params.id = new ObjectId().toString();
      User.delete.mockResolvedValue(false);

      await UserController.deleteUser(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "User not found" });
    });
  });

  describe("getUserByEmail", () => {
    it("should get user by email", async () => {
      req.params.email = "john@example.com";
      User.findByEmail.mockResolvedValue({
        _id: new ObjectId(),
        first_name: "John",
        email: "john@example.com",
        hashed_password: "secret",
      });

      await UserController.getUserByEmail(req, res);

      expect(User.findByEmail).toHaveBeenCalledWith("john@example.com");
      expect(res.json).toHaveBeenCalled();
      const response = res.json.mock.calls[0][0];
      expect(response.hashed_password).toBeUndefined();
    });

    it("should return 404 if email not found", async () => {
      req.params.email = "nonexistent@example.com";
      User.findByEmail.mockResolvedValue(null);

      await UserController.getUserByEmail(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });
});
