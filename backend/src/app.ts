import express from "express";
import cors from "cors";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

import authRoutes from "./routes/auth.routes";
import leadRoutes from "./routes/lead.routes";

app.use("/api/auth", authRoutes);
app.use("/api/lead", leadRoutes);
export default app;