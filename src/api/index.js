import dotenv from "dotenv";
import app from "./app.js";
import { connectToDb } from "../database/mango.js";

dotenv.config();

const port = process.env.PORT || 3000;

async function start() {
    await connectToDb();
    app.listen(port, () => {
        console.log(`API running at http://localhost:${port}`);
});
}

start();