const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const User = sequelize.define(
  "User",
  {
    first_name: { type: DataTypes.STRING(45), allowNull: false },
    middle_name: { type: DataTypes.STRING(45) },
    last_name: { type: DataTypes.STRING(45), allowNull: false },
    email: {
      type: DataTypes.STRING(45),
      allowNull: false,
      unique: true,
    },
    username: { type: DataTypes.STRING(45) },
    password: { type: DataTypes.STRING(255) },
  },
  {
    tableName: "users",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "modified_at",
  },
);

module.exports = User;
