import { describe, it, expect, beforeEach, vi } from "vitest";
import { User } from "../../src/models/User.js";
import { ObjectId } from "mongodb";

// Mock database
const mockCollection = {
  insertOne: vi.fn(),
  findOne: vi.fn(),
  find: vi.fn(),
  updateOne: vi.fn(),
  deleteOne: vi.fn(),
};

vi.mock("../../src/database/mango.js", () => ({
  getDb: vi.fn(() => ({
    collection: vi.fn(() => mockCollection),
  })),
}));

describe("User Model - Unit Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("create", () => {
    it("should create a user with all required fields", async () => {
      const userData = {
        first_name: "John",
        last_name: "Doe",
        email: "john@example.com",
        phone: "1234567890",
        hashed_password: "hashed123",
        role: "patient",
      };

      const userId = new ObjectId();
      mockCollection.insertOne.mockResolvedValue({ insertedId: userId });

      const result = await User.create(userData);

      expect(mockCollection.insertOne).toHaveBeenCalled();
      expect(result._id).toBe(userId);
      expect(result.first_name).toBe("John");
      expect(result.email).toBe("john@example.com");
      expect(result.created_at).toBeInstanceOf(Date);
      expect(result.updated_at).toBeInstanceOf(Date);
    });

    it("should set default role to patient if not provided", async () => {
      const userData = {
        first_name: "Jane",
        last_name: "Smith",
        email: "jane@example.com",
        phone: "0987654321",
        hashed_password: "hashed456",
      };

      mockCollection.insertOne.mockResolvedValue({ insertedId: new ObjectId() });

      await User.create(userData);

      const callArg = mockCollection.insertOne.mock.calls[0][0];
      expect(callArg.role).toBe("patient");
    });
  });

  describe("findById", () => {
    it("should find user by ID", async () => {
      const userId = new ObjectId();
      const userData = {
        _id: userId,
        first_name: "John",
        email: "john@example.com",
      };

      mockCollection.findOne.mockResolvedValue(userData);

      const result = await User.findById(userId.toString());

      expect(mockCollection.findOne).toHaveBeenCalledWith({ _id: expect.any(ObjectId) });
      expect(result).toEqual(userData);
    });

    it("should return null if user not found", async () => {
      mockCollection.findOne.mockResolvedValue(null);

      const result = await User.findById(new ObjectId().toString());

      expect(result).toBeNull();
    });
  });

  describe("findByEmail", () => {
    it("should find user by email", async () => {
      const userData = {
        _id: new ObjectId(),
        first_name: "John",
        email: "john@example.com",
      };

      mockCollection.findOne.mockResolvedValue(userData);

      const result = await User.findByEmail("john@example.com");

      expect(mockCollection.findOne).toHaveBeenCalledWith({ email: "john@example.com" });
      expect(result).toEqual(userData);
    });

    it("should return null if email not found", async () => {
      mockCollection.findOne.mockResolvedValue(null);

      const result = await User.findByEmail("nonexistent@example.com");

      expect(result).toBeNull();
    });
  });

  describe("update", () => {
    it("should update user successfully", async () => {
      const userId = new ObjectId();
      mockCollection.updateOne.mockResolvedValue({ modifiedCount: 1 });

      const result = await User.update(userId.toString(), { first_name: "Jane" });

      expect(mockCollection.updateOne).toHaveBeenCalled();
      expect(result).toBe(true);
    });

    it("should return false if user not found", async () => {
      mockCollection.updateOne.mockResolvedValue({ modifiedCount: 0 });

      const result = await User.update(new ObjectId().toString(), { first_name: "Jane" });

      expect(result).toBe(false);
    });

    it("should update the updated_at timestamp", async () => {
      mockCollection.updateOne.mockResolvedValue({ modifiedCount: 1 });

      await User.update(new ObjectId().toString(), { first_name: "Jane" });

      const updateCall = mockCollection.updateOne.mock.calls[0][1];
      expect(updateCall.$set.updated_at).toBeInstanceOf(Date);
    });
  });

  describe("delete", () => {
    it("should delete user successfully", async () => {
      mockCollection.deleteOne.mockResolvedValue({ deletedCount: 1 });

      const result = await User.delete(new ObjectId().toString());

      expect(mockCollection.deleteOne).toHaveBeenCalled();
      expect(result).toBe(true);
    });

    it("should return false if user not found", async () => {
      mockCollection.deleteOne.mockResolvedValue({ deletedCount: 0 });

      const result = await User.delete(new ObjectId().toString());

      expect(result).toBe(false);
    });
  });

  describe("findAll", () => {
    it("should find all users without filter", async () => {
      const users = [
        { _id: new ObjectId(), first_name: "John" },
        { _id: new ObjectId(), first_name: "Jane" },
      ];

      mockCollection.find.mockReturnValue({
        toArray: vi.fn().mockResolvedValue(users),
      });

      const result = await User.findAll();

      expect(mockCollection.find).toHaveBeenCalledWith({});
      expect(result).toEqual(users);
      expect(result).toHaveLength(2);
    });

    it("should find users with filter", async () => {
      const patients = [{ _id: new ObjectId(), role: "patient" }];

      mockCollection.find.mockReturnValue({
        toArray: vi.fn().mockResolvedValue(patients),
      });

      const result = await User.findAll({ role: "patient" });

      expect(mockCollection.find).toHaveBeenCalledWith({ role: "patient" });
      expect(result).toEqual(patients);
    });

    it("should return empty array if no users found", async () => {
      mockCollection.find.mockReturnValue({
        toArray: vi.fn().mockResolvedValue([]),
      });

      const result = await User.findAll();

      expect(result).toEqual([]);
    });
  });
});
