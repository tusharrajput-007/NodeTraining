const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("nodejstraining", "root", "@Ayirp123456", {
  host: "localhost",
  dialect: "mysql",
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("MySQL connected successfully!");
  } catch (error) {
    console.error("Unable to connect to MySQL:", error);
  }
};

module.exports = { sequelize, connectDB };
