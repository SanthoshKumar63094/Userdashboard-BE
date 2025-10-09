import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import apiRouter from "./routes/api.js";

dotenv.config();

const app = express();
app.use(express.json());

// ✅ Allow both local development and Netlify frontend
const allowedOrigins = [
  "http://localhost:5173", // your local Vite dev
  "https://useradminecommerce.netlify.app", // your deployed frontend
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        console.warn("❌ Blocked by CORS:", origin);
        return callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// ✅ Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// ✅ Mount API routes
app.use("/api", apiRouter);

// ✅ Root route for test
app.get("/", (req, res) => {
  res.send("Backend running successfully 🚀");
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
