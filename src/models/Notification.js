import { ObjectId } from "mongodb";
import { getDb } from "../database/mango.js";

const COLLECTION_NAME = "notifications";

export class Notification {
  static async getCollection() {
    return getDb().collection(COLLECTION_NAME);
  }

  static async create(notificationData) {
    const collection = await this.getCollection();
    const notification = {
      _id: new ObjectId(),
      appointment_id: new ObjectId(notificationData.appointment_id),
      type: notificationData.type, // 'confirmation', 'reminder', 'cancellation'
      status: notificationData.status || "pending", // 'pending', 'sent', 'failed'
      sent_at: notificationData.sent_at || null,
      created_at: new Date(),
      updated_at: new Date(),
    };
    const result = await collection.insertOne(notification);
    return { ...notification, _id: result.insertedId };
  }

  static async findById(id) {
    const collection = await this.getCollection();
    return collection.findOne({ _id: new ObjectId(id) });
  }

  static async findByAppointmentId(appointmentId) {
    const collection = await this.getCollection();
    return collection.find({ appointment_id: new ObjectId(appointmentId) }).toArray();
  }

  static async findByStatus(status) {
    const collection = await this.getCollection();
    return collection.find({ status }).toArray();
  }

  static async findPending() {
    const collection = await this.getCollection();
    return collection.find({ status: "pending" }).toArray();
  }

  static async updateStatus(id, status, sentAt = null) {
    const collection = await this.getCollection();
    const updateData = { status, updated_at: new Date() };
    if (sentAt) {
      updateData.sent_at = new Date(sentAt);
    }
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );
    return result.modifiedCount > 0;
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
