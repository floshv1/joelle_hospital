import { ObjectId } from "mongodb";
import { getDb } from "../database/mango.js";

const COLLECTION_NAME = "appointments";

export class Appointment {
  static async getCollection() {
    return getDb().collection(COLLECTION_NAME);
  }

  static async create(appointmentData) {
    const collection = await this.getCollection();
    const appointment = {
      _id: new ObjectId(),
      patient_id: new ObjectId(appointmentData.patient_id),
      practitioner_id: new ObjectId(appointmentData.practitioner_id),
      start_datetime: new Date(appointmentData.start_datetime),
      end_datetime: new Date(appointmentData.end_datetime),
      status: appointmentData.status || "booked", // 'booked', 'confirmed', 'cancelled', 'no-show'
      created_by: new ObjectId(appointmentData.created_by),
      created_at: new Date(),
      updated_at: new Date(),
    };
    const result = await collection.insertOne(appointment);
    return { ...appointment, _id: result.insertedId };
  }

  static async findById(id) {
    const collection = await this.getCollection();
    return collection.findOne({ _id: new ObjectId(id) });
  }

  static async findByPatientId(patientId) {
    const collection = await this.getCollection();
    return collection.find({ patient_id: new ObjectId(patientId) }).toArray();
  }

  static async findByPractitionerId(practitionerId) {
    const collection = await this.getCollection();
    return collection.find({ practitioner_id: new ObjectId(practitionerId) }).toArray();
  }

  static async findByDateRange(startDate, endDate, filter = {}) {
    const collection = await this.getCollection();
    return collection
      .find({
        ...filter,
        start_datetime: { $gte: new Date(startDate) },
        end_datetime: { $lte: new Date(endDate) },
      })
      .toArray();
  }

  static async updateStatus(id, status) {
    const collection = await this.getCollection();
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { status, updated_at: new Date() } }
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
