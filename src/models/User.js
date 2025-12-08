import { ObjectId } from "mongodb";
import { getDb } from "../database/mango.js";

const COLLECTION_NAME = "users";

export class User {
  static async getCollection() {
    return getDb().collection(COLLECTION_NAME);
  }

  static async create(userData) {
    const collection = await this.getCollection();
    const user = {
      _id: new ObjectId(),
      role: userData.role || "patient", // 'patient', 'practitioner', 'admin', 'staff'
      first_name: userData.first_name,
      last_name: userData.last_name,
      email: userData.email,
      phone: userData.phone,
      hashed_password: userData.hashed_password,
      created_at: new Date(),
      updated_at: new Date(),
    };
    const result = await collection.insertOne(user);
    return { ...user, _id: result.insertedId };
  }

  static async findById(id) {
    const collection = await this.getCollection();
    return collection.findOne({ _id: new ObjectId(id) });
  }

  static async findByEmail(email) {
    const collection = await this.getCollection();
    return collection.findOne({ email });
  }

  static async update(id, updates) {
    const collection = await this.getCollection();
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...updates, updated_at: new Date() } }
    );
    return result.modifiedCount > 0;
  }

  static async delete(id) {
    const collection = await this.getCollection();
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount > 0;
  }

  static async findAll(filter = {}) {
    const collection = await this.getCollection();
    return collection.find(filter).toArray();
  }
}
