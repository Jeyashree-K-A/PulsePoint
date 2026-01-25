require("dotenv").config();

const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const cors = require("cors");
const { Server } = require("socket.io");

const hospitalRoutes = require("./routes/hospitalRoutes");
const userRoutes = require("./routes/userRoutes");


const app = express();

/* ===============================
   ✅ CORS (Vite Frontend)
================================ */
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

/* ===============================
   ✅ REST API ROUTES
================================ */

app.use("/api/hospitals", hospitalRoutes);
app.use("/api/users", userRoutes);


app.get("/", (req, res) => {
  res.send("Server is running");
});

/* ===============================
   ✅ MongoDB Connection
================================ */
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

/* ===============================
   ✅ HTTP SERVER
================================ */
const server = http.createServer(app);


/* ===============================
   ✅ START SERVER (ONLY HERE)
================================ */
const PORT = process.env.PORT || 5000;;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
