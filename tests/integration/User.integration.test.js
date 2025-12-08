import { describe, it, expect, beforeAll, afterAll, beforeEach, vi } from "vitest";
import express from "express";
import request from "supertest";
import { UserController } from "../../src/controllers/UserController.js";
import userRoutes from "../../src/routes/userRoutes.js";
import { User } from "../../src/models/User.js";
import { ObjectId } from "mongodb";

vi.mock("../../src/models/User.js");

describe("User Routes - Integration Tests", () => {
  let app;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use("/api/users", userRoutes);
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("POST /api/users", () => {
    it("should create a new user", async () => {
      const newUser = {
        first_name: "John",
        last_name: "Doe",
        email: "john@example.com",
        phone: "1234567890",
        password: "password123",
      };

      User.findByEmail.mockResolvedValue(null);
      User.create.mockResolvedValue({
        _id: new ObjectId(),
        ...newUser,
        role: "patient",
      });

      const response = await request(app).post("/api/users").send(newUser);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("_id");
      expect(response.body.first_name).toBe("John");
      expect(response.body.email).toBe("john@example.com");
    });

    it("should return 400 for missing required fields", async () => {
      const incompleteUser = {
        first_name: "John",
        // missing other required fields
      };

      const response = await request(app).post("/api/users").send(incompleteUser);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("error");
    });

    it("should return 409 for duplicate email", async () => {
      const newUser = {
        first_name: "John",
        last_name: "Doe",
        email: "existing@example.com",
        phone: "1234567890",
        password: "password123",
      };

      User.findByEmail.mockResolvedValue({
        _id: new ObjectId(),
        email: "existing@example.com",
      });

      const response = await request(app).post("/api/users").send(newUser);

      expect(response.status).toBe(409);
      expect(response.body.error).toContain("already exists");
    });
  });

  describe("GET /api/users", () => {
    it("should get all users", async () => {
      const users = [
        { _id: new ObjectId(), first_name: "John", email: "john@example.com" },
        { _id: new ObjectId(), first_name: "Jane", email: "jane@example.com" },
      ];

      User.findAll.mockResolvedValue(users);

      const response = await request(app).get("/api/users");

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(response.body[0].first_name).toBe("John");
    });

    it("should filter users by role", async () => {
      const practitioners = [
        { _id: new ObjectId(), first_name: "Dr. John", role: "practitioner" },
      ];

      User.findAll.mockResolvedValue(practitioners);

      const response = await request(app).get("/api/users?role=practitioner");

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(response.body[0].role).toBe("practitioner");
    });

    it("should not return hashed passwords", async () => {
      User.findAll.mockResolvedValue([
        {
          _id: new ObjectId(),
          first_name: "John",
          email: "john@example.com",
          hashed_password: "secret123",
        },
      ]);

      const response = await request(app).get("/api/users");

      expect(response.status).toBe(200);
      expect(response.body[0].hashed_password).toBeUndefined();
    });
  });

  describe("GET /api/users/:id", () => {
    it("should get user by ID", async () => {
      const userId = new ObjectId();
      User.findById.mockResolvedValue({
        _id: userId,
        first_name: "John",
        email: "john@example.com",
      });

      const response = await request(app).get(`/api/users/${userId.toString()}`);

      expect(response.status).toBe(200);
      expect(response.body.first_name).toBe("John");
    });

    it("should return 404 if user not found", async () => {
      User.findById.mockResolvedValue(null);

      const response = await request(app).get(`/api/users/${new ObjectId().toString()}`);

      expect(response.status).toBe(404);
      expect(response.body.error).toBe("User not found");
    });
  });

  describe("GET /api/users/email/:email", () => {
    it("should get user by email", async () => {
      User.findByEmail.mockResolvedValue({
        _id: new ObjectId(),
        first_name: "John",
        email: "john@example.com",
      });

      const response = await request(app).get("/api/users/email/john@example.com");

      expect(response.status).toBe(200);
      expect(response.body.email).toBe("john@example.com");
    });

    it("should return 404 if email not found", async () => {
      User.findByEmail.mockResolvedValue(null);

      const response = await request(app).get("/api/users/email/nonexistent@example.com");

      expect(response.status).toBe(404);
    });
  });

  describe("PUT /api/users/:id", () => {
    it("should update user", async () => {
      const userId = new ObjectId();
      const updates = { first_name: "Jane", phone: "9876543210" };

      User.update.mockResolvedValue(true);
      User.findById.mockResolvedValue({
        _id: userId,
        ...updates,
        email: "jane@example.com",
      });

      const response = await request(app)
        .put(`/api/users/${userId.toString()}`)
        .send(updates);

      expect(response.status).toBe(200);
      expect(response.body.first_name).toBe("Jane");
    });

    it("should not allow updating password through PUT", async () => {
      const userId = new ObjectId();
      const updates = {
        first_name: "Jane",
        hashed_password: "newhash",
      };

      User.update.mockResolvedValue(true);
      User.findById.mockResolvedValue({
        _id: userId,
        first_name: "Jane",
      });

      const response = await request(app)
        .put(`/api/users/${userId.toString()}`)
        .send(updates);

      expect(response.status).toBe(200);
      // Verify that hashed_password was not passed to update
      const updateCall = User.update.mock.calls[0][1];
      expect(updateCall.hashed_password).toBeUndefined();
    });

    it("should return 404 if user not found", async () => {
      User.update.mockResolvedValue(false);

      const response = await request(app)
        .put(`/api/users/${new ObjectId().toString()}`)
        .send({ first_name: "Jane" });

      expect(response.status).toBe(404);
    });
  });

  describe("DELETE /api/users/:id", () => {
    it("should delete user", async () => {
      const userId = new ObjectId();
      User.delete.mockResolvedValue(true);

      const response = await request(app).delete(`/api/users/${userId.toString()}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("User deleted successfully");
    });

    it("should return 404 if user not found", async () => {
      User.delete.mockResolvedValue(false);

      const response = await request(app).delete(`/api/users/${new ObjectId().toString()}`);

      expect(response.status).toBe(404);
      expect(response.body.error).toBe("User not found");
    });
  });

  describe("Error Handling", () => {
    it("should handle database errors", async () => {
      User.findAll.mockRejectedValue(new Error("Database connection failed"));

      const response = await request(app).get("/api/users");

      expect(response.status).toBe(500);
      expect(response.body.error).toContain("Database connection failed");
    });

    it("should handle bcrypt errors during user creation", async () => {
      const newUser = {
        first_name: "John",
        last_name: "Doe",
        email: "john@example.com",
        phone: "1234567890",
        password: "password123",
      };

      User.findByEmail.mockResolvedValue(null);
      User.create.mockRejectedValue(new Error("Hashing failed"));

      const response = await request(app).post("/api/users").send(newUser);

      expect(response.status).toBe(500);
    });
  });
});
