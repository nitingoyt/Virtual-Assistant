import express from "express";
import dotenv from "dotenv";
dotenv.config();
import connectDb from "./config/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRouter from "./routes/auth.Routes.js";
import userRouter from "./routes/user.Routes.js";
import geminiResponse from "./gemini.js";

const app = express();
const PORT = process.env.PORT || 8000;
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

app.get("/", async (req, res) => {
  let prompt = req.query.prompt;
  let data = await geminiResponse(prompt);
  res.json(data);
});

app.listen(PORT, async () => {
  await connectDb();
  console.log("Server Running");
});
