import { ObjectId } from 'mongodb';
import { getDb } from '../database/mango.js';

const COLLECTION_NAME = 'users';

const getCollection = async () => {
  return getDb().collection(COLLECTION_NAME);
};

// retrieve a user from the database by email
export const findUserByEmail = async (email) => {
  const collection = await getCollection();
  return collection.findOne({ email });
};

// create a new user in the database
export const createUser = async (userData) => {
  const { role, firstName, lastName, email, phone, hashedPassword } = userData;
  const collection = await getCollection();
  
  const user = {
    _id: new ObjectId(),
    role: role || 'patient',
    first_name: firstName,
    last_name: lastName,
    email,
    phone,
    hashed_password: hashedPassword,
    created_at: new Date(),
    updated_at: new Date(),
  };
  
  const result = await collection.insertOne(user);
  return { ...user, _id: result.insertedId };
};