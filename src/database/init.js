import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

async function initializeDatabase() {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
        throw new Error("MONGO_URI environment variable is not defined");
    }

    const client = new MongoClient(mongoUri, {
        tls: true,
        tlsAllowInvalidCertificates: process.env.NODE_ENV === "development",
        retryWrites: true,
    });

    try {
        await client.connect();
        console.log("✓ Connected to MongoDB");

        const db = client.db("joelle");
        const databaseName = db.databaseName || "joelle";
        console.log(`✓ Using database: ${databaseName}`);

        // Collections to create
        const collections = [
            {
                name: "users",
                options: {
                    validator: {
                        $jsonSchema: {
                            bsonType: "object",
                            required: ["first_name", "last_name", "email", "hashed_password"],
                            properties: {
                                _id: { bsonType: "objectId" },
                                first_name: { bsonType: "string" },
                                last_name: { bsonType: "string" },
                                email: { bsonType: "string" },
                                phone: { bsonType: "string" },
                                hashed_password: { bsonType: "string" },
                                role: {
                                    enum: ["patient", "practitioner", "admin", "staff"],
                                },
                                created_at: { bsonType: "date" },
                                updated_at: { bsonType: "date" },
                            },
                        },
                    },
                },
            },
            {
                name: "practitioners",
                options: {
                    validator: {
                        $jsonSchema: {
                            bsonType: "object",
                            required: ["user_id", "specialty", "title"],
                            properties: {
                                _id: { bsonType: "objectId" },
                                user_id: { bsonType: "objectId" },
                                specialty: { bsonType: "string" },
                                title: { bsonType: "string" },
                                default_duration: { bsonType: "int" },
                                description: { bsonType: "string" },
                                created_at: { bsonType: "date" },
                                updated_at: { bsonType: "date" },
                            },
                        },
                    },
                },
            },
            {
                name: "availability_slots",
                options: {
                    validator: {
                        $jsonSchema: {
                            bsonType: "object",
                            required: ["practitioner_id", "start_datetime", "end_datetime"],
                            properties: {
                                _id: { bsonType: "objectId" },
                                practitioner_id: { bsonType: "objectId" },
                                start_datetime: { bsonType: "date" },
                                end_datetime: { bsonType: "date" },
                                recurrence_rule: { bsonType: "string" },
                                is_exception: { bsonType: "bool" },
                                created_at: { bsonType: "date" },
                                updated_at: { bsonType: "date" },
                            },
                        },
                    },
                },
            },
            {
                name: "appointments",
                options: {
                    validator: {
                        $jsonSchema: {
                            bsonType: "object",
                            required: ["patient_id", "practitioner_id", "start_datetime", "end_datetime", "created_by"],
                            properties: {
                                _id: { bsonType: "objectId" },
                                patient_id: { bsonType: "objectId" },
                                practitioner_id: { bsonType: "objectId" },
                                start_datetime: { bsonType: "date" },
                                end_datetime: { bsonType: "date" },
                                status: {
                                    enum: ["booked", "confirmed", "cancelled", "no-show"],
                                },
                                created_by: { bsonType: "objectId" },
                                created_at: { bsonType: "date" },
                                updated_at: { bsonType: "date" },
                            },
                        },
                    },
                },
            },
            {
                name: "notifications",
                options: {
                    validator: {
                        $jsonSchema: {
                            bsonType: "object",
                            required: ["appointment_id", "type"],
                            properties: {
                                _id: { bsonType: "objectId" },
                                appointment_id: { bsonType: "objectId" },
                                type: { enum: ["confirmation", "reminder", "cancellation"] },
                                status: {
                                    enum: ["pending", "sent", "failed"],
                                },
                                sent_at: { bsonType: "date" },
                                created_at: { bsonType: "date" },
                                updated_at: { bsonType: "date" },
                            },
                        },
                    },
                },
            },
            {
                name: "audit_logs",
                options: {
                    validator: {
                        $jsonSchema: {
                            bsonType: "object",
                            required: ["user_id", "action"],
                            properties: {
                                _id: { bsonType: "objectId" },
                                user_id: { bsonType: "objectId" },
                                action: { bsonType: "string" },
                                details: { bsonType: "string" },
                                timestamp: { bsonType: "date" },
                            },
                        },
                    },
                },
            },
        ];

        // Create collections
        for (const collection of collections) {
            try {
                await db.createCollection(collection.name, collection.options);
                console.log(`✓ Created collection: ${collection.name}`);
            } catch (error) {
                if (error.codeName === "NamespaceExists") {
                    console.log(`✓ Collection already exists: ${collection.name}`);
                } else {
                    throw error;
                }
            }
        }

        // Create indexes
        const indexConfigs = [
            { collection: "users", index: { email: 1 }, options: { unique: true } },
            { collection: "practitioners", index: { user_id: 1 }, options: { unique: true } },
            { collection: "practitioners", index: { specialty: 1 } },
            { collection: "availability_slots", index: { practitioner_id: 1 } },
            { collection: "appointments", index: { patient_id: 1 } },
            { collection: "appointments", index: { practitioner_id: 1 } },
            { collection: "appointments", index: { start_datetime: 1, end_datetime: 1 } },
            { collection: "notifications", index: { appointment_id: 1 } },
            { collection: "notifications", index: { status: 1 } },
            { collection: "audit_logs", index: { user_id: 1 } },
            { collection: "audit_logs", index: { timestamp: -1 } },
        ];

        for (const indexConfig of indexConfigs) {
            try {
                const collection = db.collection(indexConfig.collection);
                await collection.createIndex(indexConfig.index, indexConfig.options);
                console.log(`✓ Created index on ${indexConfig.collection}: ${JSON.stringify(indexConfig.index)}`);
            } catch (error) {
                console.log(`✓ Index already exists on ${indexConfig.collection}`);
            }
        }

        console.log("\n✅ Database initialization completed successfully!");
        console.log(`📊 Database: ${databaseName}`);
        console.log("📦 Collections created: users, practitioners, availability_slots, appointments, notifications, audit_logs");

    } catch (error) {
        console.error("❌ Database initialization failed:", error.message);
        process.exit(1);
    } finally {
        await client.close();
        console.log("\n✓ Connection closed");
    }
}

// Run initialization
initializeDatabase();
