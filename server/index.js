// should be server.sj when done.
import path from "path";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

// utils:
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import User from "./routes/userModel.js";

dotenv.config();
const port = process.env.PORT || 5000;
console.log("port: ", port);

connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ROUTES:
app.get("/api/users", userRoutes);
// app.use("/api/users", userRoutes);
// app.post("/api/users", (req, res) => {
//   const { name, email, password, isAdmin } = req.body;
//   User.create({ name, email, password, isAdmin })
//     .then((user) => {
//       res.json(user);
//       console.log("🏈 New User Creation was successfull 🏈");
//     })
//     .catch((err) => console.log(err));
// });

app.listen(port, () => console.log(`🔥 Server is RunNing on port: ${port}`));
