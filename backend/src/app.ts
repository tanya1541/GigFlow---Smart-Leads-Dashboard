import express from "express";
import cors from "cors";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Health route
app.get("/", (req, res) => {
  res.send("API Running...");
});

import authRoutes from "./routes/auth.routes";

app.use("/api/auth", authRoutes);

export default app;