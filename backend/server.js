const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();
app.use(bodyParser.json());
// Connect to DB
connectDB();
const corsOption = {
  origin: "http://localhost:5173",
  credentials: true,
};
// Middleware
app.use(cors(corsOption));
app.use(express.json({ extended: false }));

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api", require("./routes/eventRoutes"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
