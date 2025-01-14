import express from "express";
const app = express();
import mongoose from "mongoose";
import bookRoutes from "./routes/bookRoutes"
import * as dotenv from 'dotenv';
import bodyParser from 'body-parser';
dotenv.config();


const DATABASE_URL = process.env.DATABASE_URL;
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

//db connection
async function connectToDatabase() {
    const mongoUrl = DATABASE_URL;

    if (!mongoUrl) {
        throw new Error("Database URL is not defined in the environment variables.");
    }
    try {
        await mongoose.connect(mongoUrl);
        console.log("Database connected successfully!");
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("Database connection error:", error.message);
        } else {
            console.error("Unknown error occurred during database connection:", error);
        }
    }
}

connectToDatabase();

//Routes
app.use('/books', bookRoutes)


app.listen(port, () => {
    console.log(`listening to port  ${port}`);
})