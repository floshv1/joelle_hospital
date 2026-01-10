import { ObjectId } from "mongodb";
import { getDb } from "../database/mango.js";

const COLLECTION_NAME = "practitioners";

export class Practitioner {
  static async getCollection() {
    return getDb().collection(COLLECTION_NAME);
  }

  // 1. CRÉATION : On s'assure que l'ID est bien enregistré en format Objet
  static async create(practitionerData) {
    const collection = await this.getCollection();
    const practitioner = {
      _id: new ObjectId(),
      user_id: new ObjectId(practitionerData.user_id), // <--- CRITIQUE
      specialty: practitionerData.specialty,
      title: practitionerData.title || "Dr.",
      description: practitionerData.description,
      address: practitionerData.address,
      created_at: new Date(),
      updated_at: new Date(),
    };
    const result = await collection.insertOne(practitioner);
    return { ...practitioner, _id: result.insertedId };
  }

  // 2. LECTURE : On va chercher le Nom/Prénom dans la table users
  static async findAll() {
    const collection = await this.getCollection();
    return collection.aggregate([
      {
        $lookup: { // <--- C'EST CA QUI TE MANQUE PEUT-ÊTRE
          from: "users",
          localField: "user_id",
          foreignField: "_id",
          as: "userInfo"
        }
      },
      {
        $unwind: {
            path: "$userInfo",
            preserveNullAndEmptyArrays: true
        }
      }
    ]).toArray();
  }

  // ... (Garde findById, update, delete comme avant)
  static async findById(id) {
    const collection = await this.getCollection();
    return collection.findOne({ _id: new ObjectId(id) });
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
}