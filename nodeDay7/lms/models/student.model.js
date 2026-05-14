const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Student = sequelize.define(
  "Student",
  {
    name: { type: DataTypes.STRING(100), allowNull: false },
    roll_no: { type: DataTypes.STRING(50), allowNull: false },
    phone: { type: DataTypes.STRING(20) },
    photo: { type: DataTypes.STRING(100) },
    country: { type: DataTypes.STRING(100) },
    state: { type: DataTypes.STRING(100) },
    city: { type: DataTypes.STRING(100) },
  },
  {
    tableName: "students",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "modified_at",
  },
);

module.exports = Student;
