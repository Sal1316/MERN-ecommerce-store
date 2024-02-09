// should be server.sj when done.
console.log("⭐ HelLo WoRld ⭐");

// packages:
import path from "path";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

// utils:
import connectDB from "./config/db.js";

dotenv.config();
const port = process.env.PORT || 5000;

connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ROUTES:
app.get("/", (req, res) => {
  res.send("🔥🔥🔥 Hello World");
});

app.listen(port, () => console.log(`🔥Server is RunNing on port: ${port}`));
