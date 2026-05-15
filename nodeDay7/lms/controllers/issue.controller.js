const IssuedBook = require("../models/issuedBook.model");
const Book = require("../models/book.model");
const Student = require("../models/student.model");

// GET /issues
const getAllIssues = async (req, res) => {
  try {
    const issues = await IssuedBook.findAll({
      include: [Book, Student],
    });
    res.render("issue-list", { issues });
  } catch (err) {
    console.error(err);
    res.status(500).send("Something went wrong");
  }
};

// GET /issues/add
const getIssueBook = async (req, res) => {
  try {
    const books = await Book.findAll({ where: { is_deleted: false } });
    const students = await Student.findAll();
    res.render("issue-book", { books, students, error: null });
  } catch (err) {
    console.error(err);
    res.redirect("/issues");
  }
};

// POST /issues/add
const postIssueBook = async (req, res) => {
  try {
    const { book_id, student_id } = req.body;

    // Server side validation
    if (!book_id || book_id === "") {
      const books = await Book.findAll();
      const students = await Student.findAll();
      return res.render("issue-book", {
        books,
        students,
        error: "Please select a book",
      });
    }
    if (!student_id || student_id === "") {
      const books = await Book.findAll();
      const students = await Student.findAll();
      return res.render("issue-book", {
        books,
        students,
        error: "Please select a student",
      });
    }

    // Check if book is already issued
    const existing = await IssuedBook.findOne({
      where: { book_id, status: "issued" },
    });

    if (existing) {
      const books = await Book.findAll();
      const students = await Student.findAll();
      return res.render("issue-book", {
        books,
        students,
        error: "Book is already issued",
      });
    }

    await IssuedBook.create({ book_id, student_id });
    res.redirect("/issues");
  } catch (err) {
    console.error(err);
    res.redirect("/issues");
  }
};

// GET /issues/return/:id
const returnBook = async (req, res) => {
  try {
    await IssuedBook.update(
      { status: "returned", return_date: new Date() },
      { where: { id: req.params.id } },
    );
    res.redirect("/issues");
  } catch (err) {
    console.error(err);
    res.redirect("/issues");
  }
};

module.exports = { getAllIssues, getIssueBook, postIssueBook, returnBook };
