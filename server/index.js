require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./configs/db");

// Import Routes
const authRoutes = require("./routes/auth.route");
const taskRoutes = require("./routes/task.route");

const app = express();
const PORT = process.env.PORT || 5000;

// =============================
// Middleware ทั่วไป
// =============================
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

// =============================
// Routes
// =============================
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

// Health Check
app.get("/", (req, res) => {
  res.json({ message: "TaskFlow Mini API is running 🚀" });
});

// =============================
// Start Server
// =============================
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
