const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");

const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const errorHandler = require("./middleware/errorHandler");
const { PORT } = require("./config/serverConfig");
const connectDB = require("./config/dbConfig");
const ensureAuthenticated = require("./middleware/ensureAuthenticated");

const startServer = async () => {
  try {
    await connectDB();

    const app = express();
    app.use(helmet());
    app.use(morgan("combined"));
    app.use(cookieParser());
    app.use(express.json({ limit: "10kb" }));

    app.use(
      cors({
        origin: process.env.FRONTEND_ORIGIN || "http://localhost:3000",
        credentials: true,
      })
    );

    const limiter = rateLimit({
      windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
      max: Number(process.env.RATE_LIMIT_MAX) || 100, // limit requests per window per IP
      standardHeaders: true,
      legacyHeaders: false,
    });

    app.use(limiter);

    app.get("/", ensureAuthenticated, (req, res) => {
      res.send("API Running");
    });
    app.use("/api/users", userRoutes);
    app.use("/api/auth", authRoutes);

    app.use(errorHandler);

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT || 8080}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();
