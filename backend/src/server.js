const express = require("express");
const userRoutes = require("./routes/userRoutes");
const errorHandler = require("./middleware/errorHandler");
const { PORT } = require("./config/serverConfig");
const connectDB = require("./config/dbConfig");

const startServer = async () => {
  try {
    await connectDB();

    const app = express();
    app.use(express.json({ limit: "10kb" }));

    app.get("/", (req, res) => {
      res.send("API Running");
    });
    app.use("/api/users", userRoutes);

    app.use(errorHandler);

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();
