const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("lms", "root", "abcd@123", {
  host: "localhost",
  dialect: "mysql",
});

sequelize
  .authenticate()
  .then(() => {
    console.log("MySQL connected successfully");
  })
  .catch((err) => {
    console.error("DB connection failed:", err.message);
  });

module.exports = sequelize;
