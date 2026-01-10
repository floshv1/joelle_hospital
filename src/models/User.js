import { ObjectId } from "mongodb";
import { getDb } from "../database/mango.js";

const COLLECTION_NAME = "users";

// --- 1. FONCTIONS UNITAIRES (Pour AuthController) ---

export const getCollection = async () => {
  return getDb().collection(COLLECTION_NAME);
};

export const createUser = async (userData) => {
  const collection = await getCollection();
  
  const user = {
    _id: new ObjectId(),
    role: userData.role || "patient",
    firstName: userData.firstName,
    lastName: userData.lastName,
    email: userData.email,
    phone: userData.phone,
    hashedPassword: userData.hashedPassword, 
    created_at: new Date(),
    updated_at: new Date(),
  };
  
  const result = await collection.insertOne(user);
  return { ...user, _id: result.insertedId };
};

export const findUserByEmail = async (email) => {
  const collection = await getCollection();
  return collection.findOne({ email });
};

export const findUserById = async (id) => {
  const collection = await getCollection();
  return collection.findOne({ _id: new ObjectId(id) });
};


export class User {
  static async create(data) { return createUser(data); }
  static async findByEmail(email) { return findUserByEmail(email); }
  static async findById(id) { return findUserById(id); }
  
  static async findAll() { 
      const collection = await getCollection();
      return collection.find({}).toArray();
  }

  static async delete(id) {
      const collection = await getCollection();
      return collection.deleteOne({ _id: new ObjectId(id) });
  }
}