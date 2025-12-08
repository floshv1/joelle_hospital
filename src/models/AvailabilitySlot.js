import { ObjectId } from "mongodb";
import { getDb } from "../database/mango.js";

const COLLECTION_NAME = "availability_slots";

export class AvailabilitySlot {
  static async getCollection() {
    return getDb().collection(COLLECTION_NAME);
  }

  static async create(slotData) {
    const collection = await this.getCollection();
    const slot = {
      _id: new ObjectId(),
      practitioner_id: new ObjectId(slotData.practitioner_id),
      start_datetime: new Date(slotData.start_datetime),
      end_datetime: new Date(slotData.end_datetime),
      recurrence_rule: slotData.recurrence_rule || null, // RRULE format
      is_exception: slotData.is_exception || false,
      created_at: new Date(),
      updated_at: new Date(),
    };
    const result = await collection.insertOne(slot);
    return { ...slot, _id: result.insertedId };
  }

  static async findById(id) {
    const collection = await this.getCollection();
    return collection.findOne({ _id: new ObjectId(id) });
  }

  static async findByPractitionerId(practitionerId) {
    const collection = await this.getCollection();
    return collection.find({ practitioner_id: new ObjectId(practitionerId) }).toArray();
  }

  static async findAvailableSlots(practitionerId, startDate, endDate) {
    const collection = await this.getCollection();
    return collection
      .find({
        practitioner_id: new ObjectId(practitionerId),
        start_datetime: { $gte: new Date(startDate) },
        end_datetime: { $lte: new Date(endDate) },
        is_exception: false,
      })
      .toArray();
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
