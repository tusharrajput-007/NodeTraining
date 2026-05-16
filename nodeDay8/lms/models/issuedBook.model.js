const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Book = require("./book.model");
const Student = require("./student.model");

const IssuedBook = sequelize.define(
  "IssuedBook",
  {
    book_id: { type: DataTypes.INTEGER, allowNull: false },
    student_id: { type: DataTypes.INTEGER, allowNull: false },
    issue_date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    return_date: { type: DataTypes.DATE },
    status: {
      type: DataTypes.ENUM("issued", "returned"),
      defaultValue: "issued",
    },
  },
  {
    tableName: "issued_books",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "modified_at",
  },
);

IssuedBook.belongsTo(Book, { foreignKey: "book_id" });
IssuedBook.belongsTo(Student, { foreignKey: "student_id" });

module.exports = IssuedBook;
