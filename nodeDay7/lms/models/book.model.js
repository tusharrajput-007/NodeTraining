const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Book = sequelize.define(
  "Book",
  {
    book_name: { type: DataTypes.STRING(100), allowNull: false },
    author_name: { type: DataTypes.STRING(100), allowNull: false },
    isbn: { type: DataTypes.STRING(10), allowNull: false, unique: true },
    file: { type: DataTypes.STRING(100) },
    is_deleted: { type: DataTypes.BOOLEAN, defaultValue: false },
    deleted_at: { type: DataTypes.DATE, allowNull: true },
  },
  {
    tableName: "books",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "modified_at",
  },
);

module.exports = Book;
