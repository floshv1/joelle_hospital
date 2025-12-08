import { ObjectId } from "mongodb";
import { getDb } from "../database/mango.js";

const COLLECTION_NAME = "audit_logs";

export class AuditLog {
  static async getCollection() {
    return getDb().collection(COLLECTION_NAME);
  }

  static async create(logData) {
    const collection = await this.getCollection();
    const log = {
      _id: new ObjectId(),
      user_id: new ObjectId(logData.user_id),
      action: logData.action,
      details: logData.details || "",
      timestamp: new Date(),
    };
    const result = await collection.insertOne(log);
    return { ...log, _id: result.insertedId };
  }

  static async findById(id) {
    const collection = await this.getCollection();
    return collection.findOne({ _id: new ObjectId(id) });
  }

  static async findByUserId(userId) {
    const collection = await this.getCollection();
    return collection
      .find({ user_id: new ObjectId(userId) })
      .sort({ timestamp: -1 })
      .toArray();
  }

  static async findByAction(action) {
    const collection = await this.getCollection();
    return collection
      .find({ action })
      .sort({ timestamp: -1 })
      .toArray();
  }

  static async findByDateRange(startDate, endDate) {
    const collection = await this.getCollection();
    return collection
      .find({
        timestamp: {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        },
      })
      .sort({ timestamp: -1 })
      .toArray();
  }

  static async delete(id) {
    const collection = await this.getCollection();
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount > 0;
  }

  static async findAll(filter = {}) {
    const collection = await this.getCollection();
    return collection.find(filter).sort({ timestamp: -1 }).toArray();
  }
}
