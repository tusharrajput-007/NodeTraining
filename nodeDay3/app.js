const express = require("express");
const app = express();

const { connectDB, sequelize } = require("./config/db");
const bookRoutes = require("./routes/book.routes");

app.use(express.json());
app.use("/books", bookRoutes);

const startServer = async () => {
  await connectDB();
  await sequelize.sync();
  console.log("Database synced!");

  app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
  });
};

startServer();
