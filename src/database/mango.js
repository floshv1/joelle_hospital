import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

let client;
let db;

function getClient() {
    if (!client) {
        const mongoUri = process.env.MONGO_URI;
        if (!mongoUri) {
            throw new Error("MONGO_URI environment variable is not defined");
        }
        // Add SSL options for better connectivity
        const options = {
            tls: true,
            tlsAllowInvalidCertificates: process.env.NODE_ENV === "development",
            retryWrites: true,
            maxPoolSize: 10,
        };
        client = new MongoClient(mongoUri, options);
    }
    return client;
}

export async function connectToDb() {
    const mongoClient = getClient();
    await mongoClient.connect();
    db = mongoClient.db("joelle");
    console.log("Connected to MongoDB:", db.databaseName);
}

export function getDb() {
    if (!db) {
        throw new Error("Database not connected. Call connectToDb() first.");
    }
    return db;
}