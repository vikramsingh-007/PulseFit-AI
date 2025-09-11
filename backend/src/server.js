const express = require("express");
const userRoutes = require("./routes/userRoutes");
const errorHandler = require("./middleware/errorHandler");
const { PORT } = require("./config/serverConfig");
const connectDB = require("./config/dbConfig");

connectDB();

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API Running");
});
app.use("/api/users", userRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
