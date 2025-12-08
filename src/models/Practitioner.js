import { ObjectId } from "mongodb";
import { getDb } from "../database/mango.js";

const COLLECTION_NAME = "practitioners";

export class Practitioner {
  static async getCollection() {
    return getDb().collection(COLLECTION_NAME);
  }

  static async create(practitionerData) {
    const collection = await this.getCollection();
    const practitioner = {
      _id: new ObjectId(),
      user_id: new ObjectId(practitionerData.user_id),
      specialty: practitionerData.specialty,
      title: practitionerData.title,
      default_duration: practitionerData.default_duration, // in minutes
      description: practitionerData.description,
      created_at: new Date(),
      updated_at: new Date(),
    };
    const result = await collection.insertOne(practitioner);
    return { ...practitioner, _id: result.insertedId };
  }

  static async findById(id) {
    const collection = await this.getCollection();
    return collection.findOne({ _id: new ObjectId(id) });
  }

  static async findByUserId(userId) {
    const collection = await this.getCollection();
    return collection.findOne({ user_id: new ObjectId(userId) });
  }

  static async findBySpecialty(specialty) {
    const collection = await this.getCollection();
    return collection.find({ specialty }).toArray();
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
